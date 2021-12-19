import classNames from "classnames";
import React from "react";
import styles from "./Counter.module.scss";

interface Props {
  counter: number;
  resetCounter: () => void;
}

const Counter = ({ counter, resetCounter }: Props) => {
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
      return <button onClick={resetCounter}>Reset</button>;
    }
    return counter;
  }
};

export default Counter;
