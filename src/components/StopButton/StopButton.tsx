import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import IconButton from '../IconButton/IconButton';

interface Props {
  onStop: () => void;
}

const StopButton: React.FC<Props> = ({ onStop }: Props) => {
  const t = useTranslation();

  return (
    <IconButton label={t('stop')} side="left" onClick={onStop}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    </IconButton>
  );
};

export default StopButton;
