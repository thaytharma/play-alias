import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import Settings from '../Settings/Settings';
import styles from './SettingsModal.module.scss';

interface Props {
  duration: number;
  onChangeDuration: (duration: number) => void;
}

const SettingsModal: React.FC<Props> = ({ duration, onChangeDuration }: Props) => {
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
      <button
        type="button"
        className={styles.trigger}
        aria-label={t('settings')}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={t('settings')}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>{t('settings')}</h2>
              <button type="button" className={styles.close} aria-label={t('close')} onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            <Settings duration={duration} onChangeDuration={onChangeDuration} />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
