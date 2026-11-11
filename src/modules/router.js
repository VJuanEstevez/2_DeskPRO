import { currentRoute } from './nav.js';
import dashboard from './dashboard.js';
import calendar from './apps/calendar.js';
import pomodoro from './apps/pomodoro.js';
import weather from './apps/weather.js';
import todo from './apps/todo.js';
import notebook from './apps/notebook.js';
import player from './apps/player.js';
import favorites from './apps/favorites.js';
import password from './apps/password.js';

const VIEWS = {
  '': dashboard,
  calendar,
  pomodoro,
  weather,
  todo,
  notebook,
  player,
  favorites,
  password,
};

const HOME_TITLE = 'Dashboard';

let activeCleanup = null;
let firstRender = true;

/**
 * Starts the hash router on the given root element.
 * @param {HTMLElement} root
 */
export function startRouter(root) {
  const render = () => {
    const route = currentRoute();
    const view = VIEWS[route] || dashboard;
    const app = view.meta || {};

    if (typeof activeCleanup === 'function') activeCleanup();
    activeCleanup = null;

    root.innerHTML = '';
    document.title = `${route && VIEWS[route] ? app.title || HOME_TITLE : HOME_TITLE} · DeskPRO`;

    const dispose = view.render(root);
    activeCleanup = typeof dispose === 'function' ? dispose : null;

    if (firstRender) {
      firstRender = false;
      return;
    }
    focusHeading(root);
  };

  window.addEventListener('hashchange', render);
  render();
}

/**
 * Moves the focus to the view heading for keyboard and screen reader users.
 * @param {HTMLElement} root
 */
function focusHeading(root) {
  const heading = root.querySelector('h1');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: false });
}
