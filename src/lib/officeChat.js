// Lógica pura del chat de la oficina (sin window ni document, se prueba con `node --test`).
// Los tres agentes responden en una sola conversación; las respuestas salen de los temas de src/content/office.js.

/** Minúsculas y sin tildes, para comparar lo que escribe el visitante con los temas. */
export function normalize(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** true si el visitante quiere contratar, encargar un proyecto o contactar a Augusto. */
export function wantsContact(text, leadRx) {
  return leadRx.test(normalize(text));
}

export function isEmail(text) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(text || '').trim());
}

/** "sí", "enviar", "ok"… confirman el recado. */
export function isConfirm(text) {
  return /^(si|enviar|envialo|ok|dale|listo)/.test(normalize(text));
}

/**
 * Respuestas a una pregunta: el agente del primer tema que calza y, si hay otro tema de otro agente, este completa.
 * Sin tema, responde recepción. Si el visitante le habló a un agente que no sabe del tema, ese agente pasa la palabra.
 * Devuelve como máximo 3 respuestas `{ agent, text }`.
 */
export function answer(question, { topics, agents, to, noMatch }) {
  const n = normalize(question);
  const hits = topics.filter((t) => t.rx.test(n));
  const out = [];
  if (!hits.length) out.push({ agent: 'recepcion', text: noMatch });
  else {
    out.push({ agent: hits[0].agent, text: hits[0].text });
    const other = hits.find((h) => h.agent !== hits[0].agent);
    if (other) out.push({ agent: other.agent, text: 'Y para completar: ' + other.text.charAt(0).toLowerCase() + other.text.slice(1) });
  }
  if (to && out[0].agent !== to) out.unshift({ agent: to, text: `Eso lo sabe mejor ${agents[out[0].agent].name}. Te paso con él.` });
  return out.slice(0, 3);
}

/** Saludo de recepción: si el visitante ya vino y preguntó algo (que no era un contacto), lo retoma. */
export function greeting(seen, { welcome, leadRx }) {
  if (seen && seen.last && !wantsContact(seen.last, leadRx)) return `¡Volviste! La última vez preguntaste “${seen.last}”. ¿Seguimos por ahí?`;
  return welcome;
}

/** Agrupa las respuestas por agente para los globos: { arquitecto: 'texto', stack: 'texto' }. */
export function bubbleMap(replies) {
  const map = {};
  (replies || []).forEach((r) => { map[r.agent] = map[r.agent] ? map[r.agent] + ' ' + r.text : r.text; });
  return map;
}

/** Enlace mailto con el recado listo para enviar. */
export function leadMailto(email, subject, card) {
  const body = [
    `Nombre: ${card.name}`,
    `Necesita: ${card.need}`,
    `Correo: ${card.email}`,
    `Preguntó por: ${card.topics}`,
  ].join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
