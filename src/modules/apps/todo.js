import '../../css/apps/todo.css';

import { read, write, subscribe, announce } from '../store.js';
import { icon, escapeHtml, uid, armAction } from '../ui.js';

const STORAGE_KEY = 'todo';
const FILTERS = {
  all: 'Todas',
  pending: 'Pendientes',
  done: 'Hechas',
};

let filter = 'all';

/**
 * @typedef {{id: string, text: string, done: boolean, createdAt: number}} TodoItem
 */

/**
 * @returns {TodoItem[]}
 */
function getItems() {
  const stored = read(STORAGE_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

/**
 * @param {TodoItem[]} items
 */
function saveItems(items) {
  write(STORAGE_KEY, items);
}

function render() {
  const root = document.getElementById('todo-list');
  const count = document.getElementById('todo-count');
  if (!root || !count) return;

  const items = getItems();
  const pending = items.filter((item) => !item.done).length;
  const visible = items.filter((item) => {
    if (filter === 'pending') return !item.done;
    if (filter === 'done') return item.done;
    return true;
  });

  count.textContent = `${pending} pendiente${pending === 1 ? '' : 's'} de ${items.length}`;

  if (visible.length === 0) {
    root.innerHTML = `<li class="empty-state">
      ${icon('icon-inbox', { size: 28, className: 'empty-state__icon' })}
      <p class="empty-state__title">${items.length === 0 ? 'Sin tareas todavía' : 'Nada por aquí'}</p>
      <p class="empty-state__text">${
        items.length === 0 ? 'Añade la primera con el campo de arriba.' : 'Prueba con otro filtro.'
      }</p>
    </li>`;
    return;
  }

  root.innerHTML = visible
    .map(
      (item) => `
      <li class="todo__item${item.done ? ' is-done' : ''}" data-id="${item.id}">
        <label class="todo__check">
          <input type="checkbox" class="todo__checkbox" data-id="${item.id}" ${item.done ? 'checked' : ''} />
          <span class="todo__text">${escapeHtml(item.text)}</span>
        </label>
        <button class="icon-button icon-button--small todo__remove" type="button" data-remove="${item.id}" aria-label="Eliminar tarea ${escapeHtml(
          item.text
        )}">
          ${icon('icon-trash', { size: 16 })}
        </button>
      </li>`
    )
    .join('');

  root.querySelectorAll('[data-remove]').forEach((button) => {
    armAction(button, {
      label: button.getAttribute('aria-label'),
      confirmLabel: 'Confirmar eliminación',
      onConfirm: () => {
        saveItems(getItems().filter((item) => item.id !== button.dataset.remove));
        announce('Tarea eliminada');
      },
    });
  });
}

/**
 * @returns {{render: (root: HTMLElement) => (() => void)}}
 */
export default {
  meta: { title: 'To do List' },
  render(root) {
    root.innerHTML = `
      <section class="app app--todo">
        <header class="app__header">
          <div>
            <h1 class="app__title">To do List</h1>
          </div>
          <p class="todo__count" id="todo-count"></p>
        </header>

        <form class="todo__form" id="todo-form">
          <label class="field__label" for="todo-input">Nueva tarea</label>
          <div class="todo__row">
            <input class="field__control" id="todo-input" name="text" type="text" maxlength="140" placeholder="Ej. Revisar el informe trimestral" autocomplete="off" required />
            <button class="button button--primary" type="submit">${icon('icon-plus')}<span>Añadir</span></button>
          </div>
        </form>

        <fieldset class="segmented" id="todo-filters">
          <legend class="sr-only">Filtrar tareas</legend>
          ${Object.entries(FILTERS)
            .map(
              ([value, label]) => `
            <input class="segmented__input" type="radio" name="todo-filter" id="todo-filter-${value}" value="${value}" ${
                value === filter ? 'checked' : ''
              } />
            <label class="segmented__label" for="todo-filter-${value}">${label}</label>`
            )
            .join('')}
        </fieldset>

        <ul class="todo__list" id="todo-list"></ul>
      </section>`;

    const form = root.querySelector('#todo-form');
    const input = root.querySelector('#todo-input');
    const filters = root.querySelector('#todo-filters');

    render();

    const onSubmit = (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const items = getItems();
      items.unshift({ id: uid(), text, done: false, createdAt: Date.now() });
      saveItems(items);
      input.value = '';
      input.focus();
      announce('Tarea añadida');
    };

    const onChange = (event) => {
      if (event.target.name !== 'todo-filter') return;
      filter = event.target.value;
      render();
    };

    const onListChange = (event) => {
      const checkbox = event.target.closest('.todo__checkbox');
      if (!checkbox) return;
      const items = getItems().map((item) => (item.id === checkbox.dataset.id ? { ...item, done: checkbox.checked } : item));
      saveItems(items);
    };

    form.addEventListener('submit', onSubmit);
    filters.addEventListener('change', onChange);
    root.querySelector('#todo-list').addEventListener('change', onListChange);

    const unsubscribe = subscribe(STORAGE_KEY, render);

    return () => {
      unsubscribe();
    };
  },
};
