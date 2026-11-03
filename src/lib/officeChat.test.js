import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, wantsContact, isEmail, isConfirm, answer, greeting, bubbleMap, leadMailto } from './officeChat.js';
import { chat, agents } from '../content/office.js';

const opts = (to = null) => ({ topics: chat.topics, agents, to, noMatch: chat.noMatch });

test('normalize quita tildes y mayúsculas', () => {
  assert.equal(normalize('¿Qué hizo en Inkvibe?'), '¿que hizo en inkvibe?');
});

test('wantsContact reconoce pedidos de contacto', () => {
  assert.ok(wantsContact('¿Está disponible para una práctica?', chat.leadRx));
  assert.ok(wantsContact('Quiero contactarlo', chat.leadRx));
  assert.ok(!wantsContact('¿Qué stack usa?', chat.leadRx));
});

test('isEmail e isConfirm', () => {
  assert.ok(isEmail('ana@empresa.cl'));
  assert.ok(!isEmail('ana@empresa'));
  assert.ok(isConfirm('Sí, envíalo'));
  assert.ok(!isConfirm('mejor no'));
});

test('answer: el tema elige al agente', () => {
  const out = answer('¿Qué es Inkvibe?', opts());
  assert.equal(out[0].agent, 'arquitecto');
});

test('answer: dos temas de agentes distintos se completan', () => {
  const out = answer('¿Qué hizo en Rumbo a Casa con AWS?', opts());
  assert.deepEqual(out.map((r) => r.agent), ['arquitecto', 'stack']);
  assert.match(out[1].text, /^Y para completar: /);
});

test('answer: sin tema responde recepción', () => {
  const out = answer('¿Cuál es su comida favorita?', opts());
  assert.deepEqual(out, [{ agent: 'recepcion', text: chat.noMatch }]);
});

test('answer: el agente al que le hablaron pasa la palabra si no es su tema', () => {
  const out = answer('¿Qué es Zam?', opts('stack'));
  assert.equal(out[0].agent, 'stack');
  assert.match(out[0].text, /arquitecto/);
  assert.equal(out[1].agent, 'arquitecto');
  assert.ok(out.length <= 3);
});

test('greeting retoma la última pregunta salvo que fuera un contacto', () => {
  const g = { welcome: chat.welcome, leadRx: chat.leadRx };
  assert.equal(greeting(null, g), chat.welcome);
  assert.match(greeting({ last: '¿Qué stack usa?' }, g), /Volviste/);
  assert.equal(greeting({ last: 'Quiero contactarlo' }, g), chat.welcome);
});

test('bubbleMap junta las respuestas de un mismo agente', () => {
  assert.deepEqual(bubbleMap([{ agent: 'stack', text: 'a' }, { agent: 'stack', text: 'b' }, { agent: 'recepcion', text: 'c' }]), { stack: 'a b', recepcion: 'c' });
});

test('leadMailto codifica asunto y cuerpo', () => {
  const url = leadMailto('a@b.cl', 'Hola mundo', { name: 'Ana', need: 'Una web', email: 'ana@x.cl', topics: 'Nada' });
  assert.ok(url.startsWith('mailto:a@b.cl?subject=Hola%20mundo&body='));
  assert.match(decodeURIComponent(url.split('body=')[1]), /Nombre: Ana\nNecesita: Una web/);
});
