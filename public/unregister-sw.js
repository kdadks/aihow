// Unregister any service workers in development
// This prevents cached service workers from interfering with development
if ('serviceWorker' in navigator && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister().then(function(success) {
        if (success) {
          console.log('[Dev] Service worker unregistered:', registration.scope);
        }
      });
    }
  }).catch(function(err) {
    console.log('[Dev] Service worker unregistration failed:', err);
  });
}
