/**
 * Utility functions for generating tool logos
 */

/**
 * Generate a logo URL for a tool using Clearbit's logo API
 * Falls back to UI Avatars if Clearbit fails
 * @param toolName - Name of the tool
 * @param website - Website URL of the tool
 * @returns URL to the tool's logo
 */
export const getToolLogo = (toolName: string, website?: string): string => {
  // Prefer UI Avatars for consistency and to avoid Clearbit API errors
  // Clearbit often fails for non-standard domains
  const initials = toolName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Use a gradient background for better visual appeal
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=128&bold=true&rounded=true`;
};

/**
 * Handle logo loading errors by providing a fallback
 * @param toolName - Name of the tool
 * @returns Fallback logo URL
 */
export const getLogoFallback = (toolName: string): string => {
  const initials = toolName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366F1&color=fff&size=128&bold=true`;
};
