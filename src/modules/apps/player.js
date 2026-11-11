import '../../css/apps/player.css';

import { read, write, subscribe, announce } from '../store.js';
import { loadYouTubeApi, parseVideoId, fetchVideoTitle } from '../api/youtube.js';
import { icon, escapeHtml, uid, armAction, formatClock } from '../ui.js';

const STORAGE_KEY = 'player';
const PLAYING = 1;
const ENDED = 0;

/** @type {{queue: Array<{id: string, videoId: string, title: string}>, currentId: string|null}} */
const fallbackState = { queue: [], currentId: null };

let player = null;
let playerReady = false;
let pendingVideoId = null;
let pollId = null;
let lastState = -1;
let lastToggleState = null;
let fallbackMode = false;

/**
 * @returns {{queue: Array<{id: string, videoId: string, title: string}>, currentId: string|null}}
 */
function getState() {
  const stored = read(STORAGE_KEY, fallbackState);
  return {
    queue: Array.isArray(stored.queue) ? stored.queue : [],
    currentId: stored.currentId || null,
  };
}

/**
 * @param {{queue?: Array, currentId?: string|null}} patch
 */
function setState(patch) {
  write(STORAGE_KEY, { ...getState(), ...patch });
}

/**
 * @returns {{id: string, videoId: string, title: string}|null}
 */
function currentItem() {
  const state = getState();
  return state.queue.find((item) => item.id === state.currentId) || null;
}

function renderQueue() {
  const list = document.getElementById('player-queue');
  const count = document.getElementById('player-queue-count');
  if (!list || !count) return;

  const state = getState();
  count.textContent = `${state.queue.length} en cola`;

  if (state.queue.length === 0) {
    list.innerHTML = `<li class="empty-state empty-state--compact">
      ${icon('icon-play', { size: 24 })}
      <p class="empty-state__title">Cola vacía</p>
      <p class="empty-state__text">Añade enlaces con «Reproducir» o «Añadir a la cola».</p>
    </li>`;
    return;
  }

  list.innerHTML = state.queue
    .map(
      (item) => `
      <li class="queue__item${item.id === state.currentId ? ' is-current' : ''}" data-id="${item.id}">
        <button class="queue__play" type="button" data-play="${item.id}">
          ${icon('icon-play', { size: 14 })}
          <span class="queue__title">${escapeHtml(item.title)}</span>
        </button>
        <button class="icon-button icon-button--small" type="button" data-remove="${item.id}" aria-label="Quitar de la cola ${escapeHtml(
        item.title
      )}">
          ${icon('icon-close', { size: 16 })}
        </button>
      </li>`
    )
    .join('');

  list.querySelectorAll('[data-remove]').forEach((button) => {
    armAction(button, {
      label: button.getAttribute('aria-label'),
      confirmLabel: 'Confirmar quitar',
      onConfirm: () => {
        const stateNow = getState();
        const queue = stateNow.queue.filter((item) => item.id !== button.dataset.remove);
        const currentId = stateNow.currentId === button.dataset.remove ? null : stateNow.currentId;
        setState({ queue, currentId });
        if (!currentId) stopPlayback();
        announce('Vídeo quitado de la cola');
      },
    });
  });

  list.querySelectorAll('[data-play]').forEach((button) => {
    button.addEventListener('click', () => playQueueItem(button.dataset.play));
  });
}

function updateControls() {
  const toggle = document.getElementById('player-toggle');
  const timeNode = document.getElementById('player-time');
  const progress = document.getElementById('player-progress');
  if (!toggle) return;

  const isPlaying = lastState === PLAYING;
  if (lastToggleState !== isPlaying) {
    lastToggleState = isPlaying;
    toggle.innerHTML = isPlaying ? icon('icon-pause') : icon('icon-play');
    toggle.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproducir');
  }

  if (!player || !playerReady || typeof player.getCurrentTime !== 'function') return;

  const current = player.getCurrentTime() || 0;
  const duration = player.getDuration() || 0;

  if (timeNode) timeNode.textContent = `${formatClock(current)} / ${formatClock(duration)}`;
  if (progress && document.activeElement !== progress) {
    progress.max = String(Math.max(1, Math.round(duration)));
    progress.value = String(Math.round(current));
    progress.setAttribute('aria-valuetext', `${formatClock(current)} de ${formatClock(duration)}`);
  }
}

function startPolling() {
  if (pollId !== null) return;
  pollId = window.setInterval(updateControls, 500);
}

function stopPolling() {
  if (pollId === null) return;
  window.clearInterval(pollId);
  pollId = null;
}

function stopPlayback() {
  stopPolling();
  lastState = -1;
  const frame = document.getElementById('player-frame');
  if (frame) frame.innerHTML = placeholderMarkup();
  if (player && typeof player.destroy === 'function') {
    try {
      player.destroy();
    } catch (error) {
      player = null;
    }
  }
  player = null;
  playerReady = false;
}

function placeholderMarkup() {
  return `<div class="player__placeholder">
    ${icon('icon-play', { size: 32, className: 'player__placeholder-icon' })}
    <p class="player__placeholder-title">Sin reproduciendo</p>
    <p class="player__placeholder-text">Pega un enlace de YouTube en el campo de arriba para empezar.</p>
  </div>`;
}

function fallbackMarkup(videoId) {
  return `<iframe
    class="player__iframe"
    src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0"
    title="Reproductor de YouTube"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>`;
}

/**
 * @param {string} videoId
 * @param {{autoplay?: boolean}} [options]
 */
function ensurePlayer(videoId, options = {}) {
  const frame = document.getElementById('player-frame');
  if (!frame) return;

  if (player && playerReady && typeof player.loadVideoById === 'function') {
    if (options.autoplay === false) player.cueVideoById(videoId);
    else player.loadVideoById(videoId);
    return;
  }

  pendingVideoId = videoId;
  if (player) return;

  // Fallback embeds keep working when the player API is unreachable.
  if (fallbackMode) {
    frame.innerHTML = fallbackMarkup(videoId);
    return;
  }

  frame.innerHTML = `<div class="player__target" id="player-target"></div>`;

  loadYouTubeApi()
    .then((YT) => {
      if (player || fallbackMode) return;
      const target = document.getElementById('player-target');
      if (!target) return;

      player = new YT.Player('player-target', {
        width: '100%',
        height: '100%',
        videoId: pendingVideoId,
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: handleReady,
          onStateChange: handleStateChange,
          onError: handleError,
        },
      });
    })
    .catch(() => {
      const currentFrame = document.getElementById('player-frame');
      if (!currentFrame) return;
      fallbackMode = true;
      currentFrame.innerHTML = fallbackMarkup(pendingVideoId);
      announce('Sin controles propios: se usa el reproductor embebido de YouTube');
    });
}

function handleReady(event) {
  playerReady = true;
  if (event.target && typeof event.target.setVolume === 'function') event.target.setVolume(80);

  const videoId = event.target.getVideoData ? event.target.getVideoData().video_id : pendingVideoId;
  syncTitle(videoId, event.target.getVideoData ? event.target.getVideoData().title : '');
  startPolling();
  updateControls();

  if (pendingVideoId && videoId !== pendingVideoId) event.target.loadVideoById(pendingVideoId);
  pendingVideoId = null;
}

function handleStateChange(event) {
  lastState = event.data;
  updateControls();

  if (event.data === PLAYING) {
    startPolling();
    const data = event.target.getVideoData ? event.target.getVideoData() : null;
    if (data) syncTitle(data.video_id, data.title);
  }

  if (event.data === ENDED) playNext();
}

function handleError() {
  const frame = document.getElementById('player-frame');
  if (frame) {
    frame.innerHTML = `<div class="player__placeholder" role="alert">
      ${icon('icon-alert', { size: 28, className: 'player__placeholder-icon' })}
      <p class="player__placeholder-title">No se pudo reproducir</p>
      <p class="player__placeholder-text">El vídeo no está disponible o su autor ha bloqueado la reproducción incrustada.</p>
    </div>`;
  }
  stopPolling();
}

/**
 * @param {string} videoId
 * @param {string} title
 */
function syncTitle(videoId, title) {
  const state = getState();
  if (!state.queue.some((item) => item.videoId === videoId)) return;
  if (!title) return;

  const queue = state.queue.map((item) => (item.videoId === videoId ? { ...item, title } : item));
  setState({ queue });
}

/**
 * @param {string} itemId
 */
function playQueueItem(itemId) {
  const state = getState();
  const item = state.queue.find((entry) => entry.id === itemId);
  if (!item) return;

  setState({ currentId: item.id });
  ensurePlayer(item.videoId);
  renderQueue();
}

function playNext() {
  const state = getState();
  const index = state.queue.findIndex((item) => item.id === state.currentId);
  const next = state.queue[index + 1];
  if (!next) {
    announce('Fin de la cola');
    return;
  }
  playQueueItem(next.id);
}

/**
 * @param {string} videoId
 * @param {{enqueueOnly?: boolean}} [options]
 * @returns {Promise<{id: string, videoId: string, title: string}>}
 */
async function addToQueue(videoId, options = {}) {
  const state = getState();
  const existing = state.queue.find((item) => item.videoId === videoId);

  if (existing) {
    if (options.enqueueOnly) {
      announce('Ese vídeo ya está en la cola');
      return existing;
    }
    setState({ currentId: existing.id });
    ensurePlayer(existing.videoId);
    renderQueue();
    return existing;
  }

  const item = { id: uid(), videoId, title: `Vídeo ${videoId}` };
  const patch = { queue: [...state.queue, item] };
  if (!options.enqueueOnly) patch.currentId = item.id;
  setState(patch);
  renderQueue();

  if (options.enqueueOnly) announce('Añadido a la cola');

  fetchVideoTitle(videoId).then((title) => {
    if (title) syncTitle(videoId, title);
  });

  if (!options.enqueueOnly) ensurePlayer(videoId);
  return item;
}

export default {
  meta: { title: 'Reproductor' },
  render(root) {
    root.innerHTML = `
      <section class="app app--player">
        <header class="app__header">
          <div>
            <h1 class="app__title">Reproductor</h1>
          </div>
        </header>

        <form class="player__form" id="player-form">
          <div class="field">
            <label class="field__label" for="player-url">Enlace de YouTube</label>
            <div class="player__row">
              <input
                class="field__control"
                id="player-url"
                name="url"
                type="text"
                inputmode="url"
                placeholder="https://www.youtube.com/watch?v=…"
                autocomplete="off"
              />
              <button class="button button--primary" type="submit">${icon('icon-play')}<span>Reproducir</span></button>
              <button class="button button--ghost" type="button" id="player-enqueue">${icon('icon-plus')}<span>Añadir a la cola</span></button>
            </div>
          </div>
        </form>

        <div class="player__layout">
          <div class="player__stage card scrollable-y">
            <div class="player__frame" id="player-frame">${placeholderMarkup()}</div>

            <div class="player__controls">
              <button class="icon-button player__toggle" id="player-toggle" type="button" aria-label="Reproducir">
                ${icon('icon-play')}
              </button>
              <span class="player__time" id="player-time">0:00 / 0:00</span>
              <label class="sr-only" for="player-progress">Progreso de reproducción</label>
              <input class="player__progress" id="player-progress" type="range" min="0" max="100" value="0" step="1" />
              <button class="icon-button" id="player-mute" type="button" aria-label="Silenciar">
                ${icon('icon-volume')}
              </button>
              <label class="sr-only" for="player-volume">Volumen</label>
              <input class="player__volume" id="player-volume" type="range" min="0" max="100" value="80" step="1" />
            </div>
          </div>

          <aside class="player__queue card">
            <div class="player__queue-head">
              <h2 class="player__queue-title">Cola</h2>
              <p class="player__queue-count" id="player-queue-count"></p>
            </div>
            <ol class="queue scrollable-y" id="player-queue"></ol>
          </aside>
        </div>
      </section>`;

    const form = root.querySelector('#player-form');
    const urlInput = root.querySelector('#player-url');
    const progress = root.querySelector('#player-progress');
    const volume = root.querySelector('#player-volume');
    const mute = root.querySelector('#player-mute');

    renderQueue();

    const readVideoId = () => {
      const value = String(new FormData(form).get('url') || '').trim();
      const videoId = parseVideoId(value);
      if (!videoId) {
        announce('Ese enlace no parece un vídeo de YouTube válido.');
        return null;
      }
      return videoId;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const videoId = readVideoId();
      if (!videoId) return;

      await addToQueue(videoId);
      urlInput.value = '';
      urlInput.focus();
    });

    root.querySelector('#player-enqueue').addEventListener('click', async () => {
      const videoId = readVideoId();
      if (!videoId) return;
      await addToQueue(videoId, { enqueueOnly: true });
      urlInput.value = '';
    });

    root.querySelector('#player-toggle').addEventListener('click', () => {
      if (!player || !playerReady) return;
      if (lastState === PLAYING) player.pauseVideo();
      else player.playVideo();
    });

    progress.addEventListener('change', () => {
      if (!player || !playerReady) return;
      player.seekTo(Number(progress.value), true);
    });

    volume.addEventListener('input', () => {
      if (!player || !playerReady) return;
      player.setVolume(Number(volume.value));
      if (Number(volume.value) > 0 && mute.dataset.muted === 'true') {
        mute.dataset.muted = 'false';
        mute.innerHTML = icon('icon-volume');
        mute.setAttribute('aria-label', 'Silenciar');
      }
    });

    mute.addEventListener('click', () => {
      if (!player || !playerReady) return;
      const muted = mute.dataset.muted === 'true';
      if (muted) player.unMute();
      else player.mute();
      mute.dataset.muted = String(!muted);
      mute.innerHTML = muted ? icon('icon-volume') : icon('icon-mute');
      mute.setAttribute('aria-label', muted ? 'Silenciar' : 'Activar sonido');
    });

    const unsubscribe = subscribe(STORAGE_KEY, renderQueue);

    // Resume the last session if there is something queued.
    const state = getState();
    if (state.currentId) {
      const item = currentItem();
      if (item) ensurePlayer(item.videoId, { autoplay: false });
    }

    return () => {
      unsubscribe();
      stopPolling();
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch (error) {
          player = null;
        }
      }
      player = null;
      playerReady = false;
      pendingVideoId = null;
      lastState = -1;
      lastToggleState = null;
      fallbackMode = false;
    };
  },
};
