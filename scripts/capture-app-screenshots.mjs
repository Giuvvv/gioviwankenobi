/**
 * Capture real device-sized screenshots of an Expo web build.
 *
 *   node scripts/capture-app-screenshots.mjs
 *
 * Drives headless Chrome over the DevTools protocol with no dependencies:
 * Node's global WebSocket is the whole client. Chrome ships with every desktop
 * install, so nothing is downloaded.
 *
 * The app under test is served separately. For Alba:
 *
 *   cd ../alba && npx expo export --platform web --output-dir dist
 *   cd ../alba && PORT=8083 node scripts/serve-web-preview.mjs
 *
 * A dev export would expose Alba's own demo-data generator, which would be the
 * obvious way to fill the app. It is not usable here: installing eight weeks of
 * rows wedges the OPFS database that expo-sqlite keeps behind a worker, and
 * every screen afterwards renders "Cannot open the local database". So the
 * diary is seeded through the app's own quick-add screen instead, which is
 * slower but never breaks.
 *
 * Each run starts from a throwaway Chrome profile, so the app is always in a
 * first-launch state and the seeding steps below are what put it into a
 * presentable one. That is what makes the output reproducible.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIGIN = process.env.APP_ORIGIN ?? 'http://localhost:8083';
const OUT = process.env.OUT_DIR ?? 'src/assets/apps/alba';
const PORT = 9333;

/*
 * iPhone 14 Pro logical size. The pixel density is doubled past the 3x the
 * stores ask for because the website shows these magnified: at 3x a shot is
 * 1170 wide and the site can display it four times that, which is where the
 * softness came from. Layout is identical either way, only the raster is
 * finer.
 */
const DEVICE = { width: 390, height: 844, deviceScaleFactor: 6, mobile: true };

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

if (!CHROME) throw new Error('Chrome not found. Set the path in CHROME.');

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

  /** Evaluate in the page and return the value, awaiting promises. */
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

/* ------------------------------------------------------- page helpers ---- */

/** Tap a leaf element by its exact visible text. React Native Web has no roles. */
const TAP = `
  const tap = (label) => {
    const el = [...document.querySelectorAll('*')]
      .find((e) => e.textContent.trim() === label && e.children.length === 0);
    if (el) { el.click(); return true; }
    return false;
  };
  const setField = (label, value) => {
    const i = [...document.querySelectorAll('input')]
      .find((x) => x.getAttribute('aria-label') === label);
    if (!i) return false;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, value);
    i.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
`;

/**
 * Wait until the page actually contains something, rather than sleeping and
 * hoping. A dev export boots slowly enough that fixed delays photograph the
 * splash screen, which is how the first run of this script failed.
 */
async function waitForText(page, needles, timeout = 60000) {
  // Headless Chrome reports an English locale, so the app may already be in
  // English before the language is set. Markers accept alternatives rather
  // than assuming one language.
  const list = Array.isArray(needles) ? needles : [needles];
  const started = Date.now();
  while (Date.now() - started < timeout) {
    // innerHTML rather than innerText: React Native Web virtualises long
    // lists, so a heading that has scrolled out is not in the rendered text.
    const seen = await page.eval(
      `const html = document.body?.innerHTML ?? '';
       return ${JSON.stringify(list)}.some((n) => html.includes(n));`,
    ).catch(() => false);
    if (seen) return;
    await sleep(400);
  }
  const seen = await page.eval('return document.body?.innerText?.slice(0, 400) ?? "(no body)";');
  throw new Error(
    `Timed out waiting for ${JSON.stringify(list)} after ${timeout}ms.
On screen was:
${seen}`,
  );
}

/** The one full page load. Everything after this is client-side routing. */
async function boot(page, expect) {
  await page.eval(`location.assign(${JSON.stringify(ORIGIN + '/')});`).catch(() => {});
  // The execution context is torn down by the navigation; polling before it is
  // rebuilt just throws and burns the budget.
  await sleep(3000);
  const started = Date.now();
  while (Date.now() - started < 60000) {
    if (await settled(page, expect, 1000)) return;
    await sleep(300);
  }
  const seen = await page
    .eval('return { url: location.href, text: (document.body?.innerText ?? "").slice(0,200) };')
    .catch((e) => ({ url: 'eval failed: ' + e.message, text: '' }));
  throw new Error(`The app never finished booting.
URL ${seen.url}
${seen.text}`);
}

/**
 * Navigate without reloading.
 *
 * Every full reload tears down expo-sqlite's worker, and the next one cannot
 * reopen the OPFS database before the old handle is released: the app then
 * renders "Cannot open the local database" and never recovers. Driving the
 * router through history instead keeps a single database connection alive for
 * the whole run, which is the difference between this working and not.
 */
async function goto(page, path, expect) {
  const target = path.split('?')[0];
  await page.eval(`
    history.pushState({}, '', ${JSON.stringify(path)});
    window.dispatchEvent(new PopStateEvent('popstate'));
  `);

  const started = Date.now();
  while (Date.now() - started < 30000) {
    const ok = await page.eval(
      `return location.pathname === ${JSON.stringify(target)};`,
    ).catch(() => false);
    if (ok) break;
    await sleep(200);
  }

  if (!(await settled(page, expect))) {
    const seen = await page
      .eval('return { url: location.pathname + location.search, text: (document.body?.innerText ?? "").slice(0, 300) };')
      .catch(() => ({ url: '?', text: '(unreadable)' }));
    throw new Error(
      `${path} never rendered (waited for ${JSON.stringify(expect)}).
` +
        `URL was ${seen.url}
On screen:
${seen.text}`,
    );
  }

  await page.eval(`
    window.scrollTo(0, 0);
    document.querySelectorAll('*').forEach((e) => { if (e.scrollTop) e.scrollTop = 0; });
  `).catch(() => {});
  await sleep(1200); // let images and the chart settle before the shutter
}

/**
 * True once the screen is both mounted and actually visible.
 *
 * The marker is matched against innerHTML, because long lists are virtualised
 * and a heading that scrolled out is not in the rendered text. innerHTML alone
 * matches while the splash overlay still covers a mounted screen, so visible
 * text is checked too.
 */
async function settled(page, needles, timeout = 25000) {
  const list = Array.isArray(needles) ? needles : [needles];
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const state = await page
      .eval(`
        const html = document.body?.innerHTML ?? '';
        const text = (document.body?.innerText ?? '').trim();
        /*
         * Both haystacks, case-insensitively. innerHTML alone misses labels
         * that CSS uppercases (React Native Web renders "Calories" and styles
         * it to CALORIES), and innerText alone misses headings that have
         * scrolled out of a virtualised list.
         */
        const hay = (html + ' ' + text).toLowerCase();
        return {
          broken: text.includes('Cannot open the local database'),
          match: ${JSON.stringify(list)}.some((n) => hay.includes(n.toLowerCase())),
          visible: text.length,
        };
      `)
      .catch(() => ({ broken: false, match: false, visible: 0 }));
    if (state.broken) return false;
    if (state.match && state.visible > 120) return true;
    await sleep(250);
  }
  return false;
}

/**
 * Capture the screen, optionally nudged down first.
 *
 * Everything is scrolled to the top before a shot, which is right for most
 * screens and wrong for the ones whose last element then sits half outside
 * the frame. A small offset moves the crop to a clean edge.
 */
async function shot(page, file, offset = 0) {
  if (offset) {
    await page.eval(`
      const target = ${offset};
      window.scrollTo(0, target);
      for (const e of document.querySelectorAll('*')) {
        if (e.scrollHeight > e.clientHeight + 8) { e.scrollTop = target; break; }
      }
    `).catch(() => {});
    await sleep(700);
  }
  const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, file), Buffer.from(data, 'base64'));
  console.log(`  captured ${file}`);
}

/* --------------------------------------------------------------- main ---- */

const profile = mkdtempSync(join(tmpdir(), 'alba-shots-'));
const chrome = spawn(
  CHROME,
  [
    /*
     * Headless. A headed window parked off-screen gets occluded, Chrome
     * suspends its compositor, and expo-sqlite's OPFS worker never runs: the
     * app then renders "Cannot open the local database" forever.
     */
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let page;
try {
  // Wait for the debugging endpoint rather than guessing at a delay.
  let targets;
  for (let i = 0; i < 60; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      if (targets.some((t) => t.type === 'page')) break;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  const target = targets?.find((t) => t.type === 'page');
  if (!target) throw new Error('No Chrome page target appeared.');

  page = await Session.attach(target.webSocketDebuggerUrl);
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Emulation.setDeviceMetricsOverride', DEVICE);

  console.log(`Capturing ${ORIGIN} at ${DEVICE.width}x${DEVICE.height}@${DEVICE.deviceScaleFactor}x`);

  // --- 1. onboarding, English, then the app's own demo dataset -----------
  await boot(page, ['Continua', 'Continue', 'CALORIES', 'CALORIE']);
  await page.eval(`
    ${TAP}
    const nameField = [...document.querySelectorAll('input')]
      .find((i) => /nome|name/i.test(i.placeholder || ''));
    if (nameField) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
        .set.call(nameField, 'Giovi');
      nameField.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(600);
    }
    tap('Continua') || tap('Continue');
    await sleep(1600);
    tap('Sì') || tap('Yes');
    await sleep(1500);
    tap('Giornalmente') || tap('Daily');
    await sleep(2500);
  `);

  await goto(page, '/settings', ['Impostazioni', 'Settings']);
  await page.eval(`${TAP} tap('English'); await sleep(2000);`);

  /*
   * Days counted back from whenever this runs, not written out. The dates
   * used to be literals, which meant the capture only produced a full-looking
   * home screen on the single day the list happened to start at: run it a day
   * later and the current day was empty, so the headline shot showed every
   * total at zero.
   */
  const iso = (back) => {
    const d = new Date();
    d.setDate(d.getDate() - back);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Values are plausible rather than tidy: real days are uneven.
  const DAYS = [
    [iso(0), [['breakfast', 'Greek yoghurt and berries', 268, 22, 24, 9],
                    ['lunch', 'Chicken, rice and greens', 642, 46, 71, 16],
                    ['snacks', 'Apple and almonds', 214, 6, 22, 12],
                    ['dinner', 'Salmon, potatoes, salad', 611, 38, 44, 29]]],
    [iso(1), [['breakfast', 'Porridge and banana', 341, 12, 58, 7],
                    ['lunch', 'Pasta with tomato', 587, 19, 94, 12],
                    ['dinner', 'Omelette and bread', 498, 31, 34, 24]]],
    [iso(2), [['breakfast', 'Toast and eggs', 392, 24, 31, 18],
                    ['lunch', 'Lentil soup', 436, 24, 58, 9],
                    ['dinner', 'Pizza margherita', 812, 32, 98, 29]]],
    [iso(3), [['breakfast', 'Greek yoghurt and berries', 268, 22, 24, 9],
                    ['lunch', 'Tuna salad', 468, 39, 22, 24],
                    ['dinner', 'Risotto', 655, 17, 96, 19]]],
    [iso(4), [['breakfast', 'Porridge and banana', 341, 12, 58, 7],
                    ['lunch', 'Chicken wrap', 572, 37, 54, 21],
                    ['dinner', 'Stir fry and noodles', 604, 28, 79, 18]]],
    [iso(5), [['breakfast', 'Toast and eggs', 392, 24, 31, 18],
                    ['dinner', 'Beans and rice', 588, 22, 92, 12]]],
    [iso(6), [['breakfast', 'Greek yoghurt and berries', 268, 22, 24, 9],
                    ['lunch', 'Pasta with pesto', 701, 22, 88, 28]]],
    [iso(7), [['breakfast', 'Porridge and banana', 341, 12, 58, 7],
                    ['lunch', 'Soup and bread', 402, 15, 62, 9],
                    ['dinner', 'Roast vegetables and feta', 519, 20, 41, 30]]],
    [iso(8), [['breakfast', 'Toast and eggs', 392, 24, 31, 18],
                    ['dinner', 'Chicken and couscous', 631, 44, 68, 17]]],
    [iso(9), [['breakfast', 'Porridge and banana', 341, 12, 58, 7],
                    ['lunch', 'Chicken salad', 512, 41, 28, 26],
                    ['dinner', 'Pasta with beans', 664, 26, 96, 16]]],
    [iso(10), [['breakfast', 'Greek yoghurt and berries', 268, 22, 24, 9],
                    ['dinner', 'Sunday roast', 878, 52, 64, 41]]],
    [iso(11), [['breakfast', 'Toast and eggs', 392, 24, 31, 18],
                    ['lunch', 'Poke bowl', 596, 34, 68, 20],
                    ['dinner', 'Soup and bread', 402, 15, 62, 9]]],
    [iso(12), [['breakfast', 'Porridge and banana', 341, 12, 58, 7],
                    ['lunch', 'Sandwich and crisps', 631, 24, 74, 26]]],
    [iso(13), [['breakfast', 'Greek yoghurt and berries', 268, 22, 24, 9],
                    ['lunch', 'Rice and vegetables', 484, 14, 84, 10],
                    ['dinner', 'Grilled fish and salad', 549, 42, 26, 28]]],
    [iso(14), [['breakfast', 'Toast and eggs', 392, 24, 31, 18],
                    ['dinner', 'Curry and rice', 712, 29, 92, 24]]],
    [iso(15), [['breakfast', 'Porridge and banana', 341, 12, 58, 7],
                    ['lunch', 'Pasta with tomato', 587, 19, 94, 12],
                    ['dinner', 'Frittata and greens', 468, 30, 18, 30]]],
  ];

  let seeded = 0;
  for (const [date, meals] of DAYS) {
    for (const [meal, name, kcal, p, c, f] of meals) {
      await goto(page, `/quick-add?meal=${meal}&date=${date}`, ['CALORIES', 'CALORIE']);
      await page.eval(`
        ${TAP}
        setField('Name', ${JSON.stringify(name)});
        setField('Calories', '${kcal}'); setField('Protein', '${p}');
        setField('Carbs', '${c}'); setField('Fat', '${f}');
        await sleep(600);
        tap('Add') || tap('Aggiungi');
        await sleep(1800);
      `);
      seeded++;
    }
    console.log(`  seeded ${date}`);
  }
  console.log(`  ${seeded} entries across ${DAYS.length} days`);

  // A dev export shows React's error toast. It is not part of the app.
  const HIDE_DEV_UI = `
    const style = document.createElement('style');
    style.textContent = '#error-toast { display: none !important; }';
    document.head.appendChild(style);
  `;

  // --- 2. the screens worth showing --------------------------------------
  await goto(page, '/', ['CALORIES', 'CALORIE']);
  await page.eval(`${TAP} ${HIDE_DEV_UI} tap('Skip for today'); await sleep(1800);`);
  await shot(page, 'screenshot-today.png');

  /*
   * Shot on the current month on purpose. Stepping back a month fills the day
   * list but draws every bar at zero height: the chart only renders properly
   * for the month in view. That looks like a bug in the app rather than a
   * timing problem here, so this stays on the month that draws correctly.
   */
  await goto(page, '/history', 'History');
  await shot(page, 'screenshot-history.png');

  for (const [path, expect, file] of [
    ['/planner', 'Plan your week', 'screenshot-planner.png'],
    ['/settings', 'Settings', 'screenshot-settings.png'],
  ]) {
    await goto(page, path, expect);
    await page.eval(HIDE_DEV_UI);
    await shot(page, file);
  }

  console.log('Done.');
} finally {
  page?.close();
  chrome.kill();
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    /* Windows sometimes holds the profile briefly; it is in the temp dir. */
  }
}
