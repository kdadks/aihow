import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Utility to detect device type
 */
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Utility to detect browser
 */
function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Internet';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'IE';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
}

/**
 * Utility to detect OS
 */
function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('X11')) return 'UNIX';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown';
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  const SESSION_KEY = 'aihow_analytics_session';
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Parse UTM parameters from URL
 */
function getUTMParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };
}

export interface UsePageAnalyticsOptions {
  enabled?: boolean;
  trackPageTitle?: boolean;
}

/**
 * Hook to automatically track page visits and analytics
 *
 * @example
 * // In your App component or layout
 * usePageAnalytics();
 *
 * @example
 * // With options
 * usePageAnalytics({ enabled: true, trackPageTitle: true });
 */
export function usePageAnalytics(options: UsePageAnalyticsOptions = {}) {
  const { enabled = true, trackPageTitle = true } = options;
  const location = useLocation();
  const pageLoadTime = useRef<number>(Date.now());
  const previousPath = useRef<string>('');

  const trackPageView = useCallback(async () => {
    if (!enabled) return;

    // Don't track localhost or development environments
    const isLocalhost = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('192.168.');

    if (isLocalhost) {
      console.log('[Analytics] Skipping tracking on localhost');
      return;
    }

    try {
      const sessionId = getSessionId();
      const deviceType = getDeviceType();
      const browser = getBrowser();
      const os = getOS();
      const userAgent = navigator.userAgent;
      const referrer = document.referrer || undefined;
      const utmParams = getUTMParams(location.search);

      // Get page title if tracking is enabled
      const pageTitle = trackPageTitle ? document.title : undefined;

      // Calculate time on previous page if exists
      if (previousPath.current) {
        const timeOnPage = Math.floor((Date.now() - pageLoadTime.current) / 1000);

        // Update the previous page visit with time spent (could be done via API)
        // For now, we'll skip this as it requires additional infrastructure
      }

      // Track the new page visit
      const { error } = await supabase.rpc('track_page_visit', {
        p_session_id: sessionId,
        p_page_path: location.pathname,
        p_page_title: pageTitle,
        p_referrer: referrer,
        p_utm_source: utmParams.utm_source,
        p_utm_medium: utmParams.utm_medium,
        p_utm_campaign: utmParams.utm_campaign,
        p_utm_term: utmParams.utm_term,
        p_utm_content: utmParams.utm_content,
        p_device_type: deviceType,
        p_browser: browser,
        p_os: os,
        p_user_agent: userAgent,
      });

      if (error) {
        console.error('Error tracking page visit:', error);
      }

      // Update references for next page
      previousPath.current = location.pathname;
      pageLoadTime.current = Date.now();
    } catch (error) {
      console.error('Error in page analytics tracking:', error);
    }
  }, [enabled, location.pathname, location.search, trackPageTitle]);

  // Track page view on mount and route changes
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  // Track page unload (for time on page)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (previousPath.current && enabled) {
        const timeOnPage = Math.floor((Date.now() - pageLoadTime.current) / 1000);

        // Send beacon to track time on page (doesn't block page unload)
        if ('sendBeacon' in navigator && timeOnPage > 0) {
          // This would require a dedicated endpoint
          // For now, we'll skip this feature
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);

  return {
    trackPageView,
  };
}
