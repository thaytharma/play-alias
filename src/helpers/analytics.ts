// Analytics via Google Tag Manager (container GTM-KTCKPCR, bootstrapped in
// index.html) — the same setup as tharmapalan.com, so events land in the same
// GA4 property/dashboard.
//
// Events are pushed onto the GTM dataLayer. Page views are handled by the
// container's Google tag automatically; the custom events below need a matching
// "Custom Event" trigger + GA4 event tag in the GTM container to surface in GA4.

interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/**
 * Push a named event (with optional parameters) onto the GTM dataLayer.
 * Undefined parameter values are dropped so GA4 params stay clean, and the call
 * is a no-op outside the browser (e.g. during tests without a window).
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];

  const payload: DataLayerEvent = { event };
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      payload[key] = value;
    }
  }

  window.dataLayer.push(payload);
}
