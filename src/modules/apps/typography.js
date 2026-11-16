import '../../css/apps/typography.css';

import { read, write, announce } from '../store.js';
import { icon, escapeHtml } from '../ui.js';
import {
  HEADING_FONTS,
  DEFAULT_TYPOGRAPHY,
  findHeadingFont,
  findBodyFont,
  selectBodyFonts,
} from '../data/fonts.js';

const STORAGE_KEY = 'typography';
const HEADING_SIZE_RANGE = { min: 28, max: 80, fallback: DEFAULT_TYPOGRAPHY.headingSize };
const BODY_SIZE_RANGE = { min: 14, max: 24, fallback: DEFAULT_TYPOGRAPHY.bodySize };
const LINE_HEIGHT_RANGE = { min: 1.2, max: 2, fallback: DEFAULT_TYPOGRAPHY.lineHeight };

/**
 * @param {number} value
 * @param {{min: number, max: number, fallback: number}} range
 * @returns {number}
 */
function clampNumber(value, range) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return range.fallback;
  return Math.min(range.max, Math.max(range.min, numeric));
}

/**
 * Reads the saved typography setup and repairs values that no longer fit the
 * current pairing rules.
 * @returns {typeof DEFAULT_TYPOGRAPHY}
 */
function getState() {
  const stored = read(STORAGE_KEY, {});
  const source = stored && typeof stored === 'object' ? stored : {};
  const heading = findHeadingFont(source.headingFont);
  const bodyOptions = selectBodyFonts(heading.id);
  const bodyIds = bodyOptions.map((font) => font.id);

  return {
    headingFont: heading.id,
    bodyFont: bodyIds.includes(source.bodyFont) ? source.bodyFont : bodyIds[0],
    headingSize: clampNumber(source.headingSize, HEADING_SIZE_RANGE),
    bodySize: clampNumber(source.bodySize, BODY_SIZE_RANGE),
    lineHeight: Math.round(clampNumber(source.lineHeight, LINE_HEIGHT_RANGE) * 100) / 100,
  };
}

/**
 * @param {Partial<typeof DEFAULT_TYPOGRAPHY>} patch
 */
function saveState(patch) {
  write(STORAGE_KEY, { ...getState(), ...patch });
}

export default {
  meta: { title: 'Tipografía' },
  render(root) {
    const state = getState();
    const headingOptions = HEADING_FONTS.map(
      (font) => `<option value="${font.id}" ${font.id === state.headingFont ? 'selected' : ''}>${escapeHtml(font.label)}</option>`
    ).join('');

    root.innerHTML = `
      <section class="app app--typography">
        <header class="app__header">
          <div>
            <h1 class="app__title">Tipografía</h1>
            <p class="app__count">Encuentra una pareja para titulares y textos, y ajusta la escala en vivo.</p>
          </div>
          <button class="button button--ghost" id="type-reset" type="button">
            ${icon('icon-refresh')}<span>Restablecer</span>
          </button>
        </header>

        <div class="type__layout">
          <div class="type__controls card">
            <div class="field">
              <label class="field__label" for="type-heading-font">Tipografía para titulares</label>
              <select class="field__control" id="type-heading-font" name="headingFont">
                ${headingOptions}
              </select>
              <p class="field__hint" id="type-heading-note"></p>
            </div>

            <div class="field">
              <label class="field__label" for="type-body-font">Tipografía para textos</label>
              <select class="field__control" id="type-body-font" name="bodyFont"></select>
              <p class="field__hint" id="type-body-note"></p>
            </div>

            <div class="type__pairings">
              <p class="field__label">Combinaciones sugeridas</p>
              <ul class="type__pair-list" id="type-pairings"></ul>
            </div>

            <fieldset class="type__sizes">
              <legend class="field__label">Escala de la muestra</legend>

              <div class="field">
                <div class="field__inline">
                  <label class="field__label" for="type-heading-size">Tamaño del titular</label>
                  <output class="field__value" id="type-heading-size-output" for="type-heading-size"></output>
                </div>
                <input
                  class="field__control"
                  id="type-heading-size"
                  name="headingSize"
                  type="range"
                  min="${HEADING_SIZE_RANGE.min}"
                  max="${HEADING_SIZE_RANGE.max}"
                  step="1"
                  value="${state.headingSize}"
                />
              </div>

              <div class="field">
                <div class="field__inline">
                  <label class="field__label" for="type-body-size">Tamaño del texto</label>
                  <output class="field__value" id="type-body-size-output" for="type-body-size"></output>
                </div>
                <input
                  class="field__control"
                  id="type-body-size"
                  name="bodySize"
                  type="range"
                  min="${BODY_SIZE_RANGE.min}"
                  max="${BODY_SIZE_RANGE.max}"
                  step="1"
                  value="${state.bodySize}"
                />
              </div>

              <div class="field">
                <div class="field__inline">
                  <label class="field__label" for="type-line-height">Interlineado</label>
                  <output class="field__value" id="type-line-height-output" for="type-line-height"></output>
                </div>
                <input
                  class="field__control"
                  id="type-line-height"
                  name="lineHeight"
                  type="range"
                  min="${LINE_HEIGHT_RANGE.min}"
                  max="${LINE_HEIGHT_RANGE.max}"
                  step="0.05"
                  value="${state.lineHeight}"
                />
              </div>
            </fieldset>

            <p class="field__hint">Los ajustes se guardan y se aplican solo a esta muestra tipográfica.</p>
          </div>

          <section class="type__preview card" aria-labelledby="type-preview-title">
            <header class="type__preview-head">
              <div>
                <h2 class="type__preview-title" id="type-preview-title">Muestra en vivo</h2>
                <p class="type__preview-subtitle" id="type-pair-label"></p>
              </div>
              <p class="type__scale" id="type-scale-readout"></p>
            </header>

            <div class="type__specimen" id="type-specimen">
              <p class="type__eyebrow">Muestra tipográfica</p>
              <h3 class="type__headline">Historias que se leen solas</h3>
              <p class="type__lead">
                Una buena pareja tipográfica no se nota: se siente. El titular marca el tono y el texto
                hace que la lectura fluya sin esfuerzo, incluso después de varios párrafos.
              </p>
              <blockquote class="type__quote">
                «El titular marca el tono; el texto hace que la lectura fluya.»
              </blockquote>
              <p class="type__caption" id="type-caption"></p>
            </div>
          </section>
        </div>
      </section>`;

    const headingSelect = root.querySelector('#type-heading-font');
    const bodySelect = root.querySelector('#type-body-font');
    const headingNote = root.querySelector('#type-heading-note');
    const bodyNote = root.querySelector('#type-body-note');
    const pairings = root.querySelector('#type-pairings');
    const pairLabel = root.querySelector('#type-pair-label');
    const scaleReadout = root.querySelector('#type-scale-readout');
    const specimen = root.querySelector('#type-specimen');
    const caption = root.querySelector('#type-caption');
    const headingSizeInput = root.querySelector('#type-heading-size');
    const bodySizeInput = root.querySelector('#type-body-size');
    const lineHeightInput = root.querySelector('#type-line-height');
    const headingSizeOutput = root.querySelector('#type-heading-size-output');
    const bodySizeOutput = root.querySelector('#type-body-size-output');
    const lineHeightOutput = root.querySelector('#type-line-height-output');

    const paintBodyOptions = (selectedId) => {
      const options = selectBodyFonts(headingSelect.value);
      bodySelect.innerHTML = options
        .map(
          (font) =>
            `<option value="${font.id}" ${font.id === selectedId ? 'selected' : ''}>${escapeHtml(font.label)}</option>`
        )
        .join('');
      return options.some((font) => font.id === selectedId) ? selectedId : options[0].id;
    };

    const paintPairings = () => {
      const options = selectBodyFonts(headingSelect.value);
      pairings.innerHTML = options
        .map(
          (font) =>
            `<li class="type__pair-chip${font.id === bodySelect.value ? ' is-active' : ''}">${escapeHtml(
              font.label
            )}</li>`
        )
        .join('');
    };

    const paintPreview = () => {
      const current = getState();
      const heading = findHeadingFont(current.headingFont);
      const body = findBodyFont(current.bodyFont);
      const headingRem = (current.headingSize / 16).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
      const bodyRem = (current.bodySize / 16).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');

      specimen.style.setProperty('--specimen-heading-font', heading.stack);
      specimen.style.setProperty('--specimen-body-font', body.stack);
      specimen.style.setProperty('--specimen-heading-size', `${headingRem}rem`);
      specimen.style.setProperty('--specimen-body-size', `${bodyRem}rem`);
      specimen.style.setProperty('--specimen-line-height', String(current.lineHeight));

      headingSizeOutput.textContent = `${current.headingSize} px`;
      bodySizeOutput.textContent = `${current.bodySize} px`;
      lineHeightOutput.textContent = current.lineHeight.toFixed(2);
      scaleReadout.textContent = `${current.headingSize} / ${current.bodySize} px · ${current.lineHeight.toFixed(2)}`;
      caption.textContent = `Titular: ${heading.label} · Texto: ${body.label}`;
      pairLabel.textContent = `${heading.label} + ${body.label}`;

      headingNote.textContent = heading.description;
      bodyNote.textContent = body.description;
    };

    const sync = () => {
      const current = getState();
      const bodyId = paintBodyOptions(current.bodyFont);
      if (bodyId !== current.bodyFont) saveState({ bodyFont: bodyId });
      paintPairings();
      paintPreview();
    };

    headingSelect.addEventListener('change', () => {
      const previous = getState();
      const options = selectBodyFonts(headingSelect.value);
      const bodyId = options.some((font) => font.id === previous.bodyFont) ? previous.bodyFont : options[0].id;
      saveState({ headingFont: headingSelect.value, bodyFont: bodyId });
      sync();
      if (bodyId !== previous.bodyFont) {
        announce(`Tipografía de textos ajustada a ${findBodyFont(bodyId).label}`);
      }
    });

    bodySelect.addEventListener('change', () => {
      saveState({ bodyFont: bodySelect.value });
      paintPairings();
      paintPreview();
    });

    headingSizeInput.addEventListener('input', () => {
      saveState({ headingSize: Number(headingSizeInput.value) });
      paintPreview();
    });

    bodySizeInput.addEventListener('input', () => {
      saveState({ bodySize: Number(bodySizeInput.value) });
      paintPreview();
    });

    lineHeightInput.addEventListener('input', () => {
      saveState({ lineHeight: Number(lineHeightInput.value) });
      paintPreview();
    });

    root.querySelector('#type-reset').addEventListener('click', () => {
      write(STORAGE_KEY, { ...DEFAULT_TYPOGRAPHY });
      const defaults = getState();
      headingSelect.value = defaults.headingFont;
      bodySelect.value = paintBodyOptions(defaults.bodyFont);
      headingSizeInput.value = String(defaults.headingSize);
      bodySizeInput.value = String(defaults.bodySize);
      lineHeightInput.value = String(defaults.lineHeight);
      paintPairings();
      paintPreview();
      announce('Tipografía restablecida');
    });

    sync();
  },
};
