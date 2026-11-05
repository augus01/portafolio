import { test } from 'node:test';
import assert from 'node:assert/strict';
import { historialParaApi, pedirRespuesta } from './chatAgentesApi.js';

const resp = (status, body) => async () => ({ ok: status < 300, status, json: async () => body });
const base = { url: 'https://api.test/chat', mensaje: 'hola', agente: null, historial: [] };

test('historialParaApi toma los últimos 6', () => {
  const msgs = Array.from({ length: 9 }, (_, i) => ({ id: i, who: i % 2 ? 'visitor' : 'recepcion', text: `t${i}` }));
  const h = historialParaApi(msgs);
  assert.equal(h.length, 6);
  assert.deepEqual(h.at(-1), { quien: 'recepcion', texto: 't8' });
});
test('pedirRespuesta devuelve replies válidas', async () => {
  const r = await pedirRespuesta({ ...base, fetchImpl: resp(200, { replies: [{ agent: 'stack', text: 'React' }] }) });
  assert.deepEqual(r, [{ agent: 'stack', text: 'React' }]);
});
test('pedirRespuesta devuelve null sin url, con respaldo, 429 o forma rara', async () => {
  assert.equal(await pedirRespuesta({ ...base, url: '' }), null);
  assert.equal(await pedirRespuesta({ ...base, fetchImpl: resp(200, { respaldo: true, motivo: 'tope' }) }), null);
  assert.equal(await pedirRespuesta({ ...base, fetchImpl: resp(429, { message: 'Too Many Requests' }) }), null);
  assert.equal(await pedirRespuesta({ ...base, fetchImpl: resp(200, { replies: [{ agent: 'augusto', text: 'x' }] }) }), null);
  assert.equal(await pedirRespuesta({ ...base, fetchImpl: async () => { throw new TypeError('offline'); } }), null);
});
test('pedirRespuesta devuelve null al vencer el tiempo', async () => {
  const colgado = (url, { signal }) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(new DOMException('abort', 'AbortError'))));
  const t0 = Date.now();
  assert.equal(await pedirRespuesta({ ...base, timeoutMs: 50, fetchImpl: colgado }), null);
  assert.ok(Date.now() - t0 < 1000);
});
