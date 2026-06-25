import { describe, expect, it } from 'vitest';
import englishWords from '../data/englishWords';
import frenchWords from '../data/frenchWords';
import norwegianWords from '../data/norwegianWords';
import { Language } from '../types/Language';
import type { DifficultyLevel, LanguageWords, PlayMode, WordPool } from '../types/Word';
import { buildPool, generateWord } from './words';

const decapitalize = (word: string): string => word.charAt(0).toLowerCase() + word.slice(1);

const flattenPool = (pool: WordPool): string[] => [...pool.easy, ...pool.medium, ...pool.hard, ...pool.veryHard];

const allWords = (words: LanguageWords): string[] => [...flattenPool(words.standard), ...flattenPool(words.adult)];

const describeGenerator = (
  name: string,
  generate: (level: DifficultyLevel, mode: PlayMode) => string,
  words: LanguageWords,
) => {
  describe(name, () => {
    it('returns a capitalised word drawn from the curated lists', () => {
      const pool = buildPool(words, 'hard', 'party');
      for (let i = 0; i < 50; i++) {
        const word = generate('hard', 'party');
        expect(word.charAt(0)).toBe(word.charAt(0).toUpperCase());
        expect(pool).toContain(decapitalize(word));
      }
    });

    it('only draws standard words in default mode', () => {
      const standard = flattenPool(words.standard);
      const adultOnly = words.adult.easy;
      for (let i = 0; i < 50; i++) {
        const word = decapitalize(generate('hard', 'default'));
        expect(standard).toContain(word);
        expect(adultOnly).not.toContain(word);
      }
    });

    it('can produce more than one distinct word', () => {
      const words20 = new Set(Array.from({ length: 20 }, () => generate('medium', 'default')));
      expect(words20.size).toBeGreaterThan(1);
    });
  });
};

const describeList = (name: string, words: LanguageWords) => {
  describe(name, () => {
    const list = allWords(words);

    it('has no duplicates across tiers or the adult pool', () => {
      expect(new Set(list).size).toBe(list.length);
    });

    it('contains only single, non-empty lowercase words', () => {
      list.forEach((word) => {
        expect(word).toBe(word.toLowerCase());
        expect(word).not.toMatch(/\s/);
        expect(word.length).toBeGreaterThan(1);
      });
    });
  });
};

describeGenerator('generateWord (English)', (level, mode) => generateWord(Language.EN, level, mode), englishWords);
describeGenerator('generateWord (French)', (level, mode) => generateWord(Language.FR, level, mode), frenchWords);
describeGenerator('generateWord (Norwegian)', (level, mode) => generateWord(Language.NO, level, mode), norwegianWords);

describeList('curated English word list', englishWords);
describeList('curated French word list', frenchWords);
describeList('curated Norwegian word list', norwegianWords);

describe('buildPool', () => {
  const words = englishWords;

  it('easy contains only the easy tier', () => {
    expect(buildPool(words, 'easy', 'default')).toEqual(words.standard.easy);
  });

  it('levels are cumulative: easy ⊆ medium ⊆ hard', () => {
    const easy = new Set(buildPool(words, 'easy', 'default'));
    const medium = new Set(buildPool(words, 'medium', 'default'));
    const hard = new Set(buildPool(words, 'hard', 'default'));
    for (const word of easy) expect(medium.has(word)).toBe(true);
    for (const word of medium) expect(hard.has(word)).toBe(true);
  });

  it('medium adds the hard tier but excludes veryHard', () => {
    const medium = buildPool(words, 'medium', 'default');
    expect(medium).toEqual(expect.arrayContaining(words.standard.hard));
    words.standard.veryHard.forEach((word) => {
      expect(medium).not.toContain(word);
    });
  });

  it('hard includes the veryHard tier', () => {
    expect(buildPool(words, 'hard', 'default')).toEqual(expect.arrayContaining(words.standard.veryHard));
  });

  it('party mode mixes in the adult pool for the selected tiers', () => {
    const def = buildPool(words, 'hard', 'default');
    const party = buildPool(words, 'hard', 'party');
    words.adult.easy.forEach((word) => {
      expect(def).not.toContain(word);
      expect(party).toContain(word);
    });
  });

  it('party respects the level: easy mode only adds easy-tier adult words', () => {
    const party = buildPool(words, 'easy', 'party');
    words.adult.veryHard.forEach((word) => {
      expect(party).not.toContain(word);
    });
    words.adult.easy.forEach((word) => {
      expect(party).toContain(word);
    });
  });
});
