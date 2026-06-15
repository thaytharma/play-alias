import './App.scss';
import React, { useEffect, useState } from 'react';
import Word from './components/Word/Word';
import Footer from './components/Footer/Footer';
import { Language } from './types/Language';
import Counter from './components/Counter/Counter';
import SettingsModal from './components/SettingsModal/SettingsModal';
import { getInitialDuration, getInitialLanguage, saveDuration, saveLanguage } from './helpers/preferences';
import { isTimeRunningOut } from './helpers/timer';
import { TranslationProvider } from './i18n/useTranslation';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [duration, setDuration] = useState<number>(getInitialDuration);
  const [counter, setCounter] = React.useState<number>(duration);

  // Persist the language (covers both `?lang=` visits and manual changes).
  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  // Persist the chosen round length.
  useEffect(() => {
    saveDuration(duration);
  }, [duration]);

  const handleChangeLanguage = (language: Language) => {
    setLanguage(language);
    restartCounter();
  };

  const handleChangeDuration = (nextDuration: number) => {
    setDuration(nextDuration);
    setCounter(nextDuration);
  };

  useEffect(() => {
    if (counter <= 0) {
      return;
    }
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

  const restartCounter = () => {
    setCounter(duration);
  };

  const handleWordChange = () => {
    // Mid-round a new word just swaps the word; once time is up, changing the
    // word also starts the next round's timer.
    if (counter === 0) {
      restartCounter();
    }
  };

  return (
    <TranslationProvider language={language}>
      <div className="app">
        <main>
          <Word language={language} isTimeLow={isTimeRunningOut(counter)} onWordChange={handleWordChange} />
          <Counter counter={counter} />
        </main>
        <Footer />
        <SettingsModal
          language={language}
          handleChangeLanguage={handleChangeLanguage}
          duration={duration}
          onChangeDuration={handleChangeDuration}
        />
      </div>
    </TranslationProvider>
  );
};

export default App;
