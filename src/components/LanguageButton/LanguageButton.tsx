import React from "react";
import styles from "./LanguageButton.module.scss";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}

const LanguageButton: React.FC<Props> = ({
  children,
  title,
  onClick,
}: Props) => {
  return (
    <button title={title} className={styles.languageButton} onClick={onClick}>
      <span className={styles.languageButtonText}>{title}</span>
      {children}
    </button>
  );
};

export default LanguageButton;
