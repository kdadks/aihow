// Simple fallback edge function for Netlify
// This handles Single Page Application routing by returning index.html for all routes
// except for those that point to static assets

export default async function handler(request) {
  // Parse the URL
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip if it's a file request (has a file extension or is in the assets directory)
  if (
    pathname.includes('.') || // Has file extension
    pathname.startsWith('/assets/') || // Is in assets directory
    pathname === '/' || // Is root path
    pathname === '/index.html' // Is explicit index.html
  ) {
    // Allow the request to continue to the static file or default handling
    return;
  }

  // For all other paths (SPA routes), return index.html
  return new Response(
    // We'll let Netlify handle finding and returning the index.html content
    null,
    {
      status: 200,
      headers: {
        'x-middleware-rewrite': '/index.html'
      }
    }
  );
}
