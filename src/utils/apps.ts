import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig, type Locale } from '~/config/site';

export type App = CollectionEntry<'apps'>;
export type LegalDoc = CollectionEntry<'legal'>;
/*
 * "delete-account" is a document in its own right, not a section of the
 * privacy policy: Google Play asks for a separate, publicly reachable URL
 * where an account can be closed, and it has to resolve without signing in.
 */
export type LegalKind = 'privacy' | 'terms' | 'delete-account';

export const LEGAL_KINDS = ['privacy', 'terms', 'delete-account'] as const;

/** Narrows a filename fragment, so a bad one fails the build with a message. */
const isLegalKind = (value: string | undefined): value is LegalKind =>
  (LEGAL_KINDS as readonly (string | undefined)[]).includes(value);

/** Parsed identity of a legal document, derived from its file path. */
export type LegalRef = {
  entry: LegalDoc;
  /** App slug, or "site" for the site-wide documents. */
  scope: string;
  kind: LegalKind;
  locale: Locale;
};

const STATUS_RANK: Record<App['data']['status'], number> = {
  live: 0,
  beta: 1,
  'in-development': 2,
  archived: 3,
};

/**
 * Every locale a legal document may legitimately be written in: the site
 * floor, plus every language any app declares it is localized into.
 *
 * Deriving this rather than hand-maintaining a list is what stops a policy
 * from being dropped in silence when an app adds a language.
 */
export async function getLegalLocales(): Promise<string[]> {
  const apps = await getApps();
  const set = new Set<string>(siteConfig.baseLocales);
  for (const app of apps) for (const tag of app.data.languages) set.add(tag);
  return [...set];
}

/** All apps, in catalog order: status, then explicit order, then release date. */
export async function getApps(): Promise<App[]> {
  const apps = await getCollection('apps');
  return apps.sort((a, b) => {
    const byStatus = STATUS_RANK[a.data.status] - STATUS_RANK[b.data.status];
    if (byStatus !== 0) return byStatus;
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    const at = a.data.released?.getTime() ?? 0;
    const bt = b.data.released?.getTime() ?? 0;
    if (at !== bt) return bt - at;
    return a.data.name.localeCompare(b.data.name);
  });
}

export async function getFeaturedApps(): Promise<App[]> {
  return (await getApps()).filter((a) => a.data.featured);
}

/** Every legal document, with its scope/kind/locale resolved from the path. */
export async function getLegalRefs(): Promise<LegalRef[]> {
  const docs = await getCollection('legal');
  const allowed = new Set(await getLegalLocales());
  const refs: LegalRef[] = [];

  for (const entry of docs) {
    // id looks like "orbital-notes/privacy.en" or "site/terms.en"
    const [scope, file] = entry.id.split('/');
    if (!scope || !file) continue;
    const [kind, locale] = file.split('.');

    if (!isLegalKind(kind)) {
      throw new Error(
        `Legal document "${entry.id}" must be named ` +
          `${LEGAL_KINDS.map((k) => `${k}.<locale>.md`).join(', ')}. Got "${file}".`,
      );
    }
    // A file that would otherwise be dropped in silence fails the build.
    if (!locale || !allowed.has(locale)) {
      throw new Error(
        `Legal document "${entry.id}" uses locale "${locale}", which no app ` +
          `declares. Add it to that app's "languages" in ` +
          `src/content/apps/, or fix the filename. Allowed: ${[...allowed].join(', ')}.`,
      );
    }

    refs.push({ entry, scope, kind, locale });
  }

  return refs;
}

/**
 * Languages an app ships in but has no policy for yet. Reported at build time
 * so a missing translation is visible to the developer and invisible to
 * visitors, who should never see a half-translated policy list.
 */
export async function missingLegalTranslations(): Promise<
  { app: string; kind: LegalKind; locales: string[] }[]
> {
  const apps = await getApps();
  const refs = await getLegalRefs();
  const gaps: { app: string; kind: LegalKind; locales: string[] }[] = [];

  for (const app of apps) {
    for (const kind of LEGAL_KINDS) {
      const have = new Set(
        refs.filter((r) => r.scope === app.id && r.kind === kind).map((r) => r.locale),
      );
      if (have.size === 0) continue; // no document of this kind at all: not a gap
      const missing = app.data.languages.filter((l) => !have.has(l));
      if (missing.length) gaps.push({ app: app.id, kind, locales: missing });
    }
  }

  return gaps;
}

/** Legal documents belonging to one app (or to "site"). */
export async function getLegalForScope(scope: string): Promise<LegalRef[]> {
  return (await getLegalRefs()).filter((r) => r.scope === scope);
}

/** Locales a given document exists in, default locale first. */
export function localesFor(refs: LegalRef[], kind: LegalKind): Locale[] {
  const locales = refs.filter((r) => r.kind === kind).map((r) => r.locale);
  return [...new Set(locales)].sort((a, b) =>
    a === siteConfig.defaultLocale ? -1 : b === siteConfig.defaultLocale ? 1 : a.localeCompare(b),
  );
}


