# gioviwankenobi.com

The permanent website for gioviwankenobi: an independent developer's home page
and the central catalog for every app that gets published, including the
privacy policies and terms those apps link to from inside themselves.

It is built so that adding a new app is a content change, not an engineering
project.

---

## Contents

1. [Technology](#technology)
2. [Local setup](#local-setup)
3. [Deployment](#deployment)
4. [Connecting gioviwankenobi.com](#connecting-gioviwankenobicom)
5. [How to add a new app](#how-to-add-a-new-app)
6. [Giving an app its own design](#giving-an-app-its-own-design)
7. [Privacy policies and terms](#privacy-policies-and-terms)
8. [Localization](#localization)
9. [Global contact details and social links](#global-contact-details-and-social-links)
10. [Social and meta images](#social-and-meta-images)
11. [Project structure](#project-structure)
12. [The design system](#the-design-system)
13. [Values you still need to provide](#values-you-still-need-to-provide)

---

## Technology

| Concern | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build) 7, static output |
| Language | TypeScript, strict |
| Styling | Native CSS with custom properties, no framework |
| Content | Astro content collections with Zod schemas |
| Icons | [Phosphor](https://phosphoricons.com) via `astro-icon`, inlined at build |
| Fonts | Sora, Instrument Sans, IBM Plex Mono, self-hosted |
| Images | Astro's built-in pipeline (resize plus WebP) |
| Hosting | GitHub Pages |

There is no UI framework and no client-side router. The JavaScript that ships
is: the starfield canvas, one IntersectionObserver that drives every scroll
reveal, the pointer ring, the card tilt, and one line on the 404 page. All of
it is vanilla, all of it is inlined, and every piece degrades to a static page
if it fails. Everything else is static HTML.

## Local setup

Requires Node 20 or newer.

```bash
npm install
```

Start the dev server on <http://localhost:4321>:

```bash
npm run dev
```

Type-check and build to `dist/`:

```bash
npm run build
```

Serve the built output exactly as it will be served in production:

```bash
npm run preview
```

`npm run build:fast` skips `astro check` when you only want the output.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages.

One-time setup in the repository:

1. **Settings > Pages > Build and deployment > Source**: choose **GitHub
   Actions**.
2. Push to `main`.

The workflow does not hardcode a URL. `actions/configure-pages` resolves the
origin and base path for whatever the Pages site currently is, and passes them
to the build as `SITE_URL` and `BASE_PATH`. That means the same commit builds
correctly at `https://<user>.github.io/<repo>/` and at
`https://gioviwankenobi.com/`, with no edit in between.

**Never write a leading-slash URL by hand.** Internal links and files in
`public/` go through the helpers in `src/utils/paths.ts`:

```astro
import { url, asset } from '~/utils/paths';

<a href={url('/apps', slug)}>...</a>
<img src={asset('/brand/og-default.png')} />
```

`url('/apps', 'my-app')` produces `/base/apps/my-app/`. Assets imported through
`src/assets/` are rewritten by Astro automatically and need no helper.

## Connecting gioviwankenobi.com

When you are ready to move off the `github.io` address:

1. **DNS, at your registrar.** For the apex domain, four `A` records:

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   Optionally the matching `AAAA` records for IPv6:
   `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
   `2606:50c0:8003::153`.

   For `www`, one `CNAME` record pointing at `<user>.github.io`.

2. **GitHub.** Settings > Pages > Custom domain: enter `gioviwankenobi.com` and
   save. GitHub writes a `CNAME` file into the published branch for you, so you
   do not need to add one to `public/`.

3. **HTTPS.** Once DNS resolves, tick **Enforce HTTPS**. The certificate is
   issued automatically and can take a few hours.

4. **Redeploy.** Re-run the workflow, or push any commit. `configure-pages` now
   reports the custom domain, so `site` becomes `https://gioviwankenobi.com` and
   `base` becomes `/`. Canonical tags, the sitemap and `robots.txt` follow
   automatically.

You do not need to edit `astro.config.mjs`. To build for the custom domain
locally:

```bash
SITE_URL=https://gioviwankenobi.com BASE_PATH=/ npm run build
```

## How to add a new app

This is the part designed to stay easy. Adding an app touches two directories
and nothing else.

### 1. Drop the images in

```text
src/assets/apps/<slug>/
  icon.png              square, 512px or larger
  screenshot-*.png      any number, any size, PNG or JPG or WebP
```

They live in `src/assets/`, not `public/`, so Astro resizes them and serves
WebP. Do not optimise them yourself; ship the originals.

### 1b. Capturing screenshots, if the app has a web build

Expo apps with `web: { output: "static" }` can be photographed instead of
screenshotted by hand:

```bash
cd ../alba && npx expo export --platform web --output-dir dist
cd ../alba && PORT=8083 node scripts/serve-web-preview.mjs   # leave running
cd ../gioviwankenobi && node scripts/capture-app-screenshots.mjs
```

`scripts/capture-app-screenshots.mjs` drives headless Chrome over the DevTools
protocol using Node's global `WebSocket`, so there is nothing to install and no
browser to download. It emits PNGs at 1170x2532, the iPhone 14 Pro resolution
the stores expect, straight into `src/assets/apps/<slug>/`.

Every run starts from a throwaway Chrome profile, so the app is always in a
first-launch state. The script's job is to walk it into a presentable one:
finish onboarding, switch to English, add two meals, then capture. That is what
makes the output reproducible rather than a snapshot of whatever state a
simulator happened to be in. Adjust those steps when the app's flow changes.

It deliberately does not enable Alba's online lookup, because that would send
real requests to Open Food Facts just to take a picture.

Screenshots taken this way are the app's real UI, but rendered by a browser:
good enough for this site, not a substitute for native captures on a device
when you submit to the stores.

### 2. Write the content file

Create `src/content/apps/<slug>.md`. The file name is the slug, so
`aurora-timer.md` becomes `/apps/aurora-timer`.

```markdown
---
name: Aurora Timer
tagline: One line, sentence case, no full stop
summary: >-
  Two or three sentences. Used on the app page and as the meta description.
status: live                # live | beta | in-development | archived
featured: true              # gets the wide plate on the home page
order: 2                    # lower sorts first
isDemo: false

icon: aurora-timer/icon.png
accent:
  light: '#7a3ea1'          # accent on a light background
  dark: '#c79bea'           # accent on a dark background
  onLight: '#ffffff'        # text drawn on top of `light`
  onDark: '#231033'         # text drawn on top of `dark`

platforms: [ios, macos]     # full list in src/config/platforms.ts
languages: [en, it]
tech: [Swift, SwiftUI]      # shown as chips on the project card

released: 2026-05-01
updated: 2026-09-01
version: '1.0'

links:
  appStore: https://apps.apple.com/app/id000000000
  github: https://github.com/user/repo

screenshots:
  - src: aurora-timer/screenshot-main.png
    alt: Describe what is on the screen, not that it is a screenshot
    caption: Optional single line

features:
  - title: Short label
    body: One or two sentences.

faq:
  - q: A real question people ask
    a: The answer.
---

Optional long description in Markdown. Rendered on the app page only if you
write something here. Delete the body entirely if you do not need it.
```

Only `name`, `tagline`, `summary`, `status`, `icon`, `accent` and `platforms`
are required. **Sections only render when they have content**, so an app with no
FAQ shows no FAQ heading and an app with no screenshots shows no gallery.

The schema lives in `src/content.config.ts` and is enforced at build time, so a
typo fails the build with a message instead of shipping quietly.

### 3. That is it

The app now appears in the catalog on `/apps`, in the footer, in the sitemap and
at `/apps/<slug>` with its own colour. **It also gets its own constellation in
the sky**, on every page of the site, with no further work: the shape comes from
the slug and the size from how many features and screenshots the entry has. Add
its policies next, below.

### Accent colour rule

The site renders in a single dark environment, so only `dark` and `onDark` are
actually used; `light` and `onLight` stay in the schema so a light theme could
return without a content migration. `onDark` must clear WCAG AA on a solid
`dark` fill. The app's colour drives its status chip, its page rule, its
buttons, its card bloom and any custom section.

## Giving an app its own design

The default app page is deliberately neutral so it works for any product. When
an app deserves more, there are three levels, in the order you should reach for
them:

**1. The accent.** Set in the content file. It rebinds `--accent` and
`--accent-ink` for the whole page, including the header rule, the nav underline,
buttons and the status chip. For most apps this is enough.

**2. A custom section.** Create `src/components/apps/<slug>/Custom.astro`. It is
picked up automatically and rendered between the long description and the
feature list. It receives the app entry as a prop:

```astro
---
import type { App } from '~/utils/apps';
export interface Props { app: App }
const { app } = Astro.props;
---
<section class="band">...</section>
```

`src/components/apps/tidecheck/Custom.astro` is a working example. Nothing else
in the codebase changes, and apps without one render as normal.

**3. Anything further.** `src/pages/apps/[slug].astro` composes shared
components from `src/components/apps/shared/`. If one app needs a genuinely
different page, branch on `app.id` there and render a different composition.
Keep app-specific components inside `src/components/apps/<slug>/` so the shared
directory stays shared.

The global chrome (header, footer, type scale, spacing, motion, focus states) is
not overridable on purpose. That is what makes every app page still read as part
of this site.

## Privacy policies and terms

App stores keep whatever URL you give them, sometimes for years. These addresses
are therefore fixed, and they are built in exactly one place: `legalUrl()` in
`src/utils/legal.ts`.

| Document | URL |
| --- | --- |
| Site privacy | `/privacy` |
| Site terms | `/terms` |
| App privacy | `/apps/<slug>/privacy` |
| App terms | `/apps/<slug>/terms` |
| Translated app policy | `/apps/<slug>/<locale>/privacy` |
| Translated site policy | `/<locale>/privacy` |

To add one, create a Markdown file:

```text
src/content/legal/<scope>/<doc>.<locale>.md
```

- `<scope>` is an app slug, or `site` for the site-wide documents
- `<doc>` is `privacy` or `terms`
- `<locale>` is a tag listed in `siteConfig.supportedLocales`

```markdown
---
title: Aurora Timer Privacy Policy
updated: 2026-09-01
isPlaceholder: false      # true while the wording is still a draft
intro: Optional standfirst.
---

## First section

Body text.
```

Notes:

- The route, the footer links, the app page's Legal section and the language
  switcher are all derived from which files exist. There is no list to update.
- `##` headings become the table of contents, which appears automatically once a
  document has more than three of them.
- `isPlaceholder: true` renders a visible warning on the page. Set it to `false`
  only when the text has actually been reviewed.
- Legal pages have their own print stylesheet, including printed link targets.
- **The shipped documents are placeholders and are not legal advice.** Replace
  the wording before submitting any of these URLs to Apple, Google or anyone
  else.

## Localization

The rule is simple and it splits along one line:

- **The site, and every app's presentation, is English.** Home page, project
  pages, descriptions, features, the catalogue, About. One language, one thing
  to keep current.
- **Policies follow the app.** A privacy policy and terms are published in
  every language the app itself ships in, because that is who reads them.

So the `languages` field on an app is not decoration. It is the list of
locales that app's legal documents are expected to exist in, and the build
enforces it in both directions:

- **A locale no app declares fails the build.** Writing
  `legal/myapp/privacy.es.md` when the app declares `languages: [en, it]`
  stops the build with a message naming the file. Previously a file like that
  was dropped in silence: no route, no link, no error.
- **A declared language with no policy is reported.** If an app ships in `it`
  and only `privacy.en.md` exists, the build prints a `[legal]` warning naming
  the exact file to create. It is a warning, not an error, so a translation can
  land after the English original without blocking a deploy.

The set of valid locales is derived by `getLegalLocales()` from the union of
every app's `languages` plus `siteConfig.baseLocales`. Adding a language to an
app is all that is needed to make its policy locale legal; there is no list to
maintain by hand.

### URLs

The default locale keeps the short URL, so **an address already filed with a
store never changes when a translation is added later**:

| Document | URL |
| --- | --- |
| Default locale | `/apps/<slug>/privacy` |
| Any other locale | `/apps/<slug>/<locale>/privacy` |

A language switcher appears on the document automatically once a second
translation exists. `src/content/legal/tidecheck/privacy.it.md` is a working
example.

## Global contact details and social links

Everything global lives in `src/config/site.ts`. Components read it; nothing is
hardcoded elsewhere.

```ts
contact: {
  email: 'TODO_CONTACT_EMAIL',
  supportEmail: null,   // falls back to email
  privacyEmail: null,   // falls back to email
},

socials: [
  { label: 'GitHub', href: 'TODO_GITHUB_URL', icon: 'ph:github-logo' },
  { label: 'Mastodon', href: null, icon: 'ph:mastodon-logo' },
],
```

A social entry with `href: null` or a `TODO_` value is filtered out and never
rendered, so the site cannot show a dead link. Fill in a value and it appears in
the footer, on the About page and on the home page at once.

An app can override the support address for itself with `links.supportEmail`.

## Social and meta images

- **Favicon**: `public/brand/favicon.svg`
- **Apple touch icon**: `public/brand/apple-touch-icon.png`, 180x180
- **Default social card**: `public/brand/og-default.png`, 1200x630
- **Per-app social card**: put a file in `public/` and point at it from the
  app's `seo.ogImage`. Falls back to the site default when unset.

The two PNGs are generated placeholders. Regenerate them after changing the
palette, or replace them with real artwork:

```bash
npm run brand
```

The source markup is in `scripts/generate-brand-assets.mjs`.

## Project structure

```text
.github/workflows/deploy.yml   GitHub Pages build and deploy
scripts/                       Brand asset rasteriser

public/brand/                  Favicon, touch icon, social card
src/
  assets/apps/<slug>/          App icons and screenshots, optimised at build
  components/
    site/                      Header, Footer, Wordmark, StarChart,
                               ChartLegend, Cursor, SEO head, legal document
    apps/shared/               Components every app page can use
    apps/<slug>/               Optional per-app components
  config/
    site.ts                    Every global value on the site
    platforms.ts               Platform and status labels
  content/
    apps/<slug>.md             One file per app
    legal/<scope>/<doc>.<loc>  Policies and terms
  content.config.ts            Collection schemas
  layouts/BaseLayout.astro     The one page shell
  pages/                       Routes
  styles/                      tokens, base, utilities, prose, print
  utils/                       paths, images, apps, legal, format, contact
```

Two rules keep this navigable:

- `components/site/` is the identity. `components/apps/shared/` is what any app
  can use. `components/apps/<slug>/` belongs to one app, and nothing else may
  import from it.
- Anything appearing on more than one page comes from `config/` or from a
  content collection, never from a literal in a component.

## The design system

Tokens are CSS custom properties in `src/styles/tokens.css`: a fluid type scale,
a spacing scale, layout widths, motion timings, a documented z-index scale and
the palette for both themes.

Decisions worth knowing before changing something:

- **One dark environment.** The ground is a night sky drawn as an old
  celestial chart. There is no light theme and no toggle; `print.css` inverts
  everything for paper.
- **The chart is the catalogue.** `StarChart.astro` is fixed behind every page,
  and **every app is a real constellation on it**. Shape, position and star
  count come deterministically from the app's slug and from how much it
  actually contains (`features.length + screenshots.length`), so the sky is
  stable between builds and could not belong to another developer. Brightness
  encodes release status. Hovering a constellation names it, clicking it opens
  the app, and on an app's own page its constellation starts lit.
- **Placement adapts to the page.** Exclusion zones are not hard-coded per
  layout. After layout, each constellation probes a fixed sequence of offsets
  and takes the first where its whole footprint is clear of real content, so it
  works the same on the home page, an app page and a legal page. The sequence
  is fixed, so the result stays deterministic.
- **The legend is the accessible half.** The canvas is `aria-hidden`;
  `ChartLegend.astro` offers the same navigation as ordinary keyboard-reachable
  links, and the two highlight each other through `chart:hover` and
  `chart:focus` events.
- **Colour.** Warm ink rather than blue: a brown-black ground, bone-white
  stars, one aged-gold accent. App pages rebind `--accent` and `--accent-ink`,
  and nothing else changes.
- **Surfaces are plates, not glass.** Solid warm fill, hairline border, 4px
  radius, no blur and no floating. Nothing on the site is a pill.
- **Type.** Sora for display, Instrument Sans for body, IBM Plex Mono for
  metadata. Latin subsets only, self-hosted, with the two text faces preloaded.
- **Motion.** Scroll reveals, pointer parallax across the star layers, 3D tilt
  on project media, and a hairline scroll indicator. Shooting stars every five
  to sixteen seconds. Everything collapses under `prefers-reduced-motion:
  reduce`, where the chart paints one static frame and starts no loop.
- **Reveals are fail-safe.** `.reveal` is only hidden while `<html>` carries
  `.js-reveal`, which the observer script adds immediately before it starts
  observing, and a 2.5 second timer reveals everything if the observer never
  delivers. If the script fails, the page still renders in full. Content must
  never depend on an animation to be readable.

The nameplate size in `--step-plate` is tuned to the exact string
"gioviwankenobi" in Sora 600, which measures 7.79 times its font size. That
ratio is per-typeface and is not transferable: Bricolage measured 7.09. If the
name or the display face changes, re-measure it; there is a note in
`tokens.css` explaining how.

## Values you still need to provide

Search the repository for `TODO_` to find these in place.

| Placeholder | Where | What it is |
| --- | --- | --- |
| `TODO_APP_STORE_URL` | `src/content/apps/alba.md` | Alba's App Store listing |
| `TODO_GOOGLE_PLAY_URL` | `src/content/apps/alba.md` | Alba's Play listing |
| `TODO_CONTACT_EMAIL` | `src/config/site.ts` | Address shown in the footer and on About |
| `TODO_GITHUB_URL` | `src/config/site.ts` | GitHub profile |
| `TODO_LEGAL_NAME` | `src/config/site.ts` | Unused today: Alba's policies name the controller in their own text |
| `TODO_BIO` | `src/pages/about.astro` | The two About paragraphs |
| `TODO_SITE_*` | `src/content/legal/site/` | The site's own policy and terms, still placeholder |

Also outstanding, with no `TODO_` marker:

- **Alba's screenshots are browser captures**, produced by
  `scripts/capture-app-screenshots.mjs` from the Expo web build. They are the
  real UI and they are fine for this site. Native device captures are still
  what the stores should get.
- **`terms.it.md` and friends are complete, but the site's own
  `legal/site/*` documents are still placeholder text.** They are separate
  from Alba's and cover this website only.
- **A real social card.** `public/brand/og-default.png` is generated
  placeholder artwork.

### Alba's legal documents

Ported from `github.com/Giuvvv/alba-privacy`, which generated them from
`content/<lang>.mjs`. Twelve documents, six languages, privacy and terms.

Two things follow from that:

- **The source of truth moved here.** Editing must now happen in
  `src/content/legal/alba/`. The old repo's `content/*.mjs` is no longer read
  by anything.
- **The old URLs are inside shipped builds.** Alba injects
  `EXPO_PUBLIC_PRIVACY_POLICY_URL` at build time, so installed copies point at
  `giuvvv.github.io/alba-privacy/...` forever, regardless of what App Store
  Connect says later. Those addresses have to keep resolving. See the note in
  the handover about turning that repo into redirects.

`version` in each document's frontmatter must stay aligned with
`PRIVACY_POLICY_VERSION` in the app's `src/constants/privacy.ts`.

