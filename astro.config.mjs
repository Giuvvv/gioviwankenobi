// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

/**
 * SITE_URL and BASE_PATH are injected by the GitHub Pages workflow
 * (actions/configure-pages resolves them automatically, including after a
 * custom domain is attached). Locally they fall back to the production domain
 * at the root, which is what gioviwankenobi.com will eventually be.
 * See README > "Deployment".
 */
const SITE_URL = process.env.SITE_URL ?? 'https://gioviwankenobi.com';
const BASE_PATH = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    icon({ include: { ph: ['*'] } }),
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
  vite: {
    build: { cssCodeSplit: false },
  },
});
