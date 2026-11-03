// Motor de la oficina 3D (Three.js r128), portado del artefacto "Landing · oficina" (office-engine.js).
// La escena (decorado, personajes y huevos de pascua) llega en `scene`; los textos de los agentes, en `agents`.
// El panel y los botones los dibuja React: el motor solo avisa con `onChange({ active, mode })`.
import * as THREE from 'three';
import { createFrameCap, getPerfTier, onPerfTier } from './perfTier';

export function mountOffice({ stage, holder, labelsEl, scene: cfg, agents: content, onChange }) {
  if (!stage || !holder || !labelsEl) return null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch (e) { return null; }
  const off = { raf: 0, visible: true };
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(cfg.clear);
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'pan-y';
  holder.appendChild(canvas);

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(cfg.hemi[0], cfg.hemi[1], cfg.hemi[2]));
  const sun = new THREE.DirectionalLight(cfg.sun[0], cfg.sun[1]);
  sun.position.set(7, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 });
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  // Ayudas de construcción: y es la base del objeto.
  const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.88, metalness: 0 }, o || {}));
  const place = (g, x, y, z) => { g.position.set(x, y, z); g.castShadow = true; g.receiveShadow = true; scene.add(g); return g; };
  const api = {
    THREE, scene, M,
    box: (w, h, d, m, x, y, z, ry) => { const g = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); if (ry) g.rotation.y = ry; return place(g, x, y + h / 2, z); },
    cyl: (rt, h, m, x, y, z, rb) => place(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb == null ? rt : rb, h, 32), m), x, y + h / 2, z),
    sphere: (r, m, x, y, z, sx, sy, sz) => { const g = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), m); if (sx) g.scale.set(sx, sy, sz); return place(g, x, y, z); },
    cone: (r, h, m, x, y, z) => place(new THREE.Mesh(new THREE.ConeGeometry(r, h, 24), m), x, y + h / 2, z),
    torus: (R, t, m, x, y, z, arc, rx, ry, rz) => { const g = new THREE.Mesh(new THREE.TorusGeometry(R, t, 8, 40, arc || Math.PI * 2), m); g.rotation.set(rx || 0, ry || 0, rz || 0); return place(g, x, y, z); },
    part: (geo, m, x, y, z) => { const g = new THREE.Mesh(geo, m); g.position.set(x, y, z); g.castShadow = true; return g; },
  };
  const extra = cfg.build(api) || {};

  // Agentes: posición y zona de clic vienen de la escena; nombre, sección y preguntas, del contenido.
  const AGENTS = content.map((c) => ({ ...c, ...cfg.spots[c.id] }));
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const ringMat = new THREE.MeshBasicMaterial({ color: cfg.ring, transparent: true, opacity: 0.9 });
  const hitboxes = [];
  AGENTS.forEach((a) => {
    const g = cfg.makeAgent(api, a.id);
    g.position.set(...a.pos);
    g.rotation.y = Math.PI / 4;
    scene.add(g);
    a.mesh = g; a.base = a.pos[1];
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.5, 48), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(a.pos[0], 0.02, a.pos[2]);
    ring.visible = false;
    scene.add(ring);
    a.ring = ring;
    const hb = new THREE.Mesh(new THREE.BoxGeometry(...a.hit.s), hitMat);
    hb.position.set(...a.hit.c);
    hb.userData.agent = a;
    scene.add(hb);
    hitboxes.push(hb);
  });

  // Huevos de pascua: la escena devuelve { eggs: [{ c, s, anim(t) }] }; un clic en la zona los abre o cierra.
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const eggs = extra.eggs || [];
  const eggBoxes = eggs.map((eg) => {
    const hb = new THREE.Mesh(new THREE.BoxGeometry(...eg.s), hitMat);
    hb.position.set(...eg.c);
    hb.userData.egg = eg;
    scene.add(hb);
    eg.on = false; eg.t = 0;
    if (eg.anim) eg.anim(0);
    return hb;
  });
  const cast = (e, list) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    return ray.intersectObjects(list)[0];
  };
  const pickEgg = (e) => { if (!eggBoxes.length) return null; const hit = cast(e, eggBoxes); return hit ? hit.object.userData.egg : null; };
  const pick = (e) => { const hit = cast(e, hitboxes); return hit ? hit.object.userData.agent : null; };

  // Etiquetas HTML sobre la escena.
  const labels = [];
  const addLabel = (text, cls, getPos) => {
    const el = document.createElement('div');
    el.className = 'ap-off__tag ap-off__tag--' + cls;
    el.textContent = text;
    el.setAttribute('aria-hidden', 'true');
    labelsEl.appendChild(el);
    labels.push({ el, getPos });
  };
  AGENTS.forEach((a) => addLabel(a.name, 'agent', () => new THREE.Vector3(a.pos[0], a.mesh.position.y + 0.75, a.pos[2])));
  (cfg.labels || []).forEach(([t, p]) => addLabel(t, 'deco', () => new THREE.Vector3(...p)));

  // Cámara isométrica con giro limitado.
  const view = { theta: Math.PI / 4, el: Math.atan(1 / Math.SQRT2), size: 7.2, target: new THREE.Vector3(0, 0.6, 0) };
  const goal = { theta: view.theta, el: view.el, size: view.size, target: view.target.clone() };
  const TH_MIN = 0.0, TH_MAX = Math.PI / 2 - 0.12;
  let mode = 'iso', active = null, hovered = null;
  const notify = () => onChange && onChange({ active: active ? active.id : null, mode });
  const baseSize = () => 7.2 * Math.max(1, 1.15 / (stage.clientWidth / stage.clientHeight));
  const setOverview = () => {
    goal.target.set(0, 0.6, 0);
    goal.size = baseSize() * (mode === 'top' ? 0.85 : 1);
    goal.el = mode === 'top' ? Math.PI / 2 - 0.001 : Math.atan(1 / Math.SQRT2);
    goal.theta = mode === 'top' ? 0 : Math.PI / 4;
  };
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    if (!active) setOverview();
  };
  resize();
  view.size = goal.size;
  const updateCamera = () => {
    const aspect = stage.clientWidth / stage.clientHeight || 1;
    cam.left = -view.size * aspect; cam.right = view.size * aspect;
    cam.top = view.size; cam.bottom = -view.size;
    cam.updateProjectionMatrix();
    const d = 40;
    cam.position.set(
      view.target.x + d * Math.cos(view.el) * Math.sin(view.theta),
      view.target.y + d * Math.sin(view.el),
      view.target.z + d * Math.cos(view.el) * Math.cos(view.theta)
    );
    cam.up.set(0, 1, 0);
    if (mode === 'top') cam.up.set(-Math.sin(view.theta), 0, -Math.cos(view.theta));
    cam.lookAt(view.target);
  };

  const openAgent = (a) => {
    active = a;
    goal.target.set(...a.focus);
    goal.size = Math.min(3.0, baseSize() * 0.55);
    notify();
  };
  const closeAgent = () => {
    active = null;
    setOverview();
    notify();
  };

  // Puntero: girar, hover, clic.
  let drag = null;
  const onDown = (e) => { drag = { x: e.clientX, moved: false }; try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* sin captura */ } };
  const onMove = (e) => {
    if (drag) {
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      if (drag.moved) {
        canvas.classList.add('dragging');
        goal.theta = Math.min(TH_MAX, Math.max(TH_MIN, goal.theta - dx * 0.006));
        drag.x = e.clientX;
      }
      return;
    }
    hovered = pick(e);
    canvas.classList.toggle('hover', !!hovered || !!pickEgg(e));
  };
  const onUp = (e) => {
    canvas.classList.remove('dragging');
    const egHit = (drag && !drag.moved) ? pickEgg(e) : null;
    if (egHit) egHit.on = !egHit.on;
    else if (drag && !drag.moved) { const a = pick(e); if (a) openAgent(a); else if (active) closeAgent(); }
    drag = null;
  };
  const onCancel = () => { drag = null; canvas.classList.remove('dragging'); };
  const onLeave = () => { hovered = null; canvas.classList.remove('hover'); };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('pointerleave', onLeave);

  // Bucle: solo corre mientras la oficina está en pantalla.
  const clock = new THREE.Clock();
  const v = new THREE.Vector3();
  // Tope de 60 fps para todos; en modo liviano, sombras a 1024 y pixelRatio 1; en el mínimo, además 30 fps.
  const cap = createFrameCap(60);
  const applyTier = (tier) => {
    if (tier < 1) return;
    renderer.setPixelRatio(1);
    resize();
    if (sun.shadow.mapSize.x !== 1024) {
      sun.shadow.mapSize.set(1024, 1024);
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    }
    if (tier >= 2) cap.setFps(30);
  };
  applyTier(getPerfTier());
  const offTier = onPerfTier(applyTier);
  const frame = (now) => {
    off.raf = 0;
    if (!off.visible || document.hidden) return;
    if (!cap.ready(now)) { off.raf = requestAnimationFrame(frame); return; }
    const t = clock.getElapsedTime();
    const k = reduced ? 1 : 0.12;
    view.theta += (goal.theta - view.theta) * k;
    view.el += (goal.el - view.el) * k;
    view.size += (goal.size - view.size) * k;
    view.target.lerp(goal.target, k);
    updateCamera();
    AGENTS.forEach((a, i) => {
      a.mesh.position.y = a.base + (reduced ? 0 : Math.sin(t * 1.6 + i * 2) * 0.06);
      const on = a === hovered || a === active;
      a.ring.visible = on;
      const s = on ? 1.12 : 1;
      a.mesh.scale.setScalar(a.mesh.scale.x + (s - a.mesh.scale.x) * 0.2);
    });
    eggs.forEach((eg) => {
      const tgt = eg.on ? 1 : 0;
      eg.t += (tgt - eg.t) * (reduced ? 1 : 0.14);
      if (Math.abs(tgt - eg.t) < 0.002) eg.t = tgt;
      if (eg.anim) eg.anim(eg.t);
    });
    if (extra.tick && !reduced) extra.tick(t);
    renderer.render(scene, cam);
    const w = stage.clientWidth, h = stage.clientHeight;
    labels.forEach((l) => {
      v.copy(l.getPos()).project(cam);
      const x = (v.x + 1) / 2 * w, y = (1 - v.y) / 2 * h;
      l.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      l.el.style.display = (Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05) ? 'none' : '';
    });
    off.raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!off.raf && off.visible && !document.hidden) off.raf = requestAnimationFrame(frame); };
  const io = new IntersectionObserver((es) => { off.visible = es[0].isIntersecting; kick(); }, { threshold: 0 });
  io.observe(stage);
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  document.addEventListener('visibilitychange', kick);
  kick();

  return {
    // Abre el agente o, si ya estaba abierto, vuelve a la vista general (como los botones del artefacto).
    toggle(id) { const a = AGENTS.find((x) => x.id === id); if (!a) return; if (active === a) closeAgent(); else openAgent(a); },
    close() { if (active) closeAgent(); },
    setMode(m) { mode = m; if (active) closeAgent(); else { setOverview(); notify(); } },
    dispose() {
      if (off.raf) cancelAnimationFrame(off.raf);
      offTier();
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', kick);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      canvas.removeEventListener('pointerleave', onLeave);
      labels.forEach((l) => l.el.remove());
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    },
  };
}
