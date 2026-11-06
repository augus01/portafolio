import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validarPeticion, costoUsd, armarSistema, armarMensajes, interpretarRespuesta, crearHandler, mesDe } from './nucleo.mjs';
const todo = JSON.parse(readFileSync(new URL('./contenido.json', import.meta.url)));
const contenido = todo.es;

test('validarPeticion acepta una petición normal', () => {
  const r = validarPeticion({ mensaje: ' ¿Qué es Zam? ', agente: 'arquitecto', historial: [] });
  assert.deepEqual(r, { ok: true, mensaje: '¿Qué es Zam?', agente: 'arquitecto', historial: [], lang: 'es' });
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
test('costoUsd con precios de Haiku 4.5 regional', () => {
  assert.equal(costoUsd({ inputTokens: 1_000_000, outputTokens: 0 }), 1.1);
  assert.equal(costoUsd({ inputTokens: 0, outputTokens: 1_000_000 }), 5.5);
});
test('armarSistema incluye agentes, hechos y reglas', () => {
  const s = armarSistema(contenido);
  for (const id of ['recepcion', 'arquitecto', 'stack']) assert.ok(s.includes(id));
  assert.ok(s.includes(contenido.temas[0].text));
  assert.match(s, /no lo sé/i);
  assert.match(s, /"agente"/);
});
test('armarSistema incluye las reglas de cada agente y el agente pedido', () => {
  const s = armarSistema(contenido, 'stack');
  for (const r of contenido.agentes.recepcion.reglas) assert.ok(s.includes(r));
  assert.match(s, /Eres stack \(stack\)/);
  assert.match(s, /saludos y agradecimientos/i);
  assert.match(s, /"sigue"/);
  assert.match(s, /ese responde primero/);
  assert.doesNotMatch(armarSistema(contenido), /te está hablando a ti/);
});
test('sigue encadena con aviso', () => {
  const r = interpretarRespuesta('{"agente":"arquitecto","texto":"Inkvibe es…","sigue":{"agente":"stack","texto":"Está hecho con Next.js."}}', { pedido: null, contenido });
  assert.deepEqual(r.map((x) => [x.agent, !!x.handoff]), [['arquitecto', false], ['arquitecto', true], ['stack', false]]);
  assert.equal(r[1].text, contenido.derivarMas.stack);
  assert.equal(r[2].text, 'Está hecho con Next.js.');
});
test('sigue tras derivar deja como máximo 4 respuestas', () => {
  const r = interpretarRespuesta('{"agente":"arquitecto","texto":"Inkvibe es…","sigue":{"agente":"stack","texto":"Next.js."}}', { pedido: 'recepcion', contenido });
  assert.deepEqual(r.map((x) => x.agent), ['recepcion', 'arquitecto', 'arquitecto', 'stack']);
});
test('sigue inválido, del mismo agente o con sabe:false se descarta', () => {
  for (const s of ['{"agente":"stack","texto":""}', '{"agente":"arquitecto","texto":"x"}', '{"agente":"augusto","texto":"x"}', '"x"']) {
    assert.equal(interpretarRespuesta(`{"agente":"arquitecto","texto":"Hola.","sigue":${s}}`, { pedido: null, contenido }).length, 1, s);
  }
  assert.equal(interpretarRespuesta('{"agente":"recepcion","sabe":false,"texto":"No lo sé.","sigue":{"agente":"stack","texto":"x"}}', { pedido: null, contenido }).length, 1);
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
    contenido: todo, topeUsd: 8, ahora: () => new Date('2026-11-15T12:00:00Z'),
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
  assert.ok(Math.abs(llamadas.sumado[0][1] - 0.00165) < 1e-9);
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

test('armarSistema pide la intención y da la regla de ayuda', () => {
  const s = armarSistema(contenido, 'arquitecto');
  assert.match(s, /"intencion"/);
  for (const i of ['saludo', 'gracias', 'ayuda', 'pregunta', 'recado']) assert.ok(s.includes(i), i);
  assert.match(s, /qué preguntas puede aclarar/);
  assert.match(s, /cómo funciona la oficina/);
});
test('ayuda la responde el agente pedido aunque el modelo elija a otro', () => {
  const r = interpretarRespuesta('{"intencion":"ayuda","agente":"recepcion","texto":"Puedo contarte…"}', { pedido: 'arquitecto', contenido });
  assert.deepEqual(r, [{ agent: 'arquitecto', text: 'Puedo contarte…' }]);
});
test('un saludo con sabe:false igual lo responde el agente pedido', () => {
  const r = interpretarRespuesta('{"intencion":"saludo","agente":"recepcion","sabe":false,"texto":"¡Hola!"}', { pedido: 'stack', contenido });
  assert.deepEqual(r, [{ agent: 'stack', text: '¡Hola!' }]);
});
test('ayuda sin agente pedido la da recepción y descarta sigue', () => {
  const r = interpretarRespuesta('{"intencion":"ayuda","agente":"stack","texto":"x","sigue":{"agente":"arquitecto","texto":"y"}}', { pedido: null, contenido });
  assert.deepEqual(r, [{ agent: 'recepcion', text: 'x' }]);
});
test('una pregunta de otro territorio deriva como antes', () => {
  const r = interpretarRespuesta('{"intencion":"pregunta","agente":"stack","texto":"x"}', { pedido: 'arquitecto', contenido });
  assert.deepEqual(r.map((x) => [x.agent, !!x.handoff]), [['arquitecto', true], ['stack', false]]);
});
test('con agente pedido, el saludo va con la voz de ese agente', () => {
  assert.match(armarSistema(contenido, 'stack'), /te presentas como stack, que sabe de/);
});

test('validarPeticion: sin lang o con uno desconocido responde en español', () => {
  assert.equal(validarPeticion({ mensaje: 'hola' }).lang, 'es');
  assert.equal(validarPeticion({ mensaje: 'hi', lang: 'en' }).lang, 'en');
  const raro = validarPeticion({ mensaje: 'hola', lang: 'fr' });
  assert.equal(raro.ok, true);
  assert.equal(raro.lang, 'es');
});
test('contenido.json trae los dos idiomas con la misma forma', () => {
  assert.deepEqual(Object.keys(todo).sort(), ['en', 'es']);
  assert.deepEqual(Object.keys(todo.en).sort(), Object.keys(todo.es).sort());
  assert.equal(todo.en.agentes.arquitecto.name, 'architect');
});
test('armarSistema pide responder en el idioma del sitio', () => {
  assert.match(armarSistema(todo.en, null, 'en'), /Respond in English/);
  assert.match(armarSistema(todo.en, null, 'en'), /architect/);
  assert.doesNotMatch(armarSistema(todo.en, null, 'en'), /Responde en español de Chile/);
  assert.match(armarSistema(todo.es), /Responde en español de Chile/);
});
test('el handler usa el contenido del idioma pedido', async () => {
  let sistema = '';
  const { h } = falsos({ invocar: async (s) => { sistema = s; return { texto: '{"agente":"arquitecto","texto":"Zam is a corner store app."}', inputTokens: 10, outputTokens: 10 }; } });
  const r = JSON.parse((await h(ev({ mensaje: 'what is zam?', agente: 'stack', lang: 'en' }))).body);
  assert.match(sistema, /Respond in English/);
  assert.deepEqual(r.replies[0], { agent: 'stack', handoff: true, text: todo.en.derivar.arquitecto });
  const sinLang = JSON.parse((await h(ev({ mensaje: 'que es zam?', agente: 'stack' }))).body);
  assert.equal(sinLang.replies[0].text, todo.es.derivar.arquitecto);
});
test('armarSistema en inglés no le da al modelo frases en español para copiar', () => {
  const s = armarSistema(todo.en, null, 'en');
  assert.doesNotMatch(s, /recepción de Augusto|"no lo sé"/);
  assert.match(s, /reception of Augusto|reception, architect and stack/);
  assert.match(s, /"I don't know"/);
  assert.match(armarSistema(todo.es), /"no lo sé"/);
});
test('interpretarRespuesta acepta el nombre del agente en vez del id (el modelo escribe "architect")', () => {
  const r = interpretarRespuesta('{"intencion":"pregunta","agente":"architect","sabe":true,"texto":"Zam is a store app.","sigue":{"agente":"stack","texto":"Built with NestJS."}}', { pedido: null, contenido: todo.en });
  assert.deepEqual(r.map((x) => x.agent), ['arquitecto', 'arquitecto', 'stack']);
  const recep = interpretarRespuesta('{"agente":"reception","sabe":false,"texto":"I don\'t know."}', { pedido: 'stack', contenido: todo.en });
  assert.deepEqual(recep.map((x) => x.agent), ['stack', 'recepcion']);
  assert.equal(interpretarRespuesta('{"agente":"recepción","texto":"Hola."}', { pedido: null, contenido: todo.es })[0].agent, 'recepcion');
});
test('armarSistema en inglés aclara que "agente" va con el id', () => {
  assert.match(armarSistema(todo.en, null, 'en'), /"agente" is always the id \(recepcion, arquitecto, stack\)/);
});
