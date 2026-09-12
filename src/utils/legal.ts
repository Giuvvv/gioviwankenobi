import { siteConfig, type Locale } from '~/config/site';
import { url } from '~/utils/paths';
import type { LegalKind } from '~/utils/apps';

export const LEGAL_LABELS: Record<LegalKind, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  'delete-account': 'Account Deletion',
};

/**
 * The permanent address of a legal document.
 *
 *   site,  en -> /privacy
 *   site,  it -> /it/privacy
 *   an app, en -> /apps/<slug>/privacy
 *   an app, it -> /apps/<slug>/it/privacy
 *
 * These URLs get submitted to app stores, so they are built in exactly one
 * place. Do not hardcode them anywhere else.
 */
export function legalUrl(scope: string, kind: LegalKind, locale: Locale): string {
  const isDefault = locale === siteConfig.defaultLocale;
  if (scope === 'site') {
    return isDefault ? url(kind) : url(locale, kind);
  }
  return isDefault ? url('apps', scope, kind) : url('apps', scope, locale, kind);
}
