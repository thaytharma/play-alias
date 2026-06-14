import { describe, expect, it } from 'vitest';
import { isTimeRunningOut } from './timer';

describe('isTimeRunningOut', () => {
  it('is true within the final 10 seconds', () => {
    expect(isTimeRunningOut(10)).toBe(true);
    expect(isTimeRunningOut(1)).toBe(true);
  });

  it('is false above the threshold', () => {
    expect(isTimeRunningOut(11)).toBe(false);
    expect(isTimeRunningOut(60)).toBe(false);
  });

  it('is false once time is up', () => {
    expect(isTimeRunningOut(0)).toBe(false);
    expect(isTimeRunningOut(-5)).toBe(false);
  });

  it('respects a custom threshold', () => {
    expect(isTimeRunningOut(15, 20)).toBe(true);
    expect(isTimeRunningOut(15, 10)).toBe(false);
  });
});
