import '../../css/apps/pomodoro.css';

import { read, write, subscribe, announce } from '../store.js';
import { icon, formatClock, escapeHtml } from '../ui.js';

const STORAGE_KEY = 'pomodoro';
const BASE_TITLE = 'DeskPRO · Dashboard de productividad';

export const PHASES = [
  { id: 'focus', label: 'Foco', minutes: 25, next: 'short' },
  { id: 'short', label: 'Descanso corto', minutes: 5, next: 'focus' },
  { id: 'long', label: 'Descanso largo', minutes: 15, next: 'focus' },
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const listeners = new Set();
let intervalId = null;
let audioContext = null;

const state = {
  phase: 'focus',
  remaining: PHASES[0].minutes * 60,
  running: false,
  endsAt: 0,
  completed: read(STORAGE_KEY, { completed: 0 }).completed || 0,
};

/**
 * @param {string} id
 */
function phaseById(id) {
  return PHASES.find((phase) => phase.id === id) || PHASES[0];
}

function totalSeconds() {
  return phaseById(state.phase).minutes * 60;
}

function notify(force = false) {
  const second = Math.ceil(state.remaining);
  if (!force && state.lastNotifiedSecond === second) return;
  state.lastNotifiedSecond = second;
  syncTitle();
  for (const listener of [...listeners]) {
    try {
      listener({ ...state });
    } catch (error) {
      console.error('DeskPRO pomodoro listener failed', error);
    }
  }
}

/**
 * Keeps the remaining time visible in the browser tab, even from other views.
 */
function syncTitle() {
  const phase = phaseById(state.phase);
  document.title = state.running
    ? `${formatClock(state.remaining)} · ${phase.label} · DeskPRO`
    : BASE_TITLE;
}

function persist() {
  write(STORAGE_KEY, { completed: state.completed });
}

/**
 * Counts down from a timestamp so background tabs cannot desynchronise the timer.
 */
function tick() {
  if (!state.running) return;

  const remaining = Math.max(0, (state.endsAt - Date.now()) / 1000);
  state.remaining = remaining;

  if (remaining <= 0) {
    completePhase();
    return;
  }
  notify();
}

/**
 * @param {boolean} countAsCompleted skipping a focus block should not count as a pomodoro
 */
function completePhase(countAsCompleted = true) {
  const phase = phaseById(state.phase);
  const wasFocus = phase.id === 'focus';

  if (wasFocus && countAsCompleted) state.completed += 1;
  persist();

  state.running = false;
  state.phase = phase.next;
  state.remaining = totalSeconds();
  state.endsAt = 0;

  stopInterval();
  playChime();
  notify(true);

  const nextLabel = phaseById(state.phase).label;
  const message = countAsCompleted
    ? `${wasFocus ? 'Foco completado' : 'Descanso terminado'}. Sigue: ${nextLabel}`
    : `Fase saltada. Sigue: ${nextLabel}`;
  announce(message);
  document.title = BASE_TITLE;
}

function startInterval() {
  if (intervalId !== null) return;
  intervalId = window.setInterval(tick, 250);
}

function stopInterval() {
  if (intervalId === null) return;
  window.clearInterval(intervalId);
  intervalId = null;
}

function playChime() {
  try {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    audioContext = audioContext || new Context();
    const start = audioContext.currentTime;

    [0, 0.28].forEach((offset) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(0.18, start + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.3);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + 0.35);
    });

    window.setTimeout(() => {
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
      audioContext = null;
    }, 1200);
  } catch (error) {
    // Audio is a nicety: never break the timer because of it.
  }
}

/**
 * @param {(snapshot: typeof state) => void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribePomodoro(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * @returns {typeof state}
 */
export function getPomodoroState() {
  return { ...state };
}

export function startPomodoro() {
  if (state.running) return;
  if (state.remaining <= 0) state.remaining = totalSeconds();
  state.endsAt = Date.now() + state.remaining * 1000;
  state.running = true;
  startInterval();
  notify(true);
}

export function pausePomodoro() {
  if (!state.running) return;
  state.running = false;
  state.endsAt = 0;
  stopInterval();
  document.title = BASE_TITLE;
  notify(true);
}

export function resetPomodoro() {
  state.running = false;
  state.endsAt = 0;
  state.remaining = totalSeconds();
  stopInterval();
  document.title = BASE_TITLE;
  notify(true);
}

/**
 * @param {string} phaseId
 */
export function selectPhase(phaseId) {
  state.phase = phaseId;
  state.running = false;
  state.endsAt = 0;
  state.remaining = totalSeconds();
  stopInterval();
  document.title = BASE_TITLE;
  notify(true);
}

export function skipPhase() {
  completePhase(false);
}

/**
 * @param {number} value seconds
 * @returns {string} ISO 8601 duration, e.g. PT25M0S
 */
function isoDuration(value) {
  const safe = Math.max(0, Math.round(value));
  return `PT${Math.floor(safe / 60)}M${safe % 60}S`;
}

function render() {
  const root = document.getElementById('pomodoro-app');
  if (!root) return;

  const phase = phaseById(state.phase);
  const total = totalSeconds();
  const progress = total > 0 ? state.remaining / total : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  const timeNode = root.querySelector('#pomodoro-time');
  const ringNode = root.querySelector('#pomodoro-ring');
  const toggleNode = root.querySelector('#pomodoro-toggle');
  const statusNode = root.querySelector('#pomodoro-status');
  const completedNode = root.querySelector('#pomodoro-completed');
  const nextNode = root.querySelector('#pomodoro-next');

  if (timeNode) {
    timeNode.textContent = formatClock(state.remaining);
    timeNode.dateTime = isoDuration(state.remaining);
  }
  const phaseNode = root.querySelector('#pomodoro-phase-label');
  if (phaseNode) phaseNode.textContent = phase.label;
  if (ringNode) ringNode.style.strokeDashoffset = String(offset);
  if (toggleNode) {
    toggleNode.innerHTML = state.running
      ? `${icon('icon-pause')}<span>Pausar</span>`
      : `${icon('icon-play')}<span>Iniciar</span>`;
  }
  if (statusNode) statusNode.textContent = state.running ? 'En curso' : 'En pausa';
  if (completedNode) {
    completedNode.textContent = String(state.completed);
  }
  if (nextNode) {
    const nextPhase = phaseById(phase.next);
    nextNode.textContent = `Siguiente: ${nextPhase.label.toLowerCase()} (${nextPhase.minutes} min)`;
  }

  root.querySelectorAll('input[name="pomodoro-phase"]').forEach((input) => {
    input.checked = input.value === state.phase;
  });
}

export default {
  meta: { title: 'Pomodoro' },
  render(root) {
    root.innerHTML = `
      <section class="app app--pomodoro" id="pomodoro-app">
        <header class="app__header">
          <div>
            <h1 class="app__title">Pomodoro</h1>
          </div>
          <p class="pomodoro__status" id="pomodoro-status"></p>
        </header>

        <div class="pomodoro__layout">
          <fieldset class="segmented pomodoro__phases">
            <legend class="sr-only">Fase del temporizador</legend>
            ${PHASES.map(
              (item) => `
              <input class="segmented__input" type="radio" name="pomodoro-phase" id="pomodoro-phase-${item.id}" value="${item.id}" ${
                item.id === state.phase ? 'checked' : ''
              } />
              <label class="segmented__label" for="pomodoro-phase-${item.id}">${item.label}</label>`
            ).join('')}
          </fieldset>

          <div class="pomodoro__timer card">
            <div class="pomodoro__ring">
              <svg viewBox="0 0 120 120" role="img" aria-label="Progreso de la fase actual">
                <circle class="pomodoro__track" cx="60" cy="60" r="${RADIUS}" />
                <circle
                  class="pomodoro__progress"
                  id="pomodoro-ring"
                  cx="60"
                  cy="60"
                  r="${RADIUS}"
                  stroke-dasharray="${CIRCUMFERENCE.toFixed(2)}"
                  stroke-dashoffset="0"
                />
              </svg>
              <div class="pomodoro__readout">
                <time class="pomodoro__time" id="pomodoro-time" datetime="PT25M">25:00</time>
                <span class="pomodoro__phase" id="pomodoro-phase-label">${escapeHtml(phaseById(state.phase).label)}</span>
              </div>
            </div>

            <div class="pomodoro__controls">
              <button class="button button--primary" id="pomodoro-toggle" type="button">${icon('icon-play')}<span>Iniciar</span></button>
              <button class="button button--ghost" id="pomodoro-reset" type="button">${icon('icon-refresh')}<span>Reiniciar</span></button>
              <button class="button button--ghost" id="pomodoro-skip" type="button">${icon('icon-chevron-right')}<span>Saltar</span></button>
            </div>
          </div>

          <div class="pomodoro__stats">
            <div class="stat">
              <span class="stat__value" id="pomodoro-completed">0</span>
              <span class="stat__label">Focos completados</span>
            </div>
            <div class="stat">
              <span class="stat__value" id="pomodoro-next"></span>
              <span class="stat__label">Próxima fase</span>
            </div>
          </div>
        </div>
      </section>`;

    const unsubscribeStore = subscribe(STORAGE_KEY, (value) => {
      state.completed = (value && value.completed) || 0;
      render();
    });

    root.querySelector('#pomodoro-toggle').addEventListener('click', () => {
      if (state.running) pausePomodoro();
      else startPomodoro();
    });

    root.querySelector('#pomodoro-reset').addEventListener('click', () => {
      resetPomodoro();
      announce('Temporizador reiniciado');
    });

    root.querySelector('#pomodoro-skip').addEventListener('click', () => {
      skipPhase();
    });

    root.querySelectorAll('input[name="pomodoro-phase"]').forEach((input) => {
      input.addEventListener('change', () => selectPhase(input.value));
    });

    const unsubscribeState = subscribePomodoro(render);

    render();

    return () => {
      unsubscribeState();
      unsubscribeStore();
      // The timer is global state: it keeps counting while other views are open.
    };
  },
};
