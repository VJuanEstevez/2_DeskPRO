import { read, write, subscribe, announce } from './store.js';
import { icon, escapeHtml, uid, formatClock, formatRelativeTime, toIsoDate, FALLBACK_LOGO } from './ui.js';
import {
  getPomodoroState,
  subscribePomodoro,
  startPomodoro,
  pausePomodoro,
  resetPomodoro,
  PHASES,
} from './apps/pomodoro.js';
import { getLocation } from './location.js';
import { fetchCurrent, describeWeatherCode } from './api/weather.js';
import { loadYouTubeApi } from './api/youtube.js';
import { CHARACTER_SETS, generate, strengthFor } from './apps/password.js';

const WEEKDAYS_SHORT = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const MONTH_LABEL = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const YT_PLAYING = 1;

/**
 * Each widget fills its dashboard card with the real content of its
 * application (forms, lists, controls) and returns a cleanup function.
 * @type {Record<string, (node: HTMLElement) => (() => void)|void>}
 */
export const WIDGETS = {
  calendar(node) {
    const paint = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const stored = read('calendar', {});
      const eventsByDay = stored && typeof stored === 'object' ? stored : {};

      const firstDay = new Date(year, month, 1);
      const offset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const todayIso = toIsoDate(today);

      const cells = [];
      for (let index = 0; index < offset; index += 1) {
        cells.push('<li class="widget-calendar__day widget-calendar__day--outside" aria-hidden="true"></li>');
      }

      let eventCount = 0;
      let markedDays = 0;

      for (let day = 1; day <= daysInMonth; day += 1) {
        const isoDate = toIsoDate(new Date(year, month, day));
        const events = Array.isArray(eventsByDay[isoDate]) ? eventsByDay[isoDate] : [];
        eventCount += events.length;
        if (events.length > 0) markedDays += 1;

        const classes = ['widget-calendar__day'];
        if (isoDate === todayIso) classes.push('is-today');
        if (events.length > 0) classes.push('has-events');

        cells.push(`<li class="${classes.join(' ')}" aria-hidden="true">${day}</li>`);
      }

      const summary =
        eventCount === 0
          ? 'Sin citas este mes'
          : `${eventCount} cita${eventCount === 1 ? '' : 's'} en ${markedDays} día${markedDays === 1 ? '' : 's'}`;

      node.innerHTML = `
        <div class="widget-calendar">
          <p class="widget-calendar__month">${escapeHtml(capitalize(MONTH_LABEL.format(today)))}</p>
          <ol class="widget-calendar__weekdays" aria-hidden="true">
            ${WEEKDAYS_SHORT.map((day) => `<li>${day}</li>`).join('')}
          </ol>
          <ol class="widget-calendar__grid" aria-hidden="true">${cells.join('')}</ol>
          <p class="widget-calendar__summary">${escapeHtml(summary)}</p>
        </div>`;
    };

    paint();
    return subscribe('calendar', paint);
  },

  pomodoro(node) {
    node.innerHTML = `
      <div class="widget-pomodoro">
        <div class="widget-pomodoro__ring">
          <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <circle class="widget-pomodoro__track" cx="60" cy="60" r="${RING_RADIUS}" />
            <circle
              class="widget-pomodoro__progress"
              data-ring
              cx="60"
              cy="60"
              r="${RING_RADIUS}"
              stroke-dasharray="${RING_CIRCUMFERENCE.toFixed(2)}"
              stroke-dashoffset="0"
            />
          </svg>
          <div class="widget-pomodoro__readout">
            <time class="widget-pomodoro__time" data-time datetime="PT25M">25:00</time>
            <span class="widget-pomodoro__phase" data-phase>Foco</span>
          </div>
        </div>
        <div class="widget-pomodoro__actions">
          <button class="button button--primary" type="button" data-toggle>
            ${icon('icon-play', { size: 16 })}<span>Iniciar</span>
          </button>
          <button class="button button--ghost" type="button" data-reset>
            ${icon('icon-refresh', { size: 16 })}<span>Reiniciar</span>
          </button>
        </div>
      </div>`;

    const ring = node.querySelector('[data-ring]');
    const timeNode = node.querySelector('[data-time]');
    const phaseNode = node.querySelector('[data-phase]');
    const toggle = node.querySelector('[data-toggle]');

    const paint = (snapshot) => {
      const state = snapshot || getPomodoroState();
      const phase = PHASES.find((item) => item.id === state.phase) || PHASES[0];
      const total = phase.minutes * 60;
      const progress = total > 0 ? Math.min(1, Math.max(0, state.remaining / total)) : 0;
      const seconds = Math.max(0, Math.round(state.remaining));

      ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progress));
      timeNode.textContent = formatClock(state.remaining);
      timeNode.dateTime = `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;
      phaseNode.textContent = phase.label;

      if (toggle.dataset.running !== String(state.running)) {
        toggle.dataset.running = String(state.running);
        const label = state.running ? 'Pausar' : 'Iniciar';
        toggle.innerHTML = `${state.running ? icon('icon-pause', { size: 16 }) : icon('icon-play', { size: 16 })}<span>${label}</span>`;
      }
    };

    toggle.addEventListener('click', () => {
      if (getPomodoroState().running) pausePomodoro();
      else startPomodoro();
    });

    node.querySelector('[data-reset]').addEventListener('click', () => {
      resetPomodoro();
      announce('Temporizador reiniciado');
    });

    paint();
    return subscribePomodoro(paint);
  },

  weather(node) {
    let cancelled = false;
    node.innerHTML = '<p class="widget-status" role="status">Cargando el tiempo…</p>';

    getLocation()
      .then((place) => {
        if (cancelled) return;
        if (place.latitude === null || !Number.isFinite(place.latitude)) {
          node.innerHTML = '<p class="widget-status">Sin ubicación. Activa la ubicación o elige una ciudad.</p>';
          return null;
        }

        return fetchCurrent(place.latitude, place.longitude).then((current) => {
          if (cancelled) return;
          const info = describeWeatherCode(current.weatherCode);
          const iconName = info.icon === 'wmo-clear' && !current.isDay ? 'icon-moon' : info.icon;
          const temperature = Number.isFinite(current.temperature) ? `${Math.round(current.temperature)}°` : '—';

          node.innerHTML = `
            <div class="widget-weather">
              <svg class="icon widget-weather__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <use href="#${iconName}"></use>
              </svg>
              <div class="widget-weather__body">
                <p class="widget-weather__temp">${temperature}</p>
                <p class="widget-weather__condition">${escapeHtml(info.label)}</p>
                <p class="widget-weather__place">${escapeHtml(place.name)}</p>
              </div>
            </div>`;
        });
      })
      .catch(() => {
        if (!cancelled) node.innerHTML = '<p class="widget-status">No se pudo cargar el tiempo.</p>';
      });

    return () => {
      cancelled = true;
    };
  },

  todo(node) {
    node.innerHTML = `
      <form class="widget-form" data-todo-form>
        <label class="sr-only" for="widget-todo-input">Nueva tarea</label>
        <input
          class="field__control"
          id="widget-todo-input"
          name="text"
          type="text"
          maxlength="140"
          placeholder="Nueva tarea…"
          autocomplete="off"
          required
        />
        <button class="button button--primary" type="submit">${icon('icon-plus', { size: 16 })}<span>Añadir</span></button>
      </form>
      <ul class="widget-list" data-todo-list></ul>`;

    const form = node.querySelector('[data-todo-form]');
    const input = node.querySelector('#widget-todo-input');
    const list = node.querySelector('[data-todo-list]');

    const paint = () => {
      const focusWasInList = list.contains(document.activeElement);
      const focusedId = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.id : null;

      const stored = read('todo', []);
      const pending = (Array.isArray(stored) ? stored : []).filter((item) => !item.done);

      if (pending.length === 0) {
        list.innerHTML = '<li class="widget-empty">Sin tareas pendientes</li>';
      } else {
        list.innerHTML = pending
          .map(
            (item) => `
            <li class="widget-list__item">
              <label class="widget-list__label">
                <input type="checkbox" data-id="${escapeHtml(item.id)}" />
                <span>${escapeHtml(item.text)}</span>
              </label>
            </li>`
          )
          .join('');
      }

      if (focusWasInList) {
        const target =
          (focusedId && list.querySelector(`input[data-id="${focusedId}"]`)) ||
          list.querySelector('input[type="checkbox"]') ||
          input;
        target.focus();
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const stored = read('todo', []);
      const items = Array.isArray(stored) ? stored : [];
      items.unshift({ id: uid(), text, done: false, createdAt: Date.now() });
      write('todo', items);

      input.value = '';
      input.focus();
      announce('Tarea añadida');
    });

    list.addEventListener('change', (event) => {
      const checkbox = event.target.closest('input[type="checkbox"]');
      if (!checkbox) return;

      const stored = read('todo', []);
      const items = (Array.isArray(stored) ? stored : []).map((item) =>
        item.id === checkbox.dataset.id ? { ...item, done: checkbox.checked } : item
      );
      write('todo', items);
    });

    paint();
    return subscribe('todo', paint);
  },

  notebook(node) {
    node.innerHTML = `
      <form class="widget-form" data-note-form>
        <label class="sr-only" for="widget-note-input">Nueva nota</label>
        <input
          class="field__control"
          id="widget-note-input"
          name="title"
          type="text"
          maxlength="80"
          placeholder="Título de la nota…"
          autocomplete="off"
          required
        />
        <button class="button button--primary" type="submit">${icon('icon-plus', { size: 16 })}<span>Añadir</span></button>
      </form>
      <ul class="widget-list" data-note-list></ul>`;

    const form = node.querySelector('[data-note-form]');
    const input = node.querySelector('#widget-note-input');
    const list = node.querySelector('[data-note-list]');

    const paint = () => {
      const stored = read('notebook', []);
      const notes = (Array.isArray(stored) ? stored : [])
        .slice()
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 20);

      if (notes.length === 0) {
        list.innerHTML = '<li class="widget-empty">Sin notas todavía</li>';
        return;
      }

      list.innerHTML = notes
        .map(
          (note) => `
          <li class="widget-list__item">
            <button class="widget-list__button" type="button" data-note>
              <span class="widget-list__title">${escapeHtml(note.title || 'Sin título')}</span>
              <span class="widget-list__meta">${escapeHtml(formatRelativeTime(note.updatedAt))}</span>
            </button>
          </li>`
        )
        .join('');
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = input.value.trim();
      if (!title) return;

      const stored = read('notebook', []);
      const notes = Array.isArray(stored) ? stored : [];
      notes.unshift({ id: uid(), title, body: '', updatedAt: Date.now() });
      write('notebook', notes);

      input.value = '';
      input.focus();
      announce('Nota creada');
    });

    // Opening a note takes over the full notebook section.
    list.addEventListener('click', (event) => {
      if (!event.target.closest('[data-note]')) return;
      window.location.hash = '#/notebook';
    });

    paint();
    return subscribe('notebook', paint);
  },

  player(node) {
    node.innerHTML = `
      <div class="widget-player">
        <div class="widget-player__frame" data-frame></div>
        <div class="widget-player__controls">
          <button class="icon-button widget-player__toggle" type="button" data-toggle aria-label="Reproducir" disabled>
            ${icon('icon-play')}
          </button>
          <span class="widget-player__title" data-title>Sin vídeos en la cola</span>
          <a class="button button--ghost" href="#/player">Abrir</a>
        </div>
      </div>`;

    const frame = node.querySelector('[data-frame]');
    const toggle = node.querySelector('[data-toggle]');
    const titleNode = node.querySelector('[data-title]');

    let ytPlayer = null;
    let playerReady = false;
    let lastState = -1;
    let currentVideoId = null;
    let fallbackMode = false;
    let destroyed = false;
    let loading = false;
    let loadToken = 0;

    const showPlaceholder = (text) => {
      frame.innerHTML = `<p class="widget-player__placeholder">${escapeHtml(text)}</p>`;
    };

    const showIframe = (videoId) => {
      frame.innerHTML = `<iframe
        class="widget-player__iframe"
        src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0"
        title="Vídeo de YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>`;
    };

    const syncToggle = () => {
      const playing = lastState === YT_PLAYING;
      toggle.innerHTML = playing ? icon('icon-pause') : icon('icon-play');
      toggle.setAttribute('aria-label', playing ? 'Pausar el vídeo' : 'Reproducir el vídeo');
    };

    const stopPlayer = () => {
      loadToken += 1;
      loading = false;
      if (ytPlayer && typeof ytPlayer.destroy === 'function') {
        try {
          ytPlayer.destroy();
        } catch (error) {
          // The iframe is already gone: nothing else to release.
        }
      }
      ytPlayer = null;
      playerReady = false;
      lastState = -1;
      currentVideoId = null;
      fallbackMode = false;
    };

    const ensurePlayer = (videoId) => {
      if (destroyed) return;

      if (ytPlayer && playerReady && typeof ytPlayer.cueVideoById === 'function') {
        if (videoId !== currentVideoId) {
          currentVideoId = videoId;
          lastState = -1;
          syncToggle();
          ytPlayer.cueVideoById(videoId);
        }
        return;
      }

      if (ytPlayer || loading) return; // Still initialising.

      if (fallbackMode) {
        if (videoId !== currentVideoId) {
          currentVideoId = videoId;
          showIframe(videoId);
        }
        return;
      }

      loading = true;
      currentVideoId = videoId;
      const token = ++loadToken;
      frame.innerHTML = '<div data-player-target></div>';

      loadYouTubeApi()
        .then((YT) => {
          if (destroyed || token !== loadToken) return;
          loading = false;
          const target = frame.querySelector('[data-player-target]');
          if (!target) return;

          ytPlayer = new YT.Player(target, {
            width: '100%',
            height: '100%',
            videoId,
            playerVars: {
              controls: 0,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: () => {
                playerReady = true;
                syncToggle();
              },
              onStateChange: (event) => {
                lastState = event.data;
                syncToggle();
              },
            },
          });
        })
        .catch(() => {
          if (destroyed || token !== loadToken) return;
          // The API is unreachable: keep a plain embed and let YouTube own it.
          loading = false;
          fallbackMode = true;
          showIframe(videoId);
          toggle.disabled = true;
          toggle.setAttribute('aria-label', 'Controles del reproductor embebido');
        });
    };

    const paint = () => {
      const stored = read('player', null);
      const queue = stored && Array.isArray(stored.queue) ? stored.queue : [];
      const currentId = stored && stored.currentId ? stored.currentId : null;
      const current = queue.find((item) => item.id === currentId) || queue[0] || null;

      if (!current) {
        stopPlayer();
        showPlaceholder('Sin vídeos en la cola');
        titleNode.textContent = 'Añade un vídeo desde la app Reproductor';
        toggle.disabled = true;
        return;
      }

      titleNode.textContent = current.title || current.videoId;
      toggle.disabled = fallbackMode;
      ensurePlayer(current.videoId);
    };

    toggle.addEventListener('click', () => {
      if (!ytPlayer || !playerReady) return;
      if (lastState === YT_PLAYING) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    });

    const unsubscribe = subscribe('player', paint);
    paint();

    return () => {
      unsubscribe();
      destroyed = true;
      stopPlayer();
    };
  },

  favorites(node) {
    const paint = () => {
      const stored = read('favorites', []);
      const favorites = Array.isArray(stored) ? stored : [];

      if (favorites.length === 0) {
        node.innerHTML = '<p class="widget-empty">Sin favoritos guardados</p>';
        return;
      }

      node.innerHTML = `
        <ul class="widget-list">
          ${favorites
            .slice(0, 10)
            .map(
              (favorite) => `
              <li class="widget-list__item">
                <a class="widget-favorite" href="${escapeHtml(favorite.url)}" target="_blank" rel="noopener noreferrer">
                  <img
                    class="widget-favorite__logo"
                    src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(favorite.host)}&sz=64"
                    alt=""
                    width="24"
                    height="24"
                    loading="lazy"
                    data-fallback="${FALLBACK_LOGO}"
                  />
                  <span class="widget-favorite__name">${escapeHtml(favorite.name || favorite.host)}</span>
                  ${icon('icon-external', { size: 14 })}
                </a>
              </li>`
            )
            .join('')}
        </ul>`;
    };

    // Broken logos silently fall back to a generic link mark.
    const onError = (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || image.dataset.fallbackUsed) return;
      image.dataset.fallbackUsed = 'true';
      image.src = image.dataset.fallback;
    };
    node.addEventListener('error', onError, true);

    const unsubscribe = subscribe('favorites', paint);
    paint();

    return () => {
      unsubscribe();
      node.removeEventListener('error', onError, true);
    };
  },

  password(node) {
    node.innerHTML = `
      <form class="widget-password" data-password-form>
        <fieldset class="widget-password__toggles">
          <legend class="sr-only">Caracteres de la contraseña</legend>
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
        </fieldset>
        <button class="button button--primary" type="submit">${icon('icon-refresh', { size: 16 })}<span>Generar</span></button>
      </form>
      <output class="widget-password__result" data-password-result>
        <span class="widget-password__value" data-password-value>Pulsa «Generar»</span>
        <span class="widget-password__meta" data-password-meta></span>
      </output>`;

    const form = node.querySelector('[data-password-form]');
    const valueNode = node.querySelector('[data-password-value]');
    const metaNode = node.querySelector('[data-password-meta]');

    const stored = read('password-meta', null);
    if (stored && typeof stored.entropy === 'number') {
      metaNode.textContent = `Última generación: ${stored.level} · ${stored.entropy} bits`;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);

      const result = generate({
        length: 20,
        lower: data.has('lower'),
        upper: data.has('upper'),
        digits: data.has('digits'),
        symbols: data.has('symbols'),
        avoidAmbiguous: false,
      });

      if (!result) {
        announce('Selecciona al menos un tipo de carácter.');
        return;
      }

      const level = strengthFor(result.entropy);
      valueNode.textContent = result.password;
      metaNode.textContent = `${level.label} · ${result.entropy} bits · ${result.pool} caracteres posibles`;

      write('password-meta', {
        entropy: result.entropy,
        length: result.password.length,
        level: level.label,
        at: Date.now(),
      });
      announce('Contraseña generada');
    });

    return () => {};
  },
};

/**
 * @param {string} value
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
