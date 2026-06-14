import classNames from 'classnames';
import React from 'react';
import { isTimeRunningOut } from '../../helpers/timer';
import styles from './Counter.module.scss';

interface Props {
  counter: number;
  restartCounter: () => void;
}

const Counter: React.FC<Props> = ({ counter, restartCounter }: Props) => {
  const className = classNames(styles.counter, {
    [styles.urgent]: isTimeRunningOut(counter),
  });
  return (
    <span key={counter} className={className}>
      {getContent()}
    </span>
  );

  function getContent() {
    if (counter === 0) {
      return <button onClick={restartCounter}>Restart</button>;
    }
    return counter;
  }
};

export default Counter;
