// This file is used by Netlify to handle server-side redirects for SPAs
// See: https://docs.netlify.com/routing/redirects/redirect-options/
//
// IMPORTANT: If this edge function causes errors, the [[redirects]] rule in netlify.toml
// will handle the SPA routes as a fallback.

export default async function handler(request) {
  // Parse the URL to get the path
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip processing for assets and existing files
  if (path.startsWith('/assets/') || 
      path.includes('.') ||
      path === '/' || 
      path === '/index.html') {
    // Let the default handling work
    return;
  }
  
  // For SPA routes, redirect to index.html
  // Using Response directly rather than context methods which may vary
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'X-Redirected-By': 'Netlify Edge Function',
      'Location': '/index.html'
    }
  });
}
