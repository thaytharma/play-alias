import englishWords from '../data/englishWords';
import frenchWords from '../data/frenchWords';
import norwegianWords from '../data/norwegianWords';
import { type DifficultyLevel, type LanguageWords, LEVEL_TIERS, type PlayMode } from '../types/Word';
import { capitalizeFirstLetter } from './strings';

/**
 * Flatten a language's words into the candidate pool for a level and mode:
 * the standard words for every tier the level pulls in, plus the adult words
 * for those same tiers when party mode is on.
 */
export const buildPool = (words: LanguageWords, level: DifficultyLevel, mode: PlayMode): string[] => {
  const tiers = LEVEL_TIERS[level];
  const pool = tiers.flatMap((tier) => words.standard[tier]);
  if (mode === 'party') {
    pool.push(...tiers.flatMap((tier) => words.adult[tier]));
  }
  return pool;
};

/** Pick a random word from a pool, capitalised for display. */
const randomFrom = (words: readonly string[]): string =>
  capitalizeFirstLetter(words[Math.floor(Math.random() * words.length)]);

const generate = (words: LanguageWords, level: DifficultyLevel, mode: PlayMode): string =>
  randomFrom(buildPool(words, level, mode));

// Hand-picked lists of common, describable words (see ../data).
export const generateEnglishWord = (level: DifficultyLevel, mode: PlayMode): string =>
  generate(englishWords, level, mode);

export const generateNorwegianWord = (level: DifficultyLevel, mode: PlayMode): string =>
  generate(norwegianWords, level, mode);

export const generateFrenchWord = (level: DifficultyLevel, mode: PlayMode): string =>
  generate(frenchWords, level, mode);
