// Contacto: el agente amarillo de recepción en su escritorio (Three.js r128), del artefacto "Hero · Augusto Pinto"
// (contact-desk.js). Mismo personaje y colores que la oficina Original (excepción aprobada, design-system/INTEGRACION.md).
// Respira, parpadea, mira al cursor, teclea cuando lo dejas tranquilo y salta al hacerle clic o al pasar por un enlace.
import * as THREE from 'three';
import { createFrameCap, getPerfTier, onPerfTier } from './perfTier';

  export function mountContactDesk(stage, opts) {
    opts = opts || {};
    var holder = stage && stage.querySelector('[data-desk-canvas]');
    var bubble = stage && stage.querySelector('[data-desk-bubble]');
    if (!stage || !holder) return null;
    var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    var canvas = renderer.domElement;
    canvas.style.display = 'block';
    holder.appendChild(canvas);

    var scene = new THREE.Scene();
    var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.72));
    var sun = new THREE.DirectionalLight(0xffffff, 0.45);
    sun.position.set(5, 9, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 30 });
    sun.shadow.bias = -0.0006;
    scene.add(sun);

    var M = function (c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.88, metalness: 0 }, o || {})); };
    var put = function (geo, m, x, y, z) { var g = new THREE.Mesh(geo, m); g.position.set(x, y, z); g.castShadow = true; g.receiveShadow = true; scene.add(g); return g; };
    var box = function (w, h, d, m, x, y, z) { return put(new THREE.BoxGeometry(w, h, d), m, x, y + h / 2, z); };
    var cyl = function (rt, h, m, x, y, z, rb) { return put(new THREE.CylinderGeometry(rt, rb == null ? rt : rb, h, 32), m, x, y + h / 2, z); };

    /* Piso: tarima redonda con la alfombra de la entrada */
    cyl(2.25, 0.18, M(0xffffff), 0, -0.18, 0.45);
    box(1.4, 0.02, 0.75, M(0xe8c9a0), 0, 0, 1.75);

    /* Mostrador de recepción, igual al de la oficina: frente azul tinta y cubierta morada */
    var furn2 = M(0x2f3a66), aub = M(0x8a4fc0);
    box(2.6, 1.0, 0.5, furn2, 0, 0, 0.75);
    box(2.6, 0.06, 0.7, aub, 0, 1.0, 0.8);
    /* Letrero en el frente del mostrador */
    var sc = document.createElement('canvas'); sc.width = 512; sc.height = 96;
    var cx = sc.getContext('2d');
    cx.fillStyle = '#2f3a66'; cx.fillRect(0, 0, 512, 96);
    cx.fillStyle = '#f7c61b'; cx.font = '600 44px "Geist Mono", ui-monospace, Menlo, monospace';
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText('RECEPCIÓN', 256, 50);
    var signTex = new THREE.CanvasTexture(sc);
    var sign = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.28), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 0.62, 1.003);
    scene.add(sign);

    /* Silla */
    cyl(0.05, 0.5, M(0x17171c), 0, 0, 0);
    cyl(0.3, 0.16, M(0x17171c), 0, 0.5, 0);

    /* Cosas sobre el mostrador */
    var top = 1.06;
    var dark = M(0x2b3358);
    /* Notebook: base y pantalla mirando al agente */
    box(0.62, 0.03, 0.42, M(0xc9cdd4, { metalness: 0.25, roughness: 0.35 }), -0.55, top, 0.62);
    var lidPivot = new THREE.Group(); lidPivot.position.set(-0.55, top + 0.03, 0.83); scene.add(lidPivot);
    var lid = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.4, 0.025), M(0xc9cdd4, { metalness: 0.25, roughness: 0.35 }));
    lid.position.set(0, 0.2, 0); lid.castShadow = true; lidPivot.add(lid);
    var screenMat = new THREE.MeshStandardMaterial({ color: 0x9fd3ff, emissive: 0x6fb6ff, emissiveIntensity: 0.25, roughness: 0.4 });
    var scr = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.32), screenMat);
    scr.position.set(0, 0.2, -0.014); scr.rotation.y = Math.PI; lidPivot.add(scr);
    lidPivot.rotation.x = 0.28;
    /* Timbre de recepción */
    var silver = M(0xd9dce1, { metalness: 0.6, roughness: 0.25 });
    cyl(0.13, 0.03, dark, 0.55, top, 0.95);
    var bell = put(new THREE.SphereGeometry(0.11, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), silver, 0.55, top + 0.03, 0.95);
    var bellKnob = put(new THREE.SphereGeometry(0.025, 12, 8), silver, 0.55, top + 0.15, 0.95);
    /* Taza y planta */
    cyl(0.08, 0.16, M(0xe0621f), 0.95, top, 0.6);
    cyl(0.12, 0.2, furn2, -1.05, top, 0.95, 0.09);
    put(new THREE.SphereGeometry(0.2, 20, 14), M(0x3fa35e), -1.05, top + 0.36, 0.95);

    /* Agente de recepción: el mismo de la oficina Original */
    var col = 0xf7c61b;
    var skin = M(col, { emissive: col, emissiveIntensity: 0.4 });
    var w = M(0xffffff), k = M(0x1b1d33);
    var agent = new THREE.Group();
    var head = new THREE.Group(); agent.add(head);
    var part = function (geo, m, x, y, z, parent) { var p = new THREE.Mesh(geo, m); p.position.set(x, y, z); p.castShadow = true; (parent || agent).add(p); return p; };
    part(new THREE.SphereGeometry(0.3, 32, 20), skin, 0, 0, 0, head);
    var body = part(new THREE.ConeGeometry(0.27, 0.55, 24), skin, 0, -0.5, 0); body.rotation.x = Math.PI;
    var eyes = [];
    [-0.1, 0.1].forEach(function (x) {
      var eg = new THREE.Group(); eg.position.set(x, 0.05, 0.25); head.add(eg);
      part(new THREE.SphereGeometry(0.075, 16, 12), w, 0, 0, 0, eg);
      var pupil = part(new THREE.SphereGeometry(0.038, 12, 10), k, 0, 0, 0.06, eg);
      eyes.push({ g: eg, pupil: pupil });
    });
    var smile = part(new THREE.TorusGeometry(0.06, 0.014, 8, 16, Math.PI), k, 0, -0.05, 0.285, head); smile.rotation.z = Math.PI;
    var BASE_Y = 1.48;
    agent.position.set(0, BASE_Y, 0);
    scene.add(agent);
    var shadowDisc = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), new THREE.MeshBasicMaterial({ color: 0x0e0f12, transparent: true, opacity: 0.0 }));
    shadowDisc.rotation.x = -Math.PI / 2; shadowDisc.position.set(0, 0.46, 0); scene.add(shadowDisc);

    /* Cámara isométrica fija con un leve paralaje según el cursor */
    var target = new THREE.Vector3(0, 0.9, 0.5);
    var view = { theta: Math.PI / 4, el: Math.atan(1 / Math.SQRT2) };
    var goalTheta = view.theta;
    var size = 2.2;
    var resize = function () {
      var W = stage.clientWidth, H = stage.clientHeight;
      if (!W || !H) return;
      renderer.setSize(W, H);
      var aspect = W / H;
      size = 1.9 * Math.max(1, 1.2 / aspect);
    };
    var updateCam = function () {
      var aspect = (stage.clientWidth / stage.clientHeight) || 1;
      cam.left = -size * aspect; cam.right = size * aspect; cam.top = size; cam.bottom = -size;
      cam.updateProjectionMatrix();
      var d = 30;
      cam.position.set(target.x + d * Math.cos(view.el) * Math.sin(view.theta), target.y + d * Math.sin(view.el), target.z + d * Math.cos(view.el) * Math.cos(view.theta));
      cam.lookAt(target);
    };
    resize();

    /* Estado del personaje */
    var st = {
      lookX: 0, lookY: 0, goalX: 0, goalY: 0,
      lastMove: -10, hop: 0, hopT: -1, spin: 0, spinGoal: 0,
      blinkAt: 2, blinkT: -1, ringT: -1
    };
    var clock = new THREE.Clock();
    var now = function () { return clock.getElapsedTime(); };

    /* Globo de diálogo */
    var lines = opts.lines || ['¡Hola! Soy recepción', 'Deja tu mensaje para Augusto', 'Toca el timbre si quieres', 'Hoy atiendo yo'];
    var lineI = 0, sayUntil = 0, pinned = false;
    var say = function (text, ms, pin) {
      if (!bubble) return;
      bubble.textContent = text;
      bubble.classList.add('is-on');
      sayUntil = now() + (ms || 3);
      pinned = !!pin;
    };
    var rotateLine = function () { lineI = (lineI + 1) % lines.length; say(lines[lineI], 3.6); };
    say(lines[0], 3.6);

    var hop = function (spin) {
      if (reduced) return;
      st.hopT = now();
      if (spin) st.spinGoal += Math.PI * 2;
    };
    /* Tres saltos seguidos (el último con giro) y después `done`: así recepción te lleva a la oficina.
       Sin animación, `done` corre de inmediato. Mientras salta no se vuelve a pedir. */
    var HOP_MS = 560, leading = false;
    var lead = function (done) {
      if (leading) return;
      if (reduced) { done(); return; }
      leading = true;
      var i = 0;
      var next = function () {
        hop(i === 2);
        i += 1;
        timers.push(setTimeout(i < 3 ? next : function () { leading = false; done(); }, HOP_MS));
      };
      next();
    };
    var timers = [];
    var ringBell = function () { st.ringT = now(); };

    /* Cursor: mira hacia donde estás (en toda la página) */
    var onMove = function (e) {
      var r = stage.getBoundingClientRect();
      var cxp = r.left + r.width * 0.5, cyp = r.top + r.height * 0.42;
      st.goalX = Math.max(-1, Math.min(1, (e.clientX - cxp) / (r.width * 0.6)));
      st.goalY = Math.max(-1, Math.min(1, (e.clientY - cyp) / (r.height * 0.6)));
      st.lastMove = now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    /* Clic sobre el personaje o el timbre */
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    var agentMeshes = []; agent.traverse(function (o) { if (o.isMesh) agentMeshes.push(o); });
    var hitAt = function (e, list) {
      var r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, cam);
      return ray.intersectObjects(list, false).length > 0;
    };
    var onCanvasMove = function (e) { canvas.style.cursor = (hitAt(e, agentMeshes) || hitAt(e, [bell, bellKnob])) ? 'pointer' : ''; };
    /* Tres clics seguidos (menos de 0,8 s entre uno y otro) sobre recepción: te lleva a la oficina (`opts.onTriple`). */
    var tickles = opts.tickles || ['¡Jaja, me haces cosquillas!', 'Una vez más y te llevo a la oficina'];
    var clicks = 0, lastClick = -10;
    var onCanvasClick = function (e) {
      if (hitAt(e, [bell, bellKnob])) { ringBell(); hop(false); say(opts.ding || '¡Ding! Ya voy', 2.4); return; }
      if (!hitAt(e, agentMeshes) || leading) return;
      var t = now();
      clicks = t - lastClick < 0.8 ? clicks + 1 : 1;
      lastClick = t;
      if (clicks >= 3 && opts.onTriple) { clicks = 0; opts.onTriple(); return; }
      hop(true);
      say(tickles[Math.min(clicks, tickles.length) - 1], 2.4);
    };
    canvas.addEventListener('pointermove', onCanvasMove);
    canvas.addEventListener('click', onCanvasClick);

    /* Contactos: al pasar por uno, salta y dice algo */
    var links = Array.prototype.slice.call(opts.links || []);
    var onEnter = function (e) {
      var t = e.currentTarget;
      hop(false);
      say(t.getAttribute('data-contact-say') || opts.elsewhere || '¡Por ahí también!', 30, true);
      var r = t.getBoundingClientRect(), s = stage.getBoundingClientRect();
      st.goalX = Math.max(-1, Math.min(1, (r.left + r.width / 2 - (s.left + s.width / 2)) / (s.width * 0.6)));
      st.goalY = Math.max(-1, Math.min(1, (r.top + r.height / 2 - (s.top + s.height * 0.42)) / (s.height * 0.6)));
      st.lastMove = now();
    };
    var onLeaveLink = function () { pinned = false; sayUntil = now() + 1.2; };
    var onFocus = function (e) { onEnter(e); };
    links.forEach(function (l) {
      l.addEventListener('pointerenter', onEnter);
      l.addEventListener('pointerleave', onLeaveLink);
      l.addEventListener('focus', onFocus);
      l.addEventListener('blur', onLeaveLink);
    });

    /* Bucle: solo mientras la sección está en pantalla */
    var raf = 0, visible = true, lastLine = 0;
    var v = new THREE.Vector3();
    /* Tope de 60 fps; en modo liviano pixelRatio 1 y sombras de 512; en el mínimo, 30 fps. */
    var cap = createFrameCap(60);
    var applyTier = function (tier) {
      if (tier < 1) return;
      renderer.setPixelRatio(1);
      resize();
      if (sun.shadow.mapSize.x !== 512) { sun.shadow.mapSize.set(512, 512); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
      if (tier >= 2) cap.setFps(30);
    };
    applyTier(getPerfTier());
    var offTier = onPerfTier(applyTier);
    var frame = function (stamp) {
      raf = 0;
      if (!visible || document.hidden) return;
      if (!cap.ready(stamp)) { raf = requestAnimationFrame(frame); return; }
      var t = now();
      var idle = t - st.lastMove > 2.6;
      /* Sin cursor un rato: baja la mirada y teclea en el notebook */
      var gx = idle ? -0.45 : st.goalX, gy = idle ? 0.35 : st.goalY;
      var k = reduced ? 1 : 0.1;
      st.lookX += (gx - st.lookX) * k;
      st.lookY += (gy - st.lookY) * k;
      view.theta += ((Math.PI / 4 + (reduced ? 0 : st.goalX * 0.06)) - view.theta) * 0.05;
      updateCam();

      var y = BASE_Y;
      if (!reduced) {
        y += idle ? Math.abs(Math.sin(t * 9)) * 0.025 : Math.sin(t * 1.6) * 0.06;
        if (st.hopT >= 0) {
          var h = (t - st.hopT) / 0.55;
          if (h >= 1) st.hopT = -1; else y += Math.sin(h * Math.PI) * 0.45;
        }
      }
      agent.position.y = y;
      st.spin += (st.spinGoal - st.spin) * (reduced ? 1 : 0.12);
      agent.rotation.y = Math.PI / 4 + st.spin + st.lookX * 0.55;
      head.rotation.x = st.lookY * 0.28;
      agent.rotation.z = reduced ? 0 : -st.lookX * 0.06;
      eyes.forEach(function (e) { e.pupil.position.x = st.lookX * 0.022; e.pupil.position.y = -st.lookY * 0.02; });
      screenMat.emissiveIntensity = idle && !reduced ? 0.35 + Math.abs(Math.sin(t * 7)) * 0.2 : 0.25;

      /* Parpadeo */
      if (!reduced) {
        if (st.blinkT < 0 && t > st.blinkAt) st.blinkT = t;
        var sy = 1;
        if (st.blinkT >= 0) {
          var b = (t - st.blinkT) / 0.16;
          if (b >= 1) { st.blinkT = -1; st.blinkAt = t + 2.2 + Math.random() * 2.8; } else sy = Math.max(0.08, Math.abs(1 - 2 * b));
        }
        eyes.forEach(function (e) { e.g.scale.y = sy; });
      }
      /* Timbre */
      if (st.ringT >= 0) {
        var rr = (t - st.ringT) / 0.5;
        if (rr >= 1) { st.ringT = -1; bell.rotation.z = 0; }
        else bell.rotation.z = Math.sin(rr * Math.PI * 6) * 0.25 * (1 - rr);
      }
      /* Globo: cambia de frase solo si nadie está pasando por un contacto */
      if (!pinned && t > sayUntil) {
        if (bubble && bubble.classList.contains('is-on')) { bubble.classList.remove('is-on'); lastLine = t; }
        else if (t - lastLine > 1.6) rotateLine();
      }
      renderer.render(scene, cam);
      if (bubble) {
        v.set(agent.position.x, agent.position.y + 0.45, agent.position.z).project(cam);
        var W = stage.clientWidth, H = stage.clientHeight;
        bubble.style.transform = 'translate(' + ((v.x + 1) / 2 * W) + 'px,' + ((1 - v.y) / 2 * H) + 'px) translate(-50%,-100%)';
      }
      raf = requestAnimationFrame(frame);
    };
    var kick = function () { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    var io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; kick(); }, { threshold: 0 });
    io.observe(stage);
    var ro = new ResizeObserver(function () { resize(); kick(); });
    ro.observe(stage);
    var onVis = function () { kick(); };
    document.addEventListener('visibilitychange', onVis);
    kick();

    return {
      hop: hop,
      say: say,
      lead: lead,
      dispose: function () {
        timers.forEach(clearTimeout);
        if (raf) cancelAnimationFrame(raf);
        offTier();
        io.disconnect(); ro.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointermove', onCanvasMove);
        canvas.removeEventListener('click', onCanvasClick);
        links.forEach(function (l) {
          l.removeEventListener('pointerenter', onEnter);
          l.removeEventListener('pointerleave', onLeaveLink);
          l.removeEventListener('focus', onFocus);
          l.removeEventListener('blur', onLeaveLink);
        });
        scene.traverse(function (o) {
          if (o.geometry) o.geometry.dispose();
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
        });
        renderer.dispose();
        if (renderer.forceContextLoss) renderer.forceContextLoss();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }
