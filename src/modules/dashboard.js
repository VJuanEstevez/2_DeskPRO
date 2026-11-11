import { selectApps } from './settings.js';
import { subscribe } from './store.js';
import { WIDGETS } from './widgets.js';
import { icon, escapeHtml } from './ui.js';

/**
 * Dashboard view: a grid of application cards with live mini widgets.
 * Repaints itself whenever the visible applications change.
 */
export default {
  meta: { title: 'Panel' },
  render(root) {
    let widgetCleanups = [];

    const unmountWidgets = () => {
      for (const cleanup of widgetCleanups) cleanup();
      widgetCleanups = [];
    };

    const paint = () => {
      unmountWidgets();
      const apps = selectApps();

      if (apps.length === 0) {
        root.innerHTML = `
          <section class="app app--dashboard">
            <div class="empty-state">
              ${icon('icon-grid', { size: 30, className: 'empty-state__icon' })}
              <p class="empty-state__title">No hay aplicaciones visibles</p>
              <p class="empty-state__text">Activa al menos una desde el botón de ajustes.</p>
              <button class="button button--primary" type="button" id="dashboard-open-settings">
                ${icon('icon-settings')}<span>Abrir ajustes</span>
              </button>
            </div>
          </section>`;

        root.querySelector('#dashboard-open-settings').addEventListener('click', () => {
          document.getElementById('settings-toggle').click();
        });
        return;
      }

      root.innerHTML = `
        <section class="app app--dashboard">
          <div class="dashboard__grid">
            ${apps
              .map(
                (app) => `
              <article class="card dashboard__card">
                <h2 class="dashboard__title">
                  <a class="dashboard__link" href="#/${app.id}">${escapeHtml(app.label)}</a>
                </h2>
                <div class="dashboard__widget scrollable-y" data-widget="${app.id}">
                  <span class="skeleton" aria-hidden="true"></span>
                </div>
              </article>`
              )
              .join('')}
          </div>
        </section>`;

      widgetCleanups = [...root.querySelectorAll('[data-widget]')]
        .map((node) => {
          const factory = WIDGETS[node.dataset.widget];
          if (!factory) {
            node.textContent = '';
            return null;
          }
          return factory(node);
        })
        .filter((cleanup) => typeof cleanup === 'function');
    };

    paint();
    const unsubscribe = subscribe('settings', paint);

    return () => {
      unsubscribe();
      unmountWidgets();
    };
  },
};
