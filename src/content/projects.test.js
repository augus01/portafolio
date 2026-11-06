import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { cases } from './projects.js';

const zam = cases.find((c) => c.slug === 'zam');
const LAPTOP = [1508, 784];
const PHONE = [387, 784];

// Ancho y alto de un .webp, leídos del encabezado (VP8, VP8L o VP8X) sin dependencias.
function webpSize(path) {
  const b = readFileSync(path);
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (kind === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
}

// Cada imagen de la página con el dispositivo en que se muestra.
function shots(c) {
  const out = c.cover.phones.map((s) => ({ ...s, device: PHONE }));
  for (const stage of c.stages) {
    for (const bl of stage.blocks) {
      if (bl.type === 'laptop') out.push({ ...bl.shot, device: LAPTOP, caption: bl.caption });
      if (bl.type === 'phones') bl.shots.forEach((s) => out.push({ ...s, device: PHONE }));
      if (bl.type === 'combo') out.push({ ...bl.laptop, device: LAPTOP }, { ...bl.phone, device: PHONE });
      if (bl.type === 'duo') {
        if (bl.laptop) out.push({ ...bl.laptop, device: LAPTOP, caption: bl.copy });
        if (bl.phone) out.push({ ...bl.phone, device: PHONE, caption: bl.copy });
      }
    }
  }
  return out;
}

test('zam: tiene al menos 5 capturas de producto', () => {
  const unicas = new Set(shots(zam).map((s) => s.src).filter((s) => /\/zam-.*\.webp$/.test(s)));
  assert.ok(unicas.size >= 6, `hay ${unicas.size}`);
});

test('zam: cada imagen existe y tiene la medida de su dispositivo', () => {
  for (const s of shots(zam)) {
    const file = `public${s.src}`;
    assert.ok(existsSync(file), `falta ${file}`);
    assert.deepEqual(webpSize(file), s.device, s.src);
  }
});

test('zam: cada imagen tiene alt en español y no vacío', () => {
  for (const s of shots(zam)) assert.ok(s.alt && s.alt.length > 20, `alt corto en ${s.src}`);
});

test('zam: la etapa 3D se rotula como próxima etapa', () => {
  const mapa = shots(zam).find((s) => s.src.endsWith('zam-web-mapa-3d.webp'));
  assert.ok(mapa, 'falta el mapa 3D');
  assert.match(JSON.stringify(mapa.caption) + mapa.alt, /Próxima etapa/);
});

test('zam: el texto ya no dice que no hay capturas', () => {
  assert.doesNotMatch(zam.intro.body, /no tiene capturas/);
});
