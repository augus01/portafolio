import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirContenido } from './chat-agentes-contenido.mjs';
import { agents, chat } from '../src/content/office.js';

test('construirContenido toma agentes, temas y derivaciones de office.js', () => {
  const c = construirContenido({ agents, chat });
  assert.deepEqual(Object.keys(c.agentes), ['recepcion', 'arquitecto', 'stack']);
  assert.equal(c.temas.length, chat.topics.length);
  assert.ok(c.temas.every((t) => typeof t.text === 'string' && !('rx' in t)));
  assert.equal(c.derivar.stack, chat.handoff(agents.stack));
  assert.equal(c.derivarDesconocido, chat.handoffUnknown);
  assert.equal(c.sinRespuesta, chat.noMatch);
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(c)));
});
