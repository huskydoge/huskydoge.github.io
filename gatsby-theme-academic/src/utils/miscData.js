// Centralized loader for Misc content JSON files
// Keeps data shape consistent and provides light normalization

// Use static JSON imports so Gatsby/Webpack resolve paths at build-time
import photosJson from '../data/misc/photos.json';
import cooksJson from '../data/misc/cooks.json';
import animationsJson from '../data/misc/animations.json';

export function normalizeItems(items) {
  return (items || []).map((it) => ({
    title: it.title || '',
    image: it.image,
    type: it.type,
    src: it.src,
    ratio: it.ratio || '16x9',
    tags: Array.isArray(it.tags) ? it.tags : [],
    description: it.description || '',
    date: it.date || undefined,
  }));
}

export function getMiscData() {
  const photos = normalizeItems(photosJson || []);
  const cooks = normalizeItems(cooksJson || []);
  const animations = normalizeItems(animationsJson || []);
  return { photos, cooks, animations };
}


