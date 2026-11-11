const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL = 10 * 60 * 1000;

const forecastCache = new Map();
const currentCache = new Map();

const WMO_CODES = [
  { max: 0, label: 'Despejado', icon: 'wmo-clear' },
  { max: 1, label: 'Mayormente despejado', icon: 'wmo-partly' },
  { max: 2, label: 'Parcialmente nublado', icon: 'wmo-partly' },
  { max: 3, label: 'Nublado', icon: 'wmo-cloud' },
  { max: 48, label: 'Niebla', icon: 'wmo-fog' },
  { max: 57, label: 'Llovizna', icon: 'wmo-rain' },
  { max: 67, label: 'Lluvia', icon: 'wmo-rain' },
  { max: 77, label: 'Nieve', icon: 'wmo-snow' },
  { max: 82, label: 'Chubascos', icon: 'wmo-rain' },
  { max: 86, label: 'Nieve', icon: 'wmo-snow' },
  { max: 99, label: 'Tormenta', icon: 'wmo-storm' },
];

/**
 * Maps a WMO weather code to a human label and a sprite icon id.
 * @param {number} code
 * @returns {{label: string, icon: string}}
 */
export function describeWeatherCode(code) {
  const numeric = Number(code);
  const entry = WMO_CODES.find((item) => numeric <= item.max) || WMO_CODES[WMO_CODES.length - 1];
  return { label: entry.label, icon: entry.icon };
}

/**
 * Full 7 day + 24 hour forecast for one point.
 * @param {number} latitude
 * @param {number} longitude
 */
export function fetchForecast(latitude, longitude) {
  const key = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  const cached = forecastCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL) return Promise.resolve(cached.data);

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,precipitation',
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  return fetch(`${FORECAST_URL}?${params}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Open-Meteo failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      forecastCache.set(key, { data, at: Date.now() });
      return data;
    });
}

/**
 * Current conditions for a list of cities in a single request.
 * @param {Array<{name: string, latitude: number, longitude: number}>} cities
 * @returns {Promise<Array<{name: string, temperature: number, weatherCode: number, isDay: boolean}>>}
 */
export function fetchCurrentBatch(cities) {
  const key = cities.map((city) => city.name).join('|');
  const cached = currentCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL) return Promise.resolve(cached.data);

  const params = new URLSearchParams({
    latitude: cities.map((city) => city.latitude).join(','),
    longitude: cities.map((city) => city.longitude).join(','),
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'auto',
  });

  return fetch(`${FORECAST_URL}?${params}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Open-Meteo failed: ${response.status}`);
      return response.json();
    })
    .then((payload) => {
      const rows = Array.isArray(payload) ? payload : [payload];
      const data = cities.map((city, index) => {
        const row = rows[index] || {};
        const current = row.current || {};
        return {
          name: city.name,
          temperature: current.temperature_2m ?? null,
          weatherCode: current.weather_code ?? 0,
          isDay: current.is_day === 1,
        };
      });
      currentCache.set(key, { data, at: Date.now() });
      return data;
    });
}

/**
 * Current conditions for a single point (uses the forecast endpoint cache).
 * @param {number} latitude
 * @param {number} longitude
 */
export function fetchCurrent(latitude, longitude) {
  return fetchForecast(latitude, longitude).then((data) => {
    const current = data.current || {};
    return {
      temperature: current.temperature_2m ?? null,
      apparent: current.apparent_temperature ?? null,
      humidity: current.relative_humidity_2m ?? null,
      wind: current.wind_speed_10m ?? null,
      precipitation: current.precipitation ?? null,
      weatherCode: current.weather_code ?? 0,
      isDay: current.is_day === 1,
      time: current.time || '',
    };
  });
}

/**
 * Slices the next 24 hours from the hourly arrays of a forecast payload.
 * @param {{hourly: {time: string[], temperature_2m: number[], precipitation_probability: (number|null)[], weather_code: number[], wind_speed_10m: number[]}, current: {time: string}}} forecast
 */
export function next24Hours(forecast) {
  const times = forecast.hourly.time;
  const reference = String(forecast.current.time || '').slice(0, 13);
  let index = times.findIndex((time) => time.slice(0, 13) >= reference);
  if (index < 0) index = 0;

  return times.slice(index, index + 24).map((time, offset) => {
    const source = index + offset;
    return {
      time,
      temperature: forecast.hourly.temperature_2m[source],
      precipitation: forecast.hourly.precipitation_probability[source] ?? 0,
      weatherCode: forecast.hourly.weather_code[source],
      wind: forecast.hourly.wind_speed_10m[source],
    };
  });
}
