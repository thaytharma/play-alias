export type Appearance = 'dark' | 'light';

export type Theme = 'sunset' | 'ocean' | 'berry';

/** Theme display names — shown as-is in every language (like language endonyms). */
export const THEME_LABELS: Record<Theme, string> = {
  sunset: 'Sunset',
  ocean: 'Ocean',
  berry: 'Berry',
};
