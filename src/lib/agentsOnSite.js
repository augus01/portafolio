// Los agentes salen de la oficina (artefacto "Hero · Augusto Pinto", 6 nov 2026): recepción asoma sobre Contacto en la
// nav, stack conversa en la ficha de cada tecnología y arquitecto asoma por el borde de cada portada de Proyectos y
// explica el plano del proyecto. Es la misma figura 3D de la oficina (cabeza esférica, cuerpo cónico, ojos y sonrisa)
// en el color de cada agente (excepción aprobada, design-system/INTEGRACION.md). Three.js r128, cargado aparte.
// Todos te siguen con la mirada, pestañean y, sin cursor, miran de lado a lado. Con `prefers-reduced-motion` o con el
// nivel de rendimiento mínimo quedan quietos, mirando al frente.
import * as THREE from 'three';
import { getPerfTier } from './perfTier';

const COLORS = { recepcion: 0xf7c61b, arquitecto: 0x2f54d4, stack: 0xe0621f };
const INK = 0x1b1d33;
const BULB = 0xf5a8c0;

const isStill = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || getPerfTier() >= 2;
const clamp = (n) => Math.max(-1, Math.min(1, n));
const mat = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.88, metalness: 0 }, o || {}));

function makeRenderer(canvas) {
  try {
    const r = new THREE.WebGLRenderer({ canvas: canvas || undefined, antialias: true, alpha: true });
    r.setClearColor(0x000000, 0);
    return r;
  } catch (e) { return null; }
}

function freeRenderer(r) {
  if (!r) return;
  r.dispose();
  if (r.forceContextLoss) r.forceContextLoss();
}

// Luz de la oficina Original y del escritorio de Contacto.
function lights(scene, sunAt) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.72));
  const sun = new THREE.DirectionalLight(0xffffff, 0.45);
  sun.position.set(sunAt[0], sunAt[1], sunAt[2]);
  scene.add(sun);
  return sun;
}

/** Figura del agente `id`. Stack lleva su antena con ampolleta; arquitecto, su plano enrollado al costado. */
function buildAgent(id) {
  const skin = mat(COLORS[id], { emissive: COLORS[id], emissiveIntensity: 0.4 });
  const white = mat(0xffffff), ink = mat(INK);
  const g = new THREE.Group();
  const head = new THREE.Group();
  g.add(head);
  const put = (geo, m, x, y, z, parent) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); parent.add(o); return o; };
  put(new THREE.SphereGeometry(0.3, 32, 20), skin, 0, 0, 0, head);
  put(new THREE.ConeGeometry(0.27, 0.55, 28), skin, 0, -0.5, 0, g).rotation.x = Math.PI;
  const eyes = [-0.1, 0.1].map((x) => {
    const eg = new THREE.Group();
    eg.position.set(x, 0.05, 0.25);
    head.add(eg);
    put(new THREE.SphereGeometry(0.075, 16, 12), white, 0, 0, 0, eg);
    return { g: eg, pupil: put(new THREE.SphereGeometry(0.038, 12, 10), ink, 0, 0, 0.06, eg) };
  });
  put(new THREE.TorusGeometry(0.06, 0.014, 8, 16, Math.PI), ink, 0, -0.05, 0.285, head).rotation.z = Math.PI;
  if (id === 'stack') {
    put(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), ink, 0, 0.41, 0, head);
    put(new THREE.SphereGeometry(0.055, 12, 10), mat(BULB), 0, 0.54, 0, head);
  }
  if (id === 'arquitecto') {
    const roll = new THREE.Group();
    roll.add(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.5, 20), mat(0xf3f5fb, { roughness: 0.7 })));
    [-0.15, 0.15].forEach((y) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.035, 20), mat(INK)); b.position.y = y; roll.add(b); });
    const cap = new THREE.Mesh(new THREE.CircleGeometry(0.055, 20), mat(0x9fb1ee));
    cap.position.y = 0.251; cap.rotation.x = -Math.PI / 2; roll.add(cap);
    roll.position.set(0.31, -0.42, 0.1); roll.rotation.set(0.15, 0, -0.42);
    g.add(roll);
  }
  return { g, head, eyes };
}

/** Mirada y parpadeo: `look` guarda la mirada suavizada (lx, ly) y el reloj del parpadeo. */
function newLook() { return { lx: 0, ly: 0, blinkAt: 2, blinkT: -1 }; }
function pose(A, L, gx, gy, t, still) {
  const k = still ? 1 : 0.1;
  L.lx += (gx - L.lx) * k; L.ly += (gy - L.ly) * k;
  A.g.rotation.y = L.lx * 0.55;
  A.g.rotation.z = still ? 0 : -L.lx * 0.06;
  A.head.rotation.x = L.ly * 0.28;
  A.eyes.forEach((e) => { e.pupil.position.x = L.lx * 0.022; e.pupil.position.y = -L.ly * 0.02; });
  let sy = 1;
  if (!still) {
    if (L.blinkT < 0 && t > L.blinkAt) L.blinkT = t;
    if (L.blinkT >= 0) {
      const b = (t - L.blinkT) / 0.16;
      if (b >= 1) { L.blinkT = -1; L.blinkAt = t + 2.2 + Math.random() * 2.8; } else sy = Math.max(0.08, Math.abs(1 - 2 * b));
    }
  }
  A.eyes.forEach((e) => { e.g.scale.y = sy; });
}
// Sin cursor por un rato mira de lado a lado.
const idleX = (t, phase = 0) => { const ph = ((t + phase) % 7) / 7; return ph < 0.3 ? 0 : ph < 0.52 ? -0.8 : ph < 0.8 ? 0.7 : 0; };

/** Puntero de la página, compartido por todos los agentes; `fresh()` es null si no se movió en 2,6 s. */
function pointer(onMove) {
  let p = null;
  const move = (e) => { p = { x: e.clientX, y: e.clientY, at: performance.now() }; onMove(); };
  window.addEventListener('pointermove', move, { passive: true });
  return { fresh: () => (p && performance.now() - p.at < 2600 ? p : null), off: () => window.removeEventListener('pointermove', move) };
}

/** Bucle de cuadros que se detiene solo si `frame` devuelve false; `kick()` lo reanuda. */
function loop(frame) {
  let raf = 0, dead = false;
  const run = () => { raf = 0; if (dead || document.hidden) return; if (frame() !== false) raf = requestAnimationFrame(run); };
  const kick = () => { if (!raf && !dead) raf = requestAnimationFrame(run); };
  document.addEventListener('visibilitychange', kick);
  return { kick, stop: () => { dead = true; if (raf) cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', kick); } };
}

/**
 * Recepción sobre Contacto: un renderer fuera de pantalla dibuja la cabeza y la copia al lienzo visible (`canvases`,
 * uno en la nav de escritorio y otro en la barra móvil). Asoma hasta los ojos, te sigue con la mirada y pestañea.
 */
export function mountReceptionPeek(canvases) {
  const r = makeRenderer();
  if (!r) return null;
  r.setPixelRatio(1);
  const scene = new THREE.Scene();
  lights(scene, [5, 9, 6]);
  const cam = new THREE.OrthographicCamera(-0.53, 0.53, 0.58, -0.58, 0.1, 20);
  cam.position.set(0, -0.1, 5);
  cam.lookAt(0, -0.1, 0);
  const A = buildAgent('recepcion');
  scene.add(A.g);
  const L = newLook();
  const clock = new THREE.Clock();
  const still = isStill();
  let w = 0, h = 0;
  const ptr = pointer(() => lp.kick());
  const lp = loop(() => {
    const cv = canvases.find((c) => c.offsetParent !== null && c.clientWidth > 0);
    if (cv) {
      const t = clock.getElapsedTime();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
      if (w !== W || h !== H) {
        w = W; h = H; r.setSize(W, H, false);
        cam.left = -0.58 * (W / H); cam.right = 0.58 * (W / H); cam.updateProjectionMatrix();
      }
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const p = ptr.fresh();
      let gx = 0, gy = 0;
      if (p) {
        const b = cv.getBoundingClientRect();
        gx = clamp((p.x - (b.left + b.width / 2)) / 320);
        // Hacia abajo inclina poco la cabeza: el cursor suele estar bajo la barra y los ojos no deben esconderse tras ella.
        gy = Math.min(0.2, clamp((p.y - (b.top + b.height * 0.4)) / 320));
      } else if (!still) gx = idleX(t);
      pose(A, L, gx, gy, t, still);
      r.render(scene, cam);
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(r.domElement, 0, 0, W, H);
    }
    return !still;
  });
  lp.kick();
  return { dispose() { lp.stop(); ptr.off(); freeRenderer(r); } };
}

/**
 * Arquitecto en las portadas: un solo renderer para todas; dibuja cada pose y la copia a su lienzo.
 * `items`: [{ canvas, item, btn }]. Asoma hasta los ojos y sube al pasar el cursor por la portada, con foco de
 * teclado o con su plano abierto (`isOpen(i)`). Solo anima mientras la sección se ve (`setVisible`).
 */
export function mountArchitectPeeks(items, isOpen) {
  const r = makeRenderer();
  if (!r) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const SIZE = 120;
  r.setPixelRatio(1);
  r.setSize(SIZE * dpr, SIZE * dpr, false);
  const scene = new THREE.Scene();
  lights(scene, [2.5, 4, 5]);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 0, 2.24);
  const A = buildAgent('arquitecto');
  scene.add(A.g);
  const clock = new THREE.Clock();
  const still = isStill();
  let visible = true;
  const st = items.map((it, i) => {
    it.canvas.width = SIZE * dpr; it.canvas.height = SIZE * dpr;
    return { ...it, ctx: it.canvas.getContext('2d'), rise: 0, look: newLook(), phase: i * 1.7 };
  });
  const ptr = pointer(() => lp.kick());
  let prev = clock.getElapsedTime();
  const lp = loop(() => {
    if (!visible) return false;
    const t = clock.getElapsedTime();
    const dt = Math.min(t - prev, 0.05); prev = t;
    const k = still ? 1 : Math.min(1, dt * 9);
    const p = ptr.fresh();
    let moving = false;
    st.forEach((it, i) => {
      const up = isOpen(i) || it.item.matches(':hover') || it.btn.matches(':focus-visible');
      it.rise += ((up ? 1 : 0) - it.rise) * k;
      if (Math.abs((up ? 1 : 0) - it.rise) > 0.002) moving = true;
      let gx = 0, gy = 0;
      if (p) {
        const b = it.canvas.getBoundingClientRect();
        gx = clamp((p.x - (b.left + b.width / 2)) / 260);
        gy = clamp((p.y - (b.top + b.height * 0.6)) / 260);
      } else if (!still) gx = Math.sin(t * 0.7 + it.phase) * 0.7;
      pose(A, it.look, gx, gy, t + it.phase, still);
      A.g.rotation.y = it.look.lx * 0.45;
      A.g.rotation.x = it.look.ly * 0.18;
      A.g.rotation.z = 0;
      A.g.position.y = -0.4 + it.rise * 0.27 + (still ? 0 : Math.sin(t * 1.6 + it.phase) * 0.008);
      r.render(scene, cam);
      it.ctx.clearRect(0, 0, it.canvas.width, it.canvas.height);
      it.ctx.drawImage(r.domElement, 0, 0, it.canvas.width, it.canvas.height);
    });
    return !still || moving;
  });
  lp.kick();
  return {
    kick: lp.kick,
    setVisible(v) { visible = v; if (v) lp.kick(); },
    dispose() { lp.stop(); ptr.off(); freeRenderer(r); },
  };
}

/**
 * Agente de cuerpo entero en una ventana (`canvas` propio): arquitecto en el plano del proyecto o stack en la ficha
 * de una tecnología. Flota, te sigue con la mirada (sin cursor mira al logo o al plano) y da un saltito con `talk()`.
 */
export function mountAgentCard(canvas, id) {
  const r = makeRenderer(canvas);
  if (!r) return null;
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  lights(scene, [7, 14, 9]);
  const stack = id === 'stack';
  const cam = new THREE.PerspectiveCamera(stack ? 26 : 30, 0.75, 0.1, 50);
  if (stack) { cam.position.set(0, 1.0, 3.7); cam.lookAt(0, 0.7, 0); } else { cam.position.set(0, -0.15, 3.3); cam.lookAt(0, -0.32, 0); }
  const A = buildAgent(id);
  if (stack) { A.g.scale.setScalar(1.05); A.g.position.set(0, 0.82, 0); }
  scene.add(A.g);
  // Stack mira el logo de la ficha (a su izquierda); arquitecto, el plano.
  const rest = stack ? { x: -1.1, y: 0.15 } : { x: -0.5, y: 0.3 };
  const L = newLook();
  L.lx = rest.x; L.ly = rest.y;
  const clock = new THREE.Clock();
  const still = isStill();
  let talkAt = -10;
  let active = true;
  const ptr = pointer(() => lp.kick());
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    r.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    lp.kick();
  };
  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  const lp = loop(() => {
    if (!active || !canvas.clientWidth) return false;
    const t = still ? 0 : clock.getElapsedTime();
    const d = t - talkAt;
    const jump = !still && d >= 0 && d < 0.55 ? Math.sin(d / 0.55 * Math.PI) * (stack ? 0.14 : 0.12) : 0;
    A.g.position.y = (stack ? 0.82 + Math.sin(t * 1.14 + Math.PI) * 0.04 : Math.sin(t * 1.2) * 0.03) + jump;
    const p = ptr.fresh();
    let gx = rest.x, gy = rest.y;
    if (p) {
      const b = canvas.getBoundingClientRect();
      gx = clamp((p.x - (b.left + b.width * 0.5)) / (b.width * 1.6));
      gy = clamp((p.y - (b.top + b.height * 0.42)) / (b.height * 1.2));
    }
    pose(A, L, gx, gy, clock.getElapsedTime(), still);
    r.render(scene, cam);
    return !still;
  });
  size();
  lp.kick();
  return {
    talk() { talkAt = clock.getElapsedTime(); lp.kick(); },
    // Solo se anima con su ventana abierta.
    setActive(v) { active = v; if (v) lp.kick(); },
    dispose() { lp.stop(); ptr.off(); ro.disconnect(); freeRenderer(r); },
  };
}
