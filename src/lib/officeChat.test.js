import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, wantsContact, isEmail, isConfirm, answer, greeting, bubbleMap, leadMailto, leadNext, isQuestion } from './officeChat.js';
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
  assert.deepEqual(out.map((r) => r.agent), ['arquitecto', 'arquitecto', 'stack']);
  assert.equal(out[1].handoff, true);
  assert.equal(out[2].text, chat.topics.find((t) => t.agent === 'stack' && t.rx.test('aws')).text);
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
  assert.ok(out.length <= 4);
});

test('greeting retoma la última pregunta salvo que fuera un contacto', () => {
  const g = { welcome: chat.welcome, welcomeBack: chat.welcomeBack, leadRx: chat.leadRx };
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

test('answer: el último agente que habló deriva la pregunta con aviso claro', () => {
  const out = answer('¿Cómo está armado Zam?', { ...opts(), from: 'recepcion', handoff: chat.handoff });
  assert.equal(out[0].agent, 'recepcion');
  assert.equal(out[0].handoff, true);
  assert.match(out[0].text, /stack.*Te llevo a su escritorio/);
  assert.deepEqual(out.map((r) => r.agent), ['recepcion', 'stack']);
});

test('answer: si quien habló sabe del tema, no hay derivación', () => {
  const out = answer('¿Qué es Inkvibe?', { ...opts(), from: 'arquitecto', handoff: chat.handoff });
  assert.equal(out[0].agent, 'arquitecto');
  assert.ok(!out.some((r) => r.handoff));
});

test('answer: si le preguntan a stack algo que también es suyo, responde él y anuncia a arquitecto', () => {
  const out = answer('¿Qué es Rumbo a Casa y con qué tecnologías está hecho?', { ...opts('stack'), handoff: chat.handoff, handoffMore: chat.handoffMore });
  assert.deepEqual(out.map((r) => r.agent), ['stack', 'stack', 'arquitecto']);
  assert.equal(out[1].handoff, true);
  assert.match(out[1].text, /Arquitecto .* te cuenta el resto/);
});

test('answer: cada cambio de agente lleva un aviso antes', () => {
  const out = answer('¿Qué hizo en la hackathon de AWS?', { ...opts(), from: 'recepcion', handoff: chat.handoff, handoffMore: chat.handoffMore });
  for (let i = 1; i < out.length; i++) {
    if (out[i].agent !== out[i - 1].agent) assert.equal(out[i - 1].handoff, true, `falta aviso antes de ${out[i].agent}`);
  }
});

test('answer: si arquitecto o stack no saben, te pasan a recepción con aviso', () => {
  const out = answer('¿Cuál es su comida favorita?', { ...opts('stack'), noMatchHanded: chat.noMatchHanded, handoffUnknown: chat.handoffUnknown });
  assert.deepEqual(out.map((r) => r.agent), ['stack', 'recepcion']);
  assert.equal(out[0].handoff, true);
  assert.equal(out[1].text, chat.noMatchHanded);
});

test('answer: una pregunta de recepción hecha a arquitecto pasa por su aviso', () => {
  const out = answer('¿Quién es Augusto?', { ...opts('arquitecto'), handoff: chat.handoff });
  assert.deepEqual(out.map((r) => r.agent), ['arquitecto', 'recepcion']);
  assert.match(out[0].text, /recepción.*Te llevo a su escritorio/);
});

test('recepción deriva "¿qué ha hecho Augusto?" a arquitecto', () => {
  const out = answer('¿Qué ha hecho Augusto?', { ...opts('recepcion'), handoff: chat.handoff });
  assert.deepEqual(out.map((r) => r.agent), ['recepcion', 'arquitecto']);
});

test('"¿Qué es Inkvibe?" solo arquitecto', () => {
  assert.deepEqual(answer('¿Qué es Inkvibe?', opts()).map((r) => r.agent), ['arquitecto']);
});

test('"¿Cómo está hecho Inkvibe?" solo stack, también en mayúsculas', () => {
  for (const q of ['¿Cómo está hecho Inkvibe?', '¿CÓMO ESTÁ HECHO INKVIBE?']) {
    assert.deepEqual(answer(q, opts()).map((r) => r.agent), ['stack'], q);
  }
});

test('"¿Qué sabe de React?" lo responde stack nombrando Inkvibe', () => {
  const out = answer('¿Qué sabe de React?', opts());
  assert.equal(out[0].agent, 'stack');
  assert.match(out[0].text, /Inkvibe/);
});

test('dos territorios sin agente: arquitecto, aviso, stack', () => {
  const out = answer('¿Qué es Inkvibe y cómo está hecho?', { ...opts(), handoffMore: chat.handoffMore });
  assert.deepEqual(out.map((r) => r.agent), ['arquitecto', 'arquitecto', 'stack']);
  assert.equal(out[1].handoff, true);
});

test('cada agente responde su propio saludo y agradecimiento, sin derivar', () => {
  for (const id of ['recepcion', 'arquitecto', 'stack']) {
    for (const [q, key] of [['HOLA', 'greet'], ['gracias!', 'thanks']]) {
      const out = answer(q, { ...opts(id), small: chat.small, handoff: chat.handoff });
      assert.deepEqual(out, [{ agent: id, text: chat.small[key][id] }], `${id} ${q}`);
    }
  }
  assert.equal(answer('hola', { ...opts(), small: chat.small })[0].agent, 'recepcion');
  assert.equal(answer('hola', { ...opts(), from: 'stack', small: chat.small })[0].agent, 'stack');
});

test('a stack le preguntan qué es Zam: deriva y no vuelve a stack', () => {
  const out = answer('¿Qué es Zam?', { ...opts('stack'), handoff: chat.handoff, handoffMore: chat.handoffMore });
  assert.deepEqual(out.map((r) => r.agent), ['stack', 'arquitecto']);
});

const q = { isQuestion };

test('leadNext rechaza saludos y cortesías como nombre', () => {
  for (const t of ['HOLA', 'ok', 'gracias', 'sí', 'a']) assert.equal(leadNext({ step: 'name' }, t, q).say, 'badName', t);
  assert.equal(leadNext({ step: 'name' }, 'HOLA', q).lead.step, 'name');
});

test('leadNext: una pregunta durante el recado sale del recado', () => {
  assert.equal(leadNext({ step: 'name' }, '¿Qué es Zam?', q).say, 'exit');
  assert.equal(leadNext({ step: 'need', name: 'Ana' }, '¿Cómo está hecho Inkvibe?', q).say, 'exit');
});

test('leadNext acepta un nombre y lo capitaliza', () => {
  const r = leadNext({ step: 'name' }, 'ANA MARÍA', q);
  assert.equal(r.say, 'need');
  assert.equal(r.lead.name, 'Ana María');
  assert.equal(r.lead.step, 'need');
});

test('leadNext pide una necesidad de verdad', () => {
  assert.equal(leadNext({ step: 'need', name: 'Ana' }, 'hola', q).say, 'badNeed');
  assert.equal(leadNext({ step: 'need', name: 'Ana' }, 'una web', q).say, 'badNeed');
  const r = leadNext({ step: 'need', name: 'Ana' }, 'Necesito una web para mi tienda', q);
  assert.equal(r.say, 'email');
  assert.equal(r.lead.need, 'Necesito una web para mi tienda');
});

test('leadNext: el segundo correo inválido ofrece cancelar', () => {
  const a = leadNext({ step: 'email', name: 'Ana', need: 'una web nueva' }, 'al mio', q);
  assert.equal(a.say, 'badEmail');
  assert.equal(leadNext(a.lead, 'tampoco', q).say, 'badEmailCancel');
  const ok = leadNext(a.lead, 'ana@empresa.cl', q);
  assert.equal(ok.say, 'review');
  assert.equal(ok.lead.step, 'confirm');
  assert.equal(ok.lead.email, 'ana@empresa.cl');
});

test('isQuestion: solo una pregunta explícita', () => {
  assert.ok(isQuestion('¿Cómo está hecho Inkvibe?'));
  assert.ok(isQuestion('como esta hecho zam?'));
  assert.ok(!isQuestion('Ana'));
  assert.ok(!isQuestion('Que me ayude con una página web'));
});

test('leadNext: necesidades y nombres normales no sacan del recado', () => {
  for (const t of ['Tengo un proyecto de app móvil', 'Necesito una web para mi minimarket', 'Que me ayude con una página web', 'Quiero una app con inteligencia artificial']) {
    assert.equal(leadNext({ step: 'need', name: 'Ana' }, t, q).say, 'email', t);
  }
  for (const t of ['Ernesto', 'Ana Zamora', 'José Carrera', 'Augusto Pérez', 'Matías Nube']) {
    assert.equal(leadNext({ step: 'name' }, t, q).say, 'need', t);
  }
});

test('answer: "Augusto" en una pregunta de otro territorio no arrastra a recepción', () => {
  assert.deepEqual(answer('¿Qué tecnologías usa Augusto?', opts()).map((r) => r.agent), ['stack']);
  assert.deepEqual(answer('¿Augusto usa IA?', opts()).map((r) => r.agent), ['stack']);
  assert.deepEqual(answer('¿Qué hace Augusto en Lexinova?', opts()).map((r) => r.agent), ['arquitecto']);
});

test('answer: más formas de preguntar cómo está hecho van a stack', () => {
  for (const t of ['¿Con qué está hecho Zam?', '¿En qué está programado Zam?', '¿Cómo construyó Inkvibe?', '¿Cómo hizo Inkvibe?', 'how is inkvibe built']) {
    assert.deepEqual(answer(t, opts()).map((r) => r.agent), ['stack'], t);
  }
  assert.deepEqual(answer('¿Qué hizo en la hackathon de AWS?', opts()).map((r) => r.agent)[0], 'arquitecto');
});

test('answer: los premios los cuenta arquitecto', () => {
  for (const t of ['¿Ganó algún premio?', '¿Qué premios tiene?']) assert.equal(answer(t, opts())[0].agent, 'arquitecto', t);
});

test('respaldo: "¿qué te puedo preguntar?" lo responde el agente al que le hablas, sin derivar', () => {
  for (const id of ['recepcion', 'arquitecto', 'stack']) {
    for (const q of ['¿Qué te puedo preguntar?', 'en qué me ayudas', '¿De qué sabes?', '¿Cómo funciona esto?', 'ayuda']) {
      assert.deepEqual(answer(q, { ...opts(id), small: chat.small, handoff: chat.handoff }), [{ agent: id, text: chat.small.help[id] }], `${id} ${q}`);
    }
  }
  assert.equal(answer('¿Qué te puedo preguntar?', { ...opts(), small: chat.small })[0].agent, 'recepcion');
});
