/**
 * Render the promotional cards in scripts/cards/ to PNG.
 *
 *   node scripts/render-cards.mjs
 *
 * The cards are authored as HTML so the words are real typography rather than
 * pixels: Chrome rasterises them at six times the layout size, which is what
 * keeps them sharp when the site magnifies one.
 *
 * Headless Chrome's own --screenshot flag is enough here. There is no page to
 * drive and nothing to wait for beyond the fonts, so none of the CDP machinery
 * in capture-app-screenshots.mjs is needed.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

if (!CHROME) throw new Error('Chrome not found. Set the path in CHROME.');

/** Card source, output file, and the layout size it is designed at. */
const CARDS = [
  ['scripts/cards/alba-poster.html', 'src/assets/apps/alba/poster.png', 390, 844],
  ['scripts/cards/aspera-poster.html', 'src/assets/apps/aspera/poster.png', 390, 844],
];

const SCALE = 6;

for (const [src, out, width, height] of CARDS) {
  mkdirSync(resolve(out, '..'), { recursive: true });
  const profile = mkdtempSync(join(tmpdir(), 'gwk-cards-'));
  const res = spawnSync(
    CHROME,
    [
      '--headless=new',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--disable-extensions',
      '--hide-scrollbars',
      // Local fonts are loaded over file://, which a page cannot read without
      // this: without it the card renders in a fallback face.
      '--allow-file-access-from-files',
      '--default-background-color=00000000',
      `--force-device-scale-factor=${SCALE}`,
      `--window-size=${width},${height}`,
      `--screenshot=${resolve(out)}`,
      pathToFileURL(resolve(src)).href,
    ],
    { stdio: 'inherit' },
  );
  rmSync(profile, { recursive: true, force: true });
  if (res.status !== 0) throw new Error(`Chrome failed on ${src}`);
  console.log(`rendered ${out} at ${width * SCALE}x${height * SCALE}`);
}
