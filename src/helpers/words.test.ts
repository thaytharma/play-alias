import frenchWords from "../data/frenchWords";
import { generateFrenchWord } from "./words";

const decapitalize = (word: string): string => word.charAt(0).toLowerCase() + word.slice(1);

describe("generateFrenchWord", () => {
  it("returns a capitalised word drawn from the curated list", () => {
    for (let i = 0; i < 50; i++) {
      const word = generateFrenchWord();

      // Capitalised by capitalizeFirstLetter.
      expect(word.charAt(0)).toBe(word.charAt(0).toUpperCase());
      // Comes from the curated list (compare against the lowercase source form).
      expect(frenchWords).toContain(decapitalize(word));
    }
  });

  it("can produce more than one distinct word", () => {
    const words = new Set(Array.from({ length: 20 }, () => generateFrenchWord()));

    expect(words.size).toBeGreaterThan(1);
  });
});

describe("curated French word list", () => {
  it("has no duplicates", () => {
    expect(new Set(frenchWords).size).toBe(frenchWords.length);
  });

  it("contains only single, non-empty lowercase words", () => {
    frenchWords.forEach((word) => {
      expect(word).toBe(word.toLowerCase());
      expect(word).not.toMatch(/\s/);
      expect(word.length).toBeGreaterThan(1);
    });
  });
});
