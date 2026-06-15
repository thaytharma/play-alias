import { describe, expect, it } from 'vitest';
import { playTick, unlockAudio } from './sound';

// jsdom has no Web Audio API, so these should be safe no-ops rather than throw.
describe('sound', () => {
  it('does not throw when the Web Audio API is unavailable', () => {
    expect(() => unlockAudio()).not.toThrow();
    expect(() => playTick('off')).not.toThrow();
    expect(() => playTick('low')).not.toThrow();
    expect(() => playTick('high')).not.toThrow();
  });
});
