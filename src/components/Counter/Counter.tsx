import classNames from "classnames";
import React from "react";
import styles from "./Counter.module.scss";

interface Props {
  counter: number;
}

const Counter = ({ counter }: Props) => {
  const className = classNames(styles.counter, {
    [styles.urgent]: counter <= 10,
  });
  return (
    <span key={counter} className={className}>
      {counter}
    </span>
  );
};

export default Counter;
