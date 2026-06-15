import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTilt } from './useTilt';

function TiltBox() {
  const ref = useTilt<HTMLDivElement>();
  return <div ref={ref} data-testid="tilt" />;
}

describe('useTilt', () => {
  it('writes tilt CSS variables on device orientation', () => {
    render(<TiltBox />);
    const box = screen.getByTestId('tilt');

    const event = new Event('deviceorientation');
    Object.assign(event, { beta: 45, gamma: 30 });
    act(() => {
      window.dispatchEvent(event);
    });

    // gamma 30 -> rotateY 10deg; beta 45 (the neutral hold angle) -> rotateX 0deg.
    expect(box.style.getPropertyValue('--tilt-y')).toBe('10.00deg');
    expect(box.style.getPropertyValue('--tilt-x')).toBe('0.00deg');
  });
});
