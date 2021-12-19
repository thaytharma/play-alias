import "./App.scss";
import React, { useState } from "react";
import Word from "./components/Word/Word";
import LanguageButtons from "./components/LanguageButtons/LanguageButtons";

export enum LanguageType {
  ENGLISH = "EN",
  NORWEGIAN = "NO",
}

const App = () => {
  const [language, setLanguage] = useState<LanguageType>(LanguageType.ENGLISH);

  const handleChangeLanguage = (language: LanguageType) => {
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
      <footer>Copyright @ Thayanan Tharmapalan</footer>
    </div>
  );
};

export default App;
