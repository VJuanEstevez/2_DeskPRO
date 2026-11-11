/**
 * Single source of truth for the dashboard applications.
 * Identifiers are in english on purpose (see AGENTS.md), labels are user facing.
 */
export const APPS = [
  { id: 'calendar', label: 'Calendario', icon: 'icon-calendar' },
  { id: 'pomodoro', label: 'Pomodoro', icon: 'icon-timer' },
  { id: 'weather', label: 'Clima', icon: 'icon-weather' },
  { id: 'todo', label: 'To do List', icon: 'icon-check' },
  { id: 'notebook', label: 'Notebook', icon: 'icon-book' },
  { id: 'player', label: 'Reproductor', icon: 'icon-play' },
  { id: 'favorites', label: 'Favoritos', icon: 'icon-star' },
  { id: 'password', label: 'Contraseñas', icon: 'icon-key' },
];

/**
 * @param {string} id
 */
export function findApp(id) {
  return APPS.find((app) => app.id === id) || null;
}
