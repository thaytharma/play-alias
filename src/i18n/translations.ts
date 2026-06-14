import { Language } from '../types/Language';
import en from './locales/en.json';
import fr from './locales/fr.json';
import no from './locales/no.json';

// English is the source of truth for the available keys.
export type TranslationKey = keyof typeof en;
export type Messages = Record<TranslationKey, string>;

// Typing each locale as `Messages` makes TypeScript fail the build if a locale
// is missing one of the keys.
export const translations: Record<Language, Messages> = {
  [Language.EN]: en,
  [Language.NO]: no,
  [Language.FR]: fr,
};

/** The translation key holding each language's display name. */
export const languageNameKeys: Record<Language, TranslationKey> = {
  [Language.EN]: 'languageEnglish',
  [Language.NO]: 'languageNorwegian',
  [Language.FR]: 'languageFrench',
};
