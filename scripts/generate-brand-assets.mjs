/**
 * Rasterises the PNG brand assets that cannot be SVG.
 *
 *   npm run brand
 *
 * These are placeholders. Replace public/brand/og-default.png with a real
 * render when you have final artwork, or edit the markup below and re-run.
 * Fonts here are system fonts on purpose: the rasteriser has no access to the
 * webfonts the site itself uses.
 */
import sharp from 'sharp';

const ACCENT = '#e9ff4a';
const INK = '#101113';

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0c0d0e"/>
  <rect x="0" y="0" width="1200" height="10" fill="${ACCENT}"/>
  <text x="80" y="330" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="700" font-size="112" letter-spacing="-4" fill="#f2f2f0">gioviwankenobi</text>
  <rect x="80" y="372" width="196" height="16" fill="${ACCENT}"/>
  <text x="80" y="452" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="400" font-size="34" fill="#a8abae">Independent software developer</text>
  <text x="80" y="556" font-family="Consolas, Menlo, monospace" font-size="26" letter-spacing="2" fill="#797d82">gioviwankenobi.com</text>
</svg>`;

const appleTouch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${ACCENT}"/>
  <text x="90" y="138" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="700" font-size="146" letter-spacing="-6" fill="${INK}">g</text>
</svg>`;

const targets = [
  ['public/brand/og-default.png', og],
  ['public/brand/apple-touch-icon.png', appleTouch],
];

for (const [file, svg] of targets) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
  console.log(`wrote ${file}`);
}
