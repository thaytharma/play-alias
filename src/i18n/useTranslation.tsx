import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { Language } from '../types/Language';
import { type TranslationKey, translations } from './translations';

type TranslateFn = (key: TranslationKey) => string;

const TranslationContext = createContext<TranslateFn>((key) => key);

interface Props {
  language: Language;
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<Props> = ({ language, children }: Props) => {
  const translate = useMemo<TranslateFn>(() => {
    const messages = translations[language];
    return (key) => messages[key] ?? key;
  }, [language]);

  return <TranslationContext.Provider value={translate}>{children}</TranslationContext.Provider>;
};

/** Returns the translate function `t` for the currently selected language. */
export function useTranslation(): TranslateFn {
  return useContext(TranslationContext);
}
