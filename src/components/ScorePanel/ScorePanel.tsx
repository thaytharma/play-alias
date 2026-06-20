import type React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './ScorePanel.module.scss';

interface Props {
  score: number;
  isTimeUp: boolean;
  onCorrect: () => void;
  onSkip: () => void;
}

/**
 * Optional round scoring. Shows the running score and, while the round is
 * live, the Correct (+1) / Skip (−1) buttons that draw the next word. At
 * time's-up the buttons hide and the final score stays on screen.
 */
const ScorePanel: React.FC<Props> = ({ score, isTimeUp, onCorrect, onSkip }: Props) => {
  const t = useTranslation();

  return (
    <div className={styles.panel}>
      <span className={styles.score}>
        <span className={styles.scoreLabel}>{t('scoreLabel')}</span>
        <span className={styles.scoreValue}>{score}</span>
      </span>
      {!isTimeUp && (
        <div className={styles.buttons}>
          <button type="button" className={styles.skip} onClick={onSkip}>
            <span aria-hidden="true">✗</span> {t('skip')}
          </button>
          <button type="button" className={styles.correct} onClick={onCorrect}>
            <span aria-hidden="true">✓</span> {t('correct')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ScorePanel;
