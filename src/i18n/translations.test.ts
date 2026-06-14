import { describe, expect, it } from 'vitest';
import { Language } from '../types/Language';
import { languageNameKeys, translations } from './translations';

describe('translations', () => {
  const languages = Object.values(Language);
  const englishKeys = Object.keys(translations[Language.EN]).sort();

  it('provides messages for every language', () => {
    languages.forEach((language) => {
      expect(translations[language]).toBeDefined();
    });
  });

  it('every locale defines exactly the same keys', () => {
    languages.forEach((language) => {
      expect(Object.keys(translations[language]).sort()).toEqual(englishKeys);
    });
  });

  it('has no empty translation strings', () => {
    languages.forEach((language) => {
      Object.values(translations[language]).forEach((value) => {
        expect(value.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('maps every language to a real translation key', () => {
    languages.forEach((language) => {
      expect(englishKeys).toContain(languageNameKeys[language]);
    });
  });
});
