/**
 * Capture Aspera's screens.
 *
 *   node scripts/serve-static.mjs C:/dev/aspera/dist 8084
 *   node scripts/capture-aspera.mjs
 *
 * Aspera differs from Alba in the one way that matters here: the whole app is
 * behind an account, so there is no first-launch state worth photographing.
 * This script therefore reuses a persistent Chrome profile that a human has
 * already signed into, rather than the throwaway profile the Alba capture uses
 * to guarantee a clean slate. Sign in once with:
 *
 *   chrome --user-data-dir=<PROFILE> http://localhost:8084/
 *
 * Nothing here creates an account or types a password.
 *
 * The CDP plumbing is deliberately a near-copy of capture-app-screenshots.mjs.
 * It should move to a shared module the day a third app needs it; with two, the
 * seam is not yet obvious enough to guess at.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIGIN = process.env.APP_ORIGIN ?? 'http://localhost:8084';
const OUT = process.env.OUT_DIR ?? 'src/assets/apps/aspera';
const PROFILE = process.env.PROFILE ?? join(tmpdir(), 'aspera-capture-profile');
const PORT = 9334;

/* Same logical size as the Alba shots, at twice the density the stores ask
   for, because the site magnifies these. */
const DEVICE = { width: 390, height: 844, deviceScaleFactor: 6, mobile: true };

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

if (!CHROME) throw new Error('Chrome not found. Set the path in CHROME.');
if (!existsSync(PROFILE)) {
  throw new Error(
    `No signed-in profile at ${PROFILE}.\n` +
      `Open the app there and sign in first:\n` +
      `  chrome --user-data-dir="${PROFILE}" ${ORIGIN}/`,
  );
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------------------------------------- CDP ---- */

class Session {
  #ws;
  #id = 0;
  #pending = new Map();

  static async attach(wsUrl) {
    const s = new Session();
    s.#ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      s.#ws.onopen = res;
      s.#ws.onerror = () => rej(new Error('CDP socket failed'));
    });
    s.#ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      const p = s.#pending.get(msg.id);
      if (!p) return;
      s.#pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    };
    return s;
  }

  send(method, params = {}) {
    const id = ++this.#id;
    this.#ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject }));
  }

  async eval(expression) {
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression: `(async () => { ${expression} })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.text ?? 'evaluate failed');
    return result.value;
  }

  close() {
    this.#ws.close();
  }
}

/* ------------------------------------------------------------- helpers ---- */

/**
 * Wait for a screen to be up, without naming anything on it.
 *
 * Aspera speaks Italian or English depending on the profile, and headless
 * Chrome reports its own locale, so matching text would mean guessing which
 * language the shot will come out in. Waiting for the route to be current and
 * for a real amount of rendered text is language-agnostic and good enough:
 * the splash and the auth gate both fail the text test.
 */
async function ready(page, path, timeout = 30000) {
  const target = path.split('?')[0];
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const state = await page
      .eval(`
        const text = (document.body?.innerText ?? '').trim();
        return {
          here: location.pathname === ${JSON.stringify(target)},
          chars: text.length,
          gated: /crea account|create account|ho gi\\u00e0 un account|i already have/i.test(text),
        };
      `)
      .catch(() => ({ here: false, chars: 0, gated: false }));
    if (state.gated) return { ok: false, reason: 'the profile is not signed in' };
    if (state.here && state.chars > 120) return { ok: true };
    await sleep(300);
  }
  return { ok: false, reason: `timed out after ${timeout}ms` };
}

/** Client-side routing only: a reload would tear down the SQLite worker. */
async function goto(page, path) {
  await page.eval(`
    history.pushState({}, '', ${JSON.stringify(path)});
    window.dispatchEvent(new PopStateEvent('popstate'));
  `);
  return ready(page, path);
}

async function shot(page, file) {
  await page
    .eval(`
      window.scrollTo(0, 0);
      document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; });
    `)
    .catch(() => {});
  await sleep(1000);
  const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, file), Buffer.from(data, 'base64'));
  console.log(`  captured ${file}`);
}

/* --------------------------------------------------------------- main ---- */

const chrome = spawn(
  CHROME,
  [
    // Headless for the same reason as the Alba capture: a headed window that
    // is not in front gets occluded, Chrome suspends its compositor, and the
    // OPFS worker behind expo-sqlite never runs.
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--no-first-run',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    ORIGIN + '/',
  ],
  { stdio: 'ignore' },
);

let page;
try {
  let targets;
  for (let i = 0; i < 60 && !targets; i++) {
    await sleep(500);
    targets = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      .then((r) => r.json())
      .catch(() => null);
  }
  const target = targets?.find((t) => t.type === 'page');
  if (!target) throw new Error('Chrome never exposed a page to attach to.');

  page = await Session.attach(target.webSocketDebuggerUrl);
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Emulation.setDeviceMetricsOverride', DEVICE);

  console.log(`Capturing ${ORIGIN} at ${DEVICE.width}x${DEVICE.height}@${DEVICE.deviceScaleFactor}x`);
  console.log(`Profile: ${PROFILE}`);

  const boot = await ready(page, '/', 60000);
  if (!boot.ok) throw new Error(`The app never got past the gate: ${boot.reason}`);

  /*
   * Every screen is attempted and a failure is reported rather than thrown:
   * which ones have anything in them depends on what was recorded while
   * signed in, and one empty screen should not cost the whole run.
   */
  const SCREENS = [
    ['home', '/', 'screenshot-home.png'],
    ['templates', '/templates', 'screenshot-templates.png'],
    ['exercises', '/exercises', 'screenshot-exercises.png'],
    ['history', '/history', 'screenshot-history.png'],
    ['progress', '/progress', 'screenshot-progress.png'],
    // Both need a state the app does not have by default: a session actually
    // running, and an account with the coach role and a connected client.
    ['active', '/active', 'screenshot-active.png'],
    ['coach', '/coach', 'screenshot-coach.png'],
    ['coach-plan', '/coach-plan', 'screenshot-coach-plan.png'],
  ];

  /*
   * ONLY=active,coach captures just those. Without it every screen is taken,
   * which is right for a first run and wrong for a second: the later screens
   * need a different signed-in state, and a full run would overwrite good
   * shots with whatever the profile happens to hold at that moment.
   */
  const only = (process.env.ONLY ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const wanted = only.length ? SCREENS.filter(([name]) => only.includes(name)) : SCREENS;
  if (only.length && wanted.length !== only.length) {
    const known = SCREENS.map(([n]) => n).join(', ');
    throw new Error(`ONLY names an unknown screen. Available: ${known}`);
  }

  const skipped = [];
  for (const [, path, file] of wanted) {
    const state = path === '/' ? { ok: true } : await goto(page, path);
    if (!state.ok) {
      skipped.push(`${path} (${state.reason})`);
      console.log(`  skipped ${path}: ${state.reason}`);
      continue;
    }
    await shot(page, file);
  }

  if (skipped.length) console.log(`\nNot captured: ${skipped.join(', ')}`);
  console.log('Done.');
} finally {
  page?.close();
  chrome.kill();
}
