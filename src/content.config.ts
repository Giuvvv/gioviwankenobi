import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const platform = z.enum([
  'ios',
  'ipados',
  'macos',
  'android',
  'windows',
  'linux',
  'web',
  'visionos',
  'watchos',
  'tvos',
]);

const media = z.object({
  /** Path relative to src/assets/apps/, e.g. "tidecheck/screenshot-today.png". */
  src: z.string(),
  alt: z.string(),
  /** Optional one-line caption rendered below the image. */
  caption: z.string().optional(),
  /*
   * A short paragraph shown beside the image on an app page. With one, the
   * screenshot becomes a section that explains a single thing; without one it
   * is just a picture in a row, which says nothing on its own.
   */
  body: z.string().optional(),
});

/**
 * One file per app: src/content/apps/<slug>.md
 * Frontmatter is the app's metadata. The markdown body is the long description
 * and is rendered only when it has content.
 */
const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    /** One line, sentence case, no trailing period. Shown in the catalog. */
    tagline: z.string(),
    /** Two or three sentences. Used for meta description and the app header. */
    summary: z.string(),
    status: z.enum(['live', 'beta', 'in-development', 'archived']),
    /** Featured apps get the wide plate treatment on the home page. */
    featured: z.boolean().default(false),
    /** Lower numbers sort first. Ties fall back to release date, then name. */
    order: z.number().default(100),
    /**
     * Marks placeholder content that is not a real published app.
     * Demo apps render a visible notice and are excluded from sitemap priority.
     */
    isDemo: z.boolean().default(false),

    /** Square icon in src/assets/apps/, at least 512px. PNG, JPG or WebP. */
    icon: z.string(),
    /**
     * Accent colour the app page adopts, one value per theme.
     * `onLight` / `onDark` are the text colours placed on top of a solid fill
     * of the matching accent. Both pairs must clear WCAG AA.
     */
    accent: z.object({
      light: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      dark: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      onLight: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      onDark: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    }),

    platforms: z.array(platform).min(1),
    /** BCP 47 tags the app itself is localized into. */
    languages: z.array(z.string()).default(['en']),
    /** What it is built with. Rendered as chips on the project card. */
    tech: z.array(z.string()).default([]),

    released: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    version: z.string().optional(),

    links: z
      .object({
        appStore: z.url().optional(),
        googlePlay: z.url().optional(),
        testFlight: z.url().optional(),
        github: z.url().optional(),
        website: z.url().optional(),
        /** Overrides the global support address for this app. */
        supportEmail: z.email().optional(),
      })
      .default({}),

    /*
     * A designed card for the home page, standing in for a screenshot there.
     * It explains what the app is; the screenshots on the app's own page show
     * what it looks like. Optional: without one the first screenshot is used,
     * which is what every app did before this existed.
     */
    poster: media.optional(),
    screenshots: z.array(media).default([]),
    /** Rendered as a numbered editorial list, not as a card grid. */
    features: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),

    seo: z
      .object({
        description: z.string().optional(),
        /** Path under /public, 1200x630. Falls back to the site default. */
        ogImage: z.string().optional(),
      })
      .default({}),
  }),
});

/**
 * Legal documents, for the site itself and for individual apps.
 *
 * Path convention: src/content/legal/<scope>/<doc>.<locale>.md
 *   scope  = an app slug, or "site" for the site-wide documents
 *   doc    = "privacy" | "terms"
 *   locale = a BCP 47 tag listed in siteConfig.supportedLocales
 *
 * Example: src/content/legal/orbital-notes/privacy.it.md
 */
const legal = defineCollection({
  loader: glob({
    base: './src/content/legal',
    pattern: '**/*.md',
    // The default id generator strips dots, which would turn "privacy.en"
    // into "privacyen". Keep the path so scope/kind/locale stay readable.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    /** Revision date shown at the top of the document. */
    updated: z.coerce.date(),
    /**
     * Document version, shown in the header. Keep it aligned with whatever
     * constant the app checks it against before a store release.
     */
    version: z.string().optional(),
    /** Optional standfirst above the table of contents. */
    intro: z.string().optional(),
    /** Set true while the text is still placeholder wording. */
    isPlaceholder: z.boolean().default(true),
  }),
});

export const collections = { apps, legal };
