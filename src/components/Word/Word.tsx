import React, { useEffect, useState } from 'react';
import styles from './Word.module.scss';
import { isEnglish, isFrench } from '../../helpers/language';
import { Language } from '../../types/Language';
import { generateEnglishWord, generateFrenchWord, generateNorwegianWord } from '../../helpers/words';
import { APP_NAME } from '../../constants';

interface Props {
  language: Language;
  isTimeUp: boolean;
  onWordChange: () => void;
}

const Word: React.FC<Props> = ({ language, isTimeUp, onWordChange }: Props) => {
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
    onWordChange();
  };

  // While time is up, the word area shows the brand instead of the last word —
  // clicking it still draws the next word and restarts the round.
  const display = isTimeUp ? APP_NAME : word;

  return (
    <h1 className={styles.word}>
      <button
        key={display}
        tabIndex={0}
        className={styles.wordButton}
        onClick={() => {
          handleWordChange();
        }}
      >
        {display}
      </button>
    </h1>
  );
};

export default Word;
