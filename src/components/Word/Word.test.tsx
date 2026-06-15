import { act, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Language } from '../../types/Language';
import { getStoredWords } from '../../helpers/preferences';
import { APP_NAME } from '../../constants';
import Word, { WordHandle } from './Word';

beforeEach(() => {
  localStorage.clear();
});

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

  it('stores shown words and resets the history on reset', async () => {
    const ref = createRef<WordHandle>();
    render(<Word ref={ref} language={Language.EN} isTimeUp={false} onWordChange={vi.fn()} />);

    await userEvent.click(screen.getByRole('button'));
    expect(getStoredWords(Language.EN).length).toBe(2);

    act(() => {
      ref.current?.reset();
    });

    expect(getStoredWords(Language.EN).length).toBe(1);
  });
});
