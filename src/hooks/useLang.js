import { useCallback, useEffect, useState } from 'react';
import { otherLang, readLang, saveLang } from '../lib/lang';

const storage = () => {
  try {
    return window.localStorage;
  } catch (e) {
    return undefined;
  }
};

// Idioma de la página: abre con el guardado (inglés si no hay), lo aplica a <html lang> y lo recuerda al cambiarlo.
export function useLang() {
  const [lang, setLang] = useState(() => readLang(storage()));
  useEffect(() => {
    document.documentElement.lang = lang;
    saveLang(storage(), lang);
  }, [lang]);
  const toggle = useCallback(() => setLang((l) => otherLang(l)), []);
  return { lang, setLang, toggle };
}
