export const GA_ID = "G-TNJ9493YN4";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackPageView(path: string) {
  window.gtag?.("event", "page_view", {
    page_path: path,
  });
}

export function trackEngagement(action: string, details?: Record<string, unknown>) {
  window.gtag?.("event", action, {
    ...details,
    engagement_time_msec: 100,
  });
}
