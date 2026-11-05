import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validarPeticion, costoUsd, armarSistema, armarMensajes, interpretarRespuesta } from './nucleo.mjs';
const contenido = JSON.parse(readFileSync(new URL('./contenido.json', import.meta.url)));

test('validarPeticion acepta una petición normal', () => {
  const r = validarPeticion({ mensaje: ' ¿Qué es Zam? ', agente: 'arquitecto', historial: [] });
  assert.deepEqual(r, { ok: true, mensaje: '¿Qué es Zam?', agente: 'arquitecto', historial: [] });
});
test('validarPeticion rechaza mensaje vacío', () => {
  assert.equal(validarPeticion({ mensaje: '   ' }).ok, false);
  assert.equal(validarPeticion({ mensaje: 'x'.repeat(501) }).ok, false);
  assert.equal(validarPeticion(null).ok, false);
});
test('validarPeticion rechaza agente inválido', () => {
  assert.equal(validarPeticion({ mensaje: 'hola', agente: 'augusto' }).ok, false);
});
test('validarPeticion sanea el historial', () => {
  const basura = [{ quien: 'hacker', texto: 'x' }, { quien: 'visitor' }, ...Array.from({ length: 50 }, (_, i) => ({ quien: 'visitor', texto: `m${i}` }))];
  const r = validarPeticion({ mensaje: 'hola', historial: basura });
  assert.equal(r.historial.length, 6);
  assert.equal(r.historial.at(-1).texto, 'm49');
  assert.equal(validarPeticion({ mensaje: 'hola', historial: 'no' }).historial.length, 0);
});
test('costoUsd con precios de Haiku 4.5', () => {
  assert.equal(costoUsd({ inputTokens: 1_000_000, outputTokens: 0 }), 1);
  assert.equal(costoUsd({ inputTokens: 0, outputTokens: 1_000_000 }), 5);
});
test('armarSistema incluye agentes, hechos y reglas', () => {
  const s = armarSistema(contenido);
  for (const id of ['recepcion', 'arquitecto', 'stack']) assert.ok(s.includes(id));
  assert.ok(s.includes(contenido.temas[0].text));
  assert.match(s, /no lo sé/i);
  assert.match(s, /"agente"/);
});
test('armarMensajes empieza con user y alterna', () => {
  const m = armarMensajes({ historial: [{ quien: 'recepcion', texto: 'Bienvenido' }, { quien: 'visitor', texto: 'hola' }, { quien: 'visitor', texto: '¿y Zam?' }], mensaje: 'cuéntame' });
  assert.equal(m[0].role, 'user');
  assert.ok(m.every((x, i) => i === 0 || x.role !== m[i - 1].role));
  assert.equal(m.at(-1).role, 'user');
  assert.match(m.at(-1).content.map((c) => c.text).join(' '), /cuéntame/);
});
test('interpretarRespuesta devuelve replies y deriva', () => {
  assert.deepEqual(interpretarRespuesta('{"agente":"stack","texto":"Usa React."}', { pedido: null, contenido }), [{ agent: 'stack', text: 'Usa React.' }]);
  const r = interpretarRespuesta('```json\n{"agente":"stack","texto":"Usa React."}\n```', { pedido: 'arquitecto', contenido });
  assert.deepEqual(r[0], { agent: 'arquitecto', handoff: true, text: contenido.derivar.stack });
  assert.equal(r[1].agent, 'stack');
});
test('si el agente pedido no sabe, deriva al que sabe', () => {
  const r = interpretarRespuesta('{"agente":"arquitecto","sabe":true,"texto":"Zam es la caja del minimarket."}', { pedido: 'stack', contenido });
  assert.deepEqual(r, [
    { agent: 'stack', handoff: true, text: contenido.derivar.arquitecto },
    { agent: 'arquitecto', text: 'Zam es la caja del minimarket.' },
  ]);
});
test('si nadie sabe, pasa a recepción y ofrece el recado', () => {
  const r = interpretarRespuesta('{"agente":"stack","sabe":false,"texto":"No lo sé. Si quieres, tomo tu recado."}', { pedido: 'arquitecto', contenido });
  assert.deepEqual(r, [
    { agent: 'arquitecto', handoff: true, text: contenido.derivarDesconocido },
    { agent: 'recepcion', text: 'No lo sé. Si quieres, tomo tu recado.' },
  ]);
  const solo = interpretarRespuesta('{"agente":"recepcion","sabe":false,"texto":"No lo sé."}', { pedido: 'recepcion', contenido });
  assert.deepEqual(solo, [{ agent: 'recepcion', text: 'No lo sé.' }]);
});
test('interpretarRespuesta rechaza agente inválido y texto sin JSON', () => {
  assert.equal(interpretarRespuesta('{"agente":"augusto","texto":"hola"}', { pedido: null, contenido }), null);
  assert.equal(interpretarRespuesta('Hola, soy stack.', { pedido: null, contenido }), null);
  assert.equal(interpretarRespuesta('{"agente":"stack","texto":""}', { pedido: null, contenido }), null);
});
