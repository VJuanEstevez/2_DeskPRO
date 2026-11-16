import '../../css/apps/textgen.css';

import { read, write, announce } from '../store.js';
import { icon, escapeHtml, copyText } from '../ui.js';
import { TEXT_THEMES, findTextTheme } from '../data/text-themes.js';

const STORAGE_KEY = 'text-generator';

const DEFAULT_TEXT_STATE = {
  theme: 'sci-fi',
  paragraphs: 3,
  sentences: 4,
  includeTitle: true,
  output: { title: '', paragraphs: [] },
};

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {number} fallback
 * @returns {number}
 */
function clampInt(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, Math.round(numeric)));
}

/**
 * @param {string[]} items
 * @returns {string[]}
 */
function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

/**
 * Returns values without repeating an item until the whole list is consumed.
 * @param {string[]} items
 * @returns {() => string}
 */
function createPicker(items) {
  let queue = [];
  return () => {
    if (queue.length === 0) queue = shuffle(items);
    return queue.pop();
  };
}

/**
 * Pulls from a picker while avoiding values already used in the current block.
 * @param {() => string} picker
 * @param {Set<string>} used
 * @param {number} attempts
 * @returns {string}
 */
function pickUnused(picker, used, attempts) {
  let value = picker();
  let guard = 0;
  while (used.has(value) && guard < attempts) {
    value = picker();
    guard += 1;
  }
  used.add(value);
  return value;
}

/**
 * @param {string} template
 * @param {{character: string, place: string, object: string}} slots
 * @returns {string}
 */
function fillTemplate(template, slots) {
  return template.replace(/\{(\w+)\}/g, (match, key) => slots[key] || match);
}

/**
 * @param {typeof TEXT_THEMES[number]} theme
 * @param {number} paragraphCount
 * @param {number} sentenceCount
 * @returns {{title: string, paragraphs: string[]}}
 */
export function generateText(theme, paragraphCount, sentenceCount) {
  const characters = createPicker(theme.characters);
  const places = createPicker(theme.places);
  const objects = createPicker(theme.objects);
  const openers = createPicker(theme.openers);
  const beats = createPicker(theme.beats);
  const closers = createPicker(theme.closers);
  const titles = createPicker(theme.titles);

  const paragraphs = [];
  for (let index = 0; index < paragraphCount; index += 1) {
    const slots = {
      character: characters(),
      place: places(),
      object: objects(),
    };

    const sentences = [fillTemplate(openers(), slots)];
    const usedBeats = new Set();
    while (sentences.length < sentenceCount - 1) {
      const beat = pickUnused(beats, usedBeats, theme.beats.length * 2);
      sentences.push(fillTemplate(beat, slots));
    }
    if (sentenceCount > 1) sentences.push(fillTemplate(closers(), slots));
    paragraphs.push(sentences.join(' '));
  }

  return { title: titles(), paragraphs };
}

/**
 * @returns {typeof DEFAULT_TEXT_STATE}
 */
export function getTextState() {
  const stored = read(STORAGE_KEY, {});
  const source = stored && typeof stored === 'object' ? stored : {};
  const output = source.output && typeof source.output === 'object' ? source.output : {};
  const paragraphs = Array.isArray(output.paragraphs)
    ? output.paragraphs.filter((paragraph) => typeof paragraph === 'string' && paragraph.trim())
    : [];

  return {
    theme: findTextTheme(source.theme).id,
    paragraphs: clampInt(source.paragraphs, 1, 8, DEFAULT_TEXT_STATE.paragraphs),
    sentences: clampInt(source.sentences, 2, 6, DEFAULT_TEXT_STATE.sentences),
    includeTitle: source.includeTitle !== false,
    output: {
      title: typeof output.title === 'string' ? output.title : '',
      paragraphs,
    },
  };
}

export default {
  meta: { title: 'Generador de textos' },
  render(root) {
    let state = getTextState();
    const initialTheme = findTextTheme(state.theme);

    root.innerHTML = `
      <section class="app app--textgen">
        <header class="app__header">
          <div>
            <h1 class="app__title">Generador de textos</h1>
            <p class="app__count">Sinopsis de película por temática, con control de párrafos y frases.</p>
          </div>
          <button class="button button--ghost" id="textgen-copy" type="button">
            ${icon('icon-copy')}<span>Copiar texto</span>
          </button>
        </header>

        <div class="textgen__layout">
          <form class="textgen__controls card" id="textgen-form">
            <div class="field">
              <label class="field__label" for="textgen-theme">Temática</label>
              <select class="field__control" id="textgen-theme" name="theme">
                ${TEXT_THEMES.map(
                  (theme) =>
                    `<option value="${theme.id}" ${theme.id === state.theme ? 'selected' : ''}>${escapeHtml(
                      theme.label
                    )}</option>`
                ).join('')}
              </select>
              <p class="field__hint" id="textgen-theme-note">${escapeHtml(initialTheme.tagline)}</p>
            </div>

            <div class="field">
              <div class="field__inline">
                <label class="field__label" for="textgen-paragraphs">Párrafos</label>
                <output class="field__value" id="textgen-paragraphs-output" for="textgen-paragraphs">${state.paragraphs}</output>
              </div>
              <input
                class="field__control"
                id="textgen-paragraphs"
                name="paragraphs"
                type="range"
                min="1"
                max="8"
                step="1"
                value="${state.paragraphs}"
              />
            </div>

            <div class="field">
              <div class="field__inline">
                <label class="field__label" for="textgen-sentences">Frases por párrafo</label>
                <output class="field__value" id="textgen-sentences-output" for="textgen-sentences">${state.sentences}</output>
              </div>
              <input
                class="field__control"
                id="textgen-sentences"
                name="sentences"
                type="range"
                min="2"
                max="6"
                step="1"
                value="${state.sentences}"
              />
            </div>

            <label class="check">
              <input class="check__input" id="textgen-title-toggle" type="checkbox" ${state.includeTitle ? 'checked' : ''} />
              <span class="check__box" aria-hidden="true">${icon('icon-check-circle', { size: 14 })}</span>
              <span class="check__label">Incluir título de película</span>
            </label>

            <div class="textgen__actions">
              <button class="button button--primary" type="submit">
                ${icon('icon-refresh')}<span>Generar de nuevo</span>
              </button>
            </div>

            <p class="field__hint">Los cambios de temática, párrafos o frases generan una nueva versión automáticamente.</p>
          </form>

          <article class="textgen__preview card" aria-labelledby="textgen-preview-title">
            <header class="textgen__preview-head">
              <div>
                <h2 class="textgen__preview-title" id="textgen-preview-title">Sinopsis generada</h2>
                <p class="textgen__meta" id="textgen-meta"></p>
              </div>
              <p class="textgen__theme" id="textgen-theme-label"></p>
            </header>

            <div class="textgen__output">
              <h3 class="textgen__title" id="textgen-title"></h3>
              <div class="textgen__body" id="textgen-output"></div>
            </div>
          </article>
        </div>
      </section>`;

    const form = root.querySelector('#textgen-form');
    const themeSelect = root.querySelector('#textgen-theme');
    const themeNote = root.querySelector('#textgen-theme-note');
    const themeLabel = root.querySelector('#textgen-theme-label');
    const paragraphsInput = root.querySelector('#textgen-paragraphs');
    const paragraphsOutput = root.querySelector('#textgen-paragraphs-output');
    const sentencesInput = root.querySelector('#textgen-sentences');
    const sentencesOutput = root.querySelector('#textgen-sentences-output');
    const titleToggle = root.querySelector('#textgen-title-toggle');
    const titleNode = root.querySelector('#textgen-title');
    const bodyNode = root.querySelector('#textgen-output');
    const metaNode = root.querySelector('#textgen-meta');
    const copyButton = root.querySelector('#textgen-copy');

    const formatOutput = () => {
      if (state.output.paragraphs.length === 0) return '';
      const parts = [];
      if (state.includeTitle && state.output.title) parts.push(state.output.title);
      parts.push(...state.output.paragraphs);
      return parts.join('\n\n');
    };

    const paintOutput = () => {
      const theme = findTextTheme(state.theme);
      themeNote.textContent = theme.tagline;
      themeLabel.textContent = theme.label;

      const hasOutput = state.output.paragraphs.length > 0;
      if (!hasOutput) {
        titleNode.hidden = true;
        bodyNode.innerHTML = '<p class="textgen__placeholder">Pulsa «Generar de nuevo» para crear una sinopsis.</p>';
        metaNode.textContent = '';
        return;
      }

      titleNode.hidden = !state.includeTitle || !state.output.title;
      titleNode.textContent = state.output.title;
      bodyNode.innerHTML = state.output.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');

      const words = state.output.paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      metaNode.textContent = `${state.output.paragraphs.length} párrafo${
        state.output.paragraphs.length === 1 ? '' : 's'
      } · ${words} palabras · ${minutes} min de lectura`;
    };

    const regenerate = (notify = false) => {
      const theme = findTextTheme(state.theme);
      state = {
        ...state,
        output: generateText(theme, state.paragraphs, state.sentences),
      };
      write(STORAGE_KEY, state);
      paintOutput();
      if (notify) announce('Texto generado');
    };

    themeSelect.addEventListener('change', () => {
      state = { ...state, theme: themeSelect.value };
      regenerate();
    });

    paragraphsInput.addEventListener('input', () => {
      paragraphsOutput.textContent = paragraphsInput.value;
    });

    paragraphsInput.addEventListener('change', () => {
      state = { ...state, paragraphs: Number(paragraphsInput.value) };
      regenerate();
    });

    sentencesInput.addEventListener('input', () => {
      sentencesOutput.textContent = sentencesInput.value;
    });

    sentencesInput.addEventListener('change', () => {
      state = { ...state, sentences: Number(sentencesInput.value) };
      regenerate();
    });

    titleToggle.addEventListener('change', () => {
      state = { ...state, includeTitle: titleToggle.checked };
      write(STORAGE_KEY, state);
      paintOutput();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      regenerate(true);
    });

    copyButton.addEventListener('click', async () => {
      const text = formatOutput();
      if (!text) {
        announce('Genera una sinopsis primero');
        return;
      }

      try {
        await copyText(text);
        announce('Texto copiado al portapapeles');
      } catch (error) {
        announce('No se pudo copiar el texto');
      }
    });

    if (state.output.paragraphs.length === 0) {
      regenerate();
    } else {
      paintOutput();
    }
  },
};
