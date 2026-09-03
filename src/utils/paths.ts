/**
 * Base-path aware URL helpers.
 *
 * Astro rewrites `base` for imported assets and for the tags it generates,
 * but NOT for raw strings in markup. Every internal href and every reference
 * to a file in /public must go through `url()` so the site keeps working on
 * both https://<user>.github.io/<repo>/ and https://gioviwankenobi.com/.
 */

const BASE = import.meta.env.BASE_URL; // always starts and ends with "/" in Astro

/** Build an internal URL. `url('/apps', slug)` -> "/base/apps/my-app/". */
export function url(...segments: (string | number | undefined | null)[]): string {
  const path = segments
    .filter((s): s is string | number => s !== undefined && s !== null && s !== '')
    .map((s) => String(s).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
  if (!path) return BASE;
  return `${BASE}${path}/`;
}

/** Reference a file in /public. Keeps the extension, adds no trailing slash. */
export function asset(path: string): string {
  return `${BASE}${path.replace(/^\/+/, '')}`;
}

/** Absolute URL against the configured production origin, for canonical/OG tags. */
export function absolute(path: string, origin: string | URL): string {
  return new URL(path, origin).href;
}

/**
 * Absolute URL of the site root, base path included.
 * `Astro.site` is only the origin, so it is not the canonical home URL when
 * the site is served from a subdirectory.
 */
export function siteRoot(origin: string | URL): string {
  return new URL(BASE, origin).href;
}

/** True when `current` is the given route or lives underneath it. */
export function isActive(currentPathname: string, href: string): boolean {
  const a = currentPathname.replace(/\/+$/, '') || '/';
  const b = href.replace(/\/+$/, '') || '/';
  if (b === BASE.replace(/\/+$/, '')) return a === b;
  return a === b || a.startsWith(`${b}/`);
}
