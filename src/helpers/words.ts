import randomEnglishWord from 'random-words';
import { generateSlug } from 'random-word-slugs';
import randomNorwegianWord from 'tilfeldigeord';
import allFrenchWords from 'an-array-of-french-words';
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

// `an-array-of-french-words` is a ~336k entry spell-check corpus that includes many
// rare, archaic and inflected forms. Narrow it once to single, lowercase words of a
// playable length so the game surfaces recognisable words rather than obscure ones.
const frenchWordPool = allFrenchWords.filter((word) => /^[a-zàâäçéèêëîïôöùûüÿœæ]{4,10}$/.test(word));

export const generateFrenchWord = (): string => {
  const randomWord = frenchWordPool[Math.floor(Math.random() * frenchWordPool.length)];

  return capitalizeFirstLetter(randomWord);
};
