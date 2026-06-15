import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import IconButton from '../IconButton/IconButton';
import styles from './Modal.module.scss';

interface Props {
  /** Used as both the trigger's accessible name and the dialog title. */
  label: string;
  icon: React.ReactNode;
  side: 'left' | 'right';
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ label, icon, side, children }: Props) => {
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <IconButton label={label} side={side} hasPopup onClick={() => setIsOpen(true)}>
        {icon}
      </IconButton>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>{label}</h2>
              <button type="button" className={styles.close} aria-label={t('close')} onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
