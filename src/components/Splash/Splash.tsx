import React from 'react';
import styles from './Splash.module.scss';
import { useTranslation } from '../../i18n/useTranslation';

// Brand call-to-action shown before the first round starts; intentionally not
// translated so it always reads as the app's name.
const TITLE = 'Play Alias!';

interface Props {
  onStart: () => void;
}

const Splash: React.FC<Props> = ({ onStart }: Props) => {
  const t = useTranslation();

  return (
    <button type="button" className={styles.splash} onClick={onStart}>
      <span className={styles.title}>{TITLE}</span>
      <span className={styles.hint}>{t('tapToStart')}</span>
    </button>
  );
};

export default Splash;
