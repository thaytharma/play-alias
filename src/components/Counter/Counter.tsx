import classNames from "classnames";
import React from "react";
import styles from "./Counter.module.scss";

interface Props {
  counter: number;
  startCounter: () => void;
  restartCounter: () => void;
}

const Counter: React.FC<Props> = ({ counter, restartCounter }: Props) => {
  const className = classNames(styles.counter, {
    [styles.urgent]: counter <= 10,
  });
  return (
    <span key={counter} className={className}>
      {getContent()}
    </span>
  );

  function getContent() {
    if (counter === 0) {
      return <button onClick={restartCounter}>Reset</button>;
    }
    return counter;
  }
};

export default Counter;
