import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { TrackReferralParams, DeviceType } from '../types/referral.types';

/**
 * Utility function to detect device type from user agent
 */
function getDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }

  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Utility function to get or create session ID
 */
function getSessionId(): string {
  const SESSION_KEY = 'aihow_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export interface UseTrackReferralReturn {
  trackReferral: (toolId: string, referralSource?: string) => Promise<string | null>;
  isTracking: boolean;
  error: Error | null;
}

/**
 * Hook for tracking tool referrals
 *
 * @example
 * const { trackReferral, isTracking } = useTrackReferral();
 *
 * // Track a referral when user clicks on tool
 * await trackReferral(toolId, 'search_results');
 */
export function useTrackReferral(): UseTrackReferralReturn {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const trackReferral = useCallback(async (
    toolId: string,
    referralSource: string = 'direct'
  ): Promise<string | null> => {
    setIsTracking(true);
    setError(null);

    // Don't track localhost or development environments
    const isLocalhost = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('192.168.');

    if (isLocalhost) {
      console.log('[Referral Tracking] Skipping tracking on localhost');
      setIsTracking(false);
      return null;
    }

    try {
      // Get user agent and device type
      const userAgent = navigator.userAgent;
      const deviceType = getDeviceType(userAgent);
      const sessionId = getSessionId();

      // Prepare tracking parameters
      const params: Partial<TrackReferralParams> = {
        tool_id: toolId,
        referral_source: referralSource,
        user_agent: userAgent,
        session_id: sessionId,
        device_type: deviceType,
      };

      // Call the Supabase RPC function to track the referral
      const { data, error: rpcError } = await supabase.rpc('track_tool_referral', {
        p_tool_id: params.tool_id,
        p_referral_source: params.referral_source,
        p_user_agent: params.user_agent,
        p_session_id: params.session_id,
        p_device_type: params.device_type,
        p_ip_address: null, // IP will be captured server-side
        p_country_code: null, // Can be enhanced with geolocation API
      });

      if (rpcError) {
        console.error('Error tracking referral:', rpcError);
        throw new Error(rpcError.message);
      }

      return data as string;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to track referral');
      setError(errorObj);
      console.error('Error tracking referral:', err);
      return null;
    } finally {
      setIsTracking(false);
    }
  }, []);

  return {
    trackReferral,
    isTracking,
    error,
  };
}
