import React, { useEffect, useState } from 'react';
import styles from './Word.module.scss';
import { isEnglish } from '../../helpers/language';
import { Language } from '../../types/Language';
import { generateEnglishWord, generateNorwegianWord } from '../../helpers/words';

interface Props {
  language: Language;
}

const Word: React.FC<Props> = ({ language }: Props) => {
  const [word, setWord] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]);

  useEffect(() => {
    const newWord = generateWord();
    setWord(newWord);
    setUsedWords([newWord]);
  }, [language]);

  const generateWord = (): string => {
    const word = isEnglish(language) ? generateEnglishWord() : generateNorwegianWord();

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
        {word}
      </button>
    </h1>
  );
};

export default Word;
