import { getSettings } from './settings.js';

const REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

let locationPromise = null;
const geocodeCache = new Map();
const reverseCache = new Map();

/**
 * Resolves the user location: browser geolocation first, configured city as fallback.
 * The result is resolved only once per session.
 * @returns {Promise<{name: string, latitude: number, longitude: number, source: 'gps'|'city'}>}
 */
export function getLocation() {
  if (locationPromise) return locationPromise;

  locationPromise = new Promise((resolve) => {
    const fallbackToCity = () => {
      const city = getSettings().defaultCity;
      resolveCity(city).then(resolve);
    };

    if (!('geolocation' in navigator)) {
      fallbackToCity();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude)
          .then((name) => resolve({ name, latitude, longitude, source: 'gps' }))
          .catch(() => resolve({ name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, latitude, longitude, source: 'gps' }));
      },
      fallbackToCity,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  });

  return locationPromise;
}

/**
 * Resolves a place name into coordinates using the Open-Meteo geocoder.
 * @param {string} city
 * @returns {Promise<{name: string, latitude: number, longitude: number, source: 'city'}>}
 */
export function resolveCity(city) {
  const query = String(city || '').trim();
  const cacheKey = query.toLowerCase();

  if (geocodeCache.has(cacheKey)) return Promise.resolve(geocodeCache.get(cacheKey));

  return fetch(`${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=1&language=es&format=json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const place = data.results && data.results[0];
      if (!place) throw new Error('Place not found');

      const resolved = {
        name: place.name || query,
        latitude: place.latitude,
        longitude: place.longitude,
        source: 'city',
      };
      geocodeCache.set(cacheKey, resolved);
      return resolved;
    })
    .catch(() => {
      const fallback = { name: query, latitude: null, longitude: null, source: 'city' };
      geocodeCache.set(cacheKey, fallback);
      return fallback;
    });
}

/**
 * Reverse geocodes coordinates into a readable place name (OpenStreetMap Nominatim).
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>}
 */
export function reverseGeocode(latitude, longitude) {
  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  if (reverseCache.has(cacheKey)) return Promise.resolve(reverseCache.get(cacheKey));

  const url = `${REVERSE_URL}?format=jsonv2&zoom=10&lat=${latitude}&lon=${longitude}&accept-language=es`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Nominatim failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const address = (data && data.address) || {};
      const name =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        address.state ||
        (data && data.name) ||
        '';
      const country = address.country || '';
      const label = [name, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      reverseCache.set(cacheKey, label);
      return label;
    })
    .catch(() => {
      const label = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      reverseCache.set(cacheKey, label);
      return label;
    });
}
