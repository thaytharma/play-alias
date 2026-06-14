import React, { useEffect, useState } from 'react';
import styles from './Word.module.scss';
import { isEnglish, isFrench } from '../../helpers/language';
import { Language } from '../../types/Language';
import { generateEnglishWord, generateFrenchWord, generateNorwegianWord } from '../../helpers/words';

interface Props {
  language: Language;
}

const Word: React.FC<Props> = ({ language }: Props) => {
  const [word, setWord] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]);

  useEffect(() => {
    const newWord = generateNewWord();
    setWord(newWord);
    setUsedWords([newWord]);
  }, [language]);

  const generateNewWord = (): string => {
    if (isEnglish(language)) {
      return generateEnglishWord();
    }

    if (isFrench(language)) {
      return generateFrenchWord();
    }

    return generateNorwegianWord();
  };

  const handleWordChange = () => {
    const newWord = generateNewWord();

    if (!usedWords.includes(newWord)) {
      setWord(newWord);
      setUsedWords([...usedWords, newWord]);
    } else {
      const nextWord = generateNewWord();
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
