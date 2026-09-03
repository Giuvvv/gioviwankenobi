import { siteConfig } from '~/config/site';

/**
 * Chrome labels for legal documents.
 *
 * A policy published in Italian should not carry English furniture, so these
 * are localized. They are lifted verbatim from Alba's own source documents
 * rather than translated here, which is why the set matches the languages the
 * apps ship in. Anything missing falls back to English.
 */
export type LegalStrings = {
  contents: string;
  version: string;
  updated: string;
  language: string;
};

export const LEGAL_STRINGS: Record<string, LegalStrings> = {
  en: { contents: "Contents", version: "Version", updated: "Updated", language: "Language" },
  it: { contents: "Indice", version: "Versione", updated: "Aggiornato il", language: "Lingua" },
  fr: { contents: "Sommaire", version: "Version", updated: "Mise à jour le", language: "Langue" },
  es: { contents: "Índice", version: "Versión", updated: "Actualizado el", language: "Idioma" },
  de: { contents: "Inhalt", version: "Version", updated: "Aktualisiert am", language: "Sprache" },
  pt: { contents: "Índice", version: "Versão", updated: "Atualizado a", language: "Idioma" },
};

export function legalStrings(locale: string): LegalStrings {
  return LEGAL_STRINGS[locale] ?? LEGAL_STRINGS[siteConfig.defaultLocale] ?? LEGAL_STRINGS.en!;
}
