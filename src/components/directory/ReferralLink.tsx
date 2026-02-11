import React, { useCallback, MouseEvent } from 'react';
import { useTrackReferral } from '../../hooks/useTrackReferral';

export interface ReferralLinkProps {
  toolId: string;
  toolUrl: string;
  referralSource?: string;
  children: React.ReactNode;
  className?: string;
  openInNewTab?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * ReferralLink Component
 *
 * Wraps external tool links to track referrals before navigating
 * Tracks clicks and provides analytics data for admin dashboard
 *
 * @example
 * <ReferralLink
 *   toolId={tool.id}
 *   toolUrl={tool.website_url}
 *   referralSource="tool_card"
 *   openInNewTab
 * >
 *   Visit Site
 * </ReferralLink>
 */
export const ReferralLink: React.FC<ReferralLinkProps> = ({
  toolId,
  toolUrl,
  referralSource = 'direct',
  children,
  className = '',
  openInNewTab = true,
  onClick,
}) => {
  const { trackReferral } = useTrackReferral();

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLAnchorElement>) => {
      // Call custom onClick if provided
      if (onClick) {
        onClick(e);
      }

      // Track the referral asynchronously (don't block navigation)
      // This happens in the background and won't delay the user
      trackReferral(toolId, referralSource).catch((error) => {
        // Log error but don't block navigation
        console.error('Failed to track referral:', error);
      });

      // Navigation will happen naturally via the href
      // No need to prevent default or manually navigate
    },
    [toolId, referralSource, trackReferral, onClick]
  );

  return (
    <a
      href={toolUrl}
      className={className}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default ReferralLink;
