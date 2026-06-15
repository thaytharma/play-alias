import './App.scss';
import React, { useEffect, useRef, useState } from 'react';
import Word, { WordHandle } from './components/Word/Word';
import Splash from './components/Splash/Splash';
import StopButton from './components/StopButton/StopButton';
import RulesModal from './components/RulesModal/RulesModal';
import Footer from './components/Footer/Footer';
import { Language } from './types/Language';
import Counter from './components/Counter/Counter';
import SettingsModal from './components/SettingsModal/SettingsModal';
import { getInitialDuration, getInitialLanguage, saveDuration, saveLanguage } from './helpers/preferences';
import { getInitialAppearance, getInitialTheme, saveAppearance, saveTheme } from './helpers/preferences';
import { getInitialSound, saveSound } from './helpers/preferences';
import { clearStoredWords } from './helpers/preferences';
import { Appearance, Theme } from './types/Theme';
import { SoundLevel } from './helpers/sound';
import { isSoundSupported, playTick, playTimeUp, playWordChange, unlockAudio } from './helpers/sound';
import { isTimeRunningOut } from './helpers/timer';
import { TranslationProvider } from './i18n/useTranslation';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [duration, setDuration] = useState<number>(getInitialDuration);
  const [appearance, setAppearance] = useState<Appearance>(getInitialAppearance);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [sound, setSound] = useState<SoundLevel>(getInitialSound);
  const [soundSupported] = useState(() => isSoundSupported());
  const [counter, setCounter] = React.useState<number>(duration);
  const [started, setStarted] = useState<boolean>(false);
  const wordRef = useRef<WordHandle>(null);

  // Persist the language (covers both `?lang=` visits and manual changes).
  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  // Persist the chosen round length.
  useEffect(() => {
    saveDuration(duration);
  }, [duration]);

  // Persist the appearance and theme, and apply them as data attributes so the
  // token overrides in index.scss take effect.
  useEffect(() => {
    saveAppearance(appearance);
    document.documentElement.dataset.appearance = appearance;
  }, [appearance]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Persist the sound level.
  useEffect(() => {
    saveSound(sound);
  }, [sound]);

  // Tick on each of the final seconds, and chime when time is up (same
  // threshold as the urgent counter).
  useEffect(() => {
    if (!started || sound === 'off') {
      return;
    }
    if (counter === 0) {
      playTimeUp(sound);
    } else if (isTimeRunningOut(counter)) {
      playTick(sound);
    }
  }, [counter, started, sound]);

  const handleChangeLanguage = (language: Language) => {
    setLanguage(language);
    restartCounter();
  };

  const handleChangeDuration = (nextDuration: number) => {
    setDuration(nextDuration);
    setCounter(nextDuration);
  };

  useEffect(() => {
    // Hold the timer until the player starts from the splash.
    if (!started || counter <= 0) {
      return;
    }
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter, started]);

  const restartCounter = () => {
    setCounter(duration);
  };

  const handleStart = () => {
    // Unlock audio within the start gesture so ticks can play on mobile.
    unlockAudio();
    restartCounter();
    setStarted(true);
  };

  const handleStop = () => {
    setStarted(false);
  };

  const handleChangeSound = (nextSound: SoundLevel) => {
    unlockAudio();
    setSound(nextSound);
  };

  const handleClearWords = () => {
    clearStoredWords();
    // Refresh the in-progress word's history if a round is running.
    wordRef.current?.reset();
  };

  const handleWordChange = () => {
    playWordChange(sound);
    // Mid-round a new word just swaps the word; once time is up, changing the
    // word also starts the next round's timer.
    if (counter === 0) {
      restartCounter();
    }
  };

  // Keyboard controls (non-touch). Space/Enter is the primary action (start the
  // round, then draw the next word); Escape backs out one level.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const dialogOpen = !!document.querySelector('[role="dialog"]');
      const focused = document.activeElement;
      const focusedControl =
        !!focused && ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(focused.tagName);

      if (event.key === 'Escape') {
        // An open modal handles its own Escape; otherwise stop the round.
        if (!dialogOpen && started) {
          setStarted(false);
        }
        return;
      }

      if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
        // Let an open dialog or a focused control handle the key natively.
        if (dialogOpen || focusedControl || event.repeat) {
          return;
        }
        event.preventDefault();
        if (started) {
          wordRef.current?.advance();
        } else {
          unlockAudio();
          setCounter(duration);
          setStarted(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, duration]);

  return (
    <TranslationProvider language={language}>
      <div className="app">
        <main>
          {started ? (
            <>
              <Word
                ref={wordRef}
                language={language}
                isTimeUp={counter === 0}
                onWordChange={handleWordChange}
              />
              <Counter counter={counter} />
            </>
          ) : (
            <Splash onStart={handleStart} />
          )}
        </main>
        <Footer />
        {started && counter > 0 ? <StopButton onStop={handleStop} /> : <RulesModal />}
        <SettingsModal
          language={language}
          handleChangeLanguage={handleChangeLanguage}
          duration={duration}
          onChangeDuration={handleChangeDuration}
          appearance={appearance}
          onChangeAppearance={setAppearance}
          theme={theme}
          onChangeTheme={setTheme}
          sound={sound}
          onChangeSound={handleChangeSound}
          soundSupported={soundSupported}
          onClearWords={handleClearWords}
        />
      </div>
    </TranslationProvider>
  );
};

export default App;
