import { LanguageType } from "../App";

export function isEnglish(language: LanguageType): boolean {
  return language === LanguageType.ENGLISH;
}

export function isNorwegian(language: LanguageType): boolean {
  return language === LanguageType.NORWEGIAN;
}
