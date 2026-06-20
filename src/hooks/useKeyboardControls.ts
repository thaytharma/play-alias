import { useEffect, useRef } from 'react';

export interface KeyboardControls {
  /** Whether a round is in progress. */
  started: boolean;
  /** Whether scoring mode is on. */
  scoring: boolean;
  /** Whether the round's time is up (drives Space = restart vs. correct). */
  isTimeUp: boolean;
  /** Start a round (Space/Enter from the splash). */
  onStart: () => void;
  /** Stop the round (Escape). */
  onStop: () => void;
  /** Draw the next word — and, at time's-up, restart the round. */
  onAdvance: () => void;
  /** Mark the current word correct (scoring mode, Space). */
  onCorrect: () => void;
  /** Skip the current word (scoring mode, ←). */
  onSkip: () => void;
}

const ACTIVATION_KEYS = new Set([' ', 'Spacebar', 'Enter']);

/**
 * Global keyboard controls for non-touch play. Space/Enter is the primary
 * action (start the round, then draw the next word or mark it correct in
 * scoring mode); ← skips; Escape backs out one level. An open dialog or a
 * focused control is left to handle keys natively.
 *
 * The handler reads the latest controls through a ref so the listener is
 * attached once rather than re-subscribing on every state change.
 */
export function useKeyboardControls(controls: KeyboardControls): void {
  const ref = useRef(controls);
  ref.current = controls;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { started, scoring, isTimeUp, onStart, onStop, onAdvance, onCorrect, onSkip } = ref.current;
      const dialogOpen = !!document.querySelector('[role="dialog"]');

      if (event.key === 'Escape') {
        // An open modal handles its own Escape; otherwise stop the round.
        if (!dialogOpen && started) {
          onStop();
        }
        return;
      }

      // Scoring mode: ← skips the current word during a live round.
      if (event.key === 'ArrowLeft') {
        if (!dialogOpen && started && scoring && !isTimeUp && !event.repeat) {
          event.preventDefault();
          onSkip();
        }
        return;
      }

      if (ACTIVATION_KEYS.has(event.key)) {
        const focused = document.activeElement;
        const focusedControl = !!focused && ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(focused.tagName);
        // Let an open dialog or a focused control handle the key natively.
        if (dialogOpen || focusedControl || event.repeat) {
          return;
        }
        event.preventDefault();
        if (!started) {
          onStart();
        } else if (scoring && !isTimeUp) {
          // Space marks the word correct (+1); otherwise it just draws the next.
          onCorrect();
        } else {
          onAdvance();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
