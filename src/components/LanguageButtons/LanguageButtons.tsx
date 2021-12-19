import React from "react";
import { isEnglish, isNorwegian } from "../../helpers/language";
import { Language } from "../../types/Language";
import Flag from "../Flag/Flag";
import styles from "./LanguageButtons.module.scss";

interface Props {
  language: Language;
  handleChangeLanguage: (language: Language) => void;
}

const LanguageButtons = ({ language, handleChangeLanguage }: Props) => {
  return (
    <div className={styles.languageButtons}>
      <button
        className="language-button"
        onClick={() => {
          handleChangeLanguage(Language.NO);
        }}
      >
        <Flag language={Language.EN} isCurrent={isEnglish(language)} />
      </button>
      <button
        className="language-button"
        onClick={() => {
          handleChangeLanguage(Language.EN);
        }}
      >
        <Flag language={Language.NO} isCurrent={isNorwegian(language)} />
      </button>
    </div>
  );
};

export default LanguageButtons;
