// Google Analytics tracking integration utility

// Declare global types for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let activeMeasurementId: string | null = null;

/**
 * Initializes Google Analytics dynamically if a Measurement ID is provided.
 * Supports updating dynamically if the user updates the ID in the CMS console.
 * @param gaId The Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)
 */
export function initGA(gaId?: string) {
  const measurementId = gaId || import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId || measurementId.trim() === '') {
    // If analytics ID was removed or not set, clean up or skip
    return;
  }

  // If already initialized for this exact ID, do not duplicate
  if (activeMeasurementId === measurementId && document.getElementById('gtag-js')) {
    return;
  }

  // Clean up existing script if we are switching IDs
  const existingScript = document.getElementById('gtag-js');
  if (existingScript) {
    existingScript.remove();
  }

  // Store active ID
  activeMeasurementId = measurementId;

  // Insert gtag script
  const script = document.createElement('script');
  script.id = 'gtag-js';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Configure Google Tag
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
    send_page_view: true,
    // Enable enhanced link attribution
    link_attribution: true,
  });

  console.log(`[Google Analytics] Dynamic Node initialized with ID: ${measurementId}`);
}

/**
 * Tracks a manual page view.
 * @param url The page path to track
 */
export function trackPageView(url: string) {
  if (activeMeasurementId && window.gtag) {
    window.gtag('config', activeMeasurementId, {
      page_path: url,
    });
  }
}

interface EventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Tracks a custom event.
 */
export function trackEvent({ action, category, label, value, ...rest }: EventParams) {
  if (activeMeasurementId && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }
}
