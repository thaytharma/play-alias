import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach } from 'vitest';
import App from './App';
import { Language } from './types/Language';
import { translations } from './i18n/translations';
import { APP_NAME } from './constants';

beforeEach(() => {
  localStorage.clear();
});

test('renders the settings button (default language Norwegian)', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: translations[Language.NO].settings })).toBeInTheDocument();
});

test('starts on the splash and reveals the game word once started', async () => {
  render(<App />);

  const startButton = screen.getByRole('button', { name: new RegExp(translations[Language.NO].tapToStart, 'i') });
  await userEvent.click(startButton);

  expect(screen.queryByText(translations[Language.NO].tapToStart)).not.toBeInTheDocument();
  expect(screen.getByRole('heading')).toBeInTheDocument();
});

test('shows the rules button on the splash and the stop button during a round', async () => {
  render(<App />);

  expect(screen.getByRole('button', { name: translations[Language.NO].rules })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: translations[Language.NO].stop })).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: new RegExp(translations[Language.NO].tapToStart, 'i') }));

  expect(screen.getByRole('button', { name: translations[Language.NO].stop })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: translations[Language.NO].rules })).not.toBeInTheDocument();
});

test('stopping returns to the splash', async () => {
  render(<App />);

  await userEvent.click(screen.getByRole('button', { name: new RegExp(translations[Language.NO].tapToStart, 'i') }));
  await userEvent.click(screen.getByRole('button', { name: translations[Language.NO].stop }));

  expect(screen.getByText(translations[Language.NO].tapToStart)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: translations[Language.NO].stop })).not.toBeInTheDocument();
});

test('applies the selected theme to the document element', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: translations[Language.NO].settings }));

  await userEvent.click(screen.getByRole('button', { name: 'Ocean' }));

  expect(document.documentElement.dataset.theme).toBe('ocean');
  expect(document.documentElement.dataset.appearance).toBe('dark');
});

test('Space starts the round from the splash', () => {
  render(<App />);

  fireEvent.keyDown(document.body, { key: ' ' });

  expect(screen.queryByText(translations[Language.NO].tapToStart)).not.toBeInTheDocument();
  expect(screen.getByRole('heading')).toBeInTheDocument();
});

test('Escape returns to the splash during a round', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: new RegExp(translations[Language.NO].tapToStart, 'i') }));

  fireEvent.keyDown(document.body, { key: 'Escape' });

  expect(screen.getByText(translations[Language.NO].tapToStart)).toBeInTheDocument();
});

test('Escape closes an open modal without leaving the round', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: new RegExp(translations[Language.NO].tapToStart, 'i') }));
  await userEvent.click(screen.getByRole('button', { name: translations[Language.NO].settings }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  fireEvent.keyDown(document.body, { key: 'Escape' });

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: translations[Language.NO].stop })).toBeInTheDocument();
  expect(screen.queryByText(translations[Language.NO].tapToStart)).not.toBeInTheDocument();
});

test("at time's up, shows the brand and swaps the stop button for the rules button", async () => {
  vi.useFakeTimers();
  try {
    render(<App />);

    // fireEvent (not userEvent) — userEvent deadlocks under fake timers.
    fireEvent.click(screen.getByRole('button', { name: new RegExp(translations[Language.NO].tapToStart, 'i') }));

    // Run the default 60s round down to zero. The timer reschedules itself each
    // tick, so advance one second at a time, flushing effects between ticks.
    for (let second = 0; second < 60; second++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
    }

    expect(screen.getByText(translations[Language.NO].timesUp)).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent(APP_NAME);
    expect(screen.getByRole('button', { name: translations[Language.NO].rules })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: translations[Language.NO].stop })).not.toBeInTheDocument();

    // Space restarts the round from the time's-up screen.
    fireEvent.keyDown(document.body, { key: ' ' });
    expect(screen.queryByText(translations[Language.NO].timesUp)).not.toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});
