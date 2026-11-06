// Idioma de un mensaje del visitante (lógica pura, se prueba con `node --test`): los agentes de la oficina responden en
// el idioma en que les escriben, aunque el sitio esté en el otro. Cuenta palabras frecuentes de cada idioma y los signos
// propios del español (¿ ¡ ñ y tildes); si empatan o no hay pistas (un nombre, una sigla), gana el idioma del sitio.

const ES = new Set(('hola buenas buenos dias tardes noches que como cual cuales quien quienes donde cuando cuanto por para '
  + 'con sin es son esta estan eres tiene tienes tengo hace hizo hecho sabe sabes sus su el la los las un una unos unas '
  + 'de del y en al mi tu gracias proyecto proyectos trabajo trabaja puedo puedes quiero quisiera contratar hablar '
  + 'cuentame dime sobre usa uso usaste oye si pero tambien muy mas eso esto ese este algo hay ser estudia estudiante').split(' '));

const EN = new Set(('hello hi hey the what how who whom where when why which is are was were does do did you your he his him '
  + 'with about for of and in on to tell can could would should projects project work works worked use uses used thanks '
  + 'thank built build want hire contact good morning evening i it this that there these those has have had any some '
  + 'please made make from more also but very study student').split(' '));

// Signos que solo aparecen en español.
const MARCAS_ES = /[¿¡ñáéíóú]/g;

/** 'es' o 'en' según el texto; `fallback` (el idioma del sitio) decide si no hay pistas. Desconocido: inglés. */
export function detectLang(text, fallback = 'en') {
  const base = fallback === 'es' ? 'es' : 'en';
  const t = String(text || '').toLowerCase();
  let es = (t.match(MARCAS_ES) || []).length * 2;
  let en = 0;
  const palabras = t.normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z]+/).filter(Boolean);
  for (const p of palabras) {
    if (ES.has(p)) es += 1;
    if (EN.has(p)) en += 1;
  }
  if (es > en) return 'es';
  if (en > es) return 'en';
  return base;
}
