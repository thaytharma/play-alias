import type React from 'react';
import styles from './Splash.module.scss';
import { useTranslation } from '../../i18n/useTranslation';
import { useTilt } from '../../hooks/useTilt';
import { APP_NAME } from '../../constants';

interface Props {
  onStart: () => void;
}

const Splash: React.FC<Props> = ({ onStart }: Props) => {
  const t = useTranslation();
  const tiltRef = useTilt<HTMLSpanElement>();

  return (
    <button type="button" className={styles.splash} onClick={onStart}>
      <span ref={tiltRef} className={styles.titleTilt}>
        <span className={styles.tilt}>
          <span className={styles.title}>{APP_NAME}</span>
        </span>
      </span>
      <span className={`${styles.hint} ${styles.touchHint}`}>{t('tapToStart')}</span>
      <span className={`${styles.hint} ${styles.keyHint}`}>{t('pressSpaceToStart')}</span>
    </button>
  );
};

export default Splash;
