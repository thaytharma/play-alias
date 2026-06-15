import { useEffect, useRef } from 'react';

type OrientationCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

/**
 * 3D tilt: follows the mouse while hovering (desktop) and the device's
 * orientation (mobile), writing `--tilt-x` / `--tilt-y` (in degrees) onto the
 * element so CSS can apply a perspective rotation. Returns a ref to attach.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const clamp = (value: number) => Math.max(-maxDeg, Math.min(maxDeg, value));
    const setTilt = (rx: number, ry: number) => {
      el.style.setProperty('--tilt-x', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${ry.toFixed(2)}deg`);
    };
    const reset = () => setTilt(0, 0);

    const handlePointerMove = (event: PointerEvent) => {
      // Touch devices tilt via orientation instead.
      if (event.pointerType !== 'mouse') {
        return;
      }
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt(clamp(-py * 2 * maxDeg), clamp(px * 2 * maxDeg));
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) {
        return;
      }
      // gamma = left/right tilt; beta = front/back, offset by a typical holding angle.
      setTilt(clamp(-(beta - 45) / 3), clamp(gamma / 3));
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', reset);

    const orientation = window.DeviceOrientationEvent as OrientationCtor | undefined;
    const enableOrientation = () => window.addEventListener('deviceorientation', handleOrientation);

    // iOS 13+ requires motion access to be granted from a user gesture.
    const requestPermission = () => {
      window.removeEventListener('pointerdown', requestPermission);
      orientation
        ?.requestPermission?.()
        .then((state) => {
          if (state === 'granted') {
            enableOrientation();
          }
        })
        .catch(() => {});
    };

    if (typeof orientation?.requestPermission === 'function') {
      window.addEventListener('pointerdown', requestPermission);
    } else {
      enableOrientation();
    }

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', reset);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('pointerdown', requestPermission);
    };
  }, [maxDeg]);

  return ref;
}
