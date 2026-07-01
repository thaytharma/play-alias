import './App.scss';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Word, { type WordHandle } from './components/Word/Word';
import Splash from './components/Splash/Splash';
import StopButton from './components/StopButton/StopButton';
import RulesModal from './components/RulesModal/RulesModal';
import Footer from './components/Footer/Footer';
import type { Language } from './types/Language';
import type { Appearance, Theme } from './types/Theme';
import type { DifficultyLevel, PlayMode } from './types/Word';
import Counter from './components/Counter/Counter';
import ScorePanel from './components/ScorePanel/ScorePanel';
import SettingsModal from './components/SettingsModal/SettingsModal';
import { trackEvent } from './helpers/analytics';
import { clearStoredWords } from './helpers/preferences';
import { type SoundLevel, isSoundSupported, playTick, playTimeUp, playWordChange, unlockAudio } from './helpers/sound';
import { isTimeRunningOut } from './helpers/timer';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { usePreferences } from './hooks/usePreferences';
import { TranslationProvider } from './i18n/useTranslation';

const App: React.FC = () => {
  const {
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
  } = usePreferences();
  const [soundSupported] = useState(() => isSoundSupported());
  const [counter, setCounter] = useState<number>(duration);
  const [started, setStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const wordRef = useRef<WordHandle>(null);

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

  // Hold the timer until the player starts from the splash.
  useEffect(() => {
    if (!started || counter <= 0) {
      return;
    }
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter, started]);

  // Report each round ending once, when the clock reaches zero.
  // biome-ignore lint/correctness/useExhaustiveDependencies: fire on the counter→0 transition, not when the score changes mid-round
  useEffect(() => {
    if (started && counter === 0) {
      trackEvent('time_up', { scoring, score: scoring ? score : undefined });
    }
  }, [started, counter]);

  const trackSetting = (setting: string, value: unknown) => {
    trackEvent('setting_changed', { setting, value });
  };

  // Begin a fresh round: reset the clock and the score.
  const restartCounter = () => {
    setCounter(duration);
    setScore(0);
  };

  const handleChangeLanguage = (nextLanguage: Language) => {
    trackSetting('language', nextLanguage);
    setLanguage(nextLanguage);
    restartCounter();
  };

  const handleChangeDuration = (nextDuration: number) => {
    trackSetting('timer', nextDuration);
    setDuration(nextDuration);
    setCounter(nextDuration);
    setScore(0);
  };

  const handleChangeMode = (nextMode: PlayMode) => {
    trackSetting('mode', nextMode);
    setMode(nextMode);
  };

  const handleChangeLevel = (nextLevel: DifficultyLevel) => {
    trackSetting('level', nextLevel);
    setLevel(nextLevel);
  };

  const handleChangeScoring = (nextScoring: boolean) => {
    trackSetting('scoring', nextScoring);
    setScoring(nextScoring);
  };

  const handleChangeAppearance = (nextAppearance: Appearance) => {
    trackSetting('appearance', nextAppearance);
    setAppearance(nextAppearance);
  };

  const handleChangeTheme = (nextTheme: Theme) => {
    trackSetting('theme', nextTheme);
    setTheme(nextTheme);
  };

  const handleStart = () => {
    // Unlock audio within the start gesture so ticks can play on mobile.
    unlockAudio();
    trackEvent('start_game', { language, duration, mode, level, scoring });
    restartCounter();
    setStarted(true);
  };

  const handleStop = () => {
    trackEvent('stop_game');
    setStarted(false);
  };

  const handleChangeSound = (nextSound: SoundLevel) => {
    unlockAudio();
    trackSetting('sound', nextSound);
    setSound(nextSound);
  };

  const handleClearWords = () => {
    trackEvent('clear_words');
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

  // Scoring mode: a correct guess scores a point, a skip costs one; both draw
  // the next word (advance() runs handleWordChange for the sound/restart).
  const handleCorrect = () => {
    trackEvent('word_scored', { result: 'correct' });
    setScore((current) => current + 1);
    wordRef.current?.advance();
  };

  const handleSkip = () => {
    trackEvent('word_scored', { result: 'skip' });
    setScore((current) => current - 1);
    wordRef.current?.advance();
  };

  // Keyboard controls (non-touch); see useKeyboardControls for the key map.
  useKeyboardControls({
    started,
    scoring,
    isTimeUp: counter === 0,
    onStart: handleStart,
    onStop: handleStop,
    onAdvance: () => wordRef.current?.advance(),
    onCorrect: handleCorrect,
    onSkip: handleSkip,
  });

  return (
    <TranslationProvider language={language}>
      <div className="app">
        <main>
          {started ? (
            <>
              <Word
                ref={wordRef}
                language={language}
                mode={mode}
                level={level}
                isTimeUp={counter === 0}
                disableTap={scoring && counter > 0}
                onWordChange={handleWordChange}
              />
              <Counter counter={counter} />
              {scoring && (
                <ScorePanel score={score} isTimeUp={counter === 0} onCorrect={handleCorrect} onSkip={handleSkip} />
              )}
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
          mode={mode}
          onChangeMode={handleChangeMode}
          level={level}
          onChangeLevel={handleChangeLevel}
          scoring={scoring}
          onChangeScoring={handleChangeScoring}
          appearance={appearance}
          onChangeAppearance={handleChangeAppearance}
          theme={theme}
          onChangeTheme={handleChangeTheme}
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
