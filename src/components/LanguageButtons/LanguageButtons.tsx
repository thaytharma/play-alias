import React from "react";
import { LanguageType } from "../../App";
import { isEnglish, isNorwegian } from "../../helpers/language";
import Flag from "../Flag/Flag";
import styles from "./LanguageButtons.module.scss";

interface Props {
  language: LanguageType;
  handleChangeLanguage: (language: LanguageType) => void;
}

const LanguageButtons = ({ language, handleChangeLanguage }: Props) => {
  return (
    <div className={styles.languageButtons}>
      <button
        className="language-button"
        onClick={() => {
          handleChangeLanguage(LanguageType.NORWEGIAN);
        }}
      >
        <Flag language={LanguageType.ENGLISH} isCurrent={isEnglish(language)} />
      </button>
      <button
        className="language-button"
        onClick={() => {
          handleChangeLanguage(LanguageType.ENGLISH);
        }}
      >
        <Flag
          language={LanguageType.NORWEGIAN}
          isCurrent={isNorwegian(language)}
        />
      </button>
    </div>
  );
};

export default LanguageButtons;
