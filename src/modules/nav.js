import { subscribe } from './store.js';
import { selectApps } from './settings.js';

const TOOLTIP_GAP = 8;
const TOOLTIP_EDGE = 8;

/** The compact bottom bar always shows its labels, so it needs no tooltip. */
const compactNav = window.matchMedia('(max-width: 47.99rem)');

let tooltipNode = null;

/**
 * Lazily creates the single tooltip element shared by every navigation icon.
 * @returns {HTMLElement}
 */
function ensureTooltip() {
  if (tooltipNode) return tooltipNode;
  tooltipNode = document.createElement('div');
  tooltipNode.className = 'nav-tooltip';
  tooltipNode.setAttribute('aria-hidden', 'true');
  tooltipNode.hidden = true;
  document.body.appendChild(tooltipNode);
  return tooltipNode;
}

/**
 * Positions the tooltip right next to the hovered or focused icon.
 * @param {HTMLElement} link
 */
function showTooltip(link) {
  if (compactNav.matches) return;
  const label = link.querySelector('.side-nav__label');
  if (!label || !label.textContent.trim()) return;

  const tooltip = ensureTooltip();
  tooltip.textContent = label.textContent.trim();
  tooltip.hidden = false;

  const linkRect = link.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();

  let left = linkRect.right + TOOLTIP_GAP;
  if (left + tipRect.width > window.innerWidth - TOOLTIP_EDGE) {
    left = Math.max(TOOLTIP_EDGE, linkRect.left - TOOLTIP_GAP - tipRect.width);
  }

  const top = Math.min(
    Math.max(linkRect.top + linkRect.height / 2, tipRect.height / 2 + TOOLTIP_EDGE),
    window.innerHeight - tipRect.height / 2 - TOOLTIP_EDGE
  );

  tooltip.style.left = `${Math.round(left)}px`;
  tooltip.style.top = `${Math.round(top)}px`;
}

function hideTooltip() {
  if (tooltipNode) tooltipNode.hidden = true;
}

/**
 * Attaches tooltip behaviour to the freshly rendered links.
 * @param {HTMLElement} list
 */
function bindTooltips(list) {
  list.querySelectorAll('.side-nav__link').forEach((link) => {
    link.addEventListener('pointerenter', () => showTooltip(link));
    link.addEventListener('pointerleave', hideTooltip);
    link.addEventListener('focus', () => showTooltip(link));
    link.addEventListener('blur', hideTooltip);
  });
}

/**
 * Renders the fixed lateral navigation and keeps the active link in sync.
 */
export function mountNav() {
  const list = document.getElementById('nav-apps');
  if (!list) return;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideTooltip();
  });
  window.addEventListener('scroll', hideTooltip, true);
  window.addEventListener('resize', hideTooltip);

  // The footer list (Ajustes) is static, so it is bound only once.
  const footerList = document.querySelector('.side-nav__list--footer');
  if (footerList) bindTooltips(footerList);

  const render = () => {
    const current = currentRoute();
    const home = `
        <li class="side-nav__item">
          <a class="side-nav__link" href="#/" data-app="home" ${
            current === '' ? 'aria-current="page"' : ''
          }>
            <svg class="icon side-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <use href="#icon-home"></use>
            </svg>
            <span class="side-nav__label">Home</span>
          </a>
        </li>`;

    list.innerHTML = home.concat(
      selectApps()
        .map(
          (app) => `
        <li class="side-nav__item">
          <a class="side-nav__link" href="#/${app.id}" data-app="${app.id}" ${
            current === app.id ? 'aria-current="page"' : ''
          }>
            <svg class="icon side-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <use href="#${app.icon}"></use>
            </svg>
            <span class="side-nav__label">${app.label}</span>
          </a>
        </li>`
        )
        .join('')
    );

    bindTooltips(list);
  };

  render();
  window.addEventListener('hashchange', render);
  subscribe('settings', render);
}

/**
 * @returns {string} route id of the current hash ('' for the dashboard)
 */
export function currentRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  return raw.split('?')[0].replace(/\/$/, '');
}
