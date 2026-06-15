import { render, screen } from '@testing-library/react';
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
