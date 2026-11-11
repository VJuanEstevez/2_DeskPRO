import '../../css/apps/calendar.css';

import { read, write, subscribe, announce } from '../store.js';
import { icon, escapeHtml, uid, armAction, parseIsoDate, toIsoDate } from '../ui.js';

const STORAGE_KEY = 'calendar';
const WEEKDAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const MONTHS_LONG = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
const DAY_LABEL = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

/**
 * @typedef {{id: string, title: string, time: string}} CalendarEvent
 */

let viewDate = new Date();
let selectedDate = toIsoDate(new Date());

/**
 * @returns {Record<string, CalendarEvent[]>}
 */
function getStore() {
  const stored = read(STORAGE_KEY, {});
  return stored && typeof stored === 'object' ? stored : {};
}

/**
 * @param {Record<string, CalendarEvent[]>} store
 */
function saveStore(store) {
  write(STORAGE_KEY, store);
}

/**
 * @param {string} isoDate
 * @returns {CalendarEvent[]}
 */
function getEvents(isoDate) {
  const events = getStore()[isoDate];
  return Array.isArray(events) ? events : [];
}

/**
 * @param {string} isoDate
 */
function renderPanel() {
  const panel = document.getElementById('calendar-panel');
  if (!panel) return;

  const date = parseIsoDate(selectedDate);
  const events = getEvents(selectedDate);

  panel.innerHTML = `
    <h2 class="calendar__panel-title">${capitalize(DAY_LABEL.format(date))}</h2>

    <form class="event-form" id="event-form">
      <div class="field">
        <label class="field__label" for="event-title">Nuevo evento</label>
        <input class="field__control" id="event-title" name="title" type="text" maxlength="80" placeholder="Ej. Reunión de equipo" autocomplete="off" required />
      </div>
      <div class="field event-form__row">
        <label class="field__label" for="event-time">Hora</label>
        <input class="field__control" id="event-time" name="time" type="time" />
        <button class="button button--primary" type="submit">${icon('icon-plus')}<span>Añadir</span></button>
      </div>
    </form>

    ${
      events.length === 0
        ? `<p class="empty-state empty-state--compact">${icon('icon-calendar', { size: 22 })}<span>Sin eventos este día.</span></p>`
        : `<ul class="event-list">
            ${events
              .map(
                (event) => `
              <li class="event-list__item" data-id="${event.id}">
                <span class="event-list__time">${event.time ? escapeHtml(event.time) : 'Todo el día'}</span>
                <span class="event-list__title">${escapeHtml(event.title)}</span>
                <button class="icon-button icon-button--small" type="button" aria-label="Eliminar evento ${escapeHtml(event.title)}">
                  ${icon('icon-trash', { size: 16 })}
                </button>
              </li>`
              )
              .join('')}
          </ul>`
    }`;

  const form = panel.querySelector('#event-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    if (!title) return;

    const store = getStore();
    const list = Array.isArray(store[selectedDate]) ? store[selectedDate] : [];
    store[selectedDate] = [...list, { id: uid(), title, time: String(data.get('time') || '') }].sort((a, b) =>
      (a.time || '99:99').localeCompare(b.time || '99:99')
    );
    saveStore(store);
    announce('Evento añadido');

    // The panel is rebuilt on every change, so keep the keyboard where it was.
    const titleInput = panel.querySelector('#event-title');
    if (titleInput) titleInput.focus();
  });

  panel.querySelectorAll('.event-list__item').forEach((item) => {
    const button = item.querySelector('button');
    armAction(button, {
      label: button.getAttribute('aria-label'),
      confirmLabel: 'Confirmar eliminación',
      onConfirm: () => {
        const store = getStore();
        store[selectedDate] = (store[selectedDate] || []).filter((event) => event.id !== item.dataset.id);
        saveStore(store);
        announce('Evento eliminado');
      },
    });
  });
}

function renderGrid() {
  const table = document.getElementById('calendar-table');
  const title = document.getElementById('calendar-month');
  if (!table || !title) return;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  title.textContent = capitalize(MONTHS_LONG.format(viewDate));

  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const store = getStore();
  const today = toIsoDate(new Date());

  const cells = [];
  for (let index = 0; index < offset; index += 1) cells.push('<td class="calendar__cell calendar__cell--outside"></td>');

  for (let day = 1; day <= daysInMonth; day += 1) {
    const isoDate = toIsoDate(new Date(year, month, day));
    const events = Array.isArray(store[isoDate]) ? store[isoDate] : [];
    const isSelected = isoDate === selectedDate;
    const isToday = isoDate === today;
    const accessibleDay = capitalize(DAY_LABEL.format(parseIsoDate(isoDate)));

    cells.push(`
      <td class="calendar__cell${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}">
        <button
          class="calendar__day"
          type="button"
          data-date="${isoDate}"
          tabindex="${isSelected ? '0' : '-1'}"
          aria-label="${accessibleDay}${events.length > 0 ? `, ${events.length} evento${events.length === 1 ? '' : 's'}` : ''}"
        >
          <span class="calendar__day-number">${day}</span>
          ${events.length > 0 ? `<span class="calendar__badge">${events.length}</span>` : ''}
        </button>
      </td>`);
  }

  while (cells.length % 7 !== 0) cells.push('<td class="calendar__cell calendar__cell--outside"></td>');

  const rows = [];
  for (let index = 0; index < cells.length; index += 7) {
    rows.push(`<tr>${cells.slice(index, index + 7).join('')}</tr>`);
  }

  table.querySelector('tbody').innerHTML = rows.join('');

  // Keep a single tab stop inside the grid even when the selection lives in another month.
  if (!table.querySelector('.calendar__day[tabindex="0"]')) {
    const firstDayButton = table.querySelector('.calendar__day');
    if (firstDayButton) firstDayButton.tabIndex = 0;
  }
}

function render() {
  renderGrid();
  renderPanel();
}

/**
 * @param {string} isoDate
 */
function selectDate(isoDate) {
  const date = parseIsoDate(isoDate);
  if (date.getMonth() !== viewDate.getMonth() || date.getFullYear() !== viewDate.getFullYear()) {
    viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
  }
  selectedDate = isoDate;
  render();
}

export default {
  meta: { title: 'Calendario' },
  render(root) {
    root.innerHTML = `
      <section class="app app--calendar">
        <header class="app__header">
          <div>
            <h1 class="app__title">Calendario</h1>
          </div>
          <div class="calendar__controls">
            <button class="icon-button" id="calendar-prev" type="button" aria-label="Mes anterior">
              ${icon('icon-chevron-left')}
            </button>
            <button class="button button--ghost" id="calendar-today" type="button">Hoy</button>
            <button class="icon-button" id="calendar-next" type="button" aria-label="Mes siguiente">
              ${icon('icon-chevron-right')}
            </button>
          </div>
        </header>

        <div class="calendar__layout">
          <div class="calendar__main">
            <h2 class="calendar__month" id="calendar-month"></h2>
            <table class="calendar__table" id="calendar-table">
              <caption class="sr-only">Vista mensual del calendario</caption>
              <thead>
                <tr>
                  ${WEEKDAYS.map((day) => `<th scope="col">${day}</th>`).join('')}
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <aside class="calendar__panel card" id="calendar-panel"></aside>
        </div>
      </section>`;

    const table = root.querySelector('#calendar-table');

    root.querySelector('#calendar-prev').addEventListener('click', () => {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      renderGrid();
    });

    root.querySelector('#calendar-next').addEventListener('click', () => {
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      renderGrid();
    });

    root.querySelector('#calendar-today').addEventListener('click', () => {
      selectDate(toIsoDate(new Date()));
    });

    table.addEventListener('click', (event) => {
      const button = event.target.closest('.calendar__day');
      if (!button) return;
      selectDate(button.dataset.date);
    });

    table.addEventListener('keydown', (event) => {
      const button = event.target.closest('.calendar__day');
      if (!button) return;

      const deltas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      let nextDate = null;

      if (event.key in deltas) {
        const date = parseIsoDate(button.dataset.date);
        date.setDate(date.getDate() + deltas[event.key]);
        nextDate = toIsoDate(date);
      } else if (event.key === 'Home') {
        const date = parseIsoDate(button.dataset.date);
        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        nextDate = toIsoDate(date);
      } else if (event.key === 'End') {
        const date = parseIsoDate(button.dataset.date);
        date.setDate(date.getDate() + (6 - ((date.getDay() + 6) % 7)));
        nextDate = toIsoDate(date);
      } else {
        return;
      }

      event.preventDefault();
      selectDate(nextDate);
      const next = root.querySelector(`.calendar__day[data-date="${nextDate}"]`);
      if (next) next.focus();
    });

    render();

    const unsubscribe = subscribe(STORAGE_KEY, render);
    return () => unsubscribe();
  },
};

/**
 * @param {string} value
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
