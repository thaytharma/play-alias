import type React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import type { TranslationKey } from '../../i18n/translations';
import { FEEDBACK_MAILTO } from '../../constants';
import Modal from '../Modal/Modal';
import styles from './RulesModal.module.scss';

const STEP_KEYS: TranslationKey[] = ['rulesStep1', 'rulesStep2', 'rulesStep3', 'rulesStep4', 'rulesStep5'];
const TIP_KEYS: TranslationKey[] = ['tip1', 'tip2', 'tip3', 'tip4'];

const helpIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
  </svg>
);

const RulesModal: React.FC = () => {
  const t = useTranslation();

  return (
    <Modal label={t('rules')} side="left" icon={helpIcon}>
      <div className={styles.body}>
        <section className={styles.section}>
          <span className={styles.label}>{t('howToPlay')}</span>
          <ol className={styles.steps}>
            {STEP_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <span className={styles.label}>{t('tips')}</span>
          <ul className={styles.tips}>
            {TIP_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </section>

        <section className={`${styles.section} ${styles.shortcuts}`}>
          <span className={styles.label}>{t('keyboardShortcuts')}</span>
          <ul className={styles.shortcutList}>
            <li>
              <kbd className={styles.key}>Space</kbd>
              <span>{t('shortcutSpace')}</span>
            </li>
            <li>
              <kbd className={styles.key}>Esc</kbd>
              <span>{t('shortcutEsc')}</span>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <span className={styles.label}>{t('support')}</span>
          <a
            className={styles.coffee}
            href="https://buymeacoffee.com/thaytharma"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">☕</span>
            {t('buyMeCoffee')}
          </a>
        </section>

        <section className={styles.section}>
          <span className={styles.label}>{t('feedback')}</span>
          <a className={styles.feedback} href={FEEDBACK_MAILTO}>
            <span aria-hidden="true">✉️</span>
            {t('requestFeature')}
          </a>
        </section>
      </div>
    </Modal>
  );
};

export default RulesModal;
