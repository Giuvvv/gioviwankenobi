/**
 * Human-readable date. Legal documents pass their own locale so an Italian
 * policy is not dated in English.
 */
export function formatDate(value: Date | string, locale = 'en-GB'): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Machine-readable date for <time datetime>. */
export function isoDate(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

/** "en" -> "English". Falls back to the raw tag if the runtime cannot resolve it. */
export function languageName(tag: string, locale = 'en'): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(tag) ?? tag;
  } catch {
    return tag;
  }
}
