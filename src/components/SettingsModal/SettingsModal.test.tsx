import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Language } from '../../types/Language';
import { translations } from '../../i18n/translations';
import { TranslationProvider } from '../../i18n/useTranslation';
import SettingsModal from './SettingsModal';

const en = translations[Language.EN];

const renderModal = () =>
  render(
    <TranslationProvider language={Language.EN}>
      <SettingsModal duration={60} onChangeDuration={vi.fn()} />
    </TranslationProvider>,
  );

describe('SettingsModal', () => {
  it('keeps the settings hidden until the gear button is clicked', () => {
    renderModal();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a dialog with the timer settings when the gear is clicked', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '120s' })).toBeInTheDocument();
  });

  it('closes the dialog via the close button', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    await userEvent.click(screen.getByRole('button', { name: en.close }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
