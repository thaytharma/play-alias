import englishWords from '../data/englishWords';
import frenchWords from '../data/frenchWords';
import { generateEnglishWord, generateFrenchWord } from './words';

const decapitalize = (word: string): string => word.charAt(0).toLowerCase() + word.slice(1);

const describeGenerator = (name: string, generate: () => string, list: string[]) => {
  describe(name, () => {
    it('returns a capitalised word drawn from the curated list', () => {
      for (let i = 0; i < 50; i++) {
        const word = generate();
        expect(word.charAt(0)).toBe(word.charAt(0).toUpperCase());
        expect(list).toContain(decapitalize(word));
      }
    });

    it('can produce more than one distinct word', () => {
      const words = new Set(Array.from({ length: 20 }, () => generate()));
      expect(words.size).toBeGreaterThan(1);
    });
  });
};

const describeList = (name: string, list: string[]) => {
  describe(name, () => {
    it('has no duplicates', () => {
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

describeGenerator('generateEnglishWord', generateEnglishWord, englishWords);
describeGenerator('generateFrenchWord', generateFrenchWord, frenchWords);

describeList('curated English word list', englishWords);
describeList('curated French word list', frenchWords);
