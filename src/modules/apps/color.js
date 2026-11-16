import '../../css/apps/color.css';

import { read, write, announce } from '../store.js';
import { icon, copyText, escapeHtml } from '../ui.js';

const STORAGE_KEY = 'color-studio';

export const DEFAULT_COLOR = {
  hue: 214,
  saturation: 76,
  lightness: 56,
  harmony: 'analogous',
  scheme: 'dark',
};

export const HARMONIES = [
  {
    id: 'complementary',
    label: 'Complementaria',
    description: 'Dos tonos opuestos en la rueda. Máximo contraste cromático.',
    offsets: [0, 180],
    names: ['Base', 'Complementario'],
  },
  {
    id: 'analogous',
    label: 'Análoga',
    description: 'Tonos vecinos en la rueda. Una paleta serena y cohesionada.',
    offsets: [-30, 0, 30],
    names: ['Análogo frío', 'Base', 'Análogo cálido'],
  },
  {
    id: 'triadic',
    label: 'Triádica',
    description: 'Tres tonos equidistantes. Vitalidad sin perder el equilibrio.',
    offsets: [0, 120, 240],
    names: ['Base', 'Tríada +120°', 'Tríada +240°'],
  },
  {
    id: 'tetradic',
    label: 'Tetrádica',
    description: 'Cuatro tonos en dos parejas complementarias. Rica y versátil.',
    offsets: [0, 90, 180, 270],
    names: ['Base', 'Tetra +90°', 'Oposición', 'Tetra +270°'],
  },
  {
    id: 'monochromatic',
    label: 'Monocromática',
    description: 'Un solo matiz con distintas luminosidades. Orden y profundidad.',
    offsets: [0],
    names: ['Sombra', 'Sombra suave', 'Base', 'Luz suave', 'Luz'],
  },
];

const SCHEMES = {
  dark: {
    background: 7,
    surface: 11,
    surface2: 16,
    border: 28,
    text: 95,
    muted: 72,
    tint: 16,
    direction: 1,
  },
  light: {
    background: 97,
    surface: 100,
    surface2: 94,
    border: 85,
    text: 12,
    muted: 42,
    tint: 14,
    direction: -1,
  },
};

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {number} hue
 * @returns {number}
 */
function normalizeHue(hue) {
  return ((hue % 360) + 360) % 360;
}

/**
 * @param {number} hue 0-360
 * @param {number} saturation 0-100
 * @param {number} lightness 0-100
 * @returns {{r: number, g: number, b: number}}
 */
function hslToRgb(hue, saturation, lightness) {
  const h = normalizeHue(hue) / 360;
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;

  if (s === 0) {
    const channel = Math.round(l * 255);
    return { r: channel, g: channel, b: channel };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const toChannel = (value) => {
    let t = value;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  return {
    r: Math.round(toChannel(h + 1 / 3) * 255),
    g: Math.round(toChannel(h) * 255),
    b: Math.round(toChannel(h - 1 / 3) * 255),
  };
}

/**
 * @param {{r: number, g: number, b: number}} rgb
 * @returns {string}
 */
function rgbToHex(rgb) {
  return `#${[rgb.r, rgb.g, rgb.b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * @param {string} hex
 * @returns {{r: number, g: number, b: number}}
 */
function hexToRgb(hex) {
  const clean = String(hex).replace('#', '');
  const value = clean.length === 3
    ? clean
        .split('')
        .map((channel) => channel + channel)
        .join('')
    : clean;
  const numeric = Number.parseInt(value, 16);
  if (!Number.isFinite(numeric)) return { r: 0, g: 0, b: 0 };
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

/**
 * @param {string} hex
 * @returns {{h: number, s: number, l: number}}
 */
export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

/**
 * @param {number} hue
 * @param {number} saturation
 * @param {number} lightness
 * @returns {string}
 */
export function hslToHex(hue, saturation, lightness) {
  return rgbToHex(hslToRgb(hue, saturation, lightness));
}

/**
 * @param {string} hex
 * @returns {number} relative luminance (WCAG 2.1)
 */
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG contrast ratio between two colors.
 * @param {string} foreground
 * @param {string} background
 * @returns {number}
 */
export function contrastRatio(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lightest = Math.max(first, second);
  const darkest = Math.min(first, second);
  return (lightest + 0.05) / (darkest + 0.05);
}

/**
 * @param {string} hex
 * @returns {string} black or white, whichever reads better on top
 */
function bestInk(hex) {
  return contrastRatio('#000000', hex) >= contrastRatio('#ffffff', hex) ? '#000000' : '#ffffff';
}

/**
 * @param {number} hue
 * @param {number} saturation
 * @param {number} lightness
 * @returns {{h: number, s: number, l: number, hex: string, ink: string}}
 */
function makeColor(hue, saturation, lightness) {
  const h = Math.round(normalizeHue(hue));
  const s = Math.round(clamp(saturation, 0, 100));
  const l = Math.round(clamp(lightness, 0, 100));
  const hex = hslToHex(h, s, l);
  return { h, s, l, hex, ink: bestInk(hex) };
}

/**
 * @param {string} id
 * @returns {typeof HARMONIES[number]}
 */
export function findHarmony(id) {
  return HARMONIES.find((harmony) => harmony.id === id) || HARMONIES[0];
}

/**
 * @param {unknown} value
 * @param {number} fallback
 * @returns {number}
 */
function toNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

/**
 * @returns {typeof DEFAULT_COLOR}
 */
export function getColorState() {
  const stored = read(STORAGE_KEY, {});
  const source = stored && typeof stored === 'object' ? stored : {};
  return {
    hue: Math.round(clamp(toNumber(source.hue, DEFAULT_COLOR.hue), 0, 360)),
    saturation: Math.round(clamp(toNumber(source.saturation, DEFAULT_COLOR.saturation), 0, 100)),
    lightness: Math.round(clamp(toNumber(source.lightness, DEFAULT_COLOR.lightness), 0, 100)),
    harmony: findHarmony(source.harmony).id,
    scheme: source.scheme === 'light' ? 'light' : 'dark',
  };
}

/**
 * @param {typeof DEFAULT_COLOR} state
 * @returns {Array<{h: number, s: number, l: number, hex: string, ink: string, name: string}>}
 */
export function buildHarmony(state) {
  const harmony = findHarmony(state.harmony);

  if (harmony.id === 'monochromatic') {
    const steps = [-28, -14, 0, 14, 28];
    return steps.map((offset, index) => ({
      ...makeColor(state.hue, state.saturation, state.lightness + offset),
      name: harmony.names[index],
    }));
  }

  return harmony.offsets.map((offset, index) => ({
    ...makeColor(state.hue + offset, state.saturation, state.lightness),
    name: harmony.names[index],
  }));
}

/**
 * Raises or lowers lightness until the target contrast is met.
 * @param {{h: number, s: number, l: number, hex: string, ink: string}} color
 * @param {string} background
 * @param {number} target
 * @param {1|-1} direction
 */
function tuneToContrast(color, background, target, direction) {
  let lightness = color.l;
  let hex = hslToHex(color.h, color.s, lightness);
  let guard = 0;

  while (contrastRatio(hex, background) < target && guard < 100) {
    lightness = clamp(lightness + direction, 0, 100);
    hex = hslToHex(color.h, color.s, lightness);
    guard += 1;
    if (lightness === 0 || lightness === 100) break;
  }

  return { ...color, l: Math.round(lightness), hex, ink: bestInk(hex) };
}

/**
 * @param {number} ratio
 * @param {number} target
 * @returns {{level: string, label: string, pass: boolean}}
 */
function contrastLevel(ratio, target) {
  if (ratio >= 7) return { level: 'aaa', label: 'AAA', pass: true };
  if (ratio >= 4.5) return { level: 'aa', label: 'AA', pass: true };
  if (ratio >= 3 && target <= 3) return { level: 'aa', label: 'AA · 3:1', pass: true };
  return { level: 'fail', label: 'No cumple', pass: false };
}

/**
 * Builds a tinted neutral palette and tunes its text pairs to WCAG 2.1 AA.
 * @param {typeof DEFAULT_COLOR} state
 */
export function buildNeutrals(state) {
  const scheme = SCHEMES[state.scheme] || SCHEMES.dark;
  const hue = state.hue;
  const tint = scheme.tint;
  const direction = scheme.direction;

  const background = makeColor(hue, tint, scheme.background);
  const surface = makeColor(hue, tint, scheme.surface);
  const surface2 = makeColor(hue, Math.max(8, tint - 2), scheme.surface2);
  // Surface 2 is the closest panel to the text color, so it is the most
  // demanding reference: any pair that passes here also passes on the rest.
  const reference = surface2.hex;
  const border = tuneToContrast(makeColor(hue, Math.max(6, tint - 3), scheme.border), reference, 3, direction);
  const text = tuneToContrast(makeColor(hue, Math.max(8, tint - 4), scheme.text), reference, 4.5, direction);
  const muted = tuneToContrast(makeColor(hue, Math.max(8, tint - 6), scheme.muted), reference, 4.5, direction);
  const accent = tuneToContrast(
    makeColor(hue, state.saturation, state.lightness),
    reference,
    4.5,
    direction
  );
  const onAccent = accent.ink;

  const checks = {
    text: {
      ratio: contrastRatio(text.hex, reference),
      target: 4.5,
      ...contrastLevel(contrastRatio(text.hex, reference), 4.5),
    },
    muted: {
      ratio: contrastRatio(muted.hex, reference),
      target: 4.5,
      ...contrastLevel(contrastRatio(muted.hex, reference), 4.5),
    },
    border: {
      ratio: contrastRatio(border.hex, reference),
      target: 3,
      ...contrastLevel(contrastRatio(border.hex, reference), 3),
    },
    accent: {
      ratio: contrastRatio(accent.hex, reference),
      target: 4.5,
      ...contrastLevel(contrastRatio(accent.hex, reference), 4.5),
    },
  };

  return {
    background,
    surface,
    surface2,
    border,
    text,
    muted,
    accent,
    onAccent,
    checks,
  };
}

export default {
  meta: { title: 'Color' },
  render(root) {
    let state = getColorState();
    let saveTimer = null;

    const persist = () => {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => {
        saveTimer = null;
        write(STORAGE_KEY, state);
      }, 200);
    };

    const harmonyOptions = HARMONIES.map(
      (harmony) => `
        <input class="segmented__input" type="radio" name="color-harmony" id="color-harmony-${harmony.id}" value="${harmony.id}" ${
          harmony.id === state.harmony ? 'checked' : ''
        } />
        <label class="segmented__label" for="color-harmony-${harmony.id}">${escapeHtml(harmony.label)}</label>`
    ).join('');

    root.innerHTML = `
      <section class="app app--color">
        <header class="app__header">
          <div>
            <h1 class="app__title">Laboratorio de color</h1>
            <p class="app__count">Elige un color base, explora armonías y genera neutros con contraste WCAG AA.</p>
          </div>
          <button class="button button--ghost" id="color-reset" type="button">
            ${icon('icon-refresh')}<span>Restablecer</span>
          </button>
        </header>

        <div class="color__layout">
          <section class="color__panel color__picker card" aria-labelledby="color-picker-title">
            <header class="color__panel-head">
              <h2 class="color__panel-title" id="color-picker-title">Color base</h2>
              <output class="color__base-hex" id="color-base-hex" for="color-base-input"></output>
            </header>

            <div class="color__wheel-wrap">
              <div class="color__wheel" id="color-wheel" aria-hidden="true">
                <span class="color__wheel-handle" id="color-wheel-handle"></span>
              </div>

              <label class="color__native-control">
                <span class="field__label">Selector preciso</span>
                <input class="color__native" id="color-base-input" type="color" value="${hslToHex(
                  state.hue,
                  state.saturation,
                  state.lightness
                )}" />
              </label>
            </div>

            <p class="field__hint">Arrastra sobre la rueda o usa los deslizadores. El selector y los controles de rango funcionan con teclado.</p>

            <details class="color__sliders-panel">
              <summary class="color__sliders-summary">Matiz, saturación y luminosidad</summary>

              <div class="color__sliders">
                <div class="field">
                  <div class="field__inline">
                    <label class="field__label" for="color-hue">Matiz</label>
                    <output class="field__value" id="color-hue-output" for="color-hue"></output>
                  </div>
                  <input class="field__control" id="color-hue" type="range" min="0" max="360" step="1" value="${state.hue}" />
                </div>

                <div class="field">
                  <div class="field__inline">
                    <label class="field__label" for="color-saturation">Saturación</label>
                    <output class="field__value" id="color-saturation-output" for="color-saturation"></output>
                  </div>
                  <input class="field__control" id="color-saturation" type="range" min="0" max="100" step="1" value="${state.saturation}" />
                </div>

                <div class="field">
                  <div class="field__inline">
                    <label class="field__label" for="color-lightness">Luminosidad</label>
                    <output class="field__value" id="color-lightness-output" for="color-lightness"></output>
                  </div>
                  <input class="field__control" id="color-lightness" type="range" min="0" max="100" step="1" value="${state.lightness}" />
                </div>
              </div>
            </details>
          </section>

          <section class="color__panel card" aria-labelledby="color-harmony-title">
            <header class="color__panel-head">
              <div>
                <h2 class="color__panel-title" id="color-harmony-title">Armonía</h2>
                <p class="field__hint" id="color-harmony-note"></p>
              </div>
              <div class="color__harmony-actions">
                <output class="color__harmony-name" id="color-harmony-name"></output>
                <button class="button button--ghost" id="color-copy-harmony" type="button">
                  ${icon('icon-copy', { size: 16 })}<span>Copiar armonía</span>
                </button>
              </div>
            </header>

            <fieldset class="segmented color__rules" id="color-rules">
              <legend class="sr-only">Regla de armonía</legend>
              ${harmonyOptions}
            </fieldset>

            <ul class="color__swatches" id="color-swatches"></ul>
            <p class="field__hint">Selecciona una muestra para copiar su valor HEX.</p>
          </section>

          <section class="color__panel color__neutrals card" aria-labelledby="color-neutral-title">
            <header class="color__panel-head">
              <div>
                <h2 class="color__panel-title" id="color-neutral-title">Neutros de interfaz</h2>
                <p class="field__hint">Tonos de baja saturación derivados del color base, con pares ajustados a WCAG 2.1 AA.</p>
              </div>

              <fieldset class="segmented color__scheme" id="color-scheme">
                <legend class="sr-only">Esquema de la interfaz</legend>
                <input class="segmented__input" type="radio" name="color-scheme" id="color-scheme-dark" value="dark" ${
                  state.scheme === 'dark' ? 'checked' : ''
                } />
                <label class="segmented__label" for="color-scheme-dark">Oscuro</label>
                <input class="segmented__input" type="radio" name="color-scheme" id="color-scheme-light" value="light" ${
                  state.scheme === 'light' ? 'checked' : ''
                } />
                <label class="segmented__label" for="color-scheme-light">Claro</label>
              </fieldset>
            </header>

            <div class="color__neutral-layout">
              <ul class="color__tokens" id="color-tokens"></ul>

              <div class="color__preview" id="color-preview">
                <p class="color__preview-eyebrow">Vista previa</p>
                <div class="color__preview-card">
                  <h3 class="color__preview-title">Interfaz con contraste AA</h3>
                  <p class="color__preview-body">
                    Los colores neutros mantienen la jerarquía visual y garantizan la lectura incluso en
                    pantallas con poca luz.
                  </p>
                  <p class="color__preview-actions">
                    <span class="color__preview-button">Acción principal</span>
                    <span class="color__preview-muted">Texto secundario</span>
                  </p>
                </div>
                <p class="color__preview-caption" id="color-contrast-summary"></p>
              </div>
            </div>
          </section>
        </div>
      </section>`;

    const wheel = root.querySelector('#color-wheel');
    const wheelHandle = root.querySelector('#color-wheel-handle');
    const nativeInput = root.querySelector('#color-base-input');
    const baseHex = root.querySelector('#color-base-hex');
    const harmonyName = root.querySelector('#color-harmony-name');
    const harmonyNote = root.querySelector('#color-harmony-note');
    const swatches = root.querySelector('#color-swatches');
    const rules = root.querySelector('#color-rules');
    const schemeField = root.querySelector('#color-scheme');
    const tokens = root.querySelector('#color-tokens');
    const preview = root.querySelector('#color-preview');
    const contrastSummary = root.querySelector('#color-contrast-summary');
    const section = root.querySelector('.app--color');
    const hueInput = root.querySelector('#color-hue');
    const saturationInput = root.querySelector('#color-saturation');
    const lightnessInput = root.querySelector('#color-lightness');
    const hueOutput = root.querySelector('#color-hue-output');
    const saturationOutput = root.querySelector('#color-saturation-output');
    const lightnessOutput = root.querySelector('#color-lightness-output');

    const syncRadio = (container, value) => {
      container.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.checked = input.value === value;
      });
    };

    const paintBase = () => {
      const hex = hslToHex(state.hue, state.saturation, state.lightness);
      const angle = (state.hue * Math.PI) / 180;
      const distance = state.saturation * 0.46;

      wheelHandle.style.left = `${50 + Math.cos(angle) * distance}%`;
      wheelHandle.style.top = `${50 + Math.sin(angle) * distance}%`;
      wheelHandle.style.setProperty('--wheel-color', hex);
      wheel.style.setProperty('--wheel-color', hex);

      nativeInput.value = hex;
      baseHex.textContent = hex.toUpperCase();
      hueInput.value = String(state.hue);
      saturationInput.value = String(state.saturation);
      lightnessInput.value = String(state.lightness);
      hueOutput.textContent = `${state.hue}°`;
      saturationOutput.textContent = `${state.saturation}%`;
      lightnessOutput.textContent = `${state.lightness}%`;
    };

    const paintHarmony = () => {
      const harmony = findHarmony(state.harmony);
      const colors = buildHarmony(state);

      harmonyName.textContent = harmony.label;
      harmonyNote.textContent = harmony.description;
      swatches.innerHTML = colors
        .map(
          (color) => `
          <li class="color__swatch-item">
            <button
              class="color__swatch"
              type="button"
              data-copy="${color.hex}"
              aria-label="Copiar ${color.hex.toUpperCase()} (${escapeHtml(color.name)})"
              style="--swatch-color:${color.hex};--swatch-ink:${color.ink}"
            >
              <span class="color__swatch-name">${escapeHtml(color.name)}</span>
              <span class="color__swatch-hex">${color.hex.toUpperCase()}</span>
              <span class="color__swatch-hsl">H ${color.h}° · S ${color.s}% · L ${color.l}%</span>
            </button>
          </li>`
        )
        .join('');
    };

    const paintNeutrals = () => {
      const palette = buildNeutrals(state);
      const rows = [
        { id: 'background', name: 'Fondo', color: palette.background },
        { id: 'surface', name: 'Superficie', color: palette.surface },
        { id: 'surface-2', name: 'Superficie 2', color: palette.surface2 },
        { id: 'border', name: 'Borde', color: palette.border, check: palette.checks.border },
        { id: 'text', name: 'Texto', color: palette.text, check: palette.checks.text },
        { id: 'muted', name: 'Texto secundario', color: palette.muted, check: palette.checks.muted },
        { id: 'accent', name: 'Acento', color: palette.accent, check: palette.checks.accent },
      ];

      tokens.innerHTML = rows
        .map(
          (row) => `
          <li class="color__token">
            <button
              class="color__token-button"
              type="button"
              data-copy="${row.color.hex}"
              aria-label="Copiar ${row.color.hex.toUpperCase()} (${escapeHtml(row.name)})"
            >
              <span class="color__token-chip" style="--token-color:${row.color.hex}" aria-hidden="true"></span>
              <span class="color__token-body">
                <span class="color__token-name">${escapeHtml(row.name)}</span>
                <span class="color__token-hex">${row.color.hex.toUpperCase()}</span>
              </span>
              ${
                row.check
                  ? `<span class="color__token-badge" data-level="${row.check.level}">${row.check.ratio.toFixed(
                      2
                    )}:1 · ${row.check.label}</span>`
                  : '<span class="color__token-badge" data-level="base">Neutro</span>'
              }
            </button>
          </li>`
        )
        .join('');

      preview.style.setProperty('--preview-bg', palette.background.hex);
      preview.style.setProperty('--preview-surface', palette.surface.hex);
      preview.style.setProperty('--preview-surface-2', palette.surface2.hex);
      preview.style.setProperty('--preview-border', palette.border.hex);
      preview.style.setProperty('--preview-text', palette.text.hex);
      preview.style.setProperty('--preview-muted', palette.muted.hex);
      preview.style.setProperty('--preview-accent', palette.accent.hex);
      preview.style.setProperty('--preview-on-accent', palette.onAccent);

      const failing = Object.values(palette.checks).filter((check) => !check.pass);
      contrastSummary.textContent =
        failing.length === 0
          ? 'Todos los pares de texto y componentes cumplen AA en fondo y superficies.'
          : 'Ajusta el color base: algún par no alcanza el mínimo AA.';
    };

    const paintAll = () => {
      syncRadio(rules, state.harmony);
      syncRadio(schemeField, state.scheme);
      paintBase();
      paintHarmony();
      paintNeutrals();
    };

    const updateState = (patch) => {
      state = { ...state, ...patch };
      persist();
      paintAll();
    };

    let wheelPointer = null;

    const updateFromPointer = (event) => {
      const rect = wheel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const radius = Math.max(1, rect.width / 2);
      const distance = Math.min(radius, Math.hypot(dx, dy));
      const hue = Math.round(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360);
      const saturation = Math.round((distance / radius) * 100);

      updateState({ hue, saturation });
    };

    wheel.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      wheelPointer = event.pointerId;
      wheel.setPointerCapture(event.pointerId);
      updateFromPointer(event);
      event.preventDefault();
    });

    wheel.addEventListener('pointermove', (event) => {
      if (wheelPointer !== event.pointerId) return;
      updateFromPointer(event);
    });

    const endWheelDrag = (event) => {
      if (wheelPointer !== event.pointerId) return;
      wheelPointer = null;
      if (wheel.hasPointerCapture(event.pointerId)) wheel.releasePointerCapture(event.pointerId);
    };

    wheel.addEventListener('pointerup', endWheelDrag);
    wheel.addEventListener('pointercancel', endWheelDrag);

    nativeInput.addEventListener('input', () => {
      const hsl = hexToHsl(nativeInput.value);
      updateState({ hue: hsl.h, saturation: hsl.s, lightness: hsl.l });
    });

    hueInput.addEventListener('input', () => updateState({ hue: Number(hueInput.value) }));
    saturationInput.addEventListener('input', () => updateState({ saturation: Number(saturationInput.value) }));
    lightnessInput.addEventListener('input', () => updateState({ lightness: Number(lightnessInput.value) }));

    rules.addEventListener('change', (event) => {
      if (event.target.name !== 'color-harmony') return;
      updateState({ harmony: event.target.value });
    });

    schemeField.addEventListener('change', (event) => {
      if (event.target.name !== 'color-scheme') return;
      updateState({ scheme: event.target.value });
    });

    section.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-copy]');
      if (!button) return;

      try {
        await copyText(button.dataset.copy);
        announce(`Color ${button.dataset.copy.toUpperCase()} copiado`);
      } catch (error) {
        announce('No se pudo copiar el color');
      }
    });

    root.querySelector('#color-copy-harmony').addEventListener('click', async () => {
      const harmony = findHarmony(state.harmony);
      const values = buildHarmony(state).map((color) => color.hex.toUpperCase());

      try {
        await copyText(values.join(', '));
        announce(`Armonía ${harmony.label} copiada`);
      } catch (error) {
        announce('No se pudo copiar la armonía');
      }
    });

    root.querySelector('#color-reset').addEventListener('click', () => {
      state = { ...DEFAULT_COLOR };
      write(STORAGE_KEY, state);
      paintAll();
      announce('Laboratorio de color restablecido');
    });

    paintAll();

    return () => {
      if (saveTimer !== null) {
        window.clearTimeout(saveTimer);
        saveTimer = null;
        write(STORAGE_KEY, state);
      }
    };
  },
};
