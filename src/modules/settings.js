import { read, write, subscribe, announce } from "./store.js";
import { APPS } from "./registry.js";
import { MAJOR_CITIES } from "./data/cities.js";

export const SETTINGS_KEY = "settings";

// The panel slider offers 2 × 2, 3 × 3 and 4 × 4 layouts only.
export const MIN_GRID_COLUMNS = 2;
export const MAX_GRID_COLUMNS = 4;

export const DEFAULT_SETTINGS = {
  name: "",
  theme: "system",
  defaultCity: "Madrid",
  gridColumns: 3,
  hiddenApps: [],
  appOrder: [],
};

let systemThemeListenerBound = false;

/**
 * @returns {{name: string, theme: string, defaultCity: string, gridColumns: number, hiddenApps: string[], appOrder: string[]}}
 */
export function getSettings() {
  const stored = read(SETTINGS_KEY, {});
  const source = stored && typeof stored === "object" ? stored : {};
  const columns = Math.round(Number(source.gridColumns));

  return {
    ...DEFAULT_SETTINGS,
    ...source,
    gridColumns: Number.isFinite(columns)
      ? Math.min(MAX_GRID_COLUMNS, Math.max(MIN_GRID_COLUMNS, columns))
      : DEFAULT_SETTINGS.gridColumns,
  };
}

/**
 * @param {Partial<typeof DEFAULT_SETTINGS>} patch
 */
export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch };
  write(SETTINGS_KEY, next);
  applyTheme(next.theme);
  return next;
}

/**
 * Resolves the effective theme and applies it to the document.
 * @param {string} preference 'system' | 'dark' | 'light'
 */
export function applyTheme(preference) {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
  const resolve = (value) =>
    value === "system" ? (prefersLight.matches ? "light" : "dark") : value;
  const resolved = resolve(preference);

  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;

  if (!systemThemeListenerBound) {
    systemThemeListenerBound = true;
    prefersLight.addEventListener("change", () => {
      if (getSettings().theme === "system") applyTheme("system");
    });
  }
}

/**
 * Subscribes to settings changes.
 * @param {(settings: ReturnType<typeof getSettings>) => void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribeSettings(listener) {
  return subscribe(SETTINGS_KEY, () => listener(getSettings()));
}

/**
 * Returns the visible applications in the user defined order.
 */
export function selectApps() {
  const settings = getSettings();
  const hidden = new Set(settings.hiddenApps);
  const known = APPS.filter((app) => !hidden.has(app.id));

  const order = settings.appOrder.filter((id) => known.some((app) => app.id === id));
  const rest = known.filter((app) => !order.includes(app.id));
  const ordered = order.map((id) => known.find((app) => app.id === id)).concat(rest);

  return ordered.length > 0 ? ordered : APPS;
}

/**
 * Wires the settings dialog: form state, app ordering and persistence.
 */
export function mountSettings() {
  const dialog = document.getElementById("settings-dialog");
  const form = document.getElementById("settings-form");
  const toggle = document.getElementById("settings-toggle");
  const appsList = document.getElementById("settings-apps");
  const cityDatalist = document.getElementById("city-options");
  const columnsInput = document.getElementById("setting-columns");
  const columnsOutput = document.getElementById("setting-columns-value");

  if (!dialog || !form || !toggle || !appsList || !cityDatalist) return;

  /**
   * @param {unknown} value
   * @returns {number}
   */
  const clampColumns = (value) => {
    const columns = Math.round(Number(value));
    return Number.isFinite(columns)
      ? Math.min(MAX_GRID_COLUMNS, Math.max(MIN_GRID_COLUMNS, columns))
      : getSettings().gridColumns;
  };

  /** Previews the column count on the dashboard without persisting it. */
  const previewColumns = (value) => {
    const grid = document.querySelector(".dashboard__grid");
    if (grid) grid.style.setProperty("--dashboard-columns", String(value));
  };

  /** Syncs the slider, its output and the dashboard preview with the stored value. */
  const paintColumns = () => {
    const columns = getSettings().gridColumns;
    if (columnsInput) {
      columnsInput.min = String(MIN_GRID_COLUMNS);
      columnsInput.max = String(MAX_GRID_COLUMNS);
      columnsInput.value = String(columns);
    }
    if (columnsOutput) columnsOutput.textContent = `${columns} × ${columns}`;
    previewColumns(columns);
  };

  cityDatalist.innerHTML = MAJOR_CITIES.map(
    (city) => `<option value="${escapeHtml(city.name)}"></option>`
  ).join("");

  const openDialog = () => {
    fillForm();
    renderAppRows();
    dialog.returnValue = "";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  toggle.addEventListener("click", openDialog);

  const closeDialog = () => {
    if (typeof dialog.close === "function") dialog.close("cancel");
    else dialog.removeAttribute("open");
  };

  document.getElementById("settings-close").addEventListener("click", closeDialog);
  document.getElementById("settings-cancel").addEventListener("click", closeDialog);

  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "save") {
      paintColumns(); // Cancelling reverts the live preview.
      return;
    }

    const data = new FormData(form);
    const theme = String(data.get("theme") || "system");
    const name = String(data.get("name") || "").trim();
    const defaultCity = String(data.get("city") || "").trim() || DEFAULT_SETTINGS.defaultCity;
    const previousColumns = getSettings().gridColumns;
    const gridColumns = columnsInput ? clampColumns(columnsInput.value) : previousColumns;

    saveSettings({ name, theme, defaultCity, gridColumns });
    paintColumns();
    if (gridColumns !== previousColumns) announce(`Panel en ${gridColumns} × ${gridColumns}`);
    renderAppRows();
  });

  const fillForm = () => {
    const settings = getSettings();
    form.elements.namedItem("name").value = settings.name;
    form.elements.namedItem("theme").value = settings.theme;
    form.elements.namedItem("city").value = settings.defaultCity;
    paintColumns();
  };

  if (columnsInput) {
    columnsInput.addEventListener("input", () => {
      const value = clampColumns(columnsInput.value);
      if (columnsOutput) columnsOutput.textContent = `${value} × ${value}`;
      previewColumns(value);
    });
  }

  const renderAppRows = () => {
    const settings = getSettings();
    const hidden = new Set(settings.hiddenApps);
    const ordered = selectApps();
    const orderedIds = ordered.map((app) => app.id);
    const remaining = APPS.filter((app) => !orderedIds.includes(app.id));
    const ids = orderedIds.concat(remaining.map((app) => app.id));

    appsList.innerHTML = ids
      .map((id, index) => {
        const app = APPS.find((item) => item.id === id);
        const visible = !hidden.has(id);
        return `
          <li class="settings__app" data-app="${app.id}">
            <label class="settings__app-check">
              <input type="checkbox" name="visible-app" value="${app.id}" ${visible ? "checked" : ""} />
              <span>${escapeHtml(app.label)}</span>
            </label>
            <span class="settings__app-actions">
              <button class="icon-button icon-button--small" type="button" data-move="up" data-app="${app.id}" ${
                index === 0 ? "disabled" : ""
              } aria-label="Subir ${escapeHtml(app.label)}">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-arrow-up"></use></svg>
              </button>
              <button class="icon-button icon-button--small" type="button" data-move="down" data-app="${app.id}" ${
                index === ids.length - 1 ? "disabled" : ""
              } aria-label="Bajar ${escapeHtml(app.label)}">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-arrow-down"></use></svg>
              </button>
            </span>
          </li>`;
      })
      .join("");
  };

  appsList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-move]");
    if (!button) return;

    const row = button.closest(".settings__app");
    const direction = button.dataset.move === "up" ? -1 : 1;
    const sibling = direction === -1 ? row.previousElementSibling : row.nextElementSibling;
    if (!sibling) return;

    if (direction === -1) appsList.insertBefore(row, sibling);
    else appsList.insertBefore(sibling, row);
  });

  form.addEventListener("submit", (event) => {
    if (event.submitter && event.submitter.value !== "save") return;

    const ids = [...appsList.querySelectorAll(".settings__app")].map((row) => row.dataset.app);
    const visible = [...appsList.querySelectorAll('input[name="visible-app"]:checked')].map(
      (input) => input.value
    );

    // Persist ordering and visibility before the dialog closes.
    saveSettings({ appOrder: ids, hiddenApps: ids.filter((id) => !visible.includes(id)) });
  });

  subscribe(SETTINGS_KEY, () => {
    if (dialog.open) renderAppRows();
  });
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
