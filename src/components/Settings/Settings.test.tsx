import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Settings from './Settings';

describe('Settings', () => {
  it('renders a button for each duration option', () => {
    render(<Settings duration={60} onChangeDuration={vi.fn()} />);

    expect(screen.getByRole('button', { name: '60s' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '90s' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '120s' })).toBeInTheDocument();
  });

  it('marks the active duration as pressed', () => {
    render(<Settings duration={120} onChangeDuration={vi.fn()} />);

    expect(screen.getByRole('button', { name: '120s' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '60s' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChangeDuration with the picked value', async () => {
    const onChangeDuration = vi.fn();
    render(<Settings duration={60} onChangeDuration={onChangeDuration} />);

    await userEvent.click(screen.getByRole('button', { name: '120s' }));

    expect(onChangeDuration).toHaveBeenCalledWith(120);
  });
});
