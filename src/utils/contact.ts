/** True for any value still using the TODO_ placeholder convention. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || value.startsWith('TODO_');
}

/** A mailto: href, or null when the address has not been configured yet. */
export function mailto(address: string | null | undefined, subject?: string): string | null {
  if (isPlaceholder(address)) return null;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${address}${query}`;
}

/** The address itself, or null when it is still a placeholder. */
export function realAddress(address: string | null | undefined): string | null {
  return isPlaceholder(address) ? null : (address as string);
}
