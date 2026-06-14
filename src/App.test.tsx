import { render, screen } from '@testing-library/react';
import { beforeEach } from 'vitest';
import App from './App';
import { Language } from './types/Language';
import { translations } from './i18n/translations';

beforeEach(() => {
  localStorage.clear();
});

test('renders a language button for every supported language', () => {
  render(<App />);

  // Default language is Norwegian, so the buttons show the Norwegian names.
  const messages = translations[Language.NO];
  expect(screen.getByTitle(messages.languageNorwegian)).toBeInTheDocument();
  expect(screen.getByTitle(messages.languageEnglish)).toBeInTheDocument();
  expect(screen.getByTitle(messages.languageFrench)).toBeInTheDocument();
});
