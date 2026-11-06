// Superpoderes: stack (el agente naranja de la oficina) sentado en un pufón sobre la cinta de tecnologías, leyendo sin
// enterarse de nada. Si el cursor pasa por encima (o lo tocas), se despierta y salta asustado; el libro sale volando y
// vuelve a leer. Al pasar el cursor por un logo de la cinta se emociona y salta igual (`cheer`). Del artefacto "Hero · Augusto Pinto" (stack-reader.js, 6 nov 2026). Three.js r128, cargado aparte.
// Mismo personaje y colores que la oficina (excepción aprobada, design-system/INTEGRACION.md).
import * as THREE from 'three';
import { getPerfTier } from './perfTier';

export function mountStackReader(stage, opts) {
  opts = opts || {};
  var holder = stage && stage.querySelector('[data-rd-canvas]');
  var bubble = stage && stage.querySelector('[data-rd-bubble]');
  if (!stage || !holder) return null;
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || getPerfTier() >= 2;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  var canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
  holder.appendChild(canvas);

  var scene = new THREE.Scene();
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.72));
  var sun = new THREE.DirectionalLight(0xffffff, 0.42);
  sun.position.set(5, 9, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 30 });
  scene.add(sun);

  var M = function (c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.88, metalness: 0 }, o || {})); };
  var add = function (geo, m, x, y, z, parent) { var p = new THREE.Mesh(geo, m); p.position.set(x, y, z); p.castShadow = true; p.receiveShadow = true; (parent || scene).add(p); return p; };

  /* Pufón (banqueta baja) donde se sienta */
  var seatM = M(0x2f3a66), legM = M(0x17171c);
  add(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 32), seatM, 0, 0.3, 0);
  add(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12), legM, 0, 0.15, 0);
  add(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24), legM, 0, 0.02, 0);
  var shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.12 }));
  shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.position.y = 0.001; shadowFloor.receiveShadow = true; scene.add(shadowFloor);

  /* stack: igual que en la oficina (#e0621f, ojos blancos, antena tinta, ampolleta rosada) */
  var skin = M(0xe0621f, { emissive: 0xe0621f, emissiveIntensity: 0.4 }), white = M(0xffffff), ink = M(0x1b1d33);
  var agent = new THREE.Group(), head = new THREE.Group();
  agent.add(head);
  add(new THREE.SphereGeometry(0.3, 32, 20), skin, 0, 0, 0, head);
  var body = add(new THREE.ConeGeometry(0.27, 0.55, 24), skin, 0, -0.5, 0, agent); body.rotation.x = Math.PI;
  var eyes = [-0.1, 0.1].map(function (x) {
    var eg = new THREE.Group(); eg.position.set(x, 0.05, 0.25); head.add(eg);
    add(new THREE.SphereGeometry(0.075, 16, 12), white, 0, 0, 0, eg);
    return { g: eg, pupil: add(new THREE.SphereGeometry(0.038, 12, 10), ink, 0, 0, 0.06, eg) };
  });
  var mouth = add(new THREE.TorusGeometry(0.06, 0.014, 8, 16, Math.PI), ink, 0, -0.05, 0.285, head);
  mouth.rotation.z = Math.PI;
  var mouthO = add(new THREE.SphereGeometry(0.045, 12, 10), ink, 0, -0.08, 0.275, head);
  mouthO.scale.set(1, 1.25, 0.5); mouthO.visible = false;
  add(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), ink, 0, 0.41, 0, head);
  var bulb = add(new THREE.SphereGeometry(0.055, 12, 10), M(0xf5a8c0), 0, 0.54, 0, head);
  var SIT_Y = 0.36 + 0.78; /* asiento + altura del cuerpo */
  agent.position.set(0, SIT_Y, 0);
  agent.rotation.y = Math.PI / 4 - 0.15;
  scene.add(agent);

  /* Brazos: dos cilindros cortos que sostienen el libro */
  var armL = add(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), skin, -0.24, -0.5, 0.15, agent);
  var armR = add(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), skin, 0.24, -0.5, 0.15, agent);

  /* Libro abierto frente al pecho */
  var book = new THREE.Group();
  var cover = M(0x8a4fc0), pageM = M(0xfff7e6);
  add(new THREE.BoxGeometry(0.5, 0.025, 0.34), cover, 0, 0, 0, book);
  var pgL = add(new THREE.BoxGeometry(0.22, 0.03, 0.3), pageM, -0.12, 0.022, 0, book);
  var pgR = add(new THREE.BoxGeometry(0.22, 0.03, 0.3), pageM, 0.12, 0.022, 0, book);
  pgL.rotation.z = 0.08; pgR.rotation.z = -0.08;
  var flip = add(new THREE.BoxGeometry(0.2, 0.006, 0.28), pageM, 0.1, 0.05, 0, book);
  flip.geometry.translate(0.1, 0, 0); flip.position.x = 0;
  book.position.set(0, -0.55, 0.3);
  book.rotation.x = -0.9;
  agent.add(book);
  var BOOK_REST = { y: -0.55, z: 0.3, rx: -0.9 };

  /* Cámara fija, isométrica */
  var target = new THREE.Vector3(0, 0.68, 0), size = 1.4;
  var resize = function () {
    var W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    var a = W / H;
    cam.left = -size * a; cam.right = size * a; cam.top = size; cam.bottom = -size;
    cam.updateProjectionMatrix();
    var el = Math.atan(1 / Math.SQRT2), th = Math.PI / 4, d = 30;
    cam.position.set(target.x + d * Math.cos(el) * Math.sin(th), target.y + d * Math.sin(el), target.z + d * Math.cos(el) * Math.cos(th));
    cam.lookAt(target);
  };
  resize();

  var clock = new THREE.Clock();
  var now = function () { return clock.getElapsedTime(); };
  /* estados: 'read' → 'wake' (salta asustado) → 'calm' (se recoloca) → 'read' */
  var S = { mode: 'read', t0: 0, blinkAt: 3, blinkT: -1, pageAt: 2.4, pageT: -1, nodSeed: Math.random() * 6 };
  var sayT = 0;
  var say = function (txt, ms) {
    if (!bubble) return;
    bubble.textContent = txt; bubble.classList.add('is-on');
    clearTimeout(sayT); sayT = setTimeout(function () { bubble.classList.remove('is-on'); }, ms || 2200);
  };
  var raf = 0, visible = true;
  var kick = function () { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  /* Mismo salto en dos ánimos: 'scare' (cursor encima: ojos de plato, boca en O) y 'cheer' (cursor sobre un logo de la
     cinta: se emociona, sonrisa grande y salto más corto). */
  var jumpWith = function (kind, txt) {
    if (S.mode !== 'read') return;
    S.mode = 'wake'; S.kind = kind; S.t0 = now();
    say(txt, kind === 'cheer' ? 1600 : 2300);
    stage.classList.add('is-awake');
    kick();
  };
  var scare = function () { jumpWith('scare', opts.scare || '¡AAH! ¡Me asustaste!'); };
  var cheer = function (txt) { if (txt) jumpWith('cheer', txt); };
  stage.addEventListener('pointerenter', scare);
  stage.addEventListener('pointerdown', scare);

  var v = new THREE.Vector3();
  var ease = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  function frame() {
    raf = 0;
    if (!visible || document.hidden) return;
    var t = now(), tt = t - S.t0;
    var headX = 0.75, headY = 0, eyeS = 0.45, y = SIT_Y, squash = 1, armUp = 0, bookFlyT = 0, o = false, tilt = 0;
    if (S.mode === 'read') {
      /* Absorto: cabeza gacha, ojos entrecerrados que van de línea en línea, respira muy lento */
      headX = 0.62 + (reduced ? 0 : Math.sin(t * 0.9 + S.nodSeed) * 0.04);
      headY = reduced ? 0 : Math.sin(t * 0.6) * 0.06;
      eyeS = 0.5;
      if (!reduced) y += Math.sin(t * 1.2) * 0.012;
      var sweep = reduced ? 0.5 : ((t * 0.5) % 1);
      eyes.forEach(function (e) { e.pupil.position.x = (sweep - 0.5) * 0.05; });
      if (!reduced && S.blinkT < 0 && t > S.blinkAt) S.blinkT = t;
      if (S.blinkT >= 0) { var b = (t - S.blinkT) / 0.2; if (b >= 1) { S.blinkT = -1; S.blinkAt = t + 3 + Math.random() * 3; } else eyeS *= Math.max(0.1, Math.abs(1 - 2 * b)); }
      /* hoja que pasa de vez en cuando */
      if (!reduced && S.pageT < 0 && t > S.pageAt) S.pageT = t;
      if (S.pageT >= 0) { var p = (t - S.pageT) / 0.7; if (p >= 1) { S.pageT = -1; S.pageAt = t + 4 + Math.random() * 3; flip.rotation.z = 0; } else flip.rotation.z = p * Math.PI * 0.96; }
    } else if (S.mode === 'wake') {
      /* 0–0.12: se queda rígido, ojos de plato; 0.12–0.75: salto; luego aterriza */
      var pre = ease(tt / 0.12);
      var jump = (tt - 0.1) / 0.62;
      headX = 0.75 * (1 - pre) - 0.15 * pre;
      eyeS = 0.45 + pre * 1.0;
      var happy = S.kind === 'cheer';
      o = !happy;
      eyes.forEach(function (e) { e.pupil.position.x = 0; e.pupil.scale.setScalar(happy ? 1.15 : 0.7); });
      if (!reduced && jump > 0 && jump < 1) {
        y += Math.sin(jump * Math.PI) * 0.45;
        squash = 1 + Math.sin(jump * Math.PI) * 0.12;
        armUp = Math.sin(jump * Math.PI);
        tilt = Math.sin(jump * Math.PI * 2) * 0.2;
        bookFlyT = jump;
      } else if (!reduced && jump >= 1) { var lnd = ease((tt - 0.72) / 0.18); squash = 1 - Math.sin(lnd * Math.PI) * 0.1; }
      if (!reduced && tt > 0.72) bookFlyT = 1;
      if (tt > (happy ? 1.3 : 2.4)) { S.mode = 'calm'; S.t0 = t; stage.classList.remove('is-awake'); eyes.forEach(function (e) { e.pupil.scale.setScalar(1); }); }
    } else {
      /* Se calma: respira, mira alrededor un segundo y retoma el libro */
      var c = tt / 1.4;
      headX = -0.15 + ease(c) * 0.9;
      eyeS = 1.0 - ease(c) * 0.55;
      headY = reduced ? 0 : Math.sin(c * Math.PI * 2) * 0.35 * (1 - ease(c));
      o = c < 0.35 && S.kind !== 'cheer';
      if (c >= 1) { S.mode = 'read'; S.blinkAt = t + 2; S.pageAt = t + 3; }
    }
    mouth.visible = !o; mouthO.visible = o;
    /* Emocionado: la sonrisa se agranda mientras dura el salto. */
    var grin = S.mode === 'wake' && S.kind === 'cheer' ? 1.7 : 1;
    mouth.scale.set(grin, grin, 1);
    head.rotation.x = headX; head.rotation.y = headY; agent.position.y = y;
    agent.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
    agent.rotation.z = tilt;
    eyes.forEach(function (e) { e.g.scale.set(Math.max(1, eyeS), Math.max(0.08, eyeS), 1); });
    bulb.position.y = 0.54 + (S.mode === 'wake' && !reduced ? Math.sin(tt * 40) * 0.015 : 0);
    armL.rotation.x = armR.rotation.x = 0.9 - armUp * 2.4;
    armL.position.y = armR.position.y = -0.5 + armUp * 0.25;
    /* Libro: sale despedido hacia arriba y cae de vuelta a sus manos */
    if (S.mode === 'wake') {
      var f = Math.min(1, bookFlyT);
      book.position.y = BOOK_REST.y + Math.sin(f * Math.PI) * 0.9;
      book.position.z = BOOK_REST.z - Math.sin(f * Math.PI) * 0.15;
      book.rotation.x = BOOK_REST.rx + f * Math.PI * 2;
    } else { book.position.set(0, BOOK_REST.y, BOOK_REST.z); book.rotation.x = BOOK_REST.rx; }
    renderer.render(scene, cam);
    if (bubble) {
      v.set(0, agent.position.y + 0.5, 0).project(cam);
      bubble.style.transform = 'translate(' + ((v.x + 1) / 2 * stage.clientWidth) + 'px,' + ((1 - v.y) / 2 * stage.clientHeight) + 'px) translate(-50%,-100%)';
    }
    /* Quieto (sin movimiento) solo dibuja mientras dura el susto; leyendo basta con un cuadro. */
    if (!reduced || S.mode !== 'read') raf = requestAnimationFrame(frame);
  }
  var io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; kick(); }, { threshold: 0 });
  io.observe(stage);
  var ro = new ResizeObserver(function () { resize(); kick(); });
  ro.observe(stage);
  document.addEventListener('visibilitychange', kick);
  kick();

  return {
    scare: scare,
    cheer: cheer,
    dispose: function () {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(sayT);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', kick);
      stage.removeEventListener('pointerenter', scare);
      stage.removeEventListener('pointerdown', scare);
      stage.classList.remove('is-awake');
      if (bubble) bubble.classList.remove('is-on');
      scene.traverse(function (n) { if (n.geometry) n.geometry.dispose(); if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach(function (m) { m.dispose(); }); });
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };
}
