/**
 * Small DOM helpers shared by every application.
 */

/**
 * @param {string} name sprite symbol id
 * @param {{size?: number, className?: string}} [options]
 */
export function icon(name, options = {}) {
  const size = options.size || 18;
  const className = options.className ? ` ${options.className}` : '';
  // Inline sizing wins over the .icon default declared in global.css.
  return `<svg class="icon${className}" viewBox="0 0 24 24" width="${size}" height="${size}" style="width:${size}px;height:${size}px" aria-hidden="true" focusable="false"><use href="#${name}"></use></svg>`;
}

/**
 * @param {unknown} value
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @returns {string} unique id
 */
export function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Formats seconds as m:ss.
 * @param {number} totalSeconds
 */
export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Turns a destructive icon button into a two step confirmation, so a single
 * stray click never deletes data.
 * @param {HTMLButtonElement} button
 * @param {{label: string, confirmLabel: string, onConfirm: () => void, timeout?: number}} options
 */
export function armAction(button, options) {
  const timeout = options.timeout || 3000;
  let timer = null;

  const reset = () => {
    window.clearTimeout(timer);
    button.dataset.armed = 'false';
    button.setAttribute('aria-label', options.label);
  };

  button.addEventListener('click', () => {
    if (button.dataset.armed === 'true') {
      reset();
      options.onConfirm();
      return;
    }
    button.dataset.armed = 'true';
    button.setAttribute('aria-label', options.confirmLabel);
    timer = window.setTimeout(reset, timeout);
  });
}

/**
 * Copies text to the clipboard with a legacy fallback.
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

/**
 * @param {number} timestamp
 */
export function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'ahora mismo';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(timestamp));
}

/**
 * @param {string} isoDate 'YYYY-MM-DD'
 */
export function parseIsoDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * @param {Date} date
 */
export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generic link mark used when a saved site has no logo available.
 */
export const FALLBACK_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2b3646"/><path d="M13.5 18.5a4.5 4.5 0 0 0 6.83.53l2.5-2.5a4.5 4.5 0 0 0-6.36-6.36l-1.4 1.41" fill="none" stroke="#9db0c4" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5 13.5a4.5 4.5 0 0 0-6.83-.53l-2.5 2.5a4.5 4.5 0 1 0 6.36 6.36l1.4-1.41" fill="none" stroke="#9db0c4" stroke-width="1.8" stroke-linecap="round"/></svg>`
  );
