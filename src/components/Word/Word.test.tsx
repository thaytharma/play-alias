import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Language } from '../../types/Language';
import { APP_NAME } from '../../constants';
import Word from './Word';

describe('Word', () => {
  it('shows a word for the selected language', () => {
    render(<Word language={Language.EN} isTimeUp={false} onWordChange={vi.fn()} />);

    expect(screen.getByRole('button').textContent?.trim().length).toBeGreaterThan(0);
  });

  it('calls onWordChange when the word is clicked', async () => {
    const onWordChange = vi.fn();
    render(<Word language={Language.EN} isTimeUp={false} onWordChange={onWordChange} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onWordChange).toHaveBeenCalled();
  });

  it('shows the brand instead of the word when time is up', () => {
    render(<Word language={Language.EN} isTimeUp onWordChange={vi.fn()} />);

    expect(screen.getByRole('button')).toHaveTextContent(APP_NAME);
  });
});
