let apiPromise = null;

/**
 * Loads the YouTube IFrame Player API once, on demand.
 * @returns {Promise<typeof window.YT>}
 */
export function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') previousCallback();
      resolve(window.YT);
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('No se pudo cargar la API de YouTube'));
    };
    document.head.appendChild(script);

    window.setTimeout(() => {
      if (window.YT && window.YT.Player) resolve(window.YT);
      else {
        apiPromise = null;
        reject(new Error('La API de YouTube tardó demasiado en responder'));
      }
    }, 15000);
  });

  return apiPromise;
}

/**
 * Extracts a video id from a YouTube URL, a short link, a shorts link or a raw id.
 * @param {string} input
 * @returns {string|null}
 */
export function parseVideoId(input) {
  const value = String(input || '').trim();
  if (!value) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  let url;
  try {
    url = new URL(value.startsWith('http') ? value : `https://${value}`);
  } catch (error) {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') return normalizeId(url.pathname.slice(1));
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    const fromQuery = url.searchParams.get('v');
    if (fromQuery) return normalizeId(fromQuery);
    const segments = url.pathname.split('/').filter(Boolean);
    const marker = segments.findIndex((segment) => ['embed', 'shorts', 'live', 'v'].includes(segment));
    if (marker >= 0 && segments[marker + 1]) return normalizeId(segments[marker + 1]);
  }

  return null;
}

/**
 * Best effort title lookup through the public oEmbed endpoint (no API key).
 * @param {string} videoId
 * @returns {Promise<string|null>}
 */
export function fetchVideoTitle(videoId) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`
  )}&format=json`;

  return fetch(endpoint)
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => (data && typeof data.title === 'string' ? data.title : null))
    .catch(() => null);
}

/**
 * @param {string} value
 */
function normalizeId(value) {
  const id = String(value).split(/[?&#]/)[0];
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}
