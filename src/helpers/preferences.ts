import { Language } from '../types/Language';
import { Appearance, Theme } from '../types/Theme';

const LANGUAGE_STORAGE_KEY = 'alias.language';
const LANGUAGE_QUERY_KEY = 'lang';

export const DEFAULT_LANGUAGE = Language.NO;

const languageAliases: Record<string, Language> = {
  en: Language.EN,
  english: Language.EN,
  no: Language.NO,
  norwegian: Language.NO,
  fr: Language.FR,
  french: Language.FR,
};

/** Resolve a free-form value (query param or stored value) to a Language, or null. */
export function parseLanguage(value: string | null | undefined): Language | null {
  if (!value) {
    return null;
  }
  return languageAliases[value.trim().toLowerCase()] ?? null;
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (e.g. Safari private mode).
  }
}

/** Initial language: `?lang=` query param wins, then localStorage, then the default. */
export function getInitialLanguage(search: string = window.location.search): Language {
  const fromQuery = parseLanguage(new URLSearchParams(search).get(LANGUAGE_QUERY_KEY));
  if (fromQuery) {
    return fromQuery;
  }

  const fromStorage = parseLanguage(readStorage(LANGUAGE_STORAGE_KEY));
  if (fromStorage) {
    return fromStorage;
  }

  return DEFAULT_LANGUAGE;
}

export function saveLanguage(language: Language): void {
  writeStorage(LANGUAGE_STORAGE_KEY, language);
}

const DURATION_STORAGE_KEY = 'alias.duration';

/** Selectable round lengths, in seconds. */
export const DURATION_OPTIONS: readonly number[] = [30, 60, 90, 120];
export const DEFAULT_DURATION = 60;

/** Resolve a stored value to a known duration, or null. */
export function parseDuration(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return DURATION_OPTIONS.includes(parsed) ? parsed : null;
}

export function getInitialDuration(): number {
  return parseDuration(readStorage(DURATION_STORAGE_KEY)) ?? DEFAULT_DURATION;
}

export function saveDuration(duration: number): void {
  writeStorage(DURATION_STORAGE_KEY, String(duration));
}

const APPEARANCE_STORAGE_KEY = 'alias.appearance';

export const APPEARANCE_OPTIONS: readonly Appearance[] = ['dark', 'light'];
export const DEFAULT_APPEARANCE: Appearance = 'dark';

/** Resolve a stored value to a known appearance, or null. */
export function parseAppearance(value: string | null | undefined): Appearance | null {
  return APPEARANCE_OPTIONS.includes(value as Appearance) ? (value as Appearance) : null;
}

export function getInitialAppearance(): Appearance {
  return parseAppearance(readStorage(APPEARANCE_STORAGE_KEY)) ?? DEFAULT_APPEARANCE;
}

export function saveAppearance(appearance: Appearance): void {
  writeStorage(APPEARANCE_STORAGE_KEY, appearance);
}

const THEME_STORAGE_KEY = 'alias.theme';

export const THEME_OPTIONS: readonly Theme[] = ['sunset', 'ocean', 'berry'];
export const DEFAULT_THEME: Theme = 'sunset';

/** Resolve a stored value to a known theme, or null. */
export function parseTheme(value: string | null | undefined): Theme | null {
  return THEME_OPTIONS.includes(value as Theme) ? (value as Theme) : null;
}

export function getInitialTheme(): Theme {
  return parseTheme(readStorage(THEME_STORAGE_KEY)) ?? DEFAULT_THEME;
}

export function saveTheme(theme: Theme): void {
  writeStorage(THEME_STORAGE_KEY, theme);
}
