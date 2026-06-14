import { beforeEach, describe, expect, it } from 'vitest';
import { Language } from '../types/Language';
import { DEFAULT_LANGUAGE, getInitialLanguage, parseLanguage, saveLanguage } from './preferences';

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
