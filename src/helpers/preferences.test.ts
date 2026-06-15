import { beforeEach, describe, expect, it } from 'vitest';
import { Language } from '../types/Language';
import {
  DEFAULT_APPEARANCE,
  DEFAULT_DURATION,
  DEFAULT_LANGUAGE,
  DEFAULT_SOUND,
  DEFAULT_THEME,
  clearStoredWords,
  getInitialAppearance,
  getInitialDuration,
  getInitialLanguage,
  getInitialSound,
  getInitialTheme,
  getStoredWords,
  parseAppearance,
  parseDuration,
  parseLanguage,
  parseSound,
  parseTheme,
  saveAppearance,
  saveDuration,
  saveLanguage,
  saveSound,
  saveStoredWords,
  saveTheme,
} from './preferences';

describe('parseLanguage', () => {
  it('accepts short codes and full names, case-insensitively', () => {
    expect(parseLanguage('fr')).toBe(Language.FR);
    expect(parseLanguage('FR')).toBe(Language.FR);
    expect(parseLanguage(' French ')).toBe(Language.FR);
    expect(parseLanguage('en')).toBe(Language.EN);
    expect(parseLanguage('NORWEGIAN')).toBe(Language.NO);
  });

  it('returns null for empty or unknown values', () => {
    expect(parseLanguage(null)).toBeNull();
    expect(parseLanguage('')).toBeNull();
    expect(parseLanguage('klingon')).toBeNull();
  });
});

describe('getInitialLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('prefers the query param over everything else', () => {
    localStorage.setItem('alias.language', Language.NO);
    expect(getInitialLanguage('?lang=fr')).toBe(Language.FR);
  });

  it('falls back to localStorage when there is no query param', () => {
    localStorage.setItem('alias.language', Language.EN);
    expect(getInitialLanguage('')).toBe(Language.EN);
  });

  it('falls back to the default when nothing is set', () => {
    expect(getInitialLanguage('')).toBe(DEFAULT_LANGUAGE);
  });

  it('ignores an invalid query param and uses storage/default', () => {
    expect(getInitialLanguage('?lang=nope')).toBe(DEFAULT_LANGUAGE);
  });
});

describe('saveLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips through getInitialLanguage', () => {
    saveLanguage(Language.FR);
    expect(getInitialLanguage('')).toBe(Language.FR);
  });
});

describe('parseDuration', () => {
  it('accepts known durations', () => {
    expect(parseDuration('30')).toBe(30);
    expect(parseDuration('60')).toBe(60);
    expect(parseDuration('120')).toBe(120);
  });

  it('rejects unknown or invalid durations', () => {
    expect(parseDuration('45')).toBeNull();
    expect(parseDuration('abc')).toBeNull();
    expect(parseDuration(null)).toBeNull();
  });
});

describe('duration storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults when nothing is stored', () => {
    expect(getInitialDuration()).toBe(DEFAULT_DURATION);
  });

  it('round-trips through getInitialDuration', () => {
    saveDuration(120);
    expect(getInitialDuration()).toBe(120);
  });

  it('ignores a stored value that is no longer a valid option', () => {
    localStorage.setItem('alias.duration', '999');
    expect(getInitialDuration()).toBe(DEFAULT_DURATION);
  });
});

describe('parseAppearance', () => {
  it('accepts known appearances', () => {
    expect(parseAppearance('dark')).toBe('dark');
    expect(parseAppearance('light')).toBe('light');
  });

  it('rejects unknown values', () => {
    expect(parseAppearance('sepia')).toBeNull();
    expect(parseAppearance(null)).toBeNull();
  });
});

describe('parseTheme', () => {
  it('accepts known themes', () => {
    expect(parseTheme('sunset')).toBe('sunset');
    expect(parseTheme('ocean')).toBe('ocean');
    expect(parseTheme('berry')).toBe('berry');
  });

  it('rejects unknown values', () => {
    expect(parseTheme('neon')).toBeNull();
    expect(parseTheme(null)).toBeNull();
  });
});

describe('appearance and theme storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults when nothing is stored', () => {
    expect(getInitialAppearance()).toBe(DEFAULT_APPEARANCE);
    expect(getInitialTheme()).toBe(DEFAULT_THEME);
  });

  it('round-trips through the getters', () => {
    saveAppearance('light');
    saveTheme('ocean');
    expect(getInitialAppearance()).toBe('light');
    expect(getInitialTheme()).toBe('ocean');
  });
});

describe('parseSound', () => {
  it('accepts known sound levels', () => {
    expect(parseSound('off')).toBe('off');
    expect(parseSound('low')).toBe('low');
    expect(parseSound('high')).toBe('high');
  });

  it('rejects unknown values', () => {
    expect(parseSound('loud')).toBeNull();
    expect(parseSound(null)).toBeNull();
  });
});

describe('sound storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults when nothing is stored', () => {
    expect(getInitialSound()).toBe(DEFAULT_SOUND);
  });

  it('round-trips through getInitialSound', () => {
    saveSound('high');
    expect(getInitialSound()).toBe('high');
  });
});

describe('stored words', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and reads words per language', () => {
    saveStoredWords(Language.EN, ['Apple', 'Banana']);

    expect(getStoredWords(Language.EN)).toEqual(['Apple', 'Banana']);
    expect(getStoredWords(Language.FR)).toEqual([]);
  });

  it('clears stored words for every language', () => {
    saveStoredWords(Language.EN, ['Apple']);
    saveStoredWords(Language.FR, ['Pomme']);

    clearStoredWords();

    expect(getStoredWords(Language.EN)).toEqual([]);
    expect(getStoredWords(Language.FR)).toEqual([]);
  });

  it('returns an empty list for malformed data', () => {
    localStorage.setItem(`alias.usedWords.${Language.EN}`, 'not json');

    expect(getStoredWords(Language.EN)).toEqual([]);
  });
});
