import type React from 'react';
import classNames from 'classnames';
import styles from './IconButton.module.scss';

interface Props {
  label: string;
  side: 'left' | 'right';
  onClick: () => void;
  hasPopup?: boolean;
  children: React.ReactNode;
}

/** Fixed circular button anchored to a bottom corner. */
const IconButton: React.FC<Props> = ({ label, side, onClick, hasPopup, children }: Props) => (
  <button
    type="button"
    className={classNames(styles.button, styles[side])}
    aria-label={label}
    aria-haspopup={hasPopup ? 'dialog' : undefined}
    onClick={onClick}
  >
    {children}
  </button>
);

export default IconButton;
