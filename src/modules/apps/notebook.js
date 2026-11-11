import '../../css/apps/notebook.css';

import { read, write, subscribe, announce } from '../store.js';
import { icon, escapeHtml, uid, armAction, formatRelativeTime } from '../ui.js';

const STORAGE_KEY = 'notebook';
const SAVE_DELAY = 500;

/**
 * @typedef {{id: string, title: string, body: string, updatedAt: number}} Note
 */

let selectedId = null;
let query = '';
let saveTimer = null;
let pendingNote = null;

/**
 * @returns {Note[]}
 */
function getNotes() {
  const stored = read(STORAGE_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

/**
 * @param {Note[]} notes
 */
function saveNotes(notes) {
  write(STORAGE_KEY, notes);
}

/**
 * @param {string} id
 */
function findNote(id) {
  return getNotes().find((note) => note.id === id) || null;
}

function renderList() {
  const list = document.getElementById('notebook-list');
  const count = document.getElementById('notebook-count');
  if (!list || !count) return;

  const notes = getNotes().sort((a, b) => b.updatedAt - a.updatedAt);
  const filtered = notes.filter((note) => {
    if (!query) return true;
    const haystack = `${note.title} ${note.body}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  count.textContent = query
    ? `${filtered.length} de ${notes.length} nota${notes.length === 1 ? '' : 's'}`
    : `${notes.length} nota${notes.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty-state empty-state--compact">
      ${icon('icon-note', { size: 24 })}
      <p class="empty-state__title">${notes.length === 0 ? 'Sin notas' : 'Sin coincidencias'}</p>
      <p class="empty-state__text">${notes.length === 0 ? 'Crea la primera con «Nueva nota».' : 'Prueba con otra búsqueda.'}</p>
    </li>`;
    return;
  }

  list.innerHTML = filtered
    .map((note) => {
      const preview = note.body.trim().split('\n')[0] || 'Sin contenido';
      return `
      <li class="notebook__item${note.id === selectedId ? ' is-active' : ''}">
        <button class="notebook__item-button" type="button" data-id="${note.id}">
          <span class="notebook__item-title">${escapeHtml(note.title || 'Sin título')}</span>
          <span class="notebook__item-preview">${escapeHtml(preview)}</span>
          <span class="notebook__item-date">${formatRelativeTime(note.updatedAt)}</span>
        </button>
      </li>`;
    })
    .join('');
}

function renderEditor() {
  const editor = document.getElementById('notebook-editor');
  if (!editor) return;

  const note = selectedId ? findNote(selectedId) : null;

  if (!note) {
    editor.innerHTML = `<div class="empty-state">
      ${icon('icon-note', { size: 28, className: 'empty-state__icon' })}
      <p class="empty-state__title">Ninguna nota abierta</p>
      <p class="empty-state__text">Elige una de la lista o crea una nueva.</p>
    </div>`;
    return;
  }

  editor.innerHTML = `
    <div class="notebook__editor-head">
      <label class="sr-only" for="notebook-title">Título de la nota</label>
      <input class="notebook__title-input" id="notebook-title" type="text" maxlength="80" placeholder="Título de la nota" value="${escapeHtml(
        note.title
      )}" />
      <button class="icon-button" id="notebook-delete" type="button" aria-label="Eliminar nota ${escapeHtml(note.title || 'sin título')}">
        ${icon('icon-trash')}
      </button>
    </div>
    <label class="sr-only" for="notebook-body">Contenido de la nota</label>
    <textarea class="notebook__body" id="notebook-body" placeholder="Escribe aquí…">${escapeHtml(note.body)}</textarea>
    <p class="notebook__meta" id="notebook-meta">Editada ${formatRelativeTime(note.updatedAt)}</p>`;

  const titleInput = editor.querySelector('#notebook-title');
  const bodyInput = editor.querySelector('#notebook-body');
  const deleteButton = editor.querySelector('#notebook-delete');

  const scheduleSave = () => {
    window.clearTimeout(saveTimer);
    pendingNote = {
      ...note,
      title: titleInput.value,
      body: bodyInput.value,
      updatedAt: Date.now(),
    };
    saveTimer = window.setTimeout(() => {
      const current = pendingNote;
      pendingNote = null;
      if (!current) return;
      saveNotes(getNotes().map((item) => (item.id === current.id ? current : item)));
    }, SAVE_DELAY);
  };

  titleInput.addEventListener('input', scheduleSave);
  bodyInput.addEventListener('input', scheduleSave);

  armAction(deleteButton, {
    label: deleteButton.getAttribute('aria-label'),
    confirmLabel: 'Confirmar eliminación',
    onConfirm: () => {
      window.clearTimeout(saveTimer);
      pendingNote = null;
      saveNotes(getNotes().filter((item) => item.id !== note.id));
      selectedId = null;
      renderList();
      renderEditor();
      announce('Nota eliminada');
    },
  });
}

function flushPendingSave() {
  window.clearTimeout(saveTimer);
  if (!pendingNote) return;
  const current = pendingNote;
  pendingNote = null;
  saveNotes(getNotes().map((item) => (item.id === current.id ? current : item)));
}

function selectNote(id) {
  flushPendingSave();
  selectedId = id;
  renderList();
  renderEditor();
}

export default {
  meta: { title: 'Notebook' },
  render(root) {
    root.innerHTML = `
      <section class="app app--notebook">
        <header class="app__header">
          <div>
            <h1 class="app__title">Notebook</h1>
          </div>
          <div class="notebook__toolbar">
            <label class="field__label sr-only" for="notebook-search">Buscar notas</label>
            <div class="input-with-icon">
              ${icon('icon-search', { size: 16 })}
              <input class="field__control" id="notebook-search" type="search" placeholder="Buscar…" autocomplete="off" />
            </div>
            <button class="button button--primary" id="notebook-new" type="button">${icon('icon-plus')}<span>Nueva nota</span></button>
          </div>
        </header>

        <div class="notebook__layout">
          <aside class="notebook__list-pane">
            <p class="notebook__count" id="notebook-count"></p>
            <ul class="notebook__list" id="notebook-list"></ul>
          </aside>
          <section class="notebook__editor card" id="notebook-editor"></section>
        </div>
      </section>`;

    renderList();
    renderEditor();

    root.querySelector('#notebook-search').addEventListener('input', (event) => {
      query = event.target.value;
      renderList();
    });

    root.querySelector('#notebook-new').addEventListener('click', () => {
      flushPendingSave();
      const note = { id: uid(), title: '', body: '', updatedAt: Date.now() };
      saveNotes([note, ...getNotes()]);
      selectedId = note.id;
      renderList();
      renderEditor();
      const titleInput = root.querySelector('#notebook-title');
      if (titleInput) titleInput.focus();
      announce('Nota creada');
    });

    root.querySelector('#notebook-list').addEventListener('click', (event) => {
      const button = event.target.closest('[data-id]');
      if (!button) return;
      selectNote(button.dataset.id);
    });

    const unsubscribe = subscribe(STORAGE_KEY, () => {
      renderList();
      const meta = document.getElementById('notebook-meta');
      if (meta && selectedId) {
        const note = findNote(selectedId);
        if (note) meta.textContent = `Editada ${formatRelativeTime(note.updatedAt)}`;
      }
    });

    return () => {
      flushPendingSave();
      unsubscribe();
    };
  },
};
