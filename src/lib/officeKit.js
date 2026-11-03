// Piezas comunes de las oficinas temáticas, del artefacto "Hero · Augusto Pinto" (office-kit.js), como módulo.
/* Piezas comunes para las oficinas temáticas. Respeta la planta del motor: sala de 10×10, muro izquierdo en x=-5, muro del fondo en z=-5.
   Puestos fijos de los agentes: recepción tras el mostrador (2.6, z 2.3), arquitecto en el escritorio del muro izquierdo (x -3.35), stack en el escritorio del fondo (z -3.4). */
  export function kit(api) {
    var THREE = api.THREE, scene = api.scene, box = api.box, cyl = api.cyl, sphere = api.sphere;
    var S = 5;
    var add = function (geo, m, x, y, z, rx, ry, rz) {
      var g = new THREE.Mesh(geo, m);
      g.position.set(x, y, z);
      g.rotation.set(rx || 0, ry || 0, rz || 0);
      g.castShadow = true; g.receiveShadow = true;
      scene.add(g);
      return g;
    };
    var rnd = function (seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
    return {
      S: S, add: add, rnd: rnd,
      planks: function (mats) { for (var i = 0; i < 20; i++) box(10, 0.2, 0.5, mats[i % mats.length], 0, -0.2, -4.75 + i * 0.5); },
      tiles: function (mats, grout, n, seed) {
        n = n || 10;
        var s = 10 / n, r = rnd(seed || 7);
        box(10, 0.17, 10, grout, 0, -0.2, 0);
        for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
          var m = seed ? mats[Math.floor(r() * mats.length)] : mats[(i + j) % mats.length];
          box(s - 0.03, 0.2, s - 0.03, m, -S + s / 2 + i * s, -0.2, -S + s / 2 + j * s);
        }
      },
      walls: function (left, back, h) { h = h || 3.2; box(0.2, h, 10.2, left, -S - 0.1, 0, -0.1); box(10, h, 0.2, back, 0, 0, -S - 0.1); },
      /* sillares trabados en los dos muros */
      courses: function (mats, rows, cols, h, seed) {
        h = h || 3.2;
        var bh = h / rows, bw = 10 / cols, r = rnd(seed || 3);
        for (var row = 0; row < rows; row++) {
          var off = (row % 2) * 0.5;
          for (var c = -1; c < cols; c++) {
            var a = Math.max(-S + (c + off) * bw, -S), b = Math.min(-S + (c + off + 1) * bw, S);
            if (b - a < 0.05) continue;
            box(b - a - 0.04, bh - 0.04, 0.05, mats[Math.floor(r() * mats.length)], (a + b) / 2, row * bh + 0.02, -S + 0.025);
            box(0.05, bh - 0.04, b - a - 0.04, mats[Math.floor(r() * mats.length)], -S + 0.025, row * bh + 0.02, (a + b) / 2);
          }
        }
      },
      desk: function (x, z, len, depth, alongX, top, leg, h) {
        h = h || 0.72;
        var w = alongX ? len : depth, d = alongX ? depth : len;
        box(w, 0.07, d, top, x, h, z);
        if (alongX) { box(0.07, h, d, leg, x - w / 2 + 0.05, 0, z); box(0.07, h, d, leg, x + w / 2 - 0.05, 0, z); }
        else { box(w, h, 0.07, leg, x, 0, z - d / 2 + 0.05); box(w, h, 0.07, leg, x, 0, z + d / 2 - 0.05); }
      },
      stool: function (x, z, post, seat) { cyl(0.05, 0.4, post, x, 0, z); cyl(0.3, 0.1, seat, x, 0.4, z); },
      rug: function (x, z, w, d, mats) { mats.forEach(function (m, i) { box(w - i * 0.4, 0.04 + i * 0.005, d - i * 0.4, m, x, 0, z); }); },
      plant: function (x, z, pot, a, b) {
        cyl(0.26, 0.5, pot, x, 0, z, 0.2);
        for (var k = 0; k < 6; k++) { var an = k * 1.05; sphere(0.3, k % 2 ? a : b, x + Math.cos(an) * 0.28, 0.9 + 0.12 * (k % 3), z + Math.sin(an) * 0.28, 1, 0.35, 1); }
        sphere(0.26, a, x, 1.25, z, 1, 0.5, 1);
      },
      /* tablero del arquitecto en el muro izquierdo, centrado en z=0 */
      board: function (surface, frame, w, h, y) {
        w = w || 2.6; h = h || 1.3; y = y == null ? 1.15 : y;
        box(0.06, h + 0.12, w + 0.12, frame, -S + 0.05, y - 0.06, 0);
        box(0.05, h, w, surface, -S + 0.09, y, 0);
      },
      /* fila de libros de alturas y grosores variados, a lo largo de z (o de x con alongX) */
      books: function (x, y, z, alongX, n, mats, seed) {
        var r = rnd(seed || 5), p = 0;
        for (var i = 0; i < n; i++) {
          var t = 0.06 + r() * 0.05, hh = 0.24 + r() * 0.14, m = mats[i % mats.length];
          if (alongX) box(t, hh, 0.22, m, x + p, y, z); else box(0.22, hh, t, m, x, y, z + p);
          p += t + 0.012;
        }
      },
      /* cilindro tumbado: a lo largo de x, o de z con alongZ */
      log: function (r, len, m, x, y, z, alongZ) { return add(new THREE.CylinderGeometry(r, r, len, 20), m, x, y, z, alongZ ? Math.PI / 2 : 0, 0, alongZ ? 0 : Math.PI / 2); },
      light: function (color, intensity, dist, x, y, z) { var l = new THREE.PointLight(color, intensity, dist || 6, 2); l.position.set(x, y, z); scene.add(l); return l; },
      noShadow: function (g) { g.castShadow = false; g.receiveShadow = false; return g; }
    };
  }

  /* Figura base de los agentes: cabeza, cuerpo cónico, ojos y sonrisa. Los accesorios se suman con f.add(...). */
  export function figure(api, o) {
    var THREE = api.THREE, M = api.M, part = api.part;
    var g = new THREE.Group();
    var ink = M(o.ink || 0x2a2622);
    g.add(part(new THREE.SphereGeometry(0.3, 32, 20), M(o.skin || 0xf1d9b5), 0, 0, 0));
    var b = part(new THREE.ConeGeometry(0.27, 0.55, 24), M(o.body), 0, -0.5, 0);
    b.rotation.x = Math.PI;
    g.add(b);
    var w = M(0xffffff);
    if (!o.noEyes) [-0.1, 0.1].forEach(function (x) { g.add(part(new THREE.SphereGeometry(0.07, 16, 12), w, x, 0, 0.25)); g.add(part(new THREE.SphereGeometry(0.035, 12, 10), ink, x, 0, 0.31)); });
    var sl = part(new THREE.TorusGeometry(0.06, 0.016, 8, 16, Math.PI), o.mouth ? M(o.mouth) : ink, 0, -0.09, 0.28);
    sl.rotation.z = Math.PI;
    g.add(sl);
    var f = {
      g: g, M: M, THREE: THREE,
      /* radio del cuerpo a la altura y (para pegar piezas al pecho) */
      r: function (y) { return 0.27 * Math.max(0, y + 0.775) / 0.55; },
      add: function (geo, m, x, y, z, rx, ry, rz) { var p = part(geo, m, x, y, z); p.rotation.set(rx || 0, ry || 0, rz || 0); g.add(p); return p; },
      hair: function (m, cover, r) { return f.add(new THREE.SphereGeometry(r || 0.31, 32, 16, 0, Math.PI * 2, 0, Math.PI * (cover || 0.38)), m, 0, 0, 0); },
      /* capucha o melena abierta por delante */
      hood: function (m, r, cover, y, z) { return f.add(new THREE.SphereGeometry(r || 0.36, 32, 16, Math.PI / 2 + 0.75, Math.PI * 2 - 1.5, 0, Math.PI * (cover || 0.6)), m, 0, y || 0, z || -0.02); },
      collar: function (m, R, t, y) { return f.add(new THREE.TorusGeometry(R || 0.26, t || 0.04, 10, 32), m, 0, y == null ? -0.27 : y, 0, Math.PI / 2); },
      chest: function (m, w, h, y, x) { y = y == null ? -0.3 : y; return f.add(new THREE.BoxGeometry(w || 0.16, h || 0.07, 0.04), m, x || 0, y, f.r(y) - 0.005); },
      buttons: function (m, cols, rows) {
        (cols || [0]).forEach(function (x) { for (var i = 0; i < (rows || 3); i++) { var y = -0.3 - i * 0.09, rr = f.r(y); f.add(new THREE.SphereGeometry(0.018, 10, 8), m, x, y, Math.sqrt(Math.max(0, rr * rr - x * x)) + 0.004); } });
      },
      fedora: function (m, band, y) { y = y || 0.2; f.add(new THREE.CylinderGeometry(0.4, 0.4, 0.03, 28), m, 0, y, 0); f.add(new THREE.CylinderGeometry(0.2, 0.22, 0.22, 24), m, 0, y + 0.11, 0); f.add(new THREE.CylinderGeometry(0.225, 0.225, 0.05, 24), band, 0, y + 0.04, 0); }
    };
    return f;
  }

