/**
 * World cities used by the weather application and the settings datalist.
 * Coordinates come from Open-Meteo documentation examples / public data.
 */
export const MAJOR_CITIES = [
  { name: 'Madrid', country: 'España', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Barcelona', country: 'España', latitude: 41.3874, longitude: 2.1686 },
  { name: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816 },
  { name: 'Ciudad de México', country: 'México', latitude: 19.4326, longitude: -99.1332 },
  { name: 'Bogotá', country: 'Colombia', latitude: 4.711, longitude: -74.0721 },
  { name: 'Santiago', country: 'Chile', latitude: -33.4489, longitude: -70.6693 },
  { name: 'São Paulo', country: 'Brasil', latitude: -23.5505, longitude: -46.6333 },
  { name: 'Londres', country: 'Reino Unido', latitude: 51.5072, longitude: -0.1276 },
  { name: 'París', country: 'Francia', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Berlín', country: 'Alemania', latitude: 52.52, longitude: 13.405 },
  { name: 'Roma', country: 'Italia', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Lisboa', country: 'Portugal', latitude: 38.7223, longitude: -9.1393 },
  { name: 'Nueva York', country: 'EE. UU.', latitude: 40.7128, longitude: -74.006 },
  { name: 'Los Ángeles', country: 'EE. UU.', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Toronto', country: 'Canadá', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Tokio', country: 'Japón', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Pekín', country: 'China', latitude: 39.9042, longitude: 116.4074 },
  { name: 'Seúl', country: 'Corea del Sur', latitude: 37.5665, longitude: 126.978 },
  { name: 'Sídney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Dubái', country: 'EAU', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Ciudad del Cabo', country: 'Sudáfrica', latitude: -33.9249, longitude: 18.4241 },
  { name: 'Reikiavik', country: 'Islandia', latitude: 64.1466, longitude: -21.9426 },
];

/**
 * @param {string} name
 */
export function findCity(name) {
  const query = String(name || '').trim().toLowerCase();
  if (!query) return null;
  return (
    MAJOR_CITIES.find((city) => city.name.toLowerCase() === query) ||
    MAJOR_CITIES.find((city) => city.name.toLowerCase().includes(query)) ||
    null
  );
}
