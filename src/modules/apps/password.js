import '../../css/apps/password.css';

import { read, write, announce } from '../store.js';
import { icon, copyText } from '../ui.js';

const META_KEY = 'password-meta';

export const CHARACTER_SETS = {
  lower: { label: 'Minúsculas', chars: 'abcdefghijklmnopqrstuvwxyz' },
  upper: { label: 'Mayúsculas', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  digits: { label: 'Números', chars: '0123456789' },
  symbols: { label: 'Símbolos', chars: '!@#$%^&*()-_=+[]{};:,.?/' },
};

const AMBIGUOUS = '0OoIl1|`\'"{}[]()/\\';

const STRENGTH_LEVELS = [
  { min: 0, label: 'Débil', tone: 'weak' },
  { min: 40, label: 'Aceptable', tone: 'fair' },
  { min: 60, label: 'Fuerte', tone: 'strong' },
  { min: 80, label: 'Muy fuerte', tone: 'excellent' },
];

/**
 * Unbiased random integer in [0, max) using the Web Crypto API.
 * @param {number} max
 */
function randomIndex(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  let value = 0;
  do {
    window.crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

/**
 * @param {string} pool
 */
function randomChar(pool) {
  return pool.charAt(randomIndex(pool.length));
}

/**
 * Fisher-Yates shuffle driven by the secure random source.
 * @param {string[]} items
 */
function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(index + 1);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

/**
 * @param {{length: number, lower: boolean, upper: boolean, digits: boolean, symbols: boolean, avoidAmbiguous: boolean}} options
 * @returns {{password: string, pool: number, entropy: number}|null}
 */
export function generate(options) {
  const selected = Object.keys(CHARACTER_SETS)
    .filter((key) => options[key])
    .map((key) => CHARACTER_SETS[key].chars)
    .map((chars) => (options.avoidAmbiguous ? [...chars].filter((char) => !AMBIGUOUS.includes(char)).join('') : chars))
    .filter((chars) => chars.length > 0);

  if (selected.length === 0 || options.length < selected.length) return null;

  const pool = selected.join('');
  const characters = selected.map((chars) => randomChar(chars));
  while (characters.length < options.length) characters.push(randomChar(pool));

  const password = shuffle(characters).join('');
  const entropy = Math.round(options.length * Math.log2(pool.length));
  return { password, pool: pool.length, entropy };
}

/**
 * @param {number} entropy
 */
export function strengthFor(entropy) {
  return [...STRENGTH_LEVELS].reverse().find((level) => entropy >= level.min) || STRENGTH_LEVELS[0];
}

export default {
  meta: { title: 'Contraseñas' },
  render(root) {
    root.innerHTML = `
      <section class="app app--password">
        <header class="app__header">
          <div>
            <h1 class="app__title">Generador de contraseñas</h1>
          </div>
        </header>

        <div class="password__layout">
          <div class="password__result card">
            <label class="field__label" for="password-output">Contraseña generada</label>
            <div class="password__row">
              <output class="password__value" id="password-output" for="password-length">Pulsa «Generar»</output>
              <button class="icon-button" id="password-copy" type="button" aria-label="Copiar contraseña al portapapeles">
                ${icon('icon-copy')}
              </button>
            </div>
            <div class="password__meter" id="password-meter" aria-hidden="true">
              <span class="password__meter-bar" data-level="0"></span>
              <span class="password__meter-bar" data-level="1"></span>
              <span class="password__meter-bar" data-level="2"></span>
              <span class="password__meter-bar" data-level="3"></span>
            </div>
            <p class="password__strength" id="password-strength">Aún sin generar</p>
          </div>

          <form class="password__options card" id="password-form">
            <div class="field">
              <div class="field__inline">
                <label class="field__label" for="password-length">Longitud</label>
                <output class="field__value" id="password-length-output" for="password-length">20</output>
              </div>
              <input class="field__control" id="password-length" name="length" type="range" min="8" max="64" value="20" step="1" />
            </div>

            <fieldset class="password__toggles">
              <legend class="field__label">Caracteres</legend>
              ${Object.entries(CHARACTER_SETS)
                .map(
                  ([key, set]) => `
                <label class="check">
                  <input class="check__input" type="checkbox" name="${key}" checked />
                  <span class="check__box" aria-hidden="true">${icon('icon-check-circle', { size: 14 })}</span>
                  <span class="check__label">${set.label}</span>
                </label>`
                )
                .join('')}
              <label class="check">
                <input class="check__input" type="checkbox" name="avoidAmbiguous" />
                <span class="check__box" aria-hidden="true">${icon('icon-check-circle', { size: 14 })}</span>
                <span class="check__label">Evitar ambiguos (0, O, l, 1)</span>
              </label>
            </fieldset>

            <div class="password__actions">
              <button class="button button--primary" type="submit">${icon('icon-refresh')}<span>Generar</span></button>
            </div>
          </form>
        </div>
      </section>`;

    const form = root.querySelector('#password-form');
    const output = root.querySelector('#password-output');
    const strengthNode = root.querySelector('#password-strength');
    const lengthInput = root.querySelector('#password-length');
    const lengthOutput = root.querySelector('#password-length-output');
    const meterBars = [...root.querySelectorAll('.password__meter-bar')];
    const copyButton = root.querySelector('#password-copy');

    let currentPassword = '';
    let timer = null;

    const readOptions = () => {
      const data = new FormData(form);
      return {
        length: Number(data.get('length')),
        lower: data.has('lower'),
        upper: data.has('upper'),
        digits: data.has('digits'),
        symbols: data.has('symbols'),
        avoidAmbiguous: data.has('avoidAmbiguous'),
      };
    };

    const paint = (result) => {
      currentPassword = result.password;
      output.textContent = result.password;

      const level = strengthFor(result.entropy);
      const activeLevel = STRENGTH_LEVELS.findIndex((item) => item.tone === level.tone);
      meterBars.forEach((bar, index) => {
        bar.dataset.filled = index <= activeLevel ? 'true' : 'false';
      });
      strengthNode.dataset.tone = level.tone;
      strengthNode.textContent = `${level.label} · ${result.entropy} bits de entropía · ${result.pool} caracteres posibles`;

      write(META_KEY, { entropy: result.entropy, length: result.password.length, level: level.label, at: Date.now() });
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const options = readOptions();
      const result = generate(options);

      if (!result) {
        announce('Selecciona al menos un tipo de carácter y una longitud suficiente.');
        return;
      }
      paint(result);
      announce('Contraseña generada');
    });

    lengthInput.addEventListener('input', () => {
      lengthOutput.textContent = lengthInput.value;
    });

    copyButton.addEventListener('click', async () => {
      if (!currentPassword) {
        announce('Genera una contraseña primero');
        return;
      }
      try {
        await copyText(currentPassword);
        announce('Contraseña copiada al portapapeles');
        window.clearTimeout(timer);
        copyButton.setAttribute('aria-label', 'Contraseña copiada');
        timer = window.setTimeout(() => copyButton.setAttribute('aria-label', 'Copiar contraseña al portapapeles'), 2500);
      } catch (error) {
        announce('No se pudo copiar la contraseña');
      }
    });

    // Initial result so the panel is never empty.
    const stored = read(META_KEY, null);
    if (stored && typeof stored.entropy === 'number') {
      strengthNode.textContent = `Última generación: ${stored.level} · ${stored.entropy} bits`;
    }

    return () => window.clearTimeout(timer);
  },
};
