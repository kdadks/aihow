// This file is used by Netlify to handle server-side redirects for SPAs
// See: https://docs.netlify.com/routing/redirects/redirect-options/
// 
// IMPORTANT: If this edge function causes errors, the spa-fallback.js edge function
// will be used as a fallback, and if that also fails, the [[redirects]] rule in netlify.toml
// will handle the SPA routes.

export default async function handler(request, context) {
  // For non-asset paths, return the index.html
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip processing for assets and existing files
  if (path.startsWith('/assets/') || 
      path.includes('.') ||
      path === '/' || 
      path === '/index.html') {
    return; // Let the default handling work
  }
  
  // Return the index.html for all other paths (SPA routes)
  return await context.next({
    path: '/index.html',
  });
}
