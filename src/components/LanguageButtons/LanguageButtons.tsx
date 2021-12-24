import React from "react";
import { isEnglish, isNorwegian } from "../../helpers/language";
import { Language } from "../../types/Language";
import Flag from "../Flag/Flag";
import LanguageButton from "../LanguageButton/LanguageButton";
import styles from "./LanguageButtons.module.scss";

interface Props {
  language: Language;
  handleChangeLanguage: (language: Language) => void;
}

const LanguageButtons: React.FC<Props> = ({
  language,
  handleChangeLanguage,
}: Props) => {
  return (
    <div className={styles.languageButtons}>
      <LanguageButton
        title={Language.EN}
        onClick={() => {
          handleChangeLanguage(Language.NO);
        }}
      >
        <Flag language={Language.EN} isCurrent={isEnglish(language)} />
      </LanguageButton>
      <LanguageButton
        title={Language.NO}
        onClick={() => {
          handleChangeLanguage(Language.EN);
        }}
      >
        <Flag language={Language.NO} isCurrent={isNorwegian(language)} />
      </LanguageButton>
    </div>
  );
};

export default LanguageButtons;
