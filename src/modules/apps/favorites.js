import '../../css/apps/favorites.css';

import { read, write, subscribe, announce } from '../store.js';
import { icon, escapeHtml, uid, armAction, FALLBACK_LOGO } from '../ui.js';

const STORAGE_KEY = 'favorites';

/**
 * @typedef {{id: string, name: string, url: string, host: string, createdAt: number}} Favorite
 */

/**
 * @returns {Favorite[]}
 */
function getFavorites() {
  const stored = read(STORAGE_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

/**
 * @param {Favorite[]} favorites
 */
function saveFavorites(favorites) {
  write(STORAGE_KEY, favorites);
}

/**
 * @param {string} value
 * @returns {{url: string, host: string}|null}
 */
function normalizeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;

  let url;
  try {
    url = new URL(raw.includes('://') ? raw : `https://${raw}`);
  } catch (error) {
    return null;
  }

  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) return null;
  return { url: url.href, host: url.hostname.replace(/^www\./, '') };
}

function render() {
  const list = document.getElementById('favorites-list');
  const count = document.getElementById('favorites-count');
  if (!list || !count) return;

  const favorites = getFavorites();
  count.textContent = `${favorites.length} enlace${favorites.length === 1 ? '' : 's'}`;

  if (favorites.length === 0) {
    list.innerHTML = `<li class="empty-state">
      ${icon('icon-star', { size: 28, className: 'empty-state__icon' })}
      <p class="empty-state__title">Sin favoritos</p>
      <p class="empty-state__text">Guarda tu primer enlace con el formulario de arriba.</p>
    </li>`;
    return;
  }

  list.innerHTML = favorites
    .map(
      (favorite) => `
      <li class="favorite" data-id="${favorite.id}">
        <a class="favorite__link" href="${escapeHtml(favorite.url)}" target="_blank" rel="noopener noreferrer">
          <img
            class="favorite__logo"
            src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(favorite.host)}&sz=64"
            alt=""
            width="36"
            height="36"
            loading="lazy"
            data-fallback="${FALLBACK_LOGO}"
          />
          <span class="favorite__body">
            <span class="favorite__name">${escapeHtml(favorite.name)}</span>
            <span class="favorite__host">${escapeHtml(favorite.host)}</span>
          </span>
          ${icon('icon-external', { size: 16, className: 'favorite__external' })}
        </a>
        <button class="icon-button icon-button--small favorite__remove" type="button" aria-label="Eliminar favorito ${escapeHtml(
          favorite.name
        )}">
          ${icon('icon-trash', { size: 16 })}
        </button>
      </li>`
    )
    .join('');

  list.querySelectorAll('.favorite__remove').forEach((button) => {
    const id = button.closest('.favorite').dataset.id;
    armAction(button, {
      label: button.getAttribute('aria-label'),
      confirmLabel: 'Confirmar eliminación',
      onConfirm: () => {
        saveFavorites(getFavorites().filter((favorite) => favorite.id !== id));
        announce('Favorito eliminado');
      },
    });
  });
}

export default {
  meta: { title: 'Favoritos' },
  render(root) {
    root.innerHTML = `
      <section class="app app--favorites">
        <header class="app__header">
          <div>
            <h1 class="app__title">Favoritos</h1>
          </div>
          <p class="app__count" id="favorites-count"></p>
        </header>

        <form class="favorites__form" id="favorites-form">
          <div class="field">
            <label class="field__label" for="favorite-name">Nombre</label>
            <input class="field__control" id="favorite-name" name="name" type="text" maxlength="40" placeholder="Ej. Documentación" autocomplete="off" required />
          </div>
          <div class="field">
            <label class="field__label" for="favorite-url">URL</label>
            <input class="field__control" id="favorite-url" name="url" type="text" inputmode="url" placeholder="https://ejemplo.com" autocomplete="off" required />
          </div>
          <button class="button button--primary" type="submit">${icon('icon-plus')}<span>Guardar</span></button>
        </form>

        <ul class="favorites__grid" id="favorites-list"></ul>
      </section>`;

    const form = root.querySelector('#favorites-form');
    const listNode = root.querySelector('#favorites-list');

    render();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const normalized = normalizeUrl(String(data.get('url') || ''));

      if (!normalized) {
        announce('Esa URL no parece válida. Incluye un dominio, por ejemplo https://ejemplo.com');
        return;
      }

      const favorites = getFavorites();
      if (favorites.some((favorite) => favorite.url === normalized.url)) {
        announce('Ese enlace ya está guardado.');
        return;
      }

      favorites.unshift({
        id: uid(),
        name: name || normalized.host,
        url: normalized.url,
        host: normalized.host,
        createdAt: Date.now(),
      });
      saveFavorites(favorites);
      form.reset();
      announce('Favorito guardado');
    });

    // Logos are decorative: a broken image silently falls back to a generic link mark.
    listNode.addEventListener(
      'error',
      (event) => {
        const image = event.target;
        if (!(image instanceof HTMLImageElement) || image.dataset.fallbackUsed) return;
        image.dataset.fallbackUsed = 'true';
        image.src = image.dataset.fallback;
      },
      true
    );

    const unsubscribe = subscribe(STORAGE_KEY, render);
    return () => unsubscribe();
  },
};
