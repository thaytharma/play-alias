import { Language } from '../types/Language';

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
