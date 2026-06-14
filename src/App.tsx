import './App.scss';
import React, { useEffect, useState } from 'react';
import Word from './components/Word/Word';
import LanguageButtons from './components/LanguageButtons/LanguageButtons';
import Footer from './components/Footer/Footer';
import { Language } from './types/Language';
import Counter from './components/Counter/Counter';
import Settings from './components/Settings/Settings';
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

  return (
    <TranslationProvider language={language}>
      <div className="app">
        <main>
          <Word language={language} isTimeLow={isTimeRunningOut(counter)} />
          <div className="language-button-wrapper">
            <LanguageButtons language={language} handleChangeLanguage={handleChangeLanguage} />
          </div>
          <div className="settings-wrapper">
            <Settings duration={duration} onChangeDuration={handleChangeDuration} />
          </div>
          <Counter counter={counter} restartCounter={restartCounter} />
        </main>
        <Footer />
      </div>
    </TranslationProvider>
  );
};

export default App;
