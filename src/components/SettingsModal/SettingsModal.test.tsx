import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Language } from '../../types/Language';
import { translations } from '../../i18n/translations';
import { TranslationProvider } from '../../i18n/useTranslation';
import SettingsModal from './SettingsModal';

const en = translations[Language.EN];

const renderModal = (overrides = {}) =>
  render(
    <TranslationProvider language={Language.EN}>
      <SettingsModal
        language={Language.EN}
        handleChangeLanguage={vi.fn()}
        duration={60}
        onChangeDuration={vi.fn()}
        appearance="dark"
        onChangeAppearance={vi.fn()}
        theme="sunset"
        onChangeTheme={vi.fn()}
        sound="low"
        onChangeSound={vi.fn()}
        soundSupported
        onClearWords={vi.fn()}
        {...overrides}
      />
    </TranslationProvider>,
  );

describe('SettingsModal', () => {
  it('keeps the settings hidden until the gear button is clicked', () => {
    renderModal();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a dialog with the language, timer, appearance and theme settings', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Français' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '120s' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: en.appearanceLight })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: en.soundHigh })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ocean' })).toBeInTheDocument();
  });

  it('changes the language from the modal', async () => {
    const handleChangeLanguage = vi.fn();
    renderModal({ handleChangeLanguage });
    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(handleChangeLanguage).toHaveBeenCalledWith(Language.EN);
  });

  it('changes the appearance and theme from the modal', async () => {
    const onChangeAppearance = vi.fn();
    const onChangeTheme = vi.fn();
    renderModal({ onChangeAppearance, onChangeTheme });
    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    await userEvent.click(screen.getByRole('button', { name: en.appearanceLight }));
    await userEvent.click(screen.getByRole('button', { name: 'Berry' }));

    expect(onChangeAppearance).toHaveBeenCalledWith('light');
    expect(onChangeTheme).toHaveBeenCalledWith('berry');
  });

  it('changes the sound level from the modal', async () => {
    const onChangeSound = vi.fn();
    renderModal({ onChangeSound });
    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    await userEvent.click(screen.getByRole('button', { name: en.soundHigh }));

    expect(onChangeSound).toHaveBeenCalledWith('high');
  });

  it('hides the sound setting when audio is unsupported', async () => {
    renderModal({ soundSupported: false });
    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    expect(screen.queryByRole('button', { name: en.soundHigh })).not.toBeInTheDocument();
    // other settings still render
    expect(screen.getByRole('button', { name: '120s' })).toBeInTheDocument();
  });

  it('clears stored words from the modal', async () => {
    const onClearWords = vi.fn();
    renderModal({ onClearWords });
    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    await userEvent.click(screen.getByRole('button', { name: en.clearStoredWords }));

    expect(onClearWords).toHaveBeenCalled();
  });

  it('closes the dialog via the close button', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: en.settings }));

    await userEvent.click(screen.getByRole('button', { name: en.close }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
