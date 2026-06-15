import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OptionGroup from './OptionGroup';

const options = [
  { value: 'no', label: 'Norsk' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

describe('OptionGroup', () => {
  it('renders a button for each option under the group label', () => {
    render(<OptionGroup label="Language" options={options} value="no" onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();
    options.forEach((option) => {
      expect(screen.getByRole('button', { name: option.label })).toBeInTheDocument();
    });
  });

  it('marks the active option as pressed', () => {
    render(<OptionGroup label="Language" options={options} value="en" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Norsk' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the picked value', async () => {
    const onChange = vi.fn();
    render(<OptionGroup label="Language" options={options} value="no" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Français' }));

    expect(onChange).toHaveBeenCalledWith('fr');
  });

  it('supports numeric option values', async () => {
    const onChange = vi.fn();
    render(
      <OptionGroup
        label="Timer"
        options={[
          { value: 60, label: '60s' },
          { value: 90, label: '90s' },
        ]}
        value={60}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '90s' }));

    expect(onChange).toHaveBeenCalledWith(90);
  });
});
