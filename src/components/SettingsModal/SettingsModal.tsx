import type React from 'react';
import type { Language } from '../../types/Language';
import { type Appearance, type Theme, THEME_LABELS } from '../../types/Theme';
import type { DifficultyLevel, PlayMode } from '../../types/Word';
import type { SoundLevel } from '../../helpers/sound';
import { useTranslation } from '../../i18n/useTranslation';
import {
  APPEARANCE_OPTIONS,
  DURATION_OPTIONS,
  LEVEL_OPTIONS,
  MODE_OPTIONS,
  SOUND_OPTIONS,
  THEME_OPTIONS,
} from '../../helpers/preferences';
import { LANGUAGE_ENDONYMS, LANGUAGE_ORDER } from '../../helpers/language';
import OptionGroup from '../OptionGroup/OptionGroup';
import Modal from '../Modal/Modal';
import styles from './SettingsModal.module.scss';

interface Props {
  language: Language;
  handleChangeLanguage: (language: Language) => void;
  duration: number;
  onChangeDuration: (duration: number) => void;
  mode: PlayMode;
  onChangeMode: (mode: PlayMode) => void;
  level: DifficultyLevel;
  onChangeLevel: (level: DifficultyLevel) => void;
  scoring: boolean;
  onChangeScoring: (scoring: boolean) => void;
  appearance: Appearance;
  onChangeAppearance: (appearance: Appearance) => void;
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
  sound: SoundLevel;
  onChangeSound: (sound: SoundLevel) => void;
  soundSupported: boolean;
  onClearWords: () => void;
}

const gearIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const SettingsModal: React.FC<Props> = ({
  language,
  handleChangeLanguage,
  duration,
  onChangeDuration,
  mode,
  onChangeMode,
  level,
  onChangeLevel,
  scoring,
  onChangeScoring,
  appearance,
  onChangeAppearance,
  theme,
  onChangeTheme,
  sound,
  onChangeSound,
  soundSupported,
  onClearWords,
}: Props) => {
  const t = useTranslation();

  const languageOptions = LANGUAGE_ORDER.map((lang) => ({ value: lang, label: LANGUAGE_ENDONYMS[lang] }));
  const durationOptions = DURATION_OPTIONS.map((seconds) => ({ value: seconds, label: `${seconds}s` }));
  const modeOptions = MODE_OPTIONS.map((value) => ({
    value,
    label: value === 'default' ? t('modeDefault') : t('modeParty'),
  }));
  const levelOptions = LEVEL_OPTIONS.map((value) => ({
    value,
    label: value === 'easy' ? t('levelEasy') : value === 'medium' ? t('levelMedium') : t('levelHard'),
  }));
  const scoringOptions = [
    { value: 'off', label: t('scoreOff') },
    { value: 'on', label: t('scoreOn') },
  ];
  const appearanceOptions = APPEARANCE_OPTIONS.map((value) => ({
    value,
    label: value === 'dark' ? t('appearanceDark') : t('appearanceLight'),
  }));
  const themeOptions = THEME_OPTIONS.map((value) => ({ value, label: THEME_LABELS[value] }));
  const soundOptions = SOUND_OPTIONS.map((value) => ({
    value,
    label: value === 'off' ? t('soundOff') : value === 'low' ? t('soundLow') : t('soundHigh'),
  }));

  return (
    <Modal label={t('settings')} side="right" icon={gearIcon}>
      <div className={styles.body}>
        {/* Ordered most-used first: language, then round setup (timer, score),
            then content tuning (mode, level), then presentation, then upkeep. */}
        <OptionGroup label={t('language')} options={languageOptions} value={language} onChange={handleChangeLanguage} />
        <OptionGroup label={t('timer')} options={durationOptions} value={duration} onChange={onChangeDuration} />
        <OptionGroup
          label={t('keepScore')}
          options={scoringOptions}
          value={scoring ? 'on' : 'off'}
          onChange={(value) => onChangeScoring(value === 'on')}
        />
        <div className={styles.field}>
          <OptionGroup label={t('mode')} options={modeOptions} value={mode} onChange={onChangeMode} />
          {mode === 'party' && <p className={styles.hint}>{t('partyHint')}</p>}
        </div>
        <OptionGroup label={t('level')} options={levelOptions} value={level} onChange={onChangeLevel} />
        {soundSupported && (
          <OptionGroup label={t('sound')} options={soundOptions} value={sound} onChange={onChangeSound} />
        )}
        <OptionGroup
          label={t('appearance')}
          options={appearanceOptions}
          value={appearance}
          onChange={onChangeAppearance}
        />
        <OptionGroup label={t('theme')} options={themeOptions} value={theme} onChange={onChangeTheme} />
        <div className={styles.action}>
          <span className={styles.actionLabel}>{t('storedWords')}</span>
          <button type="button" className={styles.clearButton} onClick={onClearWords}>
            {t('clearStoredWords')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
