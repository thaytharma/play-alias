import { useEffect, useState } from 'react';
import type { Language } from '../types/Language';
import type { Appearance, Theme } from '../types/Theme';
import type { SoundLevel } from '../helpers/sound';
import {
  getInitialAppearance,
  getInitialDuration,
  getInitialLanguage,
  getInitialSound,
  getInitialTheme,
  saveAppearance,
  saveDuration,
  saveLanguage,
  saveSound,
  saveTheme,
} from '../helpers/preferences';

export interface Preferences {
  language: Language;
  setLanguage: (language: Language) => void;
  duration: number;
  setDuration: (duration: number) => void;
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  sound: SoundLevel;
  setSound: (sound: SoundLevel) => void;
}

/**
 * Persisted user preferences. Each value is loaded from localStorage on mount
 * and saved whenever it changes; appearance and theme are also reflected onto
 * the document element so the token overrides in index.scss apply.
 */
export function usePreferences(): Preferences {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [duration, setDuration] = useState<number>(getInitialDuration);
  const [appearance, setAppearance] = useState<Appearance>(getInitialAppearance);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [sound, setSound] = useState<SoundLevel>(getInitialSound);

  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  useEffect(() => {
    saveDuration(duration);
  }, [duration]);

  useEffect(() => {
    saveAppearance(appearance);
    document.documentElement.dataset.appearance = appearance;
  }, [appearance]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    saveSound(sound);
  }, [sound]);

  return {
    language,
    setLanguage,
    duration,
    setDuration,
    appearance,
    setAppearance,
    theme,
    setTheme,
    sound,
    setSound,
  };
}
