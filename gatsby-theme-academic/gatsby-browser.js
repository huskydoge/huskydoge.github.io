import {
  wrapPageElement as _wrapPageElement,
} from './src/utils/providers';

/** Clear stale local service workers that can serve mismatched dev bundles. */
export const onClientEntry = () => {
  const isLocalPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  if (process.env.NODE_ENV !== 'development' && !isLocalPreview) {
    return;
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()))
      .catch(() => {});
  }

  if ('caches' in window) {
    window.caches.keys()
      .then((keys) => keys.forEach((key) => window.caches.delete(key)))
      .catch(() => {});
  }
};

export const wrapPageElement = _wrapPageElement;
