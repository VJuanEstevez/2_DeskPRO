import '../../css/apps/weather.css';

import { getLocation, resolveCity } from '../location.js';
import { MAJOR_CITIES } from '../data/cities.js';
import { fetchForecast, fetchCurrentBatch, next24Hours, describeWeatherCode } from '../api/weather.js';
import { icon, escapeHtml } from '../ui.js';

const TABS = [
  { id: 'summary', label: 'Resumen' },
  { id: 'hourly', label: '24 horas' },
  { id: 'daily', label: '7 días' },
  { id: 'cities', label: 'Ciudades' },
];

/** @type {{name: string, latitude: number, longitude: number}|null} */
let place = null;
let activeTab = 'summary';
let requestToken = 0;
let forecastCache = null;

/**
 * @param {number} code
 * @param {boolean} isDay
 */
function weatherBadge(code, isDay) {
  const info = describeWeatherCode(code);
  if (info.icon === 'wmo-clear' && !isDay) return { iconName: 'icon-moon', label: info.label };
  return { iconName: info.icon, label: info.label };
}

/**
 * @param {number|null} value
 * @param {string} suffix
 * @param {number} [digits]
 */
function formatValue(value, suffix = '', digits = 0) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(digits)}${suffix}`;
}

function loadingMarkup(text) {
  return `<p class="status-line" role="status">${icon('icon-refresh', { size: 16 })}<span>${escapeHtml(text)}</span></p>`;
}

function errorMarkup(message, options = {}) {
  const retry = options.retry !== false;
  return `<div class="alert" role="alert">
    ${icon('icon-alert', { size: 18 })}
    <span>${escapeHtml(message)}</span>
    ${retry ? '<button class="button button--ghost" type="button" data-retry>Reintentar</button>' : ''}
  </div>`;
}

function render() {
  const panelNode = document.getElementById('weather-panel');
  if (!panelNode || !place) return;

  const token = ++requestToken;
  panelNode.innerHTML = loadingMarkup(`Cargando el tiempo de ${place.name}…`);

  fetchForecast(place.latitude, place.longitude)
    .then((forecast) => {
      if (token !== requestToken) return;
      forecastCache = forecast;
      paintPanel(forecast, token);
    })
    .catch(() => {
      if (token !== requestToken) return;
      panelNode.innerHTML = errorMarkup(`No se pudo cargar el tiempo de ${place.name}. Comprueba tu conexión.`);
    });
}

/**
 * @param {object} forecast
 * @param {number} token
 */
function paintPanel(forecast, token) {
  const panelNode = document.getElementById('weather-panel');
  if (!panelNode) return;

  if (activeTab === 'cities') {
    renderCities(token);
    return;
  }

  if (activeTab === 'summary') panelNode.innerHTML = summaryMarkup(forecast);
  else if (activeTab === 'hourly') panelNode.innerHTML = hourlyMarkup(forecast);
  else panelNode.innerHTML = dailyMarkup(forecast);
}

function summaryMarkup(forecast) {
  const current = forecast.current || {};
  const daily = forecast.daily || {};
  const badge = weatherBadge(current.weather_code ?? 0, current.is_day === 1);
  const sunrise = (daily.sunrise && daily.sunrise[0]) || '';
  const sunset = (daily.sunset && daily.sunset[0]) || '';

  return `
    <div class="weather__hero card">
      <div class="weather__hero-main">
        <svg class="icon weather__hero-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${badge.iconName}"></use></svg>
        <div>
          <p class="weather__place">${escapeHtml(place.name)}</p>
          <p class="weather__temperature">${formatValue(current.temperature_2m, '°', 1)}</p>
          <p class="weather__condition">${badge.label}</p>
        </div>
      </div>
      <dl class="weather__metrics">
        <div class="weather__metric"><dt>Sensación</dt><dd>${formatValue(current.apparent_temperature, '°', 1)}</dd></div>
        <div class="weather__metric"><dt>Humedad</dt><dd>${formatValue(current.relative_humidity_2m, '%')}</dd></div>
        <div class="weather__metric"><dt>Viento</dt><dd>${formatValue(current.wind_speed_10m, ' km/h')}</dd></div>
        <div class="weather__metric"><dt>Precipitación</dt><dd>${formatValue(current.precipitation, ' mm', 1)}</dd></div>
        <div class="weather__metric"><dt>Amanece</dt><dd>${sunrise ? escapeHtml(sunrise.slice(11, 16)) : '—'}</dd></div>
        <div class="weather__metric"><dt>Anochece</dt><dd>${sunset ? escapeHtml(sunset.slice(11, 16)) : '—'}</dd></div>
      </dl>
    </div>

    <h2 class="weather__section-title">Hoy y mañana</h2>
    <ul class="weather__outlook">
      ${(daily.time || [])
        .slice(0, 2)
        .map((day, index) => {
          const badgeOfDay = weatherBadge(daily.weather_code[index], true);
          const date = new Date(`${day}T12:00:00`);
          const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
          return `<li class="weather__outlook-item">
            <span class="weather__outlook-day">${capitalize(dayName)}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${badgeOfDay.iconName}"></use></svg>
            <span class="weather__outlook-range">${formatValue(daily.temperature_2m_min[index], '°')} / ${formatValue(
              daily.temperature_2m_max[index],
              '°'
            )}</span>
            <span class="weather__outlook-note">${badgeOfDay.label} · ${formatValue(daily.precipitation_probability_max[index], '%')} lluvia</span>
          </li>`;
        })
        .join('')}
    </ul>`;
}

function hourlyMarkup(forecast) {
  const hours = next24Hours(forecast);

  if (hours.length === 0) return errorMarkup('No hay previsión por horas disponible.');

  return `
    <ol class="weather__hours">
      ${hours
        .map((hour) => {
          const hourOfDay = Number(hour.time.slice(11, 13));
          const badge = weatherBadge(hour.weatherCode, hourOfDay >= 6 && hourOfDay < 19);
          return `<li class="weather__hour">
            <span class="weather__hour-time">${escapeHtml(hour.time.slice(11, 16))}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${badge.iconName}"></use></svg>
            <span class="weather__hour-temp">${formatValue(hour.temperature, '°')}</span>
            <span class="weather__hour-rain">${formatValue(hour.precipitation, '%')}</span>
          </li>`;
        })
        .join('')}
    </ol>`;
}

function dailyMarkup(forecast) {
  const daily = forecast.daily || {};
  const days = daily.time || [];
  if (days.length === 0) return errorMarkup('No hay previsión de 7 días disponible.');

  const mins = days.map((_, index) => Number(daily.temperature_2m_min[index]));
  const maxs = days.map((_, index) => Number(daily.temperature_2m_max[index]));
  const globalMin = Math.min(...mins);
  const globalMax = Math.max(...maxs);
  const span = globalMax - globalMin || 1;

  return `
    <ul class="weather__days">
      ${days
        .map((day, index) => {
          const date = new Date(`${day}T12:00:00`);
          const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
          const badge = weatherBadge(daily.weather_code[index], true);
          const left = ((mins[index] - globalMin) / span) * 100;
          const width = ((maxs[index] - mins[index]) / span) * 100;

          return `<li class="weather__day">
            <span class="weather__day-name">${capitalize(dayName)}</span>
            <span class="weather__day-date">${new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(date)}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${badge.iconName}"></use></svg>
            <span class="weather__day-condition">${badge.label}</span>
            <span class="weather__day-min">${formatValue(mins[index], '°')}</span>
            <span class="weather__day-bar" aria-hidden="true"><span class="weather__day-range" style="left:${left.toFixed(
              1
            )}%; width:${width.toFixed(1)}%"></span></span>
            <span class="weather__day-max">${formatValue(maxs[index], '°')}</span>
            <span class="weather__day-rain">${formatValue(daily.precipitation_probability_max[index], '%')}<span class="sr-only"> de lluvia</span></span>
            <span class="weather__day-wind">${formatValue(daily.wind_speed_10m_max[index], ' km/h')}</span>
          </li>`;
        })
        .join('')}
    </ul>`;
}

function renderCities(token) {
  const node = document.getElementById('weather-panel');
  if (!node) return;

  // A fresh random sample keeps the tab short and varied on every visit.
  const cities = sampleCities(MAJOR_CITIES, 10);

  node.innerHTML = loadingMarkup('Cargando ciudades del mundo…');

  fetchCurrentBatch(cities)
    .then((results) => {
      const current = document.getElementById('weather-panel');
      if (!current || token !== requestToken) return;

      current.innerHTML = `
        <ul class="weather__cities">
          ${results
            .map((result, index) => {
              const city = cities[index];
              if (!city) return '';
              const badge = weatherBadge(result.weatherCode, result.isDay);
              return `<li>
                <button class="weather__city" type="button" data-city="${escapeHtml(city.name)}" data-lat="${city.latitude}" data-lon="${
                  city.longitude
                }">
                  <span class="weather__city-name">${escapeHtml(city.name)}</span>
                  <span class="weather__city-temp">${formatValue(result.temperature, '°')}</span>
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${badge.iconName}"></use></svg>
                  <span class="weather__city-condition">${badge.label}</span>
                </button>
              </li>`;
            })
            .join('')}
        </ul>`;

      current.querySelectorAll('[data-city]').forEach((button) => {
        button.addEventListener('click', () =>
          selectPlace(button.dataset.city, Number(button.dataset.lat), Number(button.dataset.lon))
        );
      });
    })
    .catch(() => {
      const current = document.getElementById('weather-panel');
      if (current && token === requestToken) current.innerHTML = errorMarkup('No se pudieron cargar las ciudades del mundo.');
    });
}

/**
 * @param {string} name
 * @param {number} latitude
 * @param {number} longitude
 */
function selectPlace(name, latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
  place = { name, latitude, longitude };
  forecastCache = null;

  // Any place change shows its own summary, even when picked from the city list.
  activeTab = 'summary';
  const summaryRadio = document.getElementById('weather-tab-summary');
  if (summaryRadio) summaryRadio.checked = true;

  render();
}

export default {
  meta: { title: 'Clima' },
  render(root) {
    root.innerHTML = `
      <section class="app app--weather">
        <header class="app__header">
          <div>
            <h1 class="app__title">Clima</h1>
          </div>
          <form class="weather__search" id="weather-search">
            <label class="field__label sr-only" for="weather-query">Buscar ciudad</label>
            <div class="input-with-icon">
              ${icon('icon-search', { size: 16 })}
              <input class="field__control" id="weather-query" name="query" type="search" placeholder="Buscar ciudad…" autocomplete="off" list="weather-city-options" />
            </div>
            <datalist id="weather-city-options">
              ${MAJOR_CITIES.map((city) => `<option value="${escapeHtml(city.name)}"></option>`).join('')}
            </datalist>
            <button class="button button--primary" type="submit">Buscar</button>
            <button class="button button--ghost" type="button" id="weather-locate">${icon('icon-pin')}<span>Mi ubicación</span></button>
          </form>
        </header>

        <fieldset class="segmented" id="weather-tabs">
          <legend class="sr-only">Sección del clima</legend>
          ${TABS.map(
            (tab) => `
            <input class="segmented__input" type="radio" name="weather-tab" id="weather-tab-${tab.id}" value="${tab.id}" ${
              tab.id === activeTab ? 'checked' : ''
            } />
            <label class="segmented__label" for="weather-tab-${tab.id}">${tab.label}</label>`
          ).join('')}
        </fieldset>

        <div id="weather-panel"></div>
      </section>`;

    const form = root.querySelector('#weather-search');
    const tabs = root.querySelector('#weather-tabs');
    const locate = root.querySelector('#weather-locate');
    const panel = root.querySelector('#weather-panel');

    // A single delegated listener keeps every error state retryable.
    panel.addEventListener('click', (event) => {
      if (event.target.closest('[data-retry]')) render();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = String(new FormData(form).get('query') || '').trim();
      if (!value) return;

      const panelNode = document.getElementById('weather-panel');
      if (panelNode) panelNode.innerHTML = loadingMarkup(`Buscando ${value}…`);

      resolveCity(value).then((resolved) => {
        if (!resolved.latitude || !resolved.longitude) {
          if (panelNode) panelNode.innerHTML = errorMarkup(`No encontré «${value}». Prueba con otra grafía.`, { retry: false });
          return;
        }
        selectPlace(resolved.name, resolved.latitude, resolved.longitude);
      });
    });

    locate.addEventListener('click', () => {
      const panelNode = document.getElementById('weather-panel');
      if (panelNode) panelNode.innerHTML = loadingMarkup('Usando tu ubicación…');
      getLocation().then((found) => {
        if (found.latitude === null || !Number.isFinite(found.latitude)) {
          if (panelNode) panelNode.innerHTML = errorMarkup('No pude obtener tu ubicación. Busca una ciudad por nombre.', {
            retry: false,
          });
          return;
        }
        selectPlace(found.name, found.latitude, found.longitude);
      });
    });

    tabs.addEventListener('change', (event) => {
      if (event.target.name !== 'weather-tab') return;
      activeTab = event.target.value;
      requestToken += 1;
      if (activeTab === 'cities') renderCities(requestToken);
      else if (forecastCache) paintPanel(forecastCache, requestToken);
      else render();
    });

    if (!place) {
      getLocation().then((found) => {
        if (found.latitude === null || !Number.isFinite(found.latitude)) {
          const panelNode = document.getElementById('weather-panel');
          if (panelNode) {
            panelNode.innerHTML = errorMarkup('Activa la ubicación o elige una ciudad para ver el tiempo.', { retry: false });
          }
          return;
        }
        place = { name: found.name, latitude: found.latitude, longitude: found.longitude };
        render();
      });
    } else {
      render();
    }

    return () => {
      requestToken += 1;
    };
  },
};

/**
 * @param {string} value
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Fisher-Yates sample of `count` random entries.
 * @template T
 * @param {T[]} items
 * @param {number} count
 * @returns {T[]}
 */
function sampleCities(items, count) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled.slice(0, count);
}
