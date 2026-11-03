import { useCallback, useEffect, useRef, useState } from 'react';
import { loadOfficeScene } from '../lib/officeThemes';

/**
 * Monta la oficina 3D de la serie `theme` en `stageRef` (lienzo en `canvasRef`, etiquetas en `labelsRef`) y expone
 * su estado a React: `active` (id del agente abierto o null), `mode` ('iso' | 'top') y las acciones de los botones.
 * Three.js se descarga aparte, solo cuando el escenario se acerca a la pantalla, para no pesar en la carga inicial.
 * Al cambiar `theme` se desmonta la oficina (liberando el contexto WebGL) y se monta la nueva desde cero.
 * Esc cierra el agente abierto. Sin WebGL, `failed` queda en true y el escenario muestra el aviso.
 */
export function useOffice(stageRef, canvasRef, labelsRef, agents, theme = 'original') {
  const [state, setState] = useState({ active: null, mode: 'iso' });
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const officeRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      setNear(true);
    }, { rootMargin: '800px 0px' });
    io.observe(stage);
    return () => io.disconnect();
  }, [stageRef]);

  useEffect(() => {
    if (!near) return undefined;
    let cancelled = false;
    setState({ active: null, mode: 'iso' });
    const load = async () => {
      const [{ mountOffice }, scene] = await Promise.all([import('../lib/officeEngine'), loadOfficeScene(theme)]);
      if (cancelled) return;
      const office = mountOffice({
        stage: stageRef.current, holder: canvasRef.current, labelsEl: labelsRef.current,
        scene, agents, onChange: setState,
      });
      if (!office) { setFailed(true); return; }
      officeRef.current = office;
    };
    load().catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      if (officeRef.current) { officeRef.current.dispose(); officeRef.current = null; }
    };
  }, [near, theme, stageRef, canvasRef, labelsRef, agents]);

  const toggle = useCallback((id) => officeRef.current?.toggle(id), []);
  const close = useCallback(() => officeRef.current?.close(), []);
  const setMode = useCallback((m) => officeRef.current?.setMode(m), []);

  useEffect(() => {
    if (!state.active) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.active, close]);

  return { ...state, failed, toggle, close, setMode };
}
