import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Language } from '../../types/Language';
import { TranslationProvider } from '../../i18n/useTranslation';
import { translations } from '../../i18n/translations';
import Splash from './Splash';

const renderSplash = (onStart = vi.fn()) =>
  render(
    <TranslationProvider language={Language.EN}>
      <Splash onStart={onStart} />
    </TranslationProvider>,
  );

describe('Splash', () => {
  it('shows the title and a localized start hint', () => {
    renderSplash();

    expect(screen.getByText('Play Alias!')).toBeInTheDocument();
    expect(screen.getByText(translations[Language.EN].tapToStart)).toBeInTheDocument();
  });

  it('calls onStart when clicked', async () => {
    const onStart = vi.fn();
    renderSplash(onStart);

    await userEvent.click(screen.getByRole('button'));

    expect(onStart).toHaveBeenCalled();
  });
});
