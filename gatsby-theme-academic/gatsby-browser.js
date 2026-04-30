import {
  wrapPageElement as _wrapPageElement,
} from './src/utils/providers';

/** Clear stale local service workers that can serve mismatched dev bundles. */
export const onClientEntry = () => {
  const isLocalPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  if (process.env.NODE_ENV !== 'development' && !isLocalPreview) {
    return;
  }

  const reloadAfterCleanup = () => {
    const cleanupKey = 'local-service-worker-cleaned';
    if (!navigator.serviceWorker?.controller || window.sessionStorage.getItem(cleanupKey) === 'true') {
      return;
    }
    window.sessionStorage.setItem(cleanupKey, 'true');
    window.location.reload();
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .then(reloadAfterCleanup)
      .catch(() => {});
  }

  if ('caches' in window) {
    window.caches.keys()
      .then((keys) => keys.forEach((key) => window.caches.delete(key)))
      .catch(() => {});
  }
};

export const wrapPageElement = _wrapPageElement;
