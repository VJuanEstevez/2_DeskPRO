import { read, write, subscribe, announce } from "./store.js";
import {
  icon,
  escapeHtml,
  uid,
  armAction,
  copyText,
  formatClock,
  formatRelativeTime,
  toIsoDate,
  clearableInput,
  showTooltip,
  hideTooltip,
  FALLBACK_LOGO,
} from "./ui.js";
import {
  getPomodoroState,
  subscribePomodoro,
  startPomodoro,
  pausePomodoro,
  resetPomodoro,
  stopAlarm,
  PHASES,
} from "./apps/pomodoro.js";
import { getLocation } from "./location.js";
import { fetchCurrent, describeWeatherCode } from "./api/weather.js";
import { loadYouTubeApi } from "./api/youtube.js";
import { CHARACTER_SETS, generate, strengthFor } from "./apps/password.js";
import {
  getColorState,
  buildHarmony,
  buildNeutrals,
  findHarmony,
  HARMONIES,
} from "./apps/color.js";
import { getTextState } from "./apps/textgen.js";
import {
  DEFAULT_TYPOGRAPHY,
  HEADING_FONTS,
  findHeadingFont,
  findBodyFont,
  selectBodyFonts,
} from "./data/fonts.js";
import { findTextTheme } from "./data/text-themes.js";

const WEEKDAYS_SHORT = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const MONTH_LABEL = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const YT_PLAYING = 1;
const TYPOGRAPHY_KEY = "typography";
const COLOR_KEY = "color-studio";

/**
 * Reads the typography setup used by the widget, repairing missing values and
 * keeping the body font compatible with the selected heading font.
 */
function readTypographyState() {
  const stored = read(TYPOGRAPHY_KEY, {});
  const source = stored && typeof stored === "object" ? stored : {};
  const heading = findHeadingFont(source.headingFont);
  const bodyOptions = selectBodyFonts(heading.id);
  const body = bodyOptions.find((font) => font.id === source.bodyFont) || bodyOptions[0];
  const numberOr = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

  return {
    headingFont: heading.id,
    bodyFont: body.id,
    headingSize: numberOr(source.headingSize, DEFAULT_TYPOGRAPHY.headingSize),
    bodySize: numberOr(source.bodySize, DEFAULT_TYPOGRAPHY.bodySize),
    lineHeight: numberOr(source.lineHeight, DEFAULT_TYPOGRAPHY.lineHeight),
  };
}

/**
 * @param {string} headingId
 * @param {string} selectedId
 */
function bodyFontOptions(headingId, selectedId) {
  return selectBodyFonts(headingId)
    .map(
      (font) =>
        `<option value="${font.id}" ${font.id === selectedId ? "selected" : ""}>${escapeHtml(font.label)}</option>`
    )
    .join("");
}

/**
 * Builds the CSS variables copied by the typography widget export button.
 * @param {ReturnType<typeof readTypographyState>} state
 */
function buildTypographyCss(state) {
  const heading = findHeadingFont(state.headingFont);
  const body = findBodyFont(state.bodyFont);

  return `:root {
  --font-heading: ${heading.stack};
  --font-body: ${body.stack};
  --font-size-heading: ${state.headingSize}px;
  --font-size-body: ${state.bodySize}px;
  --line-height-body: ${state.lineHeight.toFixed(2)};
}`;
}

/**
 * Builds the CSS variables copied by the color widget export button.
 * @param {ReturnType<typeof getColorState>} state
 */
function buildColorCss(state) {
  const palette = buildNeutrals(state);

  return `:root {
  --color-background: ${palette.background.hex};
  --color-surface: ${palette.surface.hex};
  --color-surface-2: ${palette.surface2.hex};
  --color-border: ${palette.border.hex};
  --color-text: ${palette.text.hex};
  --color-text-muted: ${palette.muted.hex};
  --color-accent: ${palette.accent.hex};
  --color-on-accent: ${palette.onAccent};
}`;
}

/**
 * Each widget fills its dashboard card with the real content of its
 * application (forms, lists, controls) and returns a cleanup function.
 * @type {Record<string, (node: HTMLElement) => (() => void)|void>}
 */
export const WIDGETS = {
  calendar(node) {
    // The widget keeps its own month so it can browse other months while the
    // dashboard still highlights today.
    let viewDate = new Date();

    const paint = () => {
      const today = new Date();
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const stored = read("calendar", {});
      const eventsByDay = stored && typeof stored === "object" ? stored : {};

      const firstDay = new Date(year, month, 1);
      const offset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const todayIso = toIsoDate(today);

      const cells = [];
      for (let index = 0; index < offset; index += 1) {
        cells.push(
          '<li class="widget-calendar__day widget-calendar__day--outside" aria-hidden="true"></li>'
        );
      }

      let eventCount = 0;
      let markedDays = 0;

      for (let day = 1; day <= daysInMonth; day += 1) {
        const isoDate = toIsoDate(new Date(year, month, day));
        const events = Array.isArray(eventsByDay[isoDate]) ? eventsByDay[isoDate] : [];
        eventCount += events.length;
        if (events.length > 0) markedDays += 1;

        const classes = ["widget-calendar__day"];
        if (isoDate === todayIso) classes.push("is-today");
        if (events.length > 0) classes.push("has-events");

        const tooltipText = events
          .map((event) => `${event.time ? `${event.time} · ` : ""}${event.title}`)
          .join(" | ");
        const label = `${day} de ${capitalize(MONTH_LABEL.format(viewDate))}: ${tooltipText}`;
        const body =
          events.length > 0
            ? `<button class="widget-calendar__day-button" type="button" data-events="${escapeHtml(
                tooltipText
              )}" aria-label="${escapeHtml(label)}">${day}</button>`
            : String(day);

        cells.push(`<li class="${classes.join(" ")}">${body}</li>`);
      }

      const summary =
        eventCount === 0
          ? "Sin citas este mes"
          : `${eventCount} cita${eventCount === 1 ? "" : "s"} en ${markedDays} día${markedDays === 1 ? "" : "s"}`;

      node.innerHTML = `
        <div class="widget-calendar">
          <div class="widget-calendar__head">
            <button class="icon-button icon-button--small" type="button" data-month-prev aria-label="Mes anterior">
              ${icon("icon-chevron-left", { size: 16 })}
            </button>
            <p class="widget-calendar__month">${escapeHtml(capitalize(MONTH_LABEL.format(viewDate)))}</p>
            <button class="icon-button icon-button--small" type="button" data-month-next aria-label="Mes siguiente">
              ${icon("icon-chevron-right", { size: 16 })}
            </button>
          </div>
          <ol class="widget-calendar__weekdays" aria-hidden="true">
            ${WEEKDAYS_SHORT.map((day) => `<li>${day}</li>`).join("")}
          </ol>
          <ol class="widget-calendar__grid">${cells.join("")}</ol>
          <p class="widget-calendar__summary">${escapeHtml(summary)}</p>
        </div>`;

      node.querySelector("[data-month-prev]").addEventListener("click", () => {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        paint();
      });

      node.querySelector("[data-month-next]").addEventListener("click", () => {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        paint();
      });

      node.querySelectorAll("[data-events]").forEach((button) => {
        const show = () => showTooltip(button.dataset.events, button);
        button.addEventListener("pointerenter", show);
        button.addEventListener("focus", show);
        button.addEventListener("click", show);
        button.addEventListener("pointerleave", hideTooltip);
        button.addEventListener("blur", hideTooltip);
      });
    };

    paint();
    return subscribe("calendar", paint);
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
            ${icon("icon-play", { size: 16 })}<span>Iniciar</span>
          </button>
          <button class="button button--ghost" type="button" data-reset>
            ${icon("icon-refresh", { size: 16 })}<span>Reiniciar</span>
          </button>
          <button class="button button--ghost widget-pomodoro__alarm" type="button" data-stop-alarm hidden>
            ${icon("icon-stop", { size: 16 })}<span>Detener alarma</span>
          </button>
        </div>
      </div>`;

    const ring = node.querySelector("[data-ring]");
    const timeNode = node.querySelector("[data-time]");
    const phaseNode = node.querySelector("[data-phase]");
    const toggle = node.querySelector("[data-toggle]");
    const alarmButton = node.querySelector("[data-stop-alarm]");

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
        const label = state.running ? "Pausar" : "Iniciar";
        toggle.innerHTML = `${state.running ? icon("icon-pause", { size: 16 }) : icon("icon-play", { size: 16 })}<span>${label}</span>`;
      }

      alarmButton.hidden = !state.alarm;
    };

    toggle.addEventListener("click", () => {
      if (getPomodoroState().running) pausePomodoro();
      else startPomodoro();
    });

    node.querySelector("[data-reset]").addEventListener("click", () => {
      resetPomodoro();
      announce("Temporizador reiniciado");
    });

    alarmButton.addEventListener("click", () => {
      stopAlarm();
      announce("Alarma detenida");
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
          node.innerHTML =
            '<p class="widget-status">Sin ubicación. Activa la ubicación o elige una ciudad.</p>';
          return null;
        }

        return fetchCurrent(place.latitude, place.longitude).then((current) => {
          if (cancelled) return;
          const info = describeWeatherCode(current.weatherCode);
          const iconName = info.icon === "wmo-clear" && !current.isDay ? "icon-moon" : info.icon;
          const temperature = Number.isFinite(current.temperature)
            ? `${Math.round(current.temperature)}°`
            : "—";

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
        if (!cancelled)
          node.innerHTML = '<p class="widget-status">No se pudo cargar el tiempo.</p>';
      });

    return () => {
      cancelled = true;
    };
  },

  todo(node) {
    const EDIT_DELAY = 300;
    let editingId = null;
    let editingOriginal = null;
    let selfWrite = false;
    let editTimer = null;
    let pendingEdit = null;

    node.innerHTML = `
      <form class="widget-form" data-todo-form>
        <label class="sr-only" for="widget-todo-input">Nueva tarea</label>
        ${clearableInput(`
        <input
          class="field__control"
          id="widget-todo-input"
          name="text"
          type="text"
          maxlength="140"
          placeholder="Nueva tarea…"
          autocomplete="off"
          required
        />`)}
        <button class="button button--primary" type="submit">${icon("icon-plus", { size: 16 })}<span>Añadir</span></button>
      </form>
      <ul class="widget-list" data-todo-list></ul>`;

    const form = node.querySelector("[data-todo-form]");
    const input = node.querySelector("#widget-todo-input");
    const list = node.querySelector("[data-todo-list]");

    const readItems = () => {
      const stored = read("todo", []);
      return Array.isArray(stored) ? stored : [];
    };

    // Saving while typing must not repaint the list: the DOM already shows the text.
    const commitEdit = (id, text) => {
      const value = String(text).trim();
      if (!value) return; // An empty task is never stored.

      const items = readItems();
      const item = items.find((entry) => entry.id === id);
      if (!item || item.text === value) return;

      selfWrite = true;
      write(
        "todo",
        items.map((entry) => (entry.id === id ? { ...entry, text: value } : entry))
      );
      selfWrite = false;
    };

    const cancelPendingEdit = () => {
      if (editTimer !== null) {
        window.clearTimeout(editTimer);
        editTimer = null;
      }
      pendingEdit = null;
    };

    const commitPendingEdit = () => {
      if (!pendingEdit) return;
      commitEdit(pendingEdit.id, pendingEdit.text);
      cancelPendingEdit();
    };

    const paint = () => {
      if (selfWrite) return;

      const active = document.activeElement;
      const editing =
        active instanceof HTMLInputElement && active.dataset.edit
          ? { id: active.dataset.edit, start: active.selectionStart, end: active.selectionEnd }
          : null;
      const focusWasInList = list.contains(active);
      const focusedId =
        active instanceof HTMLInputElement && active.dataset.id ? active.dataset.id : null;

      const pending = readItems().filter((item) => !item.done);

      if (pending.length === 0) {
        editingId = null;
        editingOriginal = null;
        list.innerHTML = '<li class="widget-empty">Sin tareas pendientes</li>';
        return;
      }

      list.innerHTML = pending
        .map((item) => {
          const body =
            item.id === editingId
              ? clearableInput(
                  `<input class="widget-list__edit" data-edit="${escapeHtml(
                    item.id
                  )}" type="text" maxlength="140" value="${escapeHtml(item.text)}" aria-label="Editar tarea ${escapeHtml(
                    item.text
                  )}" />`
                )
              : `<label class="widget-list__label">
                  <input type="checkbox" data-id="${escapeHtml(item.id)}" />
                  <span>${escapeHtml(item.text)}</span>
                </label>`;

          return `
            <li class="widget-list__item">
              ${body}
              <span class="widget-list__actions">
                <button class="icon-button icon-button--small" type="button" data-edit-action="${escapeHtml(
                  item.id
                )}" aria-label="Editar ${escapeHtml(item.text)}">
                  ${icon("icon-edit", { size: 16 })}
                </button>
                <button class="icon-button icon-button--small" type="button" data-delete="${escapeHtml(
                  item.id
                )}" aria-label="Eliminar ${escapeHtml(item.text)}">
                  ${icon("icon-trash", { size: 16 })}
                </button>
              </span>
            </li>`;
        })
        .join("");

      // A stray click never deletes a task: the button must be pressed twice.
      list.querySelectorAll("[data-delete]").forEach((button) => {
        armAction(button, {
          label: button.getAttribute("aria-label"),
          confirmLabel: "Confirmar eliminación",
          onConfirm: () => {
            const id = button.dataset.delete;
            if (editingId === id) {
              editingId = null;
              editingOriginal = null;
            }
            write(
              "todo",
              readItems().filter((item) => item.id !== id)
            );
            announce("Tarea eliminada");
          },
        });
      });

      if (!focusWasInList) return;

      const field = editing ? list.querySelector(`input[data-edit="${editing.id}"]`) : null;
      if (field) {
        field.focus();
        field.setSelectionRange(editing.start, editing.end);
        return;
      }

      // The edited task may be gone: fall back to the first checkbox.
      const target =
        (!editing && focusedId && list.querySelector(`input[data-id="${focusedId}"]`)) ||
        list.querySelector('input[type="checkbox"]') ||
        input;
      target.focus();
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      write("todo", [{ id: uid(), text, done: false, createdAt: Date.now() }, ...readItems()]);
      input.value = "";
      input.focus();
      announce("Tarea añadida");
    });

    list.addEventListener("change", (event) => {
      const checkbox = event.target.closest('input[type="checkbox"]');
      if (!checkbox) return;

      write(
        "todo",
        readItems().map((item) =>
          item.id === checkbox.dataset.id ? { ...item, done: checkbox.checked } : item
        )
      );
    });

    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-edit-action]");
      if (!button) return;

      const id = button.dataset.editAction;
      commitPendingEdit();

      const item = readItems().find((entry) => entry.id === id);
      if (!item) return;

      editingId = id;
      editingOriginal = item.text;
      paint();

      const field = list.querySelector(`input[data-edit="${id}"]`);
      if (field) {
        field.focus();
        field.setSelectionRange(field.value.length, field.value.length);
      }
    });

    list.addEventListener("input", (event) => {
      const field = event.target.closest("[data-edit]");
      if (!field) return;

      pendingEdit = { id: field.dataset.edit, text: field.value };
      if (editTimer !== null) window.clearTimeout(editTimer);
      editTimer = window.setTimeout(() => {
        editTimer = null;
        const current = pendingEdit;
        pendingEdit = null;
        if (current) commitEdit(current.id, current.text);
      }, EDIT_DELAY);
    });

    list.addEventListener("keydown", (event) => {
      const field = event.target.closest("[data-edit]");
      if (!field) return;

      if (event.key === "Enter") {
        event.preventDefault();
        commitPendingEdit();
        editingId = null;
        editingOriginal = null;
        paint();
        announce("Tarea actualizada");
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        cancelPendingEdit();
        if (editingOriginal !== null) commitEdit(field.dataset.edit, editingOriginal);
        editingId = null;
        editingOriginal = null;
        paint();
      }
    });

    list.addEventListener("focusout", (event) => {
      const field = event.target.closest("[data-edit]");
      if (!field) return;
      const id = field.dataset.edit;

      if (pendingEdit) commitPendingEdit();
      else commitEdit(id, field.value);

      // Keep edit mode while the pointer lands on a row action, otherwise the
      // re-render would destroy the button before its click reaches it.
      const next = event.relatedTarget;
      if (next instanceof Element && next.matches("[data-edit-action], [data-delete]")) return;

      if (editingId === id) {
        editingId = null;
        editingOriginal = null;
        paint();
      }
    });

    paint();
    const unsubscribe = subscribe("todo", paint);

    return () => {
      unsubscribe();
      commitPendingEdit();
    };
  },

  notebook(node) {
    const SAVE_DELAY = 300;
    let openId = null;
    let renderedId = null;
    let saveTimer = null;
    let pending = null;

    const readNotes = () => {
      const stored = read("notebook", []);
      return Array.isArray(stored) ? stored : [];
    };

    const findNote = (id) => readNotes().find((note) => note.id === id) || null;

    const flushSave = () => {
      if (saveTimer !== null) {
        window.clearTimeout(saveTimer);
        saveTimer = null;
      }
      const current = pending;
      pending = null;
      if (!current) return;
      write(
        "notebook",
        readNotes().map((note) =>
          note.id === current.id
            ? { ...note, body: current.body, updatedAt: current.updatedAt }
            : note
        )
      );
    };

    const scheduleSave = (note, body) => {
      pending = { id: note.id, body, updatedAt: Date.now() };
      if (saveTimer !== null) window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(flushSave, SAVE_DELAY);

      const meta = node.querySelector("[data-note-meta]");
      if (meta) meta.textContent = "Editada ahora mismo";
    };

    const paintItems = (notes) => {
      const list = node.querySelector("[data-note-list]");
      if (!list) return;

      const items = notes
        .slice()
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 20);

      if (items.length === 0) {
        list.innerHTML = '<li class="widget-empty">Sin notas todavía</li>';
        return;
      }

      list.innerHTML = items
        .map(
          (note) => `
          <li class="widget-list__item">
            <button class="widget-list__button" type="button" data-note="${note.id}">
              <span class="widget-list__title">${escapeHtml(note.title || "Sin título")}</span>
              <span class="widget-list__meta">${escapeHtml(formatRelativeTime(note.updatedAt))}</span>
            </button>
          </li>`
        )
        .join("");
    };

    // The "new note" form survives every list repaint, so only its list rebuilds.
    const renderShell = (notes) => {
      if (!node.querySelector("[data-note-list]")) {
        node.innerHTML = `
          <form class="widget-form" data-note-form>
            <label class="sr-only" for="widget-note-input">Nueva nota</label>
            ${clearableInput(`
            <input
              class="field__control"
              id="widget-note-input"
              name="title"
              type="text"
              maxlength="80"
              placeholder="Título de la nota…"
              autocomplete="off"
              required
            />`)}
            <button class="button button--primary" type="submit">${icon("icon-plus", { size: 16 })}<span>Añadir</span></button>
          </form>
          <ul class="widget-list" data-note-list></ul>`;
      }
      paintItems(notes);
    };

    const renderEditor = (note) => {
      renderedId = note.id;
      node.innerHTML = `
        <div class="widget-note" data-note-editor>
          <div class="widget-note__head">
            <p class="widget-note__title">${escapeHtml(note.title || "Sin título")}</p>
            <button class="icon-button icon-button--small" type="button" data-note-close aria-label="Cerrar nota">
              ${icon("icon-close", { size: 16 })}
            </button>
          </div>
          <label class="sr-only" for="widget-note-body">Contenido de la nota</label>
          <textarea class="field__control widget-note__body" id="widget-note-body" data-note-body placeholder="Escribe aquí…">${escapeHtml(
            note.body
          )}</textarea>
          <p class="widget-note__meta" data-note-meta>Editada ${escapeHtml(formatRelativeTime(note.updatedAt))}</p>
        </div>`;

      const body = node.querySelector("[data-note-body]");
      body.focus();
      body.setSelectionRange(body.value.length, body.value.length);
    };

    const closeEditor = () => {
      flushSave(); // Triggers a paint while the editor is still mounted.
      openId = null;
      renderedId = null;
      renderShell(readNotes());
    };

    const paint = () => {
      if (openId) {
        const note = findNote(openId);
        if (!note) {
          openId = null;
          renderedId = null;
        } else if (renderedId === openId && node.querySelector("[data-note-body]")) {
          return; // Never rebuild while the note is open: it would steal the caret.
        } else {
          renderEditor(note);
          return;
        }
      }
      renderShell(readNotes());
    };

    node.addEventListener("submit", (event) => {
      const form = event.target.closest("[data-note-form]");
      if (!form) return;
      event.preventDefault();

      const input = form.querySelector("#widget-note-input");
      const title = input.value.trim();
      if (!title) return;

      write("notebook", [{ id: uid(), title, body: "", updatedAt: Date.now() }, ...readNotes()]);
      input.value = "";
      input.focus();
      announce("Nota creada");
    });

    node.addEventListener("click", (event) => {
      if (event.target.closest("[data-note-close]")) {
        closeEditor();
        return;
      }

      const item = event.target.closest("[data-note]");
      if (!item) return;

      flushSave();
      openId = item.dataset.note;
      const note = findNote(openId);
      if (note) renderEditor(note);
      else openId = null;
    });

    node.addEventListener("input", (event) => {
      const body = event.target.closest("[data-note-body]");
      if (!body || !openId) return;
      const note = findNote(openId);
      if (note) scheduleSave(note, body.value);
    });

    paint();
    const unsubscribe = subscribe("notebook", paint);

    return () => {
      unsubscribe();
      flushSave();
    };
  },

  player(node) {
    node.innerHTML = `
      <div class="widget-player">
        <div class="widget-player__frame" data-frame></div>
        <div class="widget-player__controls">
          <button class="icon-button widget-player__toggle" type="button" data-toggle aria-label="Reproducir" disabled>
            ${icon("icon-play")}
          </button>
          <span class="widget-player__title" data-title>Sin vídeos en la cola</span>
        </div>
      </div>`;

    const frame = node.querySelector("[data-frame]");
    const toggle = node.querySelector("[data-toggle]");
    const titleNode = node.querySelector("[data-title]");

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
      toggle.innerHTML = playing ? icon("icon-pause") : icon("icon-play");
      toggle.setAttribute("aria-label", playing ? "Pausar el vídeo" : "Reproducir el vídeo");
    };

    const stopPlayer = () => {
      loadToken += 1;
      loading = false;
      if (ytPlayer && typeof ytPlayer.destroy === "function") {
        try {
          ytPlayer.destroy();
        } catch {
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

      if (ytPlayer && playerReady && typeof ytPlayer.cueVideoById === "function") {
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
      frame.innerHTML = "<div data-player-target></div>";

      loadYouTubeApi()
        .then((YT) => {
          if (destroyed || token !== loadToken) return;
          loading = false;
          const target = frame.querySelector("[data-player-target]");
          if (!target) return;

          ytPlayer = new YT.Player(target, {
            width: "100%",
            height: "100%",
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
          toggle.setAttribute("aria-label", "Controles del reproductor embebido");
        });
    };

    const paint = () => {
      const stored = read("player", null);
      const queue = stored && Array.isArray(stored.queue) ? stored.queue : [];
      const currentId = stored && stored.currentId ? stored.currentId : null;
      const current = queue.find((item) => item.id === currentId) || queue[0] || null;

      if (!current) {
        stopPlayer();
        showPlaceholder("Sin vídeos en la cola");
        titleNode.textContent = "Añade un vídeo desde la app Reproductor";
        toggle.disabled = true;
        return;
      }

      titleNode.textContent = current.title || current.videoId;
      toggle.disabled = fallbackMode;
      ensurePlayer(current.videoId);
    };

    toggle.addEventListener("click", () => {
      if (!ytPlayer || !playerReady) return;
      if (lastState === YT_PLAYING) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    });

    const unsubscribe = subscribe("player", paint);
    paint();

    return () => {
      unsubscribe();
      destroyed = true;
      stopPlayer();
    };
  },

  favorites(node) {
    const paint = () => {
      const stored = read("favorites", []);
      const favorites = Array.isArray(stored) ? stored : [];

      if (favorites.length === 0) {
        node.innerHTML = '<p class="widget-empty">Sin favoritos guardados</p>';
        return;
      }

      node.innerHTML = `
        <div class="widget-favorites">
          ${favorites
            .slice(0, 10)
            .map(
              (favorite) => `
              <a class="widget-favorite-card" href="${escapeHtml(favorite.url)}" target="_blank" rel="noopener noreferrer">
                <span class="widget-favorite-card__top">
                  <img
                    class="widget-favorite-card__logo"
                    src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(favorite.host)}&sz=64"
                    alt=""
                    width="32"
                    height="32"
                    loading="lazy"
                    data-fallback="${FALLBACK_LOGO}"
                  />
                  ${icon("icon-external", { size: 14, className: "widget-favorite-card__external" })}
                </span>
                ${
                  favorite.name && favorite.name !== favorite.host
                    ? `<span class="widget-favorite-card__name">${escapeHtml(favorite.name)}</span>`
                    : ""
                }
                <span class="widget-favorite-card__host">${escapeHtml(favorite.host || favorite.url)}</span>
              </a>`
            )
            .join("")}
        </div>`;
    };

    // Broken logos silently fall back to a generic link mark.
    const onError = (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || image.dataset.fallbackUsed) return;
      image.dataset.fallbackUsed = "true";
      image.src = image.dataset.fallback;
    };
    node.addEventListener("error", onError, true);

    const unsubscribe = subscribe("favorites", paint);
    paint();

    return () => {
      unsubscribe();
      node.removeEventListener("error", onError, true);
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
                <span class="check__box" aria-hidden="true">${icon("icon-check-circle", { size: 14 })}</span>
                <span class="check__label">${set.label}</span>
              </label>`
            )
            .join("")}
        </fieldset>
        <button class="button button--primary" type="submit">${icon("icon-refresh", { size: 16 })}<span>Generar</span></button>
      </form>
      <output class="widget-password__result" data-password-result>
        <span class="widget-password__value" data-password-value>Pulsa «Generar»</span>
        <span class="widget-password__meta" data-password-meta></span>
        <span class="password__meter widget-password__meter" aria-hidden="true">
          <span class="password__meter-bar widget-password__meter-bar" data-level="0"></span>
          <span class="password__meter-bar widget-password__meter-bar" data-level="1"></span>
          <span class="password__meter-bar widget-password__meter-bar" data-level="2"></span>
          <span class="password__meter-bar widget-password__meter-bar" data-level="3"></span>
        </span>
        <span class="widget-password__strength" data-password-strength>Aún sin generar</span>
      </output>`;

    const form = node.querySelector("[data-password-form]");
    const valueNode = node.querySelector("[data-password-value]");
    const metaNode = node.querySelector("[data-password-meta]");
    const strengthNode = node.querySelector("[data-password-strength]");
    const meterBars = [...node.querySelectorAll(".widget-password__meter-bar")];

    const stored = read("password-meta", null);
    if (stored && typeof stored.entropy === "number") {
      metaNode.textContent = `Última generación: ${stored.level} · ${stored.entropy} bits`;
      strengthNode.textContent = `Última generación: ${stored.level} · ${stored.entropy} bits`;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);

      const result = generate({
        length: 20,
        lower: data.has("lower"),
        upper: data.has("upper"),
        digits: data.has("digits"),
        symbols: data.has("symbols"),
        avoidAmbiguous: false,
      });

      if (!result) {
        announce("Selecciona al menos un tipo de carácter.");
        return;
      }

      const level = strengthFor(result.entropy);
      const activeLevel = ["weak", "fair", "strong", "excellent"].indexOf(level.tone);
      valueNode.textContent = result.password;
      metaNode.textContent = `${level.label} · ${result.entropy} bits · ${result.pool} caracteres posibles`;
      meterBars.forEach((bar, index) => {
        bar.dataset.filled = index <= activeLevel ? "true" : "false";
      });
      strengthNode.dataset.tone = level.tone;
      strengthNode.textContent = `${level.label} · ${result.entropy} bits de entropía`;

      write("password-meta", {
        entropy: result.entropy,
        length: result.password.length,
        level: level.label,
        at: Date.now(),
      });
      announce("Contraseña generada");
    });

    return () => {};
  },

  typography(node) {
    const state = readTypographyState();

    node.innerHTML = `
      <div class="widget-type">
        <div class="widget-type__preview">
          <p class="widget-type__meta" data-type-meta></p>
          <p class="widget-type__sample" data-type-sample aria-hidden="true">Aa</p>
          <p class="widget-type__body" data-type-example>El titular marca el tono; el texto hace que la lectura fluya.</p>
        </div>
        <div class="widget-type__controls">
          <label class="field">
            <span class="field__label">Tipografía de titulares</span>
            <select class="field__control" data-type-heading>
              ${HEADING_FONTS.map(
                (font) =>
                  `<option value="${font.id}" ${font.id === state.headingFont ? "selected" : ""}>${escapeHtml(
                    font.label
                  )}</option>`
              ).join("")}
            </select>
          </label>
          <label class="field">
            <span class="field__label">Tipografía de textos</span>
            <select class="field__control" data-type-body data-heading="${state.headingFont}">
              ${bodyFontOptions(state.headingFont, state.bodyFont)}
            </select>
          </label>
          <button class="button button--ghost widget-type__export" type="button" data-type-export>
            ${icon("icon-copy", { size: 16 })}<span>Exportar CSS</span>
          </button>
        </div>
      </div>`;

    const meta = node.querySelector("[data-type-meta]");
    const sample = node.querySelector("[data-type-sample]");
    const example = node.querySelector("[data-type-example]");
    const headingSelect = node.querySelector("[data-type-heading]");
    const bodySelect = node.querySelector("[data-type-body]");
    const exportButton = node.querySelector("[data-type-export]");

    const paint = () => {
      const current = readTypographyState();
      const heading = findHeadingFont(current.headingFont);
      const body = findBodyFont(current.bodyFont);

      meta.textContent = `${heading.label} + ${body.label}`;
      sample.style.fontFamily = heading.stack;
      example.style.fontFamily = body.stack;

      if (headingSelect.value !== current.headingFont) headingSelect.value = current.headingFont;
      if (bodySelect.dataset.heading !== current.headingFont) {
        bodySelect.innerHTML = bodyFontOptions(current.headingFont, current.bodyFont);
        bodySelect.dataset.heading = current.headingFont;
      }
      bodySelect.value = current.bodyFont;
    };

    const save = (patch) => {
      write(TYPOGRAPHY_KEY, { ...readTypographyState(), ...patch });
    };

    headingSelect.addEventListener("change", () => {
      const current = readTypographyState();
      const options = selectBodyFonts(headingSelect.value);
      const bodyId = options.some((font) => font.id === current.bodyFont)
        ? current.bodyFont
        : options[0].id;

      save({ headingFont: headingSelect.value, bodyFont: bodyId });
      if (bodyId !== current.bodyFont) {
        announce(`Tipografía de textos ajustada a ${findBodyFont(bodyId).label}`);
      }
    });

    bodySelect.addEventListener("change", () => {
      save({ bodyFont: bodySelect.value });
    });

    exportButton.addEventListener("click", async () => {
      try {
        await copyText(buildTypographyCss(readTypographyState()));
        announce("CSS de tipografía copiado");
      } catch {
        announce("No se pudo copiar el CSS");
      }
    });

    paint();
    return subscribe(TYPOGRAPHY_KEY, paint);
  },

  color(node) {
    node.innerHTML = `
      <div class="widget-color">
        <div class="widget-color__row" data-color-swatches aria-hidden="true"></div>
        <p class="widget-color__meta" data-color-meta></p>
        <fieldset class="segmented widget-color__rules" data-color-rules>
          <legend class="sr-only">Armonía de color</legend>
          ${HARMONIES.map(
            (harmony) => `
            <input
              class="segmented__input"
              type="radio"
              name="widget-color-harmony"
              id="widget-color-harmony-${harmony.id}"
              value="${harmony.id}"
            />
            <label class="segmented__label" for="widget-color-harmony-${harmony.id}">${escapeHtml(harmony.label)}</label>`
          ).join("")}
        </fieldset>
        <button class="button button--ghost widget-color__export" type="button" data-color-export>
          ${icon("icon-copy", { size: 16 })}<span>Exportar CSS</span>
        </button>
      </div>`;

    const swatches = node.querySelector("[data-color-swatches]");
    const meta = node.querySelector("[data-color-meta]");
    const rules = node.querySelector("[data-color-rules]");

    const paint = () => {
      const state = getColorState();
      const colors = buildHarmony(state);
      const base = colors.find((color) => color.name === "Base") || colors[0];
      const harmony = findHarmony(state.harmony);

      swatches.innerHTML = colors
        .slice(0, 5)
        .map(
          (color) =>
            `<span class="widget-color__swatch" style="--widget-swatch:${color.hex}"></span>`
        )
        .join("");

      meta.innerHTML = `${escapeHtml(harmony.label)} · <span class="widget-color__base">${base.hex.toUpperCase()}</span>`;

      rules.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.checked = input.value === state.harmony;
      });
    };

    rules.addEventListener("change", (event) => {
      const input = event.target.closest('input[name="widget-color-harmony"]');
      if (!input) return;
      write(COLOR_KEY, { ...getColorState(), harmony: input.value });
    });

    node.querySelector("[data-color-export]").addEventListener("click", async () => {
      try {
        await copyText(buildColorCss(getColorState()));
        announce("CSS de color copiado");
      } catch {
        announce("No se pudo copiar el CSS");
      }
    });

    paint();
    return subscribe(COLOR_KEY, paint);
  },

  textgen(node) {
    const paint = () => {
      const state = getTextState();
      const theme = findTextTheme(state.theme);
      const excerpt = state.output.paragraphs[0] || "";
      const title = state.includeTitle ? state.output.title : "";

      if (!excerpt) {
        node.innerHTML =
          '<p class="widget-empty">Genera tu primera sinopsis desde la app de texto.</p>';
        return;
      }

      node.innerHTML = `
        <div class="widget-textgen">
          <p class="widget-textgen__meta">${escapeHtml(theme.label)} · ${state.output.paragraphs.length} párrafo${
            state.output.paragraphs.length === 1 ? "" : "s"
          }</p>
          ${title ? `<p class="widget-textgen__title">${escapeHtml(title)}</p>` : ""}
          <p class="widget-textgen__excerpt">${escapeHtml(excerpt)}</p>
          <button class="button button--ghost widget-textgen__copy" type="button" data-copy-text>
            ${icon("icon-copy", { size: 16 })}<span>Copiar texto</span>
          </button>
        </div>`;

      node.querySelector("[data-copy-text]").addEventListener("click", async () => {
        const current = getTextState();
        const parts = [];
        if (current.includeTitle && current.output.title) parts.push(current.output.title);
        parts.push(...current.output.paragraphs);
        const text = parts.join("\n\n");

        if (!text) {
          announce("Genera una sinopsis primero");
          return;
        }

        try {
          await copyText(text);
          announce("Texto copiado al portapapeles");
        } catch {
          announce("No se pudo copiar el texto");
        }
      });
    };

    paint();
    return subscribe("text-generator", paint);
  },
};

/**
 * @param {string} value
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
