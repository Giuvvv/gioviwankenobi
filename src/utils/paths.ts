/**
 * Base-path aware URL helpers.
 *
 * Astro rewrites `base` for imported assets and for the tags it generates,
 * but NOT for raw strings in markup. Every internal href and every reference
 * to a file in /public must go through `url()` so the site keeps working on
 * both https://<user>.github.io/<repo>/ and https://gioviwankenobi.com/.
 */

/*
 * Astro keeps `base` exactly as it was configured, and the workflow feeds it
 * from `actions/configure-pages`, which reports a project site's base_path
 * WITHOUT a trailing slash ("/gioviwankenobi"). BASE_URL is therefore not the
 * "/…/" the Astro docs imply, and every helper below concatenates onto it:
 * unnormalised, the whole site ships links like "/gioviwankenobiabout/".
 * At the domain root the base is "/" and the fault is invisible, which is
 * exactly why it has to be handled here rather than at the call sites -- and
 * why the joining below is a pure function with its own tests: this is the one
 * piece of the site that production exercises in a shape localhost never does.
 */
export function normaliseBase(raw: string): string {
  if (!raw) return '/';
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

/** `url()` and `asset()` against an explicit base. Exported so it is testable. */
export function joinBase(
  base: string,
  ...segments: (string | number | undefined | null)[]
): string {
  const root = normaliseBase(base);
  const path = segments
    .filter((s): s is string | number => s !== undefined && s !== null && s !== '')
    .map((s) => String(s).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
  if (!path) return root;
  return `${root}${path}/`;
}

/** A file in /public against an explicit base. Keeps the extension. */
export function joinAsset(base: string, path: string): string {
  return `${normaliseBase(base)}${path.replace(/^\/+/, '')}`;
}

// `import.meta.env` is Vite's, and Astro always defines it. The optional chain
// is for the one caller that runs outside Vite -- paths.test.ts, which imports
// this module for the pure functions above and never reaches a bare url().
const BASE = normaliseBase(import.meta.env?.BASE_URL ?? '/');

/** Build an internal URL. `url('/apps', slug)` -> "/base/apps/my-app/". */
export function url(...segments: (string | number | undefined | null)[]): string {
  return joinBase(BASE, ...segments);
}

/** Reference a file in /public. Keeps the extension, adds no trailing slash. */
export function asset(path: string): string {
  return joinAsset(BASE, path);
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
