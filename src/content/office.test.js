import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { agents, chat } from './office.js';
import { contact } from './home.js';

const sinTildes = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// Todos los textos de la oficina, con las funciones resueltas con un agente de prueba.
const falso = { name: 'x', topic: 'y' };
const todo = JSON.stringify({ agents, chat }, (k, v) => (v instanceof RegExp ? undefined : typeof v === 'function' ? v(falso) : v));

const TEC = /react|next|nest|typescript|postgres|prisma|supabase|lambda|bedrock|cloudfront|dynamo|firebase|tailwind|cloudflare|railway|expo|python|mantine|stripe|vitest/i;
const PROYECTOS = /rumbo|\bzam\b|lexinova|portafolio/i;

test('topics de cada agente coinciden con la spec', () => {
  assert.equal(agents.recepcion.topic, 'quién es Augusto y cómo dejarle un recado');
  assert.equal(agents.arquitecto.topic, 'qué es cada proyecto y qué logra');
  assert.equal(agents.stack.topic, 'cómo está construido cada proyecto');
  for (const a of Object.values(agents)) assert.ok(Array.isArray(a.rules) && a.rules.length >= 3, `${a.id} sin reglas`);
});

test('recepción no habla de proyectos ni tecnologías', () => {
  for (const t of chat.topics.filter((t) => t.agent === 'recepcion')) {
    assert.doesNotMatch(t.text, TEC);
    assert.doesNotMatch(t.text, PROYECTOS);
  }
  for (const v of chat.visitors) assert.doesNotMatch(v.reply, TEC);
});

test('arquitecto no nombra tecnologías', () => {
  for (const t of chat.topics.filter((t) => t.agent === 'arquitecto')) assert.doesNotMatch(t.text, TEC, t.text);
});

test('stack siempre nombra un proyecto, salvo Python para IA', () => {
  for (const t of chat.topics.filter((t) => t.agent === 'stack' && !/python/i.test(t.text))) {
    assert.match(t.text, /rumbo|inkvibe|zam|lexinova|portafolio/i, t.text);
  }
});

test('saludos y agradecimientos con texto propio de cada agente', () => {
  for (const id of ['recepcion', 'arquitecto', 'stack']) {
    assert.ok(chat.small.greet[id] && chat.small.thanks[id], id);
  }
  assert.ok(chat.small.greetRx.test('hola'));
  assert.ok(chat.small.thanksRx.test('gracias'));
  assert.ok(!chat.topics.some((t) => t.rx.test('hola') || t.rx.test('gracias')), 'el saludo ya no es un tema');
});

test('ningún texto habla de prácticas ni filtra datos personales', () => {
  assert.doesNotMatch(todo, /pr[aá]ctica|pasant/i);
  assert.doesNotMatch(JSON.stringify(contact), /pr[aá]ctica|pasant/i);
  assert.doesNotMatch(todo, /\+?56\s?9|\b\d{8,9}\b|san miguel/i);
  const correos = (todo.match(/[a-z0-9._-]+@[a-z0-9-]+\.[a-z.]+/gi) || []).filter((c) => c !== 'tu@correo.com');
  assert.deepEqual(correos, []);
});

test('nombres de organizaciones del perfil local no aparecen', (t) => {
  const perfil = new URL('../../docs/sensible/perfil-augusto.md', import.meta.url);
  if (!existsSync(perfil)) return t.skip('sin docs/sensible/perfil-augusto.md (clon limpio)');
  const linea = readFileSync(perfil, 'utf-8').split('\n').find((l) => l.startsWith('Organizaciones que no se nombran:'));
  assert.ok(linea, 'falta la línea de organizaciones en el perfil');
  const nombres = linea.split(':')[1].replace(/\.$/, '').split(',').map((n) => sinTildes(n.trim())).filter(Boolean);
  const texto = sinTildes(todo);
  for (const n of nombres) assert.ok(!texto.includes(n), `aparece ${n}`);
});

test('leadRx: disponibilidad sí, práctica no', () => {
  assert.ok(chat.leadRx.test('esta disponible'));
  assert.ok(!chat.leadRx.test('hizo una practica'));
});
