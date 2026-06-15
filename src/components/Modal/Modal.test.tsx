import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Language } from '../../types/Language';
import { TranslationProvider } from '../../i18n/useTranslation';
import { translations } from '../../i18n/translations';
import Modal from './Modal';

const renderModal = () =>
  render(
    <TranslationProvider language={Language.EN}>
      <Modal label="Help" side="left" icon={<svg />}>
        <p>Body content</p>
      </Modal>
    </TranslationProvider>,
  );

describe('Modal', () => {
  it('stays closed until the trigger is clicked', () => {
    renderModal();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a dialog with the title and body', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: 'Help' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('closes with the close button', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Help' }));

    await userEvent.click(screen.getByRole('button', { name: translations[Language.EN].close }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Help' }));

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
