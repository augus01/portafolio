// Idioma del sitio (lógica pura, se prueba con `node --test`). Inglés es el principal: lo leen los jueces de AWS.
// El español es la alternativa y la elección se recuerda en localStorage. Nada de esto lanza: sin almacenamiento, inglés.

export const LANGS = ['en', 'es'];
export const DEFAULT_LANG = 'en';
export const LANG_KEY = 'ap-lang';

const valid = (lang) => LANGS.includes(lang);

export function readLang(storage) {
  try {
    const saved = storage?.getItem(LANG_KEY);
    return valid(saved) ? saved : DEFAULT_LANG;
  } catch (e) {
    return DEFAULT_LANG;
  }
}

export function saveLang(storage, lang) {
  try {
    storage?.setItem(LANG_KEY, lang);
  } catch (e) {
    // Sin almacenamiento (modo privado, cuota llena): el cambio vale solo para esta visita.
  }
}

export const otherLang = (lang) => (lang === 'es' ? 'en' : 'es');

/** Contenido del idioma pedido; con un idioma desconocido, el inglés. */
export const pickLang = (lang, byLang) => (valid(lang) ? byLang[lang] : byLang[DEFAULT_LANG]);
