import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createGovernor, createFrameCap, isSoftwareRenderer, parsePerfParam,
  getPerfTier, raisePerfTier, onPerfTier, forcePerfTier,
} from './perfTier.js';

test('sube cuando la media supera 24 ms', () => {
  const g = createGovernor();
  let raised = false;
  for (let i = 0; i < 60; i++) raised = g.sample(30) || raised;
  assert.equal(raised, true);
});

test('no sube con cuadros sanos a 60 Hz', () => {
  const g = createGovernor();
  for (let i = 0; i < 600; i++) assert.equal(g.sample(16.7), false);
});

test('ignora intervalos mayores a 250 ms', () => {
  const g = createGovernor();
  for (let i = 0; i < 120; i++) assert.equal(g.sample(1000), false);
});

test('un pico aislado no sube el nivel', () => {
  const g = createGovernor();
  for (let i = 0; i < 59; i++) g.sample(16.7);
  assert.equal(g.sample(200), false);
});

test('tres tirones de carga en una ventana sana no suben el nivel', () => {
  const g = createGovernor();
  for (let i = 0; i < 57; i++) assert.equal(g.sample(16.7), false);
  for (let i = 0; i < 3; i++) assert.equal(g.sample(200), false);
});

test('a 60 Hz con tope 60 dibuja todos los cuadros', () => {
  const c = createFrameCap(60); let n = 0;
  for (let i = 1; i <= 60; i++) if (c.ready(i * 16.667)) n++;
  assert.ok(n >= 59, `dibujó ${n}`);
});

test('a 120 Hz con tope 60 entrega 60 por segundo', () => {
  const c = createFrameCap(60); let n = 0;
  for (let i = 1; i <= 120; i++) if (c.ready(i * 8.333)) n++;
  assert.ok(n >= 58 && n <= 61, `dibujó ${n}`);
});

test('a 144 Hz entrega entre 55 y 60 cuadros por segundo', () => {
  const c = createFrameCap(60); let n = 0;
  for (let i = 1; i <= 144; i++) if (c.ready(i * 6.944)) n++;
  assert.ok(n >= 55 && n <= 61, `dibujó ${n}`);
});

test('setFps(30) a 60 Hz entrega 30 por segundo', () => {
  const c = createFrameCap(60); c.setFps(30); let n = 0;
  for (let i = 1; i <= 60; i++) if (c.ready(i * 16.667)) n++;
  assert.ok(n >= 29 && n <= 31, `dibujó ${n}`);
});

test('detecta WebGL por software', () => {
  assert.equal(isSoftwareRenderer('ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)))'), true);
  assert.equal(isSoftwareRenderer('ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11)'), false);
});

test('parsePerfParam', () => {
  assert.equal(parsePerfParam('?perf=lite'), 1);
  assert.equal(parsePerfParam('?perf=min'), 2);
  assert.equal(parsePerfParam('?perf=full'), 0);
  assert.equal(parsePerfParam('?x=1'), null);
});

test('raisePerfTier nunca baja y avisa', () => {
  const seen = [];
  const off = onPerfTier((t) => seen.push(t));
  raisePerfTier(1); raisePerfTier(0); raisePerfTier(2); raisePerfTier(5);
  off();
  assert.equal(getPerfTier(), 2);
  assert.deepEqual(seen, [1, 2]);
});

test('forcePerfTier fija el nivel y bloquea las subidas automáticas', () => {
  forcePerfTier(0);
  raisePerfTier(2);
  assert.equal(getPerfTier(), 0);
});
