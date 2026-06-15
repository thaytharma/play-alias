import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Language } from '../../types/Language';
import { TranslationProvider } from '../../i18n/useTranslation';
import { translations } from '../../i18n/translations';
import RulesModal from './RulesModal';

const renderRulesModal = () =>
  render(
    <TranslationProvider language={Language.EN}>
      <RulesModal />
    </TranslationProvider>,
  );

describe('RulesModal', () => {
  it('opens the rules dialog and shows the steps', async () => {
    renderRulesModal();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: translations[Language.EN].rules }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(translations[Language.EN].rulesStep1)).toBeInTheDocument();
    expect(screen.getByText(translations[Language.EN].rulesStep4)).toBeInTheDocument();
  });

  it('closes the dialog with the close button', async () => {
    renderRulesModal();
    await userEvent.click(screen.getByRole('button', { name: translations[Language.EN].rules }));
    await userEvent.click(screen.getByRole('button', { name: translations[Language.EN].close }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
