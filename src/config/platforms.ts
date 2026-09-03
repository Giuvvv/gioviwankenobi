/** Display metadata for every platform an app can declare. */
export const PLATFORMS = {
  ios: { label: 'iPhone', icon: 'ph:device-mobile' },
  ipados: { label: 'iPad', icon: 'ph:device-tablet' },
  macos: { label: 'Mac', icon: 'ph:desktop' },
  android: { label: 'Android', icon: 'ph:android-logo' },
  windows: { label: 'Windows', icon: 'ph:windows-logo' },
  linux: { label: 'Linux', icon: 'ph:linux-logo' },
  web: { label: 'Web', icon: 'ph:globe-simple' },
  visionos: { label: 'Vision Pro', icon: 'ph:eyeglasses' },
  watchos: { label: 'Apple Watch', icon: 'ph:watch' },
  tvos: { label: 'Apple TV', icon: 'ph:television-simple' },
} as const;

export type PlatformId = keyof typeof PLATFORMS;

/** Human label for a release status. */
export const STATUS = {
  live: { label: 'Available' },
  beta: { label: 'In beta' },
  'in-development': { label: 'In development' },
  archived: { label: 'Archived' },
} as const;

export type StatusId = keyof typeof STATUS;
