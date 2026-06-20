import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './Word.module.scss';
import { isEnglish, isFrench } from '../../helpers/language';
import type { Language } from '../../types/Language';
import type { DifficultyLevel, PlayMode } from '../../types/Word';
import { generateEnglishWord, generateFrenchWord, generateNorwegianWord } from '../../helpers/words';
import { getStoredWords, saveStoredWords } from '../../helpers/preferences';
import { useTilt } from '../../hooks/useTilt';
import { APP_NAME } from '../../constants';

export interface WordHandle {
  /** Draw the next word (and, at time's up, restart the round). */
  advance: () => void;
  /** Forget the shown-words history (keeping the current word on screen). */
  reset: () => void;
}

interface Props {
  language: Language;
  mode: PlayMode;
  level: DifficultyLevel;
  isTimeUp: boolean;
  /** When true, tapping the word does nothing — scoring drives advancing instead. */
  disableTap?: boolean;
  onWordChange: () => void;
}

const Word = forwardRef<WordHandle, Props>(
  ({ language, mode, level, isTimeUp, disableTap = false, onWordChange }: Props, ref) => {
    const [word, setWord] = useState<string>('');
    const [usedWords, setUsedWords] = useState<string[]>([]);
    const tiltRef = useTilt<HTMLHeadingElement>();

    // biome-ignore lint/correctness/useExhaustiveDependencies: re-seed only when the language changes
    useEffect(() => {
      // Seed from previously-shown words so they keep being avoided across sessions.
      const stored = getStoredWords(language);
      const newWord = generateUnusedWord(stored);
      const next = [...stored, newWord];
      setWord(newWord);
      setUsedWords(next);
      saveStoredWords(language, next);
    }, [language]);

    const generateNewWord = (): string => {
      if (isEnglish(language)) {
        return generateEnglishWord(level, mode);
      }

      if (isFrench(language)) {
        return generateFrenchWord(level, mode);
      }

      return generateNorwegianWord(level, mode);
    };

    // Try a few times to surface a word that hasn't been shown yet, falling back to
    // whatever we drew last if the pool keeps repeating.
    const generateUnusedWord = (used: string[]): string => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = generateNewWord();
        if (!used.includes(candidate)) {
          return candidate;
        }
      }
      return generateNewWord();
    };

    const handleWordChange = () => {
      const nextWord = generateUnusedWord(usedWords);
      const updated = [...usedWords, nextWord];
      setWord(nextWord);
      setUsedWords(updated);
      saveStoredWords(language, updated);
      onWordChange();
    };

    // Forget history but keep the current word on screen (and stored).
    const reset = () => {
      const kept = word ? [word] : [];
      setUsedWords(kept);
      saveStoredWords(language, kept);
    };

    useImperativeHandle(ref, () => ({ advance: handleWordChange, reset }));

    // While time is up, the word area shows the brand instead of the last word —
    // clicking it still draws the next word and restarts the round.
    const display = isTimeUp ? APP_NAME : word;

    return (
      <h1 ref={tiltRef} className={styles.word}>
        <span className={styles.tilt}>
          <button
            key={display}
            type="button"
            tabIndex={0}
            className={styles.wordButton}
            onClick={() => {
              if (disableTap) {
                return;
              }
              handleWordChange();
            }}
          >
            {display}
          </button>
        </span>
      </h1>
    );
  },
);

Word.displayName = 'Word';

export default Word;
