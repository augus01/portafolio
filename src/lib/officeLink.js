/** Enlace a la oficina con el agente elegido y la pregunta ya escrita (OfficePage lee `agente` y `pregunta`). */
export const officeHref = (base, agent, question) => `${base}?agente=${encodeURIComponent(agent)}&pregunta=${encodeURIComponent(question)}`;

/** Lee `agente` y `pregunta` de la URL de la oficina; `agents` son los ids válidos. */
export function readOfficeLink(search, agents) {
  const p = new URLSearchParams(search || '');
  const to = p.get('agente');
  const draft = (p.get('pregunta') || '').slice(0, 400);
  return { to: agents.includes(to) ? to : null, draft };
}
