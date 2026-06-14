import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Language } from '../../types/Language';
import { translations } from '../../i18n/translations';
import { TranslationProvider } from '../../i18n/useTranslation';
import Counter from './Counter';

const renderCounter = (counter: number) =>
  render(
    <TranslationProvider language={Language.EN}>
      <Counter counter={counter} />
    </TranslationProvider>,
  );

describe('Counter', () => {
  it('shows the remaining seconds while counting down', () => {
    renderCounter(30);

    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('shows a localized time-up message and a restart hint at zero', () => {
    renderCounter(0);
    const en = translations[Language.EN];

    expect(screen.getByText(en.timesUp)).toBeInTheDocument();
    expect(screen.getByText(en.clickWordToRestart)).toBeInTheDocument();
  });
});
