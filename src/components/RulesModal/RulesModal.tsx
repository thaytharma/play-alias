import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { TranslationKey } from '../../i18n/translations';
import styles from './RulesModal.module.scss';

const STEP_KEYS: TranslationKey[] = ['rulesStep1', 'rulesStep2', 'rulesStep3', 'rulesStep4'];

const RulesModal: React.FC = () => {
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
        aria-label={t('rules')}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={t('rules')}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>{t('rules')}</h2>
              <button type="button" className={styles.close} aria-label={t('close')} onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            <ol className={styles.steps}>
              {STEP_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
};

export default RulesModal;
