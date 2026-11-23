const NAMESPACE = "deskpro:v1:";
const listeners = new Map();

/**
 * Reads a value from localStorage under the DeskPRO namespace.
 * @param {string} key
 * @param {*} fallback
 */
export function read(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(NAMESPACE + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Writes a value to localStorage and notifies subscribers.
 * @param {string} key
 * @param {*} value
 */
export function write(key, value) {
  try {
    window.localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode): state stays in memory for this session.
  }
  emit(key, value);
}

/**
 * Reads, mutates and writes a value in one step.
 * @param {string} key
 * @param {*} fallback
 * @param {(current: *) => *} mutator
 */
export function update(key, fallback, mutator) {
  const next = mutator(read(key, fallback));
  write(key, next);
  return next;
}

/**
 * Subscribes to changes of a key.
 * @param {string} key
 * @param {(value: *) => void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribe(key, listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(listener);
  return () => {
    const bucket = listeners.get(key);
    if (!bucket) return;
    bucket.delete(listener);
    if (bucket.size === 0) listeners.delete(key);
  };
}

/**
 * @param {string} key
 * @param {*} value
 */
function emit(key, value) {
  const bucket = listeners.get(key);
  if (!bucket) return;
  for (const listener of Array.from(bucket)) {
    try {
      listener(value);
    } catch (error) {
      console.error("DeskPRO store listener failed", error);
    }
  }
}

const TOAST_DURATION = 3000;
const TOAST_FADE = 240;

let showTimer = null;
let hideTimer = null;

/**
 * Simple transient notifications for the live region: they fade in, stay for a
 * few seconds and then hide themselves instead of lingering on screen.
 * @param {string} message
 */
export function announce(message) {
  const region = document.getElementById("toast-region");
  if (!region) return;

  window.clearTimeout(showTimer);
  window.clearTimeout(hideTimer);
  region.classList.remove("is-leaving");
  region.textContent = "";

  showTimer = window.setTimeout(() => {
    region.textContent = message;

    hideTimer = window.setTimeout(() => {
      region.classList.add("is-leaving");

      hideTimer = window.setTimeout(() => {
        region.classList.remove("is-leaving");
        region.textContent = "";
      }, TOAST_FADE);
    }, TOAST_DURATION);
  }, 40);
}
