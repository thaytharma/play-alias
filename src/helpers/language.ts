import { Language } from '../types/Language';

/** Order languages are shown in the settings selector. */
export const LANGUAGE_ORDER: readonly Language[] = [Language.NO, Language.EN, Language.FR];

/** Each language labelled in its own language, so it's recognisable regardless
 * of the current UI language. */
export const LANGUAGE_ENDONYMS: Record<Language, string> = {
  [Language.NO]: 'Norsk',
  [Language.EN]: 'English',
  [Language.FR]: 'Français',
};

export function isEnglish(language: Language): boolean {
  return language === Language.EN;
}

export function isNorwegian(language: Language): boolean {
  return language === Language.NO;
}

export function isFrench(language: Language): boolean {
  return language === Language.FR;
}
