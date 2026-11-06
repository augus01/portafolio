import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGS, DEFAULT_LANG, LANG_KEY, readLang, saveLang, otherLang, pickLang } from './lang.js';

test('lang: inglés es el idioma por defecto', () => {
  assert.deepEqual(LANGS, ['en', 'es']);
  assert.equal(DEFAULT_LANG, 'en');
  assert.equal(LANG_KEY, 'ap-lang');
});

test('readLang: sin almacenamiento abre en inglés', () => {
  assert.equal(readLang(), 'en');
});

test('readLang: respeta un idioma guardado válido', () => {
  assert.equal(readLang({ getItem: (k) => (k === 'ap-lang' ? 'es' : null) }), 'es');
});

test('readLang: un valor desconocido abre en inglés', () => {
  assert.equal(readLang({ getItem: () => 'fr' }), 'en');
  assert.equal(readLang({ getItem: () => '"es"' }), 'en');
});

test('readLang: si el almacenamiento lanza, abre en inglés', () => {
  assert.equal(readLang({ getItem: () => { throw new Error('bloqueado'); } }), 'en');
});

test('saveLang: guarda con la clave del sitio', () => {
  const calls = [];
  saveLang({ setItem: (k, v) => calls.push([k, v]) }, 'es');
  assert.deepEqual(calls, [['ap-lang', 'es']]);
});

test('saveLang: nunca lanza', () => {
  assert.doesNotThrow(() => saveLang({ setItem: () => { throw new Error('lleno'); } }, 'es'));
  assert.doesNotThrow(() => saveLang(undefined, 'es'));
});

test('otherLang: alterna entre inglés y español', () => {
  assert.equal(otherLang('en'), 'es');
  assert.equal(otherLang('es'), 'en');
});

test('pickLang: elige el contenido del idioma, inglés si es inválido', () => {
  assert.equal(pickLang('es', { en: 1, es: 2 }), 2);
  assert.equal(pickLang('en', { en: 1, es: 2 }), 1);
  assert.equal(pickLang('xx', { en: 1, es: 2 }), 1);
});
