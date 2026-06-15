import React from 'react';
import styles from './Splash.module.scss';
import { useTranslation } from '../../i18n/useTranslation';
import { APP_NAME } from '../../constants';

interface Props {
  onStart: () => void;
}

const Splash: React.FC<Props> = ({ onStart }: Props) => {
  const t = useTranslation();

  return (
    <button type="button" className={styles.splash} onClick={onStart}>
      <span className={styles.title}>{APP_NAME}</span>
      <span className={`${styles.hint} ${styles.touchHint}`}>{t('tapToStart')}</span>
      <span className={`${styles.hint} ${styles.keyHint}`}>{t('pressSpaceToStart')}</span>
    </button>
  );
};

export default Splash;
