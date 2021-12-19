import "./App.scss";
import React, { useState } from "react";
import Word from "./components/Word/Word";
import LanguageButtons from "./components/LanguageButtons/LanguageButtons";
import Footer from "./components/Footer/Footer";
import { Language } from "./types/Language";

const App = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);

  const handleChangeLanguage = (language: Language) => {
    setLanguage(language);
  };

  return (
    <div className="app">
      <main>
        <Word language={language} />
        <div className="language-button-wrapper">
          <LanguageButtons
            language={language}
            handleChangeLanguage={handleChangeLanguage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
