// Motor de la oficina 3D (Three.js r128), portado del artefacto "Hero · Augusto Pinto" (office-engine.js, modo chat).
// El decorado y los personajes llegan en `theme` (src/lib/officeThemes.js); los nombres de los agentes, en `agents`.
// Un clic en un agente no abre panel: lo marca y avisa con `onPick(id | null)`; la conversación la dibuja React.
// Los globos de diálogo sobre cada agente se muestran con `say({ id: texto })` y el anillo del que habla con `speak(id)`.
// Cuando un agente habla, la cámara se acerca a él (como recepción en Contacto) y solo entonces se ve su globo;
// Esc (`unfocus()`) vuelve a la vista general.
import * as THREE from 'three';
import { createFrameCap, getPerfTier, onPerfTier } from './perfTier';

// Puesto fijo de cada agente en la planta: posición, zona de clic y punto de la cámara. Cada oficina puede moverlo.
const SPOTS = {
  recepcion: { pos: [2.6, 1.3, 1.55], hit: { c: [2.6, 1.0, 1.95], s: [3.0, 2.0, 1.6] } },
  arquitecto: { pos: [-4.25, 1.3, 0], hit: { c: [-3.9, 1.0, 0], s: [1.9, 2.0, 2.8] } },
  stack: { pos: [1.3, 1.3, -4.25], hit: { c: [1.6, 1.0, -3.9], s: [3.2, 2.0, 1.9] } },
};

export function mountOffice({ stage, holder, labelsEl, theme, agents, onPick }) {
  if (!stage || !holder || !labelsEl || !theme) return null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch (e) { return null; }
  const off = { raf: 0, visible: true };
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(theme.clear);
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'pan-y';
  holder.appendChild(canvas);

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(theme.hemi[0], theme.hemi[1], theme.hemi[2]));
  const sun = new THREE.DirectionalLight(theme.sun[0], theme.sun[1]);
  sun.position.set(7, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 });
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  // Agentes: nombre del contenido, puesto del motor y, si la oficina lo cambia, el de la oficina.
  const moved = theme.agents || {};
  const AG = agents.map((a) => ({ ...a, ...SPOTS[a.id], ...(moved[a.id] || {}) }));
  let active = null, hovered = null, speaking = null;

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
    arch: (r, t, m, x, y, z) => { const g = new THREE.Mesh(new THREE.CylinderGeometry(r, r, t, 48, 1, false, Math.PI / 2, Math.PI), m); g.rotation.x = Math.PI / 2; return place(g, x, y, z); },
    discZ: (r, t, m, x, y, z) => { const g = new THREE.Mesh(new THREE.CylinderGeometry(r, r, t, 40), m); g.rotation.x = Math.PI / 2; return place(g, x, y, z); },
    discX: (r, t, m, x, y, z) => { const g = new THREE.Mesh(new THREE.CylinderGeometry(r, r, t, 40), m); g.rotation.z = Math.PI / 2; return place(g, x, y, z); },
    part: (geo, m, x, y, z) => { const g = new THREE.Mesh(geo, m); g.position.set(x, y, z); g.castShadow = true; return g; },
    // Para animaciones del decorado: true si el visitante eligió a ese agente o si es el que está hablando.
    isActive: (id) => (active && active.id === id) || (speaking && speaking.id === id),
  };
  const extra = theme.build(api) || {};

  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const ringMat = new THREE.MeshBasicMaterial({ color: theme.ring, transparent: true, opacity: 0.9 });
  const hitboxes = [];
  AG.forEach((a) => {
    const g = theme.makeAgent(api, a.id);
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

  // Huevos de pascua: la oficina devuelve { eggs: [{ c, s, anim(t) }] }; un clic en la zona los abre o cierra.
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

  // Etiquetas HTML sobre la escena y un globo de diálogo por agente.
  const labels = [];
  const addLabel = (text, cls, getPos) => {
    const el = document.createElement('div');
    el.className = 'ap-off__tag ap-off__tag--' + cls;
    el.textContent = text;
    el.setAttribute('aria-hidden', 'true');
    labelsEl.appendChild(el);
    labels.push({ el, getPos });
    return el;
  };
  AG.forEach((a) => { a.tagEl = addLabel(a.name, 'agent', () => new THREE.Vector3(a.pos[0], a.mesh.position.y + 0.75, a.pos[2])); });
  (theme.labels || []).forEach(([t, p]) => addLabel(t, 'deco', () => new THREE.Vector3(...p)));
  const says = {};
  AG.forEach((a) => {
    const el = document.createElement('div');
    el.className = 'ap-off__say ap-off__say--' + a.id;
    el.setAttribute('aria-hidden', 'true');
    const nm = document.createElement('span'); nm.className = 'ap-off__sayname'; nm.textContent = a.name;
    const tx = document.createElement('span'); tx.className = 'ap-off__saytext';
    el.append(nm, tx);
    labelsEl.appendChild(el);
    says[a.id] = { el, tx, on: false };
  });

  // Cámara isométrica con giro limitado.
  // `lift` y `shift` corren el encuadre (fracción del alto y del ancho) para que el agente no quede bajo la conversación.
  const view = { theta: Math.PI / 4, el: Math.atan(1 / Math.SQRT2), size: 7.2, target: new THREE.Vector3(0, 0.6, 0), lift: 0, shift: 0 };
  const goal = { theta: view.theta, el: view.el, size: view.size, target: view.target.clone(), lift: 0, shift: 0 };
  const TH_MIN = 0.0, TH_MAX = Math.PI / 2 - 0.12;
  let mode = 'iso';
  // Agente al que se acerca la cámara mientras habla (null: vista general). FOCUS es la fracción del encuadre general
  // y FOCUS_Y cuánto sobre el agente queda el centro, para que su globo entre arriba sin tocar el borde.
  let focus = null;
  const FOCUS = 0.36, FOCUS_Y = 0.3;
  // La conversación ocupa el pie del escenario: --off-room-lift (fracción del alto) sube la maqueta y --off-room-zoom
  // la aleja para que entre completa arriba (oficina.css). De cerca, --off-focus-lift y --off-focus-shift (fracción del
  // ancho, hacia la derecha) dejan al agente fuera de la tarjeta de la conversación. Se leen al cambiar el tamaño.
  let lift = 0, zoom = 1, focusLift = 0, focusShift = 0;
  const readFrame = () => {
    const cs = getComputedStyle(stage);
    const num = (k, d) => { const n = parseFloat(cs.getPropertyValue(k)); return Number.isFinite(n) ? n : d; };
    lift = num('--off-room-lift', 0);
    zoom = num('--off-room-zoom', 1) || 1;
    focusLift = num('--off-focus-lift', lift);
    focusShift = num('--off-focus-shift', 0);
  };
  readFrame();
  const baseSize = () => 7.2 * zoom * Math.max(1, 1.15 / (stage.clientWidth / stage.clientHeight));
  const frameGoal = () => {
    if (focus) {
      goal.target.set(focus.pos[0], focus.pos[1] + FOCUS_Y, focus.pos[2]);
      goal.size = baseSize() * FOCUS;
      goal.lift = focusLift;
      goal.shift = focusShift;
      return;
    }
    goal.lift = lift;
    goal.shift = 0;
    goal.target.set(0, 0.6, 0);
    goal.size = baseSize() * (mode === 'top' ? 0.85 : 1);
  };
  const setOverview = () => {
    goal.el = mode === 'top' ? Math.PI / 2 - 0.001 : Math.atan(1 / Math.SQRT2);
    goal.theta = mode === 'top' ? 0 : Math.PI / 4;
    frameGoal();
  };
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    readFrame();
    renderer.setSize(w, h);
    frameGoal();
  };
  resize();
  view.size = goal.size;
  view.lift = goal.lift;
  const updateCamera = () => {
    const aspect = stage.clientWidth / stage.clientHeight || 1;
    const sx = 2 * view.shift * view.size * aspect;
    cam.left = -view.size * aspect - sx; cam.right = view.size * aspect - sx;
    const s = 2 * view.lift * view.size;
    cam.top = view.size - s; cam.bottom = -view.size - s;
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

  // Elegir un agente (o soltarlo con un segundo clic) avisa a la página.
  const pickAgent = (a) => { active = active === a ? null : a; if (onPick) onPick(active ? active.id : null); kick(); };

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
    else if (drag && !drag.moved) { const a = pick(e); if (a || active) pickAgent(a || active); }
    drag = null;
  };
  const onCancel = () => { drag = null; canvas.classList.remove('dragging'); };
  const onLeave = () => { hovered = null; canvas.classList.remove('hover'); };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('pointerleave', onLeave);

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

  // Bucle: solo corre mientras la oficina está en pantalla.
  const clock = new THREE.Clock();
  const v = new THREE.Vector3();
  const frame = (now) => {
    off.raf = 0;
    if (!off.visible || document.hidden) return;
    if (!cap.ready(now)) { off.raf = requestAnimationFrame(frame); return; }
    const t = clock.getElapsedTime();
    // Suavizado de la cámara: ~0,8 s para viajar de un agente a otro, así se entiende a dónde te lleva.
    const k = reduced ? 1 : 0.08;
    view.theta += (goal.theta - view.theta) * k;
    view.el += (goal.el - view.el) * k;
    view.size += (goal.size - view.size) * k;
    view.lift += (goal.lift - view.lift) * k;
    view.shift += (goal.shift - view.shift) * k;
    view.target.lerp(goal.target, k);
    updateCamera();
    AG.forEach((a, i) => {
      a.mesh.position.y = a.base + (reduced ? 0 : Math.sin(t * 1.6 + i * 2) * 0.06);
      const on = a === hovered || a === active || a === speaking;
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
    // Globos sobre la cabeza del agente sin salirse del recuadro; la colita sigue apuntando al agente.
    // En pantallas angostas se apilan arriba, a lo ancho y bajo el selector de serie, para no tapar la maqueta.
    const narrow = w < 560;
    let stackY = 60;
    AG.forEach((a) => {
      const s = says[a.id];
      if (!s.on) return;
      a.tagEl.style.display = 'none';
      s.el.classList.toggle('is-docked', narrow);
      if (narrow) s.el.classList.remove('is-side', 'is-side-l');
      if (narrow) {
        s.el.style.maxWidth = (w - 16) + 'px';
        s.el.style.transform = `translate(8px, ${stackY}px)`;
        stackY += s.el.offsetHeight + 6;
        return;
      }
      s.el.style.maxWidth = '';
      v.set(a.pos[0], a.mesh.position.y + 0.5, a.pos[2]).project(cam);
      const x = (v.x + 1) / 2 * w, y = (1 - v.y) / 2 * h;
      const bw = s.el.offsetWidth, bh = s.el.offsetHeight;
      let cx = Math.max(bw / 2 + 8, Math.min(w - bw / 2 - 8, x));
      // Sin zoom, un globo alto no se mete bajo el selector de serie: se corre a su lado y, si no cabe, baja hasta su borde.
      let minTop = 8;
      const sw = stage.querySelector('.ap-ofsw--stage');
      if (sw && y - bh - 16 < sw.offsetTop + sw.offsetHeight + 8) {
        const swL = sw.offsetLeft, swR = sw.offsetLeft + sw.offsetWidth;
        if (cx - bw / 2 < swR + 8 && cx + bw / 2 > swL - 8) {
          const side = swR + 8 + bw / 2;
          if (side + bw / 2 + 8 <= w && x - (side - bw / 2) >= 18) cx = side;
          else minTop = sw.offsetTop + sw.offsetHeight + 8;
        }
      }
      // Si no cabe sobre la cabeza (respuesta larga), va al costado del agente, más ancho y sin taparlo, sobre la
      // conversación del pie; la colita apunta de lado al agente.
      if (y - bh - 16 < minTop) {
        const dock = stage.querySelector('.ap-ofd');
        const sr = stage.getBoundingClientRect();
        const floor = dock ? dock.getBoundingClientRect().top - sr.top - 8 : h - 8;
        const gap = 44;
        const right = w - x - gap - 8, left = x - gap - 8;
        const room = Math.max(right, left);
        s.el.style.maxWidth = Math.round(Math.max(220, Math.min(440, room))) + 'px';
        const sw2 = s.el.offsetWidth, sh2 = s.el.offsetHeight;
        const onRight = right >= sw2 || right >= left;
        const sx = onRight ? x + gap : x - gap - sw2;
        const sy = Math.max(8, Math.min(floor - sh2, y - sh2 / 2));
        s.el.classList.add('is-side');
        s.el.classList.toggle('is-side-l', !onRight);
        s.el.style.transform = `translate(${Math.round(sx)}px, ${Math.round(sy)}px)`;
        s.el.style.setProperty('--tail-y', Math.round(Math.max(16, Math.min(sh2 - 16, y - sy))) + 'px');
        return;
      }
      s.el.classList.remove('is-side', 'is-side-l');
      const top = Math.max(minTop, y - bh - 16);
      s.el.style.transform = `translate(${Math.round(cx - bw / 2)}px, ${Math.round(top)}px)`;
      s.el.style.setProperty('--tail', Math.round(Math.max(18, Math.min(bw - 18, bw / 2 + (x - cx)))) + 'px');
    });
    off.raf = requestAnimationFrame(frame);
  };
  function kick() { if (!off.raf && off.visible && !document.hidden) off.raf = requestAnimationFrame(frame); }
  const io = new IntersectionObserver((es) => { off.visible = es[0].isIntersecting; kick(); }, { threshold: 0 });
  io.observe(stage);
  const ro = new ResizeObserver(() => { resize(); kick(); });
  ro.observe(stage);
  document.addEventListener('visibilitychange', kick);
  kick();

  const byId = (id) => AG.find((x) => x.id === id) || null;
  return {
    // Marca al agente elegido desde los botones de la página (sin volver a avisar con onPick).
    select(id) { active = byId(id); kick(); },
    // Anillo sobre el agente que acaba de responder.
    speak(id) { speaking = byId(id); kick(); },
    // say({ arquitecto: 'texto' }, { focus }): muestra el globo del último agente del mapa (el que habla) y oculta los
    // demás; las otras respuestas quedan en el historial. Con `focus: false` la cámara queda en la vista general; si no,
    // se acerca a ese agente (en la vista isométrica).
    say(map, opts) {
      const ids = Object.keys(map || {}).filter((id) => map[id]);
      const last = ids.length ? byId(ids[ids.length - 1]) : null;
      focus = mode === 'iso' && last && !(opts && opts.focus === false) ? last : null;
      AG.forEach((a) => {
        const s = says[a.id];
        s.on = a === last; s.tx.textContent = s.on ? map[a.id] : '';
        s.el.classList.toggle('is-on', s.on);
        if (!s.on) a.tagEl.style.display = '';
      });
      frameGoal();
      kick();
    },
    // Esc: vuelve a la vista general y oculta el globo.
    unfocus() {
      if (!focus && !AG.some((a) => says[a.id].on)) return false;
      focus = null;
      AG.forEach((a) => { const s = says[a.id]; s.on = false; s.tx.textContent = ''; s.el.classList.remove('is-on'); a.tagEl.style.display = ''; });
      frameGoal();
      kick();
      return true;
    },
    setMode(m) { mode = m; setOverview(); kick(); },
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
      Object.values(says).forEach((s) => s.el.remove());
      // Libera geometrías, materiales y el contexto WebGL: así se puede cambiar de oficina muchas veces seguidas.
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      });
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    },
  };
}
