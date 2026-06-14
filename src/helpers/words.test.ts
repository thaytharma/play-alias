import { generateFrenchWord } from "./words";

describe("generateFrenchWord", () => {
  it("returns a capitalised, single French word of playable length", () => {
    for (let i = 0; i < 25; i++) {
      const word = generateFrenchWord();

      // Starts with an uppercase letter (capitalizeFirstLetter).
      expect(word.charAt(0)).toBe(word.charAt(0).toUpperCase());
      // Single word, within the length window the pool is filtered to.
      expect(word).toMatch(/^[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ][a-zàâäçéèêëîïôöùûüÿœæ]{3,9}$/);
    }
  });

  it("can produce more than one distinct word", () => {
    const words = new Set(Array.from({ length: 20 }, () => generateFrenchWord()));

    expect(words.size).toBeGreaterThan(1);
  });
});
