import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { cases, getCase } from './projects.js';

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

test('zam: cada imagen existe', () => {
  for (const s of shots(zam)) assert.ok(existsSync(`public${s.src}`), `falta public${s.src}`);
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

test('zam: el intro aclara que las pantallas son diseños, no capturas de un producto funcionando', () => {
  assert.match(zam.intro.body, /diseños/);
});

test('zam: el dato de módulos calza con los 7 módulos de los preDocs', () => {
  const mod = zam.facts.find((f) => /Módulos/.test(f.l));
  assert.equal(mod.n, '7');
});

test('zam: no se versiona el runtime de Claude Design', () => {
  assert.ok(!existsSync('docs/zam-pantallas/fuente/support.js'));
});

test('zam: las imágenes van al doble de la medida del dispositivo para que el texto se lea', () => {
  for (const s of shots(zam)) {
    const [w, h] = webpSize(`public${s.src}`);
    assert.deepEqual([w, h], [s.device[0] * 2, s.device[1] * 2], s.src);
  }
});

test('cada caso muestra abajo los otros dos proyectos, en orden y solo con su logo y color', () => {
  for (const c of cases) {
    const { others } = getCase(c.slug);
    const esperados = cases.filter((o) => o.slug !== c.slug);
    assert.equal(others.length, cases.length - 1, c.slug);
    assert.ok(others.every((o) => esperados.some((e) => e.name === o.name)), c.slug);
    assert.equal(others[0].name, cases[(cases.indexOf(c) + 1) % cases.length].name, `${c.slug}: primero el siguiente`);
    for (const o of others) {
      assert.ok(o.logo && (o.logo.symbol || o.logo.image), `${o.name} sin logo`);
      const caso = cases.find((e) => e.name === o.name);
      assert.equal(o.color, caso.theme.brand, `${o.name}: el fondo es el color de marca del landing`);
      assert.ok(o.logo.image || o.logo.wordmark, `${o.name}: logo completo, no solo el isotipo`);
      assert.equal(o.thumb, undefined, `${o.name} no lleva pantallas`);
    }
  }
});
