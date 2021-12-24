import './App.scss';
import React, { useState } from 'react';
import Word from './components/Word/Word';
import LanguageButtons from './components/LanguageButtons/LanguageButtons';
import Footer from './components/Footer/Footer';
import { Language } from './types/Language';
import Counter from './components/Counter/Counter';

const App = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [counter, setCounter] = React.useState(60);

  const handleChangeLanguage = (language: Language) => {
    setLanguage(language);
    restartCounter();
  };

  const startCounter = () => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  };

  const restartCounter = () => {
    setCounter(60);
  };

  return (
    <div className="app">
      <main>
        <Word language={language} />
        <div className="language-button-wrapper">
          <LanguageButtons language={language} handleChangeLanguage={handleChangeLanguage} />
        </div>
        <Counter counter={counter} startCounter={startCounter} restartCounter={restartCounter} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
