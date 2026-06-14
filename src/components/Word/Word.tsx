import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './Word.module.scss';
import { isEnglish, isFrench } from '../../helpers/language';
import { Language } from '../../types/Language';
import { generateEnglishWord, generateFrenchWord, generateNorwegianWord } from '../../helpers/words';

interface Props {
  language: Language;
  isTimeLow: boolean;
}

const Word: React.FC<Props> = ({ language, isTimeLow }: Props) => {
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

  // Try a few times to surface a word that hasn't been shown yet, falling back to
  // whatever we drew last if the pool keeps repeating.
  const generateUnusedWord = (): string => {
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = generateNewWord();
      if (!usedWords.includes(candidate)) {
        return candidate;
      }
    }
    return generateNewWord();
  };

  const handleWordChange = () => {
    const nextWord = generateUnusedWord();
    setWord(nextWord);
    setUsedWords([...usedWords, nextWord]);
  };

  return (
    <h1 className={classNames(styles.word, { [styles.timeLow]: isTimeLow })}>
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
