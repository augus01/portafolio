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
 * Respuestas a una pregunta. Los saludos y agradecimientos (`small`) los responde el agente al que le hablas (`to`, o
 * el último que habló, `from`; sin ninguno, recepción), con su voz y sin derivar. Si no, responde el tema del agente
 * pedido; si no hay, arquitecto antes que stack; si no, el primero que calza. Un tema con `unless` que calza no aplica.
 * Si calza otro tema de otro agente, este completa (encadenamiento con `handoffMore`), salvo que sea el agente pedido
 * que acaba de derivar: así el visitante no salta dos veces. Cada vez que la palabra pasa a otro agente hay un aviso
 * (marcado `handoff: true`): `handoff` al derivar, `handoffMore` cuando otro completa. Sin tema, responde recepción.
 * Devuelve como máximo 4 respuestas `{ agent, text, handoff? }`.
 */
export function answer(question, { topics, agents, small, to, from, noMatch, noMatchHanded, handoff, handoffMore, handoffUnknown }) {
  const n = normalize(question);
  const asked = to || from;
  if (small) {
    const key = small.greetRx.test(n) ? 'greet' : small.thanksRx.test(n) ? 'thanks' : null;
    if (key) return [{ agent: asked || 'recepcion', text: small[key][asked || 'recepcion'] }];
  }
  const hits = topics.filter((t) => t.rx.test(n) && !(t.unless && t.unless.test(n)));
  const out = [];
  if (!hits.length) {
    // Nadie sabe del tema: si estabas con arquitecto o stack, te pasa a recepción, que ofrece dejarle la pregunta a Augusto.
    if (asked && asked !== 'recepcion' && handoffUnknown) {
      return [{ agent: asked, handoff: true, text: handoffUnknown }, { agent: 'recepcion', text: noMatchHanded || noMatch }];
    }
    out.push({ agent: 'recepcion', text: noMatch });
  }
  else {
    const arq = hits.some((h) => h.agent === 'stack') && hits.find((h) => h.agent === 'arquitecto');
    const main = hits.find((h) => h.agent === asked) || arq || hits[0];
    out.push({ agent: main.agent, text: main.text });
    const other = hits.find((h) => h.agent !== main.agent && h.agent !== asked);
    if (other) {
      const next = agents[other.agent];
      out.push({ agent: main.agent, handoff: true, text: handoffMore ? handoffMore(next) : `${next.name} te cuenta el resto.` });
      out.push({ agent: other.agent, text: other.text });
    }
  }
  if (asked && out[0].agent !== asked) {
    const next = agents[out[0].agent];
    out.unshift({ agent: asked, handoff: true, text: handoff ? handoff(next) : `Eso lo sabe mejor ${next.name}. Te paso con él.` });
  }
  return out.slice(0, 4);
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
