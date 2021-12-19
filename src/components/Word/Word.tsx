import React, { useState } from "react";
import randomEnglishWord from "random-words";
import randomNorwegianWord from "tilfeldigeord";
import styles from "./Word.module.scss";

const Word = ({ language }) => {
  const initialWord = randomEnglishWord();
  const [word, setWord] = useState<string>(initialWord);

  const handleWordChange = () => {
    setWord(
      language === "EN"
        ? randomEnglishWord()
        : randomNorwegianWord.getTilfeldigOrd().split(" ")[0]
    );
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
