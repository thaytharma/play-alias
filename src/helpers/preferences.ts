import { Language } from '../types/Language';
import type { Appearance, Theme } from '../types/Theme';
import type { DifficultyLevel, PlayMode } from '../types/Word';
import type { SoundLevel } from './sound';

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

function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
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

const SOUND_STORAGE_KEY = 'alias.sound';

export const SOUND_OPTIONS: readonly SoundLevel[] = ['off', 'low', 'high'];
export const DEFAULT_SOUND: SoundLevel = 'low';

/** Resolve a stored value to a known sound level, or null. */
export function parseSound(value: string | null | undefined): SoundLevel | null {
  return SOUND_OPTIONS.includes(value as SoundLevel) ? (value as SoundLevel) : null;
}

export function getInitialSound(): SoundLevel {
  return parseSound(readStorage(SOUND_STORAGE_KEY)) ?? DEFAULT_SOUND;
}

export function saveSound(sound: SoundLevel): void {
  writeStorage(SOUND_STORAGE_KEY, sound);
}

const MODE_STORAGE_KEY = 'alias.mode';

export const MODE_OPTIONS: readonly PlayMode[] = ['default', 'party'];
export const DEFAULT_MODE: PlayMode = 'default';

/** Resolve a stored value to a known play mode, or null. */
export function parseMode(value: string | null | undefined): PlayMode | null {
  return MODE_OPTIONS.includes(value as PlayMode) ? (value as PlayMode) : null;
}

export function getInitialMode(): PlayMode {
  return parseMode(readStorage(MODE_STORAGE_KEY)) ?? DEFAULT_MODE;
}

export function saveMode(mode: PlayMode): void {
  writeStorage(MODE_STORAGE_KEY, mode);
}

const LEVEL_STORAGE_KEY = 'alias.level';

export const LEVEL_OPTIONS: readonly DifficultyLevel[] = ['easy', 'medium', 'hard'];
export const DEFAULT_LEVEL: DifficultyLevel = 'medium';

/** Resolve a stored value to a known difficulty level, or null. */
export function parseLevel(value: string | null | undefined): DifficultyLevel | null {
  return LEVEL_OPTIONS.includes(value as DifficultyLevel) ? (value as DifficultyLevel) : null;
}

export function getInitialLevel(): DifficultyLevel {
  return parseLevel(readStorage(LEVEL_STORAGE_KEY)) ?? DEFAULT_LEVEL;
}

export function saveLevel(level: DifficultyLevel): void {
  writeStorage(LEVEL_STORAGE_KEY, level);
}

const USED_WORDS_KEY_PREFIX = 'alias.usedWords.';

/** Words already shown for a language, persisted so they don't repeat across sessions. */
export function getStoredWords(language: Language): string[] {
  const raw = readStorage(USED_WORDS_KEY_PREFIX + language);
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((word): word is string => typeof word === 'string') : [];
  } catch {
    return [];
  }
}

export function saveStoredWords(language: Language, words: string[]): void {
  writeStorage(USED_WORDS_KEY_PREFIX + language, JSON.stringify(words));
}

/** Forget the shown-words history for every language. */
export function clearStoredWords(): void {
  Object.values(Language).forEach((language) => {
    removeStorage(USED_WORDS_KEY_PREFIX + language);
  });
}
