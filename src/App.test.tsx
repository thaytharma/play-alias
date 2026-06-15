import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach } from 'vitest';
import App from './App';
import { Language } from './types/Language';
import { translations } from './i18n/translations';

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

test('stopping returns to the splash', async () => {
  render(<App />);

  await userEvent.click(screen.getByRole('button', { name: new RegExp(translations[Language.NO].tapToStart, 'i') }));
  await userEvent.click(screen.getByRole('button', { name: translations[Language.NO].stop }));

  expect(screen.getByText(translations[Language.NO].tapToStart)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: translations[Language.NO].stop })).not.toBeInTheDocument();
});
