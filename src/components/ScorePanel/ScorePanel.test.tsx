import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Language } from '../../types/Language';
import { translations } from '../../i18n/translations';
import { TranslationProvider } from '../../i18n/useTranslation';
import ScorePanel from './ScorePanel';

const en = translations[Language.EN];

const renderPanel = (props: Partial<React.ComponentProps<typeof ScorePanel>> = {}) =>
  render(
    <TranslationProvider language={Language.EN}>
      <ScorePanel score={0} isTimeUp={false} onCorrect={vi.fn()} onSkip={vi.fn()} {...props} />
    </TranslationProvider>,
  );

describe('ScorePanel', () => {
  it('shows the current score', () => {
    renderPanel({ score: 5 });

    expect(screen.getByText(en.scoreLabel)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('fires onCorrect and onSkip from the buttons', async () => {
    const onCorrect = vi.fn();
    const onSkip = vi.fn();
    renderPanel({ onCorrect, onSkip });

    await userEvent.click(screen.getByRole('button', { name: new RegExp(en.correct, 'i') }));
    await userEvent.click(screen.getByRole('button', { name: new RegExp(en.skip, 'i') }));

    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('hides the buttons but keeps the score at time-up', () => {
    renderPanel({ score: 3, isTimeUp: true });

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: new RegExp(en.correct, 'i') })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: new RegExp(en.skip, 'i') })).not.toBeInTheDocument();
  });
});
