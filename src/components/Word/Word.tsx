import React, { useEffect, useState } from "react";
import randomEnglishWord from "random-words";
import randomNorwegianWord from "tilfeldigeord";
import styles from "./Word.module.scss";
import firstWord, { capitalizeFirstLetter } from "../../helpers/strings";
import { isEnglish } from "../../helpers/language";
import { Language } from "../../types/Language";

interface Props {
  language: Language;
}

const Word = ({ language }: Props) => {
  const [word, setWord] = useState<string>("");
  const [usedWords, setUsedWords] = useState<string[]>([]);

  console.log(usedWords);

  useEffect(() => {
    const newWord = generateWord();
    setWord(newWord);
    setUsedWords([newWord]);
  }, [language]);

  const generateWord = (): string => {
    const word = isEnglish(language)
      ? randomEnglishWord()
      : firstWord(randomNorwegianWord.getTilfeldigOrd());

    return word;
  };

  const handleWordChange = () => {
    const newWord = generateWord();

    if (!usedWords.includes(newWord)) {
      setWord(newWord);
      setUsedWords([...usedWords, newWord]);
    } else {
      const nextWord = generateWord();
      setWord(nextWord);
      setUsedWords([...usedWords, nextWord]);
    }
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
        {capitalizeFirstLetter(word)}
      </button>
    </h1>
  );
};

export default Word;
