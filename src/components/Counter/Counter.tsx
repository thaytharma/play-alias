import classNames from 'classnames';
import type React from 'react';
import { isTimeRunningOut } from '../../helpers/timer';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './Counter.module.scss';

interface Props {
  counter: number;
}

const Counter: React.FC<Props> = ({ counter }: Props) => {
  const t = useTranslation();

  if (counter === 0) {
    return (
      <div className={styles.timesUp}>
        <span>{t('timesUp')}</span>
        <span className={styles.hint}>{t('clickWordToRestart')}</span>
      </div>
    );
  }

  const className = classNames(styles.counter, {
    [styles.urgent]: isTimeRunningOut(counter),
  });

  return (
    <span key={counter} className={className}>
      {counter}
    </span>
  );
};

export default Counter;
