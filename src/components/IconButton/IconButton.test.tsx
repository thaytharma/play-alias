import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders with an accessible label and calls onClick', async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Stop" side="left" onClick={onClick}>
        <svg />
      </IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Stop' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('marks the trigger as a dialog popup when hasPopup is set', () => {
    render(
      <IconButton label="Settings" side="right" hasPopup onClick={vi.fn()}>
        <svg />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
