/**
 * Single source of truth for every global value on the site.
 * Nothing here should be duplicated inside a component.
 *
 * Values written as `TODO_*` are placeholders. Search the repo for "TODO_"
 * to find every one of them, or read the "Values you still need to provide"
 * section of README.md.
 */

export type SocialLink = {
  /** Visible label. */
  label: string;
  /** Full URL. Set to null to hide the link everywhere. */
  href: string | null;
  /** Iconify name from the Phosphor set, e.g. "ph:github-logo". */
  icon: string;
};

export const siteConfig = {
  /** Production domain, without protocol. Used for display only. */
  domain: 'gioviwankenobi.com',

  /** Display name of the developer identity. */
  name: 'gioviwankenobi',

  /**
   * Legal/attribution name shown in policy documents.
   * Replace once you decide what name should appear on App Store listings.
   */
  legalName: 'Giovan Battista Lo Buglio',

  /** Used for <title> suffixes and the OG site_name. */
  shortDescription: 'Independent software developer',

  /** Default meta description. Keep under ~155 characters. */
  description:
    'gioviwankenobi is an independent software developer. Apps, tools and experiments, plus the privacy policies and terms that go with them.',

  /** Default language of the main site (BCP 47). */
  defaultLocale: 'en',

  /**
   * Locales the site itself may publish a legal document in.
   *
   * This is only the floor. The real set is derived at build time from the
   * `languages` each app declares, so an app localized into Spanish makes
   * `privacy.es.md` valid without anyone editing this file.
   * See getLegalLocales() in src/utils/apps.ts.
   */
  baseLocales: ['en'] as const,

  /** Year the site started, used in the footer copyright range. */
  foundedYear: 2026,

  contact: {
    /** General enquiries. */
    email: 'info@gioviwankenobi.com',
    /** App support. Falls back to `email` when null. */
    supportEmail: null as string | null,
    /** Privacy requests. Falls back to `email` when null. */
    privacyEmail: null as string | null,
  },

  socials: [
    { label: 'GitHub', href: 'TODO_GITHUB_URL', icon: 'ph:github-logo' },
    { label: 'Mastodon', href: null, icon: 'ph:mastodon-logo' },
    { label: 'X', href: null, icon: 'ph:x-logo' },
  ] satisfies SocialLink[],

  /**
   * Social preview image, relative to /public. 1200x630.
   * Replace public/brand/og-default.png with a real render.
   */
  ogImage: '/brand/og-default.png',

  /**
   * Primary navigation. Legal links live in the footer, not here.
   * Contact points at the About page's contact block, which is where the
   * address actually lives; there is no separate Contact route to keep in sync.
   */
  /**
   * Things that are deliberately provisional. Set one to false and the
   * component is not rendered at all, rather than hidden with CSS.
   */
  experiments: {
    /** The ship you can drag, and fly behind the page. */
    ship: true,
  },

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/apps' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/about#contact' },
  ],
} as const;

/** Resolved support address, with fallback. */
export const supportEmail = siteConfig.contact.supportEmail ?? siteConfig.contact.email;

/** Resolved privacy address, with fallback. */
export const privacyEmail = siteConfig.contact.privacyEmail ?? siteConfig.contact.email;

/** Socials that actually have a URL. Never renders a dead link. */
export const activeSocials = siteConfig.socials.filter(
  (s): s is SocialLink & { href: string } => typeof s.href === 'string' && !s.href.startsWith('TODO_'),
);

/** A BCP 47 tag. Validated at build time against getLegalLocales(). */
export type Locale = string;
