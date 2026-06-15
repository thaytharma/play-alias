import { describe, expect, it } from 'vitest';
import { playTick, playTimeUp, playWordChange, unlockAudio } from './sound';

// jsdom has no Web Audio API, so these should be safe no-ops rather than throw.
describe('sound', () => {
  it('does not throw when the Web Audio API is unavailable', () => {
    expect(() => unlockAudio()).not.toThrow();
    for (const level of ['off', 'low', 'high'] as const) {
      expect(() => playTick(level)).not.toThrow();
      expect(() => playWordChange(level)).not.toThrow();
      expect(() => playTimeUp(level)).not.toThrow();
    }
  });
});
