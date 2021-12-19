import { Language } from "../types/Language";

export function isEnglish(language: Language): boolean {
  return language === Language.EN;
}

export function isNorwegian(language: Language): boolean {
  return language === Language.NO;
}
