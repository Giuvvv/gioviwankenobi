import type { ImageMetadata } from 'astro';

/**
 * App icons and screenshots live in src/assets/apps/<slug>/ so Astro's image
 * pipeline can resize them and emit modern formats. Content frontmatter refers
 * to them by the path underneath that directory, for example
 * "tidecheck/screenshot-today.png".
 */
const APP_IMAGES = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/apps/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

/** Resolve a frontmatter image path. Fails the build loudly on a typo. */
export function appImage(path: string): ImageMetadata {
  const key = `/src/assets/apps/${path.replace(/^\/+/, '')}`;
  const found = APP_IMAGES[key];
  if (!found) {
    throw new Error(
      `Missing app image "${path}". Expected a file at src/assets/apps/${path}. ` +
        `Available: ${Object.keys(APP_IMAGES).join(', ') || 'none'}`,
    );
  }
  return found.default;
}
