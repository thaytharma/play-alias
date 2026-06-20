/** Brand name shown on the splash and when a round's time is up. Intentionally
 * not translated so it always reads as the app's name. */
export const APP_NAME = 'Play Alias!';

/** Where the "Request a feature" link sends mail. */
export const FEEDBACK_EMAIL = 'thayanan@tharmapalan.com';
export const FEEDBACK_SUBJECT = 'Feature request: Alias';

/** A `mailto:` URL pre-filled with the feedback address and subject. */
export const FEEDBACK_MAILTO = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(FEEDBACK_SUBJECT)}`;
