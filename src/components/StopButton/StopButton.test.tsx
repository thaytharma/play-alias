import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Language } from '../../types/Language';
import { TranslationProvider } from '../../i18n/useTranslation';
import { translations } from '../../i18n/translations';
import StopButton from './StopButton';

const renderStopButton = (onStop = vi.fn()) =>
  render(
    <TranslationProvider language={Language.EN}>
      <StopButton onStop={onStop} />
    </TranslationProvider>,
  );

describe('StopButton', () => {
  it('renders with a localized label', () => {
    renderStopButton();

    expect(screen.getByRole('button', { name: translations[Language.EN].stop })).toBeInTheDocument();
  });

  it('calls onStop when clicked', async () => {
    const onStop = vi.fn();
    renderStopButton(onStop);

    await userEvent.click(screen.getByRole('button'));

    expect(onStop).toHaveBeenCalled();
  });
});
