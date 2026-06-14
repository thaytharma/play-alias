import './App.scss';
import React, { useEffect, useState } from 'react';
import Word from './components/Word/Word';
import LanguageButtons from './components/LanguageButtons/LanguageButtons';
import Footer from './components/Footer/Footer';
import { Language } from './types/Language';
import Counter from './components/Counter/Counter';
import { getInitialLanguage, saveLanguage } from './helpers/preferences';
import { isTimeRunningOut } from './helpers/timer';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [counter, setCounter] = React.useState<number>(60);

  // Persist the language (covers both `?lang=` visits and manual changes).
  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  const handleChangeLanguage = (language: Language) => {
    setLanguage(language);
    restartCounter();
  };

  useEffect(() => {
    if (counter <= 0) {
      return;
    }
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

  const restartCounter = () => {
    setCounter(60);
  };

  return (
    <div className="app">
      <main>
        <Word language={language} isTimeLow={isTimeRunningOut(counter)} />
        <div className="language-button-wrapper">
          <LanguageButtons language={language} handleChangeLanguage={handleChangeLanguage} />
        </div>
        <Counter counter={counter} restartCounter={restartCounter} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
