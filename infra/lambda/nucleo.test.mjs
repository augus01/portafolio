import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validarPeticion, costoUsd, armarSistema, armarMensajes, interpretarRespuesta, crearHandler, mesDe } from './nucleo.mjs';
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

const ev = (b) => ({ body: JSON.stringify(b) });
const falsos = (over = {}) => {
  const llamadas = { invocar: 0, sumado: [] };
  const deps = {
    contenido, topeUsd: 8, ahora: () => new Date('2026-11-15T12:00:00Z'),
    leerGasto: async () => 0,
    sumarGasto: async (mes, usd) => { llamadas.sumado.push([mes, usd]); },
    invocar: async () => { llamadas.invocar++; return { texto: '{"agente":"stack","texto":"Usa React."}', inputTokens: 1000, outputTokens: 100 }; },
    ...over,
  };
  return { h: crearHandler(deps), llamadas };
};

test('respuesta normal suma el gasto del mes', async () => {
  const { h, llamadas } = falsos();
  const r = await h(ev({ mensaje: '¿qué stack usa?' }));
  assert.equal(r.statusCode, 200);
  assert.equal(JSON.parse(r.body).replies[0].agent, 'stack');
  assert.equal(llamadas.sumado[0][0], '2026-11');
  assert.ok(Math.abs(llamadas.sumado[0][1] - 0.0015) < 1e-9);
});
test('petición inválida no gasta', async () => {
  const { h, llamadas } = falsos();
  assert.equal((await h({ body: 'no-json' })).statusCode, 400);
  assert.equal((await h(ev({ mensaje: '' }))).statusCode, 400);
  assert.equal(llamadas.invocar, 0);
});
test('al llegar al tope responde respaldo sin invocar', async () => {
  const { h, llamadas } = falsos({ leerGasto: async () => 8 });
  assert.deepEqual(JSON.parse((await h(ev({ mensaje: 'hola' }))).body), { respaldo: true, motivo: 'tope' });
  assert.equal(llamadas.invocar, 0);
});
test('si no se puede leer el gasto, no invoca', async () => {
  const { h, llamadas } = falsos({ leerGasto: async () => { throw new Error('dynamo'); } });
  assert.equal(JSON.parse((await h(ev({ mensaje: 'hola' }))).body).respaldo, true);
  assert.equal(llamadas.invocar, 0);
});
test('error de Bedrock o formato raro da respaldo', async () => {
  const caido = falsos({ invocar: async () => { throw new Error('AccessDenied'); } });
  assert.equal(JSON.parse((await caido.h(ev({ mensaje: 'hola' }))).body).motivo, 'error');
  const raro = falsos({ invocar: async () => ({ texto: 'sin json', inputTokens: 10, outputTokens: 10 }) });
  assert.equal(JSON.parse((await raro.h(ev({ mensaje: 'hola' }))).body).motivo, 'formato');
  assert.equal(raro.llamadas.sumado.length, 1);
});
test('si falla sumar el gasto, igual responde', async () => {
  const { h } = falsos({ sumarGasto: async () => { throw new Error('dynamo'); } });
  assert.ok(JSON.parse((await h(ev({ mensaje: 'hola' }))).body).replies);
});
test('el gasto se lleva por mes UTC', () => {
  assert.equal(mesDe(new Date('2026-11-30T23:59:59Z')), '2026-11');
  assert.equal(mesDe(new Date('2026-12-01T00:00:00Z')), '2026-12');
});
