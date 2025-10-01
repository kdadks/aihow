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
  // If website is provided, try to extract domain for Clearbit
  if (website) {
    try {
      const url = new URL(website);
      const domain = url.hostname.replace('www.', '');
      // Use Clearbit's logo API (free, no auth required)
      return `https://logo.clearbit.com/${domain}`;
    } catch (e) {
      // If URL parsing fails, fall through to fallback
    }
  }

  // Fallback to UI Avatars with tool name initials
  const initials = toolName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3B82F6&color=fff&size=128&bold=true`;
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
