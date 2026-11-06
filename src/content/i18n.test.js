import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shape, strings } from './shape.js';
import * as esHome from './home.js';
import * as enHome from './en/home.js';
import * as esProjects from './projects.js';
import * as enProjects from './en/projects.js';

// Textos que se escriben igual en los dos idiomas: nombres propios, marcas, siglas, rutas y datos.
const SAME_RX = /^(augusto pinto|\/.*|https?:.*|#.*|.{0,3}|[^a-záéíóúñ]*)$/i;
// Palabras que son iguales en inglés y español (marcas, tecnologías, términos técnicos usados tal cual).
const SAME_WORDS = new Set([
  'GitHub', 'AWS', 'Zam', 'zam', 'Inkvibe', 'Rumbo a Casa', 'Frontend', 'Backend', 'ORM', 'Stack', 'stack', 'Bedrock', 'Lambda',
  'CloudFront', 'DynamoDB', 'Polly', 'InkCards', 'Builder Center', 'React', 'Python', 'Next.js', 'Node.js', 'Cloudflare',
  'TypeScript', 'PostgreSQL', 'Railway', 'JavaScript', 'Prisma', 'Docker', 'Vite', 'Supabase', 'Material UI', 'Firebase',
  'Lexinova', 'Original', 'Mad Men', 'Web', 'Backend', 'Expo', 'NestJS', 'Chile · GMT−3', 'recepcion', 'arquitecto', '© 2026 Augusto Pinto', 'Social good',
  'Marketplace', '01 — Landing', 'Blog', '06 — Blog', 'NestJS + Fastify', 'Postgres + Firebase', 'inkvibe.app',
]);
const SAME = (t) => SAME_RX.test(t) || SAME_WORDS.has(t);
// Nombres propios con tilde que pueden aparecer en inglés.
const ACCENT_OK = /Universidad San Sebastián|Ingeniería Civil Informática|Rumbo a Casa|Bogotá|Medellín|Perú|Concepción|Valparaíso|Más|Ñ/g;

const pairs = [
  ['home', esHome, enHome],
  ['projects', esProjects, enProjects],
];

for (const [name, es, en] of pairs) {
  test(`${name}: el inglés exporta lo mismo que el español`, () => {
    assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
  });

  test(`${name}: cada export tiene la misma forma en los dos idiomas`, () => {
    for (const k of Object.keys(es)) {
      if (typeof es[k] === 'function') continue;
      assert.deepEqual(shape(en[k]), shape(es[k]), `${name}.${k}`);
    }
  });

  test(`${name}: no queda español en la versión en inglés`, () => {
    for (const k of Object.keys(en).filter((k) => k !== 'langToggle')) {
      for (const [path, text] of strings(en[k], k)) {
        assert.doesNotMatch(text.replace(ACCENT_OK, ''), /[áéíóúñ¿¡]/i, `${name}.${path}: ${text}`);
      }
    }
  });

  test(`${name}: los textos están traducidos, no copiados`, () => {
    const copied = [];
    for (const k of Object.keys(es)) {
      const enTexts = new Map(strings(en[k], k));
      for (const [path, text] of strings(es[k], k)) {
        if (SAME(text.trim()) || path.endsWith('.href') || path.endsWith('.src') || /(^|\.)(id|slug|logo|brand|agent|image|symbol|mark|tone|type|variant|color|before|office|height|width|def)$/.test(path) || /^caseSlugs\.|\.(stack|theme)\./.test(path)) continue;
        if (enTexts.get(path) === text) copied.push(`${path}: ${text}`);
      }
    }
    assert.deepEqual(copied, [], `${name}: textos que siguen en español`);
  });
}

test('projects: los mismos slugs en los dos idiomas (las rutas no cambian)', () => {
  assert.deepEqual(enProjects.cases.map((c) => c.slug), esProjects.caseSlugs);
  assert.deepEqual(enProjects.caseSlugs, esProjects.caseSlugs);
  for (const slug of esProjects.caseSlugs) {
    assert.equal(enProjects.getCase(slug).slug, slug);
    assert.match(enProjects.getCase(slug).index, /^Project 0\d \/ 0\d$/);
  }
});

test('home: la píldora de idioma lleva al otro idioma', () => {
  assert.deepEqual(enHome.langToggle, { label: 'ES', ariaLabel: 'ES, ver en español', target: 'es' });
  assert.deepEqual(esHome.langToggle, { label: 'EN', ariaLabel: 'EN, view in English', target: 'en' });
});

test('inglés natural: contracciones en lo que dicen los agentes y la misma carrera en todo el sitio', async () => {
  const enOffice = await import('./en/office.js');
  const todo = [...strings(enOffice.chat, 'chat'), ...strings(enOffice.agents, 'agents'), ...strings(enHome.contact, 'contact'), ...strings(enHome.about, 'about')];
  const rigidas = todo.filter(([, t]) => /\b(Let us|I do not|You are|I am|I will|does not)\b/.test(t)).map(([p, t]) => `${p}: ${t}`);
  assert.deepEqual(rigidas, []);
  assert.deepEqual(todo.filter(([, t]) => /Ingenier/.test(t)).map(([p]) => p), []);
});

test('inglés: sin contracciones al final de una cláusula ("who he’s,", "what it’s and")', async () => {
  const enOffice = await import('./en/office.js');
  const todo = [...strings(enOffice, 'office'), ...strings(enHome, 'home'), ...strings(enProjects, 'projects')];
  assert.deepEqual(todo.filter(([, t]) => /\b(who|what|where) (he|it|she)’s[,.;:?!]|\b(who|what) (he|it)’s and\b/.test(t)).map(([p, t]) => `${p}: ${t}`), []);
});
