import randomNorwegianWord from 'tilfeldigeord';
import englishWords from '../data/englishWords';
import frenchWords from '../data/frenchWords';
import firstWord, { capitalizeFirstLetter } from './strings';

/** Pick a random word from a curated list, capitalised for display. */
const randomFrom = (words: readonly string[]): string =>
  capitalizeFirstLetter(words[Math.floor(Math.random() * words.length)]);

// Hand-picked lists of common, describable words (see ../data).
export const generateEnglishWord = (): string => randomFrom(englishWords);

export const generateNorwegianWord = (): string =>
  capitalizeFirstLetter(firstWord(randomNorwegianWord.getTilfeldigOrd()));

export const generateFrenchWord = (): string => randomFrom(frenchWords);
