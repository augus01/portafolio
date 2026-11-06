import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectLang } from './detectLang.js';

test('reconoce español aunque el sitio esté en inglés', () => {
  for (const t of ['hola', '¿Qué stack usa Zam?', 'cuentame de inkvibe', 'que usa en el backend', 'gracias', 'Quiero contratar a Augusto', 'cómo está hecho este portafolio']) {
    assert.equal(detectLang(t, 'en'), 'es', t);
  }
});

test('reconoce inglés aunque el sitio esté en español', () => {
  for (const t of ['hi', 'What stack does Zam use?', 'tell me about inkvibe', 'how is zam built', 'thanks!', 'I want to hire Augusto', 'hello there']) {
    assert.equal(detectLang(t, 'es'), 'en', t);
  }
});

test('sin pistas (nombres, siglas, vacío) usa el idioma del sitio', () => {
  for (const t of ['AWS', 'Inkvibe', 'React', '', '   ', '?']) {
    assert.equal(detectLang(t, 'en'), 'en', t);
    assert.equal(detectLang(t, 'es'), 'es', t);
  }
});

test('con un idioma de respaldo desconocido, inglés', () => {
  assert.equal(detectLang('Inkvibe', 'fr'), 'en');
  assert.equal(detectLang('hola', 'fr'), 'es');
});
