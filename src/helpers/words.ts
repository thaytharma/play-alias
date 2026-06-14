import randomEnglishWord from 'random-words';
import { generateSlug } from 'random-word-slugs';
import randomNorwegianWord from 'tilfeldigeord';
import frenchWords from '../data/frenchWords';
import firstWord, { capitalizeFirstLetter } from './strings';

export const generateEnglishWord = (): string => {
  const randomEnglishSlug = () => {
    const slug = generateSlug(1, {
      format: 'title',
      categories: {
        adjective: ['color', 'appearance', 'condition', 'personality', 'taste', 'sounds', 'time', 'touch', 'shapes'],
        noun: [
          'animals',
          'business',
          'education',
          'family',
          'food',
          'health',
          'media',
          'people',
          'profession',
          'religion',
          'science',
          'sports',
          'technology',
          'thing',
          'time',
          'transportation',
        ],
      },
    });

    return slug;
  };
  const generateRandomEnglishWordsFunctions = [randomEnglishWord(), randomEnglishSlug()];
  const randomWord = generateRandomEnglishWordsFunctions[Math.floor(Math.random() * generateRandomEnglishWordsFunctions.length)];

  return capitalizeFirstLetter(randomWord);
};

export const generateNorwegianWord = (): string => {
  return capitalizeFirstLetter(firstWord(randomNorwegianWord.getTilfeldigOrd()));
};

// A hand-picked list of common, describable French words (see ../data/frenchWords).
export const generateFrenchWord = (): string => {
  const randomWord = frenchWords[Math.floor(Math.random() * frenchWords.length)];

  return capitalizeFirstLetter(randomWord);
};
