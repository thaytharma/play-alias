import { useEffect } from 'react';
import type { Language } from '../types/Language';
import type { Appearance, Theme } from '../types/Theme';
import type { DifficultyLevel, PlayMode } from '../types/Word';
import type { SoundLevel } from '../helpers/sound';
import {
  getInitialAppearance,
  getInitialDuration,
  getInitialLanguage,
  getInitialLevel,
  getInitialMode,
  getInitialScoring,
  getInitialSound,
  getInitialTheme,
  saveAppearance,
  saveDuration,
  saveLanguage,
  saveLevel,
  saveMode,
  saveScoring,
  saveSound,
  saveTheme,
} from '../helpers/preferences';
import { usePersistedState } from './usePersistedState';

export interface Preferences {
  language: Language;
  setLanguage: (language: Language) => void;
  duration: number;
  setDuration: (duration: number) => void;
  mode: PlayMode;
  setMode: (mode: PlayMode) => void;
  level: DifficultyLevel;
  setLevel: (level: DifficultyLevel) => void;
  scoring: boolean;
  setScoring: (scoring: boolean) => void;
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
  const [language, setLanguage] = usePersistedState(getInitialLanguage, saveLanguage);
  const [duration, setDuration] = usePersistedState(getInitialDuration, saveDuration);
  const [mode, setMode] = usePersistedState(getInitialMode, saveMode);
  const [level, setLevel] = usePersistedState(getInitialLevel, saveLevel);
  const [scoring, setScoring] = usePersistedState(getInitialScoring, saveScoring);
  const [appearance, setAppearance] = usePersistedState(getInitialAppearance, saveAppearance);
  const [theme, setTheme] = usePersistedState(getInitialTheme, saveTheme);
  const [sound, setSound] = usePersistedState(getInitialSound, saveSound);

  // Reflect appearance/theme onto <html> so the token overrides in index.scss apply.
  useEffect(() => {
    document.documentElement.dataset.appearance = appearance;
  }, [appearance]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return {
    language,
    setLanguage,
    duration,
    setDuration,
    mode,
    setMode,
    level,
    setLevel,
    scoring,
    setScoring,
    appearance,
    setAppearance,
    theme,
    setTheme,
    sound,
    setSound,
  };
}
