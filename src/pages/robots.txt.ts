import type { APIRoute } from 'astro';
import { asset } from '~/utils/paths';

/** Generated so the sitemap URL follows whatever origin and base the build targets. */
export const GET: APIRoute = ({ site }) => {
  const path = asset('/sitemap-index.xml');
  const sitemap = site ? new URL(path, site).href : path;
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
