import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Monta la oficina 3D `themeId` en `stageRef` (lienzo en `canvasRef`, etiquetas y globos en `labelsRef`).
 * Al cambiar `themeId` se desmonta la oficina anterior (libera la GPU) y se monta la nueva, con los mismos globos,
 * el mismo agente elegido y la misma vista. Three.js y los decorados se descargan aparte, al abrir la página.
 * Devuelve un control estable: `say(map, opts)`, `speak(id)`, `select(id)`, `unfocus()`, `setMode(m)`, más `mode` y `failed`.
 * `onPick(id | null)` avisa cuando el visitante hace clic en un agente dentro de la maqueta.
 */
export function useOfficeScene({ stageRef, canvasRef, labelsRef, themeId, agents, onPick }) {
  const [mode, setModeState] = useState('iso');
  const [failed, setFailed] = useState(false);
  const engineRef = useRef(null);
  // Lo último que se le pidió a la escena, para repetirlo al montar otra oficina.
  const last = useRef({ say: null, speak: null, select: null, mode: 'iso' });
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    let cancelled = false;
    (async () => {
      const [{ mountOffice }, { officeThemes }] = await Promise.all([import('../lib/officeEngine'), import('../lib/officeThemes')]);
      if (cancelled) return;
      const engine = mountOffice({
        stage, holder: canvasRef.current, labelsEl: labelsRef.current,
        theme: officeThemes[themeId] || officeThemes.original, agents,
        onPick: (id) => { last.current.select = id; if (pickRef.current) pickRef.current(id); },
      });
      if (!engine) { setFailed(true); return; }
      setFailed(false);
      engineRef.current = engine;
      const l = last.current;
      if (l.mode !== 'iso') engine.setMode(l.mode);
      engine.select(l.select);
      // Al montar una oficina (también al cambiarla) se parte en la vista general, sin acercarse a nadie.
      engine.say(l.say, { focus: false });
      engine.speak(l.speak);
    })().catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      if (engineRef.current) { engineRef.current.dispose(); engineRef.current = null; }
    };
  }, [stageRef, canvasRef, labelsRef, themeId, agents]);

  const control = useMemo(() => ({
    say(map, opts) { last.current.say = map; engineRef.current?.say(map, opts); },
    speak(id) { last.current.speak = id; engineRef.current?.speak(id); },
    select(id) { last.current.select = id; engineRef.current?.select(id); },
    // Esc: suelta el zoom (y el globo). Lo que se repite al montar otra oficina queda sin globo.
    unfocus() { last.current.say = null; return engineRef.current?.unfocus() || false; },
    setMode(m) { last.current.mode = m; setModeState(m); engineRef.current?.setMode(m); },
  }), []);

  return { ...control, mode, failed };
}
