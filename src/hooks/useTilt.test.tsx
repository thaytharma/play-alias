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

  it('tilts toward the pointer on hover', () => {
    render(<TiltBox />);
    const box = screen.getByTestId('tilt');
    box.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;

    const event = new Event('pointermove', { bubbles: true });
    // Top-right corner: px = +0.5 -> rotateY +12deg; py = -0.5 -> rotateX +12deg.
    Object.assign(event, { pointerType: 'mouse', clientX: 100, clientY: 0 });
    act(() => {
      box.dispatchEvent(event);
    });

    expect(box.style.getPropertyValue('--tilt-y')).toBe('12.00deg');
    expect(box.style.getPropertyValue('--tilt-x')).toBe('12.00deg');
  });

  it('resets the tilt when the pointer leaves', () => {
    render(<TiltBox />);
    const box = screen.getByTestId('tilt');
    box.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;

    const move = new Event('pointermove', { bubbles: true });
    Object.assign(move, { pointerType: 'mouse', clientX: 100, clientY: 0 });
    act(() => {
      box.dispatchEvent(move);
    });
    act(() => {
      box.dispatchEvent(new Event('pointerleave'));
    });

    expect(box.style.getPropertyValue('--tilt-x')).toBe('0.00deg');
    expect(box.style.getPropertyValue('--tilt-y')).toBe('0.00deg');
  });
});
