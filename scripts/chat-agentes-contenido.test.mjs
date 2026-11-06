import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirContenido, construirIdiomas } from './chat-agentes-contenido.mjs';
import { agents, chat } from '../src/content/office.js';
import * as en from '../src/content/en/office.js';

test('construirContenido toma agentes, temas y derivaciones de office.js', () => {
  const c = construirContenido({ agents, chat });
  assert.deepEqual(Object.keys(c.agentes), ['recepcion', 'arquitecto', 'stack']);
  assert.equal(c.temas.length, chat.topics.length);
  assert.ok(c.temas.every((t) => typeof t.text === 'string' && !('rx' in t)));
  assert.equal(c.derivar.stack, chat.handoff(agents.stack));
  assert.equal(c.derivarDesconocido, chat.handoffUnknown);
  assert.equal(c.sinRespuesta, chat.noMatch);
  assert.deepEqual(c.agentes.stack.reglas, agents.stack.rules);
  assert.equal(c.derivarMas.stack, chat.handoffMore(agents.stack));
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(c)));
});

test('construirIdiomas arma el contenido en español e inglés', () => {
  const c = construirIdiomas({ es: { agents, chat }, en });
  assert.deepEqual(Object.keys(c), ['es', 'en']);
  assert.deepEqual(c.es, construirContenido({ agents, chat }));
  assert.equal(c.en.agentes.arquitecto.name, 'architect');
  assert.equal(c.en.sinRespuesta, en.chat.noMatch);
});
