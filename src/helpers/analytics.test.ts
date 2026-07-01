import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { trackEvent } from './analytics';

describe('trackEvent', () => {
  beforeEach(() => {
    window.dataLayer = undefined;
  });

  afterEach(() => {
    window.dataLayer = undefined;
  });

  it('initialises the dataLayer and pushes the event', () => {
    trackEvent('start_game');

    expect(window.dataLayer).toEqual([{ event: 'start_game' }]);
  });

  it('includes provided parameters', () => {
    trackEvent('start_game', { language: 'en', duration: 60, scoring: false });

    expect(window.dataLayer?.[0]).toEqual({
      event: 'start_game',
      language: 'en',
      duration: 60,
      scoring: false,
    });
  });

  it('drops undefined parameter values', () => {
    trackEvent('time_up', { scoring: false, score: undefined });

    expect(window.dataLayer?.[0]).toEqual({ event: 'time_up', scoring: false });
  });

  it('appends to an existing dataLayer without clobbering it', () => {
    window.dataLayer = [{ event: 'gtm.js' }];

    trackEvent('stop_game');

    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer?.[1]).toEqual({ event: 'stop_game' });
  });
});
