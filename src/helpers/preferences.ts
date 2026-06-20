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

interface OptionPref<T extends string> {
  options: readonly T[];
  fallback: T;
  parse: (value: string | null | undefined) => T | null;
  getInitial: () => T;
  save: (value: T) => void;
}

/**
 * Build the standard accessors for a string-enum preference: a parser that
 * only accepts known values, a loader that falls back to the default, and a
 * saver. Keeps every such setting (appearance, theme, sound, …) consistent.
 */
function createOptionPref<T extends string>(key: string, options: readonly T[], fallback: T): OptionPref<T> {
  const parse = (value: string | null | undefined): T | null => (options.includes(value as T) ? (value as T) : null);
  return {
    options,
    fallback,
    parse,
    getInitial: () => parse(readStorage(key)) ?? fallback,
    save: (value: T) => writeStorage(key, value),
  };
}

const appearancePref = createOptionPref<Appearance>('alias.appearance', ['dark', 'light'], 'dark');
export const APPEARANCE_OPTIONS = appearancePref.options;
export const DEFAULT_APPEARANCE = appearancePref.fallback;
export const parseAppearance = appearancePref.parse;
export const getInitialAppearance = appearancePref.getInitial;
export const saveAppearance = appearancePref.save;

const themePref = createOptionPref<Theme>('alias.theme', ['sunset', 'ocean', 'berry'], 'sunset');
export const THEME_OPTIONS = themePref.options;
export const DEFAULT_THEME = themePref.fallback;
export const parseTheme = themePref.parse;
export const getInitialTheme = themePref.getInitial;
export const saveTheme = themePref.save;

const soundPref = createOptionPref<SoundLevel>('alias.sound', ['off', 'low', 'high'], 'low');
export const SOUND_OPTIONS = soundPref.options;
export const DEFAULT_SOUND = soundPref.fallback;
export const parseSound = soundPref.parse;
export const getInitialSound = soundPref.getInitial;
export const saveSound = soundPref.save;

const modePref = createOptionPref<PlayMode>('alias.mode', ['default', 'party'], 'default');
export const MODE_OPTIONS = modePref.options;
export const DEFAULT_MODE = modePref.fallback;
export const parseMode = modePref.parse;
export const getInitialMode = modePref.getInitial;
export const saveMode = modePref.save;

const levelPref = createOptionPref<DifficultyLevel>('alias.level', ['easy', 'medium', 'hard'], 'medium');
export const LEVEL_OPTIONS = levelPref.options;
export const DEFAULT_LEVEL = levelPref.fallback;
export const parseLevel = levelPref.parse;
export const getInitialLevel = levelPref.getInitial;
export const saveLevel = levelPref.save;

const SCORING_STORAGE_KEY = 'alias.scoring';

export const DEFAULT_SCORING = false;

/** Resolve a stored value to a boolean, or null when unrecognised. */
export function parseScoring(value: string | null | undefined): boolean | null {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return null;
}

export function getInitialScoring(): boolean {
  return parseScoring(readStorage(SCORING_STORAGE_KEY)) ?? DEFAULT_SCORING;
}

export function saveScoring(scoring: boolean): void {
  writeStorage(SCORING_STORAGE_KEY, String(scoring));
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

/** Whether any language has shown-words history stored (i.e. there's something to clear). */
export function hasStoredWords(): boolean {
  return Object.values(Language).some((language) => getStoredWords(language).length > 0);
}

/** Forget the shown-words history for every language. */
export function clearStoredWords(): void {
  Object.values(Language).forEach((language) => {
    removeStorage(USED_WORDS_KEY_PREFIX + language);
  });
}
