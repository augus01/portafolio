import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampOffset, isDrag, marqueeCount, marqueePeriod, wrapOffset } from './techMarquee.js';

const items = ['react', 'python', 'aws', 'nextjs', 'nodejs', 'cloudflare', 'typescript', 'postgresql', 'railway'].map((logo) => ({ logo }));

test('logos por período según el ancho, entre 10 y 26', () => {
  assert.equal(marqueeCount(1440), 13);
  assert.equal(marqueeCount(320), 10);
  assert.equal(marqueeCount(4000), 26);
});

test('cada logo sale una vez visible y stack una sola vez por período', () => {
  const slots = marqueePeriod(items, 1, 1440, 'nextjs');
  assert.equal(slots.filter((s) => s.reader).length, 1);
  const shown = slots.filter((s) => s.item && !s.copy).map((s) => s.item.logo);
  assert.deepEqual(shown, items.map((s) => s.logo));
});

test('arriba, stack va justo antes de Next.js', () => {
  const slots = marqueePeriod(items, 0, 1440, 'nextjs');
  const k = slots.findIndex((s) => s.reader);
  assert.equal(slots[k + 1].item.logo, 'nextjs');
  assert.equal(slots[k - 1].item.logo, 'aws');
});

test('abajo, stack va a media vuelta del de arriba', () => {
  const slots = marqueePeriod(items, 1, 1440, 'nextjs');
  assert.equal(slots.findIndex((s) => s.reader), 10);
});

test('el aviso de emoción llega a todos los stack suscritos y se puede soltar', async () => {
  const { createCheer } = await import('./techMarquee.js');
  const cheer = createCheer();
  const got = [];
  const off = cheer.on((t) => got.push(`a:${t}`));
  cheer.on((t) => got.push(`b:${t}`));
  cheer.emit('React');
  off();
  cheer.emit('AWS');
  assert.deepEqual(got, ['a:React', 'b:React', 'b:AWS']);
});

test('cinta móvil: el desplazamiento da la vuelta dentro de (-mitad, 0]', () => {
  assert.equal(wrapOffset(-50, 1000), -50);
  assert.equal(wrapOffset(-1000, 1000), 0);
  assert.equal(wrapOffset(-1250, 1000), -250);
  assert.equal(wrapOffset(30, 1000), -970);
  assert.equal(wrapOffset(2100, 1000), -900);
  assert.equal(wrapOffset(-10, 0), 0);
});

test('cinta móvil sin bucle (sin movimiento): no pasa de los bordes', () => {
  assert.equal(clampOffset(20, 1500, 375), 0);
  assert.equal(clampOffset(-600, 1500, 375), -600);
  assert.equal(clampOffset(-2000, 1500, 375), -1125);
  assert.equal(clampOffset(-50, 300, 375), 0);
});

test('cinta móvil: un arrastre corto es un toque, uno largo no', () => {
  assert.equal(isDrag(3, 2), false);
  assert.equal(isDrag(12, 3), true);
  assert.equal(isDrag(4, 30), false);
});
