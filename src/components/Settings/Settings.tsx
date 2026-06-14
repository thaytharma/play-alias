import classNames from 'classnames';
import React from 'react';
import { DURATION_OPTIONS } from '../../helpers/preferences';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './Settings.module.scss';

interface Props {
  duration: number;
  onChangeDuration: (duration: number) => void;
}

const Settings: React.FC<Props> = ({ duration, onChangeDuration }: Props) => {
  const t = useTranslation();

  return (
    <div className={styles.settings}>
      <span className={styles.label}>{t('timer')}</span>
      <div className={styles.options} role="group" aria-label={t('timer')}>
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={classNames(styles.option, { [styles.active]: option === duration })}
            aria-pressed={option === duration}
            onClick={() => onChangeDuration(option)}
          >
            {option}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default Settings;
