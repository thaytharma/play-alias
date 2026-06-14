import { render, screen } from '@testing-library/react';
import App from './App';
import { Language } from './types/Language';

test('renders a language button for every supported language', () => {
  render(<App />);

  expect(screen.getByTitle(Language.EN)).toBeInTheDocument();
  expect(screen.getByTitle(Language.NO)).toBeInTheDocument();
  expect(screen.getByTitle(Language.FR)).toBeInTheDocument();
});
