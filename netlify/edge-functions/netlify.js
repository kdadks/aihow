// This file is used by Netlify to handle server-side redirects for SPAs
// See: https://docs.netlify.com/routing/redirects/redirect-options/

export default function handler(req, context) {
  // For non-asset paths, return the index.html
  const path = context.path;
  
  // Skip processing for assets
  if (path.startsWith('/assets/') || 
      path.includes('.') ||
      path === '/' || 
      path === '/index.html') {
    return;
  }
  
  // Return the index.html for all other paths
  return context.rewrite('/');
}
