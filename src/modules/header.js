import { getSettings, subscribeSettings } from './settings.js';
import { getLocation } from './location.js';

const timeFormatter = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
 * Mounts the fixed header: logo, greeting, live clock, date and location.
 */
export function mountHeader() {
  const timeNode = document.getElementById('header-time');
  const dateNode = document.getElementById('header-date');
  const placeNode = document.getElementById('header-place');
  const greetingNode = document.getElementById('header-greeting');
  if (!timeNode || !dateNode || !placeNode || !greetingNode) return;

  const tick = () => {
    const now = new Date();
    timeNode.textContent = timeFormatter.format(now);
    timeNode.dateTime = now.toISOString();
    dateNode.textContent = capitalize(dateFormatter.format(now));
    greetingNode.textContent = buildGreeting(getSettings().name, now);
  };

  tick();
  window.setInterval(tick, 1000);

  subscribeSettings(() => {
    tick();
    placeNode.textContent = 'Buscando ubicación…';
    loadPlace(placeNode);
  });

  loadPlace(placeNode);
}

/**
 * @param {HTMLElement} node
 */
function loadPlace(node) {
  getLocation()
    .then((place) => {
      node.textContent = place.name;
    })
    .catch(() => {
      node.textContent = 'Ubicación no disponible';
    });
}

/**
 * @param {string} name
 * @param {Date} now
 */
function buildGreeting(name, now) {
  const hour = now.getHours();
  const salutation = hour < 6 ? 'Buenas noches' : hour < 13 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  const trimmed = name.trim();
  return trimmed ? `${salutation}, ${trimmed}` : salutation;
}

/**
 * @param {string} value
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
