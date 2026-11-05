// Cliente del chat con IA (chat-agentes). Nunca lanza ni escribe en la consola: ante cualquier fallo devuelve null y el
// sitio responde con las reglas locales (officeChat.answer).

const AGENTES = ['recepcion', 'arquitecto', 'stack'];
const MAX_HISTORIAL = 6;

export const historialParaApi = (msgs) =>
  (Array.isArray(msgs) ? msgs : []).slice(-MAX_HISTORIAL).map((m) => ({ quien: m.who, texto: m.text }));

const validas = (replies) =>
  Array.isArray(replies) && replies.length >= 1 && replies.length <= 4 &&
  replies.every((r) => r && AGENTES.includes(r.agent) && typeof r.text === 'string');

export async function pedirRespuesta({ url, mensaje, agente, historial, timeoutMs = 8000, fetchImpl = globalThis.fetch }) {
  if (!url) return null;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mensaje, agente, historial }),
      signal: ctl.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.respaldo) return null;
    return validas(data.replies) ? data.replies : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
