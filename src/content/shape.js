// Forma de un valor de contenido, para comprobar que las versiones en inglés y español tienen la misma estructura:
// claves de objeto ordenadas, largo de arreglos y tipo de cada hoja (las RegExp como 'regexp').
export function shape(value) {
  if (value instanceof RegExp) return 'regexp';
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])]));
  }
  return typeof value;
}

// Todas las cadenas de un valor de contenido, con su ruta ("about.paragraphs.0").
export function strings(value, path = '') {
  if (typeof value === 'string') return [[path, value]];
  if (value instanceof RegExp || !value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
}
