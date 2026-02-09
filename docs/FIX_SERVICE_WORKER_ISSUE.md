# Fix Service Worker and Module Loading Issues

## Problem

Your browser has a cached service worker that's interfering with the development server, causing:
- Failed to fetch errors for modules
- WebSocket connection failures
- Module loading failures for UserDashboard.tsx

## Solution

### Step 1: Unregister Service Worker

**Option A: Using Browser DevTools (Recommended)**

1. Open your browser (Chrome/Edge)
2. Press `F12` or `Cmd+Option+I` (Mac) to open DevTools
3. Go to the **Application** tab (or **Storage** in Firefox)
4. In the left sidebar, find **Service Workers**
5. You'll see a service worker for `localhost:5173`
6. Click **Unregister** next to it
7. Refresh the page

**Option B: Using JavaScript Console**

1. Open DevTools (F12)
2. Go to the **Console** tab
3. Paste this code and press Enter:

```javascript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('Unregistered:', registration.scope);
  }
  console.log('All service workers unregistered. Please refresh the page.');
});
```

4. Refresh the page

### Step 2: Clear Browser Cache

**Chrome/Edge:**
1. Press `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
2. Select "Cached images and files"
3. Choose "All time"
4. Click "Clear data"

**Or use DevTools:**
1. Open DevTools (F12)
2. Right-click the refresh button (with DevTools open)
3. Select "Empty Cache and Hard Reload"

### Step 3: Clear Application Storage

1. Open DevTools (F12)
2. Go to **Application** tab
3. In the left sidebar, find **Storage**
4. Click "Clear site data"
5. Confirm

### Step 4: Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 5: Open in Incognito/Private Window (Alternative)

If the above doesn't work, try opening the app in an incognito/private window:
- Chrome: `Cmd+Shift+N` (Mac) or `Ctrl+Shift+N` (Windows)
- Firefox: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)

Then navigate to `http://localhost:5173`

## Prevention

To prevent this issue in the future, you can add a script to unregister service workers in development mode.

### Option: Add Service Worker Unregister Script

Create a file `public/unregister-sw.js`:

```javascript
// Unregister any service workers in development
if ('serviceWorker' in navigator && window.location.hostname === 'localhost') {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}
```

Then add it to your `index.html` before the main script:

```html
<script src="/unregister-sw.js"></script>
<script type="module" src="/src/main.tsx"></script>
```

## Why This Happens

Service workers are powerful caching mechanisms that:
- Cache resources for offline use
- Intercept network requests
- Can persist even after code changes

When developing locally, an old service worker can:
- Serve stale cached files
- Block new module requests
- Cause "Failed to fetch" errors

## After Fixing

Once you've completed these steps:

1. ✅ Service worker should be unregistered
2. ✅ Cache should be cleared
3. ✅ Dev server should reload fresh files
4. ✅ UserDashboard.tsx should load correctly
5. ✅ No more WebSocket errors

## Still Having Issues?

If you're still seeing errors:

1. **Check if dev server is running:**
   ```bash
   npm run dev
   ```

2. **Check the port:**
   - Make sure nothing else is using port 5173
   - Try changing the port in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     server: {
       port: 5174  // Use a different port
     }
   })
   ```

3. **Check for module errors:**
   - Look in the browser console for specific module import errors
   - Check if all imported files exist

4. **Restart your computer:**
   - Sometimes a full restart clears persistent issues

## Quick Command Reference

```bash
# Restart dev server
npm run dev

# Build the project (to check for errors)
npm run build

# Preview the production build
npm run preview
```
