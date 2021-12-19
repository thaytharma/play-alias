import React, { useEffect, useState } from "react";
import randomEnglishWord from "random-words";
import randomNorwegianWord from "tilfeldigeord";
import styles from "./Word.module.scss";
import { LanguageType } from "../../App";
import getFirstWord from "../../helpers/strings";
import { isEnglish } from "../../helpers/language";

interface Props {
  language: LanguageType;
}

const Word = ({ language }: Props) => {
  const [word, setWord] = useState<string>("");

  useEffect(() => {
    setWord(generateWord());
  }, [language]);

  const generateWord = (): string => {
    const word = isEnglish(language)
      ? randomEnglishWord()
      : getFirstWord(randomNorwegianWord.getTilfeldigOrd());

    return word;
  };

  const handleWordChange = () => {
    setWord(generateWord());
  };

  return (
    <h1 className={styles.word}>
      <button
        key={word}
        tabIndex={0}
        className={styles.wordButton}
        onClick={() => {
          handleWordChange();
        }}
      >
        {word.charAt(0).toUpperCase() + word.slice(1)}
      </button>
    </h1>
  );
};

export default Word;
