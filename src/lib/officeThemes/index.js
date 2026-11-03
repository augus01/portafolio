// Registro de las oficinas por serie. Cada escena se descarga aparte y solo una vez (la promesa queda en caché),
// así el cambio puede empezar a bajar la oficina nueva apenas se elige, mientras los cuadrados tapan la vista.
// Las temáticas usan los mismos puestos de agente que la original (salvo los que muevan con `agents`).
const original = () => import('../officeScene').then((m) => m.officeScene);
const themed = (load) => Promise.all([original(), load()]).then(([base, scene]) => ({ spots: base.spots, ...scene }));
const loaders = {
  original,
  madmen: () => themed(() => import('./madmen').then((m) => m.madmenScene)),
  sopranos: () => themed(() => import('./sopranos').then((m) => m.sopranosScene)),
  odisea: () => themed(() => import('./odisea').then((m) => m.odiseaScene)),
};
const cache = {};

export function loadOfficeScene(id) {
  const load = loaders[id] || loaders.original;
  const key = loaders[id] ? id : 'original';
  if (!cache[key]) cache[key] = load().catch((e) => { delete cache[key]; throw e; });
  return cache[key];
}
