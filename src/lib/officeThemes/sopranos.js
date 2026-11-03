// Oficina "sopranos" del artefacto "Oficina · cambio de serie" (copiada de su artboard, sin cambios de diseño).
// Los Soprano: trastienda de una carnicería de Nueva Jersey (baldosas, jamones colgando, caja fuerte).
// Los colores son de la maqueta 3D (excepción aprobada, ver design-system/INTEGRACION.md), no de la UI.
import { kit, figure } from '../officeKit';

export const sopranosScene = {
  clear: 0x1c1412, hemi: [0xffe2bf, 0x3a2018, 0.62], sun: [0xffd9a8, 0.6], ring: 0xd4af37,
  labels: [],
  agents: { arquitecto: { pos: [-4.1, 1.3, 0], hit: { c: [-3.2, 1.0, 0], s: [2.6, 2.0, 2.4] }, focus: [-3.3, 1.0, 0] } },
  build(api) {
    const { THREE, scene, M, box, cyl, sphere, cone, torus, discZ } = api;
    const K = kit(api), S = K.S;
    const d = {
      bw: M(0x1d1b1a), ww: M(0xe9e3d3), wood: M(0x6a4428), woodD: M(0x4d2f1b), woodL: M(0x845634),
      burg: M(0x6b1e24), burgL: M(0x7f2a30), burgD: M(0x4a1418), cream: M(0xefe6d2), green: M(0x2f5a3c), felt: M(0x1f5a36, { roughness: 1 }),
      gold: M(0xd4af37, { metalness: 0.6, roughness: 0.35 }), chrome: M(0xc9ccd0, { metalness: 0.85, roughness: 0.25 }),
      steel: M(0x4a4d52, { metalness: 0.6, roughness: 0.4 }), steelD: M(0x2e3034, { metalness: 0.5, roughness: 0.5 }),
      glass: M(0xd7ebf0, { transparent: true, opacity: 0.28, roughness: 0.05 }),
      meat: M(0xb5413c), salami: M(0x8f2f2a), salamiL: M(0xa5463c), cheese: M(0xe8c35a), ham: M(0xc9705e), bone: M(0xf0e6d0), black: M(0x151515), leather: M(0x5a3320),
      sepia: M(0xb79b74), tv: M(0x7fa6c9, { emissive: 0x7fa6c9, emissiveIntensity: 0.6 }), neon: M(0xff4f9a, { emissive: 0xff4f9a, emissiveIntensity: 1.4 }),
      red: M(0xb3262b), white: M(0xf6f1e6), bottle: M(0x2c5a2e, { roughness: 0.25 }), amber: M(0xb86a20, { roughness: 0.25 }), whisky: M(0xc98a3a, { transparent: true, opacity: 0.6, roughness: 0.1 }),
      wine: M(0x6a1420, { transparent: true, opacity: 0.75, roughness: 0.1 }), bread: M(0xc98a45), basket: M(0x8a6a3a),
      terra: M(0xb5643c), leafA: M(0x3f6b35), leafB: M(0x2f5528), pasta: M(0xf0d27a), sauce: M(0xb3321f), carton: M(0xa88456), cartonD: M(0x8a6a42),
      cash: M(0x8fa67a, { roughness: 0.9 }), cashD: M(0x6f8a5c, { roughness: 0.9 }), band: M(0xe9e0c8), navy: M(0x1f2738),
      chipR: M(0xc0392b), chipW: M(0xf4efe4), chipB: M(0x1f1f1f), chipG: M(0x2e7d4f), card: M(0xfbf8f0),
      ember: M(0xff6a1a, { emissive: 0xff5a10, emissiveIntensity: 1.3 }), cigar: M(0x6b3e22),
      glow: M(0xfff1c8, { emissive: 0xffe2a0, emissiveIntensity: 0.9 }), lampG: M(0x1f4a30, { roughness: 0.4 }),
      flagG: M(0x2e8b4a), flagW: M(0xf4efe4), flagR: M(0xc0392b)
    };
    // un fajo suelto, y una pila de fajos como un solo bloque con sus fajas
    const fajo = (x, y, z, ry) => {
      K.add(new THREE.BoxGeometry(0.17, 0.035, 0.075), d.cash, x, y + 0.0175, z, 0, ry || 0, 0);
      K.add(new THREE.BoxGeometry(0.035, 0.037, 0.077), d.band, x, y + 0.0175, z, 0, ry || 0, 0);
    };
    const pila = (x, y, z, n, ry) => {
      const h = n * 0.036;
      K.add(new THREE.BoxGeometry(0.17, h, 0.075), (Math.round(x * 10 + z * 10) % 2) ? d.cash : d.cashD, x, y + h / 2, z, 0, ry || 0, 0);
      K.add(new THREE.BoxGeometry(0.035, h + 0.002, 0.077), d.band, x, y + h / 2, z, 0, ry || 0, 0);
      for (let i = 1; i < n; i += 2) K.add(new THREE.BoxGeometry(0.172, 0.004, 0.077), d.cashD, x, y + i * 0.036, z, 0, ry || 0, 0);
    };
    const fichas = (x, y, z, n, m) => cyl(0.045, n * 0.012, m, x, y, z);
    // silla de madera a escala de los agentes
    const chair = (x, z, fx, fz, seat) => {
      const ry = Math.atan2(fx, fz);
      K.add(new THREE.BoxGeometry(0.48, 0.06, 0.48), seat || d.woodD, x, 0.47, z, 0, ry, 0);
      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([a, b]) => box(0.05, 0.44, 0.05, d.woodD, x + a, 0, z + b));
      K.add(new THREE.BoxGeometry(0.48, 0.55, 0.05), d.woodD, x - fx * 0.22, 0.78, z - fz * 0.22, 0, ry, 0);
      K.add(new THREE.BoxGeometry(0.4, 0.2, 0.06), seat || d.burg, x - fx * 0.21, 0.86, z - fz * 0.21, 0, ry, 0);
    };

    // damero, friso de madera y papel burdeo a rayas
    K.tiles([d.bw, d.ww], d.bw, 10);
    K.walls(d.wood, d.wood);
    box(10, 1.85, 0.04, d.burg, 0, 1.35, -S + 0.02);
    box(0.04, 1.85, 10, d.burg, -S + 0.02, 1.35, 0);
    for (let i = 0; i < 20; i++) {
      box(0.05, 1.85, 0.045, d.burgL, -S + 0.25 + i * 0.5, 1.35, -S + 0.025);
      box(0.045, 1.85, 0.05, d.burgL, -S + 0.025, 1.35, -S + 0.25 + i * 0.5);
    }
    for (let i = 0; i < 10; i++) {
      box(0.86, 0.95, 0.04, d.woodL, -S + 0.5 + i, 0.15, -S + 0.04);
      box(0.04, 0.95, 0.86, d.woodL, -S + 0.04, 0.15, -S + 0.5 + i);
    }
    box(10, 0.08, 0.09, d.woodD, 0, 1.28, -S + 0.06);
    box(0.09, 0.08, 10, d.woodD, -S + 0.06, 1.28, 0);

    // banderines verde, blanco y rojo en lo alto de los muros
    const flags = [d.flagG, d.flagW, d.flagR];
    for (let i = 0; i < 24; i++) {
      K.add(new THREE.ConeGeometry(0.1, 0.22, 3), flags[i % 3], -4.7 + i * 0.4, 2.95, -S + 0.1, Math.PI, 0, 0);
      K.add(new THREE.ConeGeometry(0.1, 0.22, 3), flags[i % 3], -S + 0.1, 2.95, -4.7 + i * 0.4, Math.PI, Math.PI / 2, 0);
    }

    // ZONA 1 · carnicería del fondo: riel con embutidos y tajo con rebanadora
    box(3.3, 0.05, 0.05, d.chrome, -3.0, 2.35, -4.55);
    [-4.4, -1.6].forEach((x) => box(0.05, 0.6, 0.05, d.chrome, x, 2.35, -4.85));
    const hang = [];
    [-4.4, -4.0, -3.6, -3.15, -2.7, -2.25, -1.8].forEach((x, i) => {
      cyl(0.006, 0.18, d.black, x, 2.17, -4.55);
      if (i % 3 === 2) {
        hang.push(sphere(0.17, d.ham, x, 1.82, -4.55, 0.9, 1.5, 0.8));
        cyl(0.025, 0.14, d.bone, x, 2.03, -4.55);
      } else if (i % 3 === 1) {
        for (let k = 0; k < 4; k++) hang.push(sphere(0.055, d.salamiL, x, 2.1 - k * 0.11, -4.55, 1, 1.3, 1));
      } else {
        hang.push(cyl(0.06, 0.5, i % 2 ? d.salami : d.meat, x, 1.67, -4.55, 0.055));
      }
    });
    box(1.6, 0.85, 0.7, d.woodL, -2.9, 0, -4.45);
    box(1.62, 0.12, 0.72, d.cream, -2.9, 0.85, -4.45);
    box(0.4, 0.12, 0.35, d.chrome, -3.35, 0.97, -4.45);
    discZ(0.17, 0.03, d.chrome, -3.35, 1.25, -4.42);
    box(0.12, 0.1, 0.25, d.red, -3.15, 0.97, -4.4);
    box(0.3, 0.015, 0.1, d.chrome, -2.6, 0.97, -4.3);
    box(0.08, 0.03, 0.05, d.black, -2.4, 0.97, -4.3);
    K.log(0.07, 0.35, d.salami, -2.7, 1.04, -4.6);

    // ZONA 2 · caja fuerte grande, abierta y repleta de fajos
    const sx = -0.6, sz = -4.5, sw = 1.0, sh = 1.4, sd = 0.7;
    box(sw, 0.08, sd, d.steel, sx, 0, sz);
    box(sw, 0.08, sd, d.steel, sx, sh - 0.08, sz);
    box(0.07, sh, sd, d.steel, sx - sw / 2 + 0.035, 0, sz);
    box(0.07, sh, sd, d.steel, sx + sw / 2 - 0.035, 0, sz);
    box(sw, sh, 0.07, d.steelD, sx, 0, sz - sd / 2 + 0.035);
    [0.5, 0.92].forEach((y) => box(sw - 0.14, 0.03, sd - 0.1, d.steel, sx, y, sz));
    [[0.08, 11], [0.53, 10], [0.95, 10]].forEach(([y, n]) => {
      for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) pila(sx - 0.34 + c * 0.17, y, sz - 0.2 + r * 0.17, n - ((c + r) % 3 === 0 ? 1 : 0));
    });
    // puerta abierta hacia la izquierda, con bisagras, volante y pernos
    const door = new THREE.Group();
    door.position.set(sx - sw / 2, 0, sz + sd / 2);
    door.rotation.y = -0.35;
    const dp = new THREE.Mesh(new THREE.BoxGeometry(0.08, sh - 0.02, sw), d.steel);
    dp.position.set(-0.04, sh / 2, sw / 2);
    door.add(dp);
    for (let i = 0; i < 4; i++) { const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.1, 10), d.chrome); pin.rotation.z = Math.PI / 2; pin.position.set(0.02, 0.25 + i * 0.3, sw - 0.06); door.add(pin); }
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 8, 24), d.chrome);
    wheel.rotation.y = Math.PI / 2; wheel.position.set(-0.1, 0.75, sw / 2); door.add(wheel);
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 20), d.gold);
    dial.rotation.z = Math.PI / 2; dial.position.set(-0.1, 1.05, sw / 2); door.add(dial);
    door.traverse((o) => { o.castShadow = true; });
    scene.add(door);
    // fajos encima y desparramados frente a la caja
    for (let i = 0; i < 3; i++) pila(sx - 0.25 + i * 0.25, sh, sz, 5 + i, i * 0.2);
    [[0.2, -3.95, 0.4], [0.05, -3.85, -0.6], [-0.35, -3.9, 1.1], [0.3, -3.75, 2.0]].forEach(([dx, z, ry]) => fajo(sx + dx, 0, z, ry));
    pila(sx + 0.15, 0, -3.95, 4, 0.3);

    // neón abstracto sobre el escritorio
    for (let i = 0; i < 5; i++) K.add(new THREE.BoxGeometry(0.42, 0.05, 0.05), d.neon, 0.5 + i * 0.38, 2.5, -S + 0.12, 0, 0, i % 2 ? -0.55 : 0.55);
    torus(0.3, 0.03, d.neon, 3.0, 2.5, -S + 0.12);
    K.light(0xff4f9a, 0.5, 4, 1.4, 2.4, -4.3);

    // ZONA 3 · pizarra de precios del arquitecto
    K.board(d.black, d.woodD, 2.6, 1.3, 1.15);
    box(0.02, 0.1, 1.7, d.red, -S + 0.12, 2.25, -0.3);
    for (let rr = 0; rr < 6; rr++) {
      box(0.02, 0.04, 1.3 - (rr % 3) * 0.2, d.cream, -S + 0.12, 1.3 + rr * 0.15, -0.45);
      box(0.02, 0.04, 0.3, d.gold, -S + 0.12, 1.3 + rr * 0.15, 0.95);
    }
    // la mesa de póker es ahora la del arquitecto: él preside desde la cabecera, junto a su pizarra
    K.rug(-2.7, 0, 3.6, 3.4, [d.burgD, d.burg]);
    const tx = -2.7, tz = 0;
    cyl(0.22, 0.68, d.woodD, tx, 0, tz, 0.4);
    K.add(new THREE.CylinderGeometry(0.85, 0.85, 0.08, 48), d.woodD, tx, 0.72, tz).scale.set(1.3, 1, 1);
    K.add(new THREE.CylinderGeometry(0.76, 0.76, 0.02, 48), d.felt, tx, 0.77, tz).scale.set(1.3, 1, 1);
    pila(tx - 0.08, 0.78, tz - 0.05, 4, 0.4);
    pila(tx + 0.12, 0.78, tz + 0.06, 3, -0.5);
    fajo(tx - 0.05, 0.78, tz + 0.2, 1.2);
    fajo(tx + 0.15, 0.78, tz - 0.18, -0.3);
    [[-0.75, 0, [d.chipR, d.chipW, d.chipB]], [0.75, 0, [d.chipG, d.chipR, d.chipW]], [-0.35, -0.5, [d.chipB, d.chipG]], [0.35, -0.5, [d.chipW, d.chipR]], [-0.35, 0.5, [d.chipR, d.chipB, d.chipG]], [0.35, 0.5, [d.chipG, d.chipW]]].forEach(([dx, dz, ms]) => {
      ms.forEach((m, i) => fichas(tx + dx + (i - 1) * 0.1, 0.78, tz + dz + (i % 2) * 0.06, 3 + ((i * 3 + 2) % 5), m));
      [0, 1].forEach((k) => K.add(new THREE.BoxGeometry(0.09, 0.004, 0.13), d.card, tx + dx * 0.72 + k * 0.05, 0.785 + k * 0.004, tz + dz * 0.72, 0, k * 0.4 + dx, 0));
    });
    [[0.4, -0.3], [-0.5, 0.3]].forEach(([dx, dz]) => cyl(0.035, 0.08, d.whisky, tx + dx, 0.78, tz + dz));
    cyl(0.08, 0.025, d.glass, tx - 0.4, 0.78, tz - 0.3);
    K.log(0.018, 0.16, d.cigar, tx - 0.4, 0.82, tz - 0.3);
    sphere(0.02, d.ember, tx - 0.32, 0.82, tz - 0.3);
    chair(-4.1, tz, 1, 0, d.burg);
    [[tx - 0.45, -1.3, 0, 1], [tx + 0.45, -1.3, 0, 1], [tx - 0.45, 1.3, 0, -1], [tx + 0.45, 1.3, 0, -1]].forEach(([x, z, fx, fz]) => chair(x, z, fx, fz, d.green));
    chair(tx + 1.45, tz, 0.707, 0.707, d.green);
    cyl(0.008, 0.9, d.black, tx, 2.3, tz);
    cyl(0.12, 0.22, d.lampG, tx, 2.08, tz, 0.4);
    K.noShadow(cyl(0.38, 0.01, d.glow, tx, 2.075, tz));
    K.light(0xffe2a0, 1.4, 5, tx, 1.95, tz);

    // ZONA 4 · escritorio ejecutivo del stack y mueble de licores
    K.desk(1.3, -3.4, 2.2, 0.95, true, d.woodD, d.wood);
    box(2.0, 0.55, 0.04, d.wood, 1.3, 0.12, -2.95);
    cyl(0.08, 0.03, d.gold, 0.35, 0.79, -3.55);
    cyl(0.015, 0.3, d.gold, 0.35, 0.82, -3.55);
    box(0.3, 0.1, 0.14, d.green, 0.35, 1.1, -3.55);
    box(0.26, 0.02, 0.1, d.glow, 0.35, 1.09, -3.55);
    box(0.32, 0.14, 0.26, d.cream, 1.85, 0.79, -3.5);
    box(0.24, 0.03, 0.16, d.black, 1.85, 0.93, -3.5);
    fajo(1.85, 0.96, -3.5, 0);
    pila(0.75, 0.79, -3.15, 6, 0.1);
    pila(0.95, 0.79, -3.15, 4, -0.15);
    pila(2.2, 0.79, -3.15, 5, 0.25);
    fajo(1.55, 0.79, -3.05, 0.6);
    cyl(0.08, 0.025, d.glass, 2.25, 0.79, -3.55);
    K.log(0.018, 0.16, d.cigar, 2.25, 0.83, -3.55);
    sphere(0.02, d.ember, 2.33, 0.83, -3.55);
    cyl(0.04, 0.06, d.white, 1.55, 0.79, -3.6);
    box(0.7, 0.15, 0.6, d.burg, 1.3, 0.38, -4.25);
    box(0.75, 1.0, 0.15, d.burg, 1.3, 0.45, -4.6);
    cyl(0.04, 0.38, d.chrome, 1.3, 0, -4.25, 0.2);
    box(1.0, 1.0, 0.7, d.woodD, 3.85, 0, -4.5);
    box(1.05, 0.05, 0.75, d.woodL, 3.85, 1.0, -4.5);
    box(0.5, 0.42, 0.4, d.chrome, 3.85, 1.05, -4.55);
    [-0.12, 0.12].forEach((dx) => cyl(0.035, 0.08, d.black, 3.85 + dx, 1.12, -4.33));
    box(1.0, 0.05, 0.3, d.woodD, 3.85, 1.9, -4.82);
    [[3.5, d.bottle], [3.7, d.amber], [3.9, d.glass], [4.1, d.bottle], [4.25, d.amber]].forEach(([x, m]) => { cyl(0.05, 0.24, m, x, 1.95, -4.82); cyl(0.018, 0.08, m, x, 2.19, -4.82); });
    // cajas de mercadería "caída del camión" en la esquina
    [[4.45, -3.6, 0], [4.45, -3.05, 0], [4.45, -3.35, 0.4]].forEach(([x, z, y]) => { box(0.42, 0.4, 0.5, d.carton, x, y, z); box(0.44, 0.03, 0.18, d.cartonD, x, y + 0.4, z); });

    // ZONA 5 · recepción: vitrina refrigerada de fiambrería, con la trastienda a la vista detrás
    const cx = 2.6, cz = 2.3;
    const dl = {
      glassC: M(0xe6f3f7, { transparent: true, opacity: 0.12, roughness: 0.02, depthWrite: false }),
      cool: M(0xf2f6ff, { emissive: 0xf2f6ff, emissiveIntensity: 1.0 }),
      mort: M(0xd98c8c), mortFace: M(0xf0b4b0), fat: M(0xf8efe6), prosc: M(0xb85a4a), herb: M(0x4f8a3c),
      canR: M(0xc0392b), canY: M(0xe8b830), oil: M(0x2e6b3a), pastaB: M(0x2a4f9a), jar: M(0xc9a85a, { roughness: 0.3 }), rope: M(0xd8c79a)
    };
    box(2.7, 0.75, 0.75, d.white, cx, 0, cz);
    box(2.7, 0.08, 0.02, d.red, cx, 0.55, cz + 0.38);
    box(2.7, 0.1, 0.02, d.steelD, cx, 0, cz + 0.38);
    box(2.62, 0.03, 0.66, d.chrome, cx, 0.75, cz);
    box(2.7, 0.5, 0.06, d.white, cx, 0.75, cz - 0.35);
    [-1.33, 1.33].forEach((dx) => box(0.04, 0.57, 0.75, d.white, cx + dx, 0.75, cz));
    K.noShadow(K.add(new THREE.BoxGeometry(2.62, 0.69, 0.015), dl.glassC, cx, 1.04, cz + 0.155, -0.71, 0, 0));
    box(2.7, 0.04, 0.3, d.chrome, cx, 1.3, cz - 0.22);
    K.noShadow(box(2.5, 0.015, 0.04, dl.cool, cx, 1.28, cz - 0.12));
    K.light(0xf2f6ff, 0.7, 2.2, cx, 1.15, cz + 0.15);
    // dentro de la vitrina: jamón serrano, mortadela, salames, provolone y fiambre en lonjas
    sphere(0.17, dl.prosc, cx - 0.95, 0.9, cz, 1.5, 0.7, 0.9);
    sphere(0.16, dl.fat, cx - 0.98, 0.93, cz, 1.4, 0.55, 0.85);
    sphere(0.15, dl.prosc, cx - 0.95, 0.95, cz, 1.4, 0.55, 0.82);
    K.log(0.03, 0.22, d.bone, cx - 0.62, 0.92, cz);
    K.log(0.14, 0.42, dl.mort, cx - 0.32, 0.92, cz - 0.05);
    api.discX(0.135, 0.01, dl.mortFace, cx - 0.105, 0.92, cz - 0.05);
    [[0.04, 0.03], [-0.05, -0.04], [0.02, -0.07], [-0.07, 0.05]].forEach(([dy, dz]) => sphere(0.012, dl.fat, cx - 0.098, 0.92 + dy, cz - 0.05 + dz));
    for (let i = 0; i < 3; i++) K.log(0.05, 0.38, i % 2 ? d.salamiL : d.salami, cx + 0.2, 0.83, cz - 0.14 + i * 0.12);
    sphere(0.12, d.cheese, cx + 0.68, 0.9, cz - 0.02, 1, 1.25, 1);
    torus(0.07, 0.008, dl.rope, cx + 0.68, 1.04, cz - 0.02, Math.PI * 2, Math.PI / 2, 0, 0);
    for (let i = 0; i < 6; i++) K.add(new THREE.CylinderGeometry(0.075, 0.075, 0.008, 20), i % 2 ? d.ham : dl.mortFace, cx + 0.98 + i * 0.045, 0.8 + i * 0.006, cz + 0.05, 0, 0, -0.25);
    [[-0.6, 0.18], [0.45, 0.18], [0.9, -0.15]].forEach(([dx, dz]) => sphere(0.03, dl.herb, cx + dx, 0.81, cz + dz));
    [-0.95, -0.32, 0.2, 0.68, 1.1].forEach((dx) => K.add(new THREE.BoxGeometry(0.08, 0.05, 0.005), d.white, cx + dx, 0.82, cz + 0.27, -0.6, 0, 0));
    box(0.36, 0.18, 0.28, d.steel, 1.55, 1.34, cz - 0.22);
    K.add(new THREE.BoxGeometry(0.3, 0.12, 0.04), d.black, 1.55, 1.57, cz - 0.28, -0.4, 0, 0);
    K.stool(cx, 1.55, d.chrome, d.burg);
    // riel de jamones, provolones y salames colgando detrás de la recepción
    const bz = 0.75;
    [-1.15, 1.15].forEach((dx) => box(0.06, 2.5, 0.06, d.chrome, cx + dx, 0, bz + 0.12));
    box(2.35, 0.05, 0.05, d.chrome, cx, 2.48, bz + 0.12);
    [-0.95, -0.55, -0.15, 0.25, 0.65, 1.0].forEach((dx, i) => {
      const x = cx + dx, z = bz + 0.12;
      cyl(0.006, 0.14, dl.rope, x, 2.34, z);
      if (i % 3 === 0) {
        hang.push(sphere(0.19, dl.prosc, x, 2.02, z, 0.85, 1.55, 0.75));
        cyl(0.028, 0.16, d.bone, x, 2.25, z);
      } else if (i % 3 === 1) {
        hang.push(sphere(0.13, d.cheese, x, 2.1, z, 1, 1.35, 1));
        torus(0.06, 0.01, dl.rope, x, 2.27, z, Math.PI * 2, Math.PI / 2, 0, 0);
      } else {
        for (let k = 0; k < 3; k++) hang.push(cyl(0.045, 0.42, k % 2 ? d.salamiL : d.salami, x - 0.08 + k * 0.08, 1.9, z, 0.04));
      }
    });

    // ZONA 7 · comedor de la fiambrería: mesa larga con mantel a cuadros
    const mx = 3.25, mz = 4.0, mw = 1.7, md = 0.9;
    box(mw, 0.05, md, d.white, mx, 0.74, mz);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2 === 0) box(mw / 6, 0.004, md / 3, d.red, mx - mw / 2 + mw / 12 + i * mw / 6, 0.79, mz - md / 2 + md / 6 + j * md / 3);
    box(mw + 0.02, 0.18, md + 0.02, d.white, mx, 0.6, mz);
    [[-0.75, -0.35], [0.75, -0.35], [-0.75, 0.35], [0.75, 0.35]].forEach(([a, b]) => box(0.06, 0.6, 0.06, d.woodD, mx + a, 0, mz + b));
    [[2.85, 3.2, 0, 1], [3.65, 3.2, 0, 1], [2.85, 4.75, 0, -1], [3.65, 4.75, 0, -1], [2.05, 4.0, 1, 0], [4.45, 4.0, -1, 0]].forEach(([x, z, fx, fz]) => chair(x, z, fx, fz, d.burg));
    [[2.85, 3.75], [3.65, 3.75], [2.85, 4.25], [3.65, 4.25]].forEach(([x, z]) => {
      cyl(0.17, 0.02, d.white, x, 0.79, z);
      sphere(0.09, d.pasta, x, 0.82, z, 1, 0.35, 1);
      sphere(0.045, d.sauce, x, 0.85, z, 1, 0.5, 1);
      cyl(0.03, 0.12, d.wine, x + 0.17, 0.79, z);
    });
    cyl(0.06, 0.3, d.bottle, mx, 0.79, mz);
    cyl(0.02, 0.1, d.bottle, mx, 1.09, mz);
    cyl(0.14, 0.08, d.basket, mx - 0.45, 0.79, mz, 0.1);
    [[-0.03, 0], [0.04, 0.03]].forEach(([dx, dz]) => sphere(0.06, d.bread, mx - 0.45 + dx, 0.88, mz + dz, 1.4, 0.7, 1));

    // tabique bajo de madera frente a la mesa de póker
    box(2.9, 0.95, 0.1, d.woodD, -3.5, 0, 1.9);
    box(2.95, 0.06, 0.16, d.woodL, -3.5, 0.95, 1.9);
    [-4.9, -2.05].forEach((x) => { box(0.1, 1.3, 0.12, d.woodD, x, 0, 1.9); sphere(0.06, d.gold, x, 1.36, 1.9); });
    // fotos familiares en el muro
    [[2.3, 1.75], [3.15, 1.6], [4.0, 1.8]].forEach(([z, y]) => { box(0.04, 0.56, 0.72, d.gold, -S + 0.08, y, z); box(0.05, 0.44, 0.6, d.sepia, -S + 0.09, y + 0.06, z); });
    // el bolso con los fajos, sobre la silla frente al arquitecto
    const bx = tx + 1.45;
    K.log(0.17, 0.5, d.navy, bx, 0.67, 0, true);
    box(0.24, 0.03, 0.42, d.black, bx, 0.83, 0);
    for (let i = 0; i < 6; i++) fajo(bx - 0.06 + (i % 2) * 0.12, 0.85, -0.15 + Math.floor(i / 2) * 0.15, (i % 2) * 0.3);
    pila(bx, 0.91, -0.02, 3, 0.4);
    torus(0.12, 0.018, d.black, bx, 0.92, 0, Math.PI, 0, Math.PI / 2, 0);
    [[0.35, 0.3, 0.5], [0.45, -0.25, -0.4], [0.3, 0.05, 1.2]].forEach(([dx, dz, ry]) => fajo(bx + dx, 0, dz, ry));
    K.plant(-4.4, 4.4, d.terra, d.leafB, d.leafA);

    return {
      tick(t) {
        hang.forEach((h, i) => { h.rotation.z = Math.sin(t * 0.9 + i * 0.7) * 0.05; });
      }
    };
  },
  makeAgent(api, id) {
    const { THREE } = api;
    const F = figure;
    const gold = (f) => f.M(0xd4af37, { metalness: 0.7, roughness: 0.3 });
    const brows = (f, m, y, tilt, w) => [-1, 1].forEach((s) => f.add(new THREE.BoxGeometry(w || 0.1, 0.03, 0.03), m, s * 0.1, y, 0.278, 0, 0, s * tilt));
    if (id === 'recepcion') {
      // la del mostrador: melena rizada con volumen, sombra azul, lunar, aros grandes, blusa de leopardo, delantal y crucecita de oro
      const f = F(api, { body: 0x2a1a14, skin: 0xf0d0b0, mouth: 0xb3262b });
      const hair = f.M(0x3a1a10, { side: THREE.DoubleSide });
      f.hood(hair, 0.37, 0.55, 0.03, -0.04);
      for (let k = 0; k < 18; k++) {
        const a = k / 18 * Math.PI * 2;
        if (Math.cos(a) > 0.45) continue;
        f.add(new THREE.SphereGeometry(0.1, 12, 10), hair, Math.sin(a) * 0.33, 0.05 + (k % 3) * 0.09, Math.cos(a) * 0.3 - 0.04);
      }
      [[-0.12, 0.33, 0.02], [0.12, 0.33, 0.02], [0, 0.36, -0.1], [0, 0.32, 0.12]].forEach(([x, y, z]) => f.add(new THREE.SphereGeometry(0.11, 12, 10), hair, x, y, z));
      [-0.1, 0.1].forEach((x) => f.add(new THREE.BoxGeometry(0.13, 0.03, 0.02), f.M(0x4a7fd0), x, 0.075, 0.272));
      f.add(new THREE.SphereGeometry(0.012, 8, 6), f.M(0x2a1a14), 0.13, -0.06, 0.265);
      [-0.32, 0.32].forEach((x) => f.add(new THREE.TorusGeometry(0.08, 0.013, 8, 24), gold(f), x, -0.16, 0.02, 0, Math.PI / 2, 0));
      const spot = f.M(0xc8913a);
      [[-0.12, -0.27], [0.13, -0.28], [-0.17, -0.33], [0.17, -0.34]].forEach(([x, y]) => f.add(new THREE.SphereGeometry(0.025, 10, 8), spot, x, y, Math.sqrt(Math.max(0, f.r(y) ** 2 - x * x))));
      f.chest(f.M(0xf6f1e6), 0.24, 0.3, -0.5);
      f.chest(f.M(0xb3262b), 0.24, 0.025, -0.34);
      [-0.1, 0.1].forEach((x) => f.add(new THREE.BoxGeometry(0.02, 0.12, 0.02), f.M(0xf6f1e6), x, -0.27, Math.sqrt(Math.max(0, f.r(-0.27) ** 2 - x * x)) + 0.005));
      f.add(new THREE.BoxGeometry(0.018, 0.07, 0.015), gold(f), 0, -0.285, f.r(-0.285) + 0.01);
      f.add(new THREE.BoxGeometry(0.045, 0.016, 0.015), gold(f), 0, -0.275, f.r(-0.275) + 0.012);
      return f.g;
    }
    if (id === 'arquitecto') {
      // el que reparte las cartas: pelo engominado con canas, cejas pobladas, bigote, buzo de terciopelo, cadena con medalla y puro
      const f = F(api, { body: 0x1f4a35, skin: 0xe8c39e });
      const dark = f.M(0x161616, { roughness: 0.2 });
      f.hair(dark, 0.36);
      [-1, 1].forEach((s) => f.add(new THREE.SphereGeometry(0.1, 12, 10), f.M(0x9a9a9a), s * 0.27, 0.06, -0.04).scale.set(0.45, 1, 1));
      brows(f, dark, 0.115, 0.12, 0.12);
      f.add(new THREE.BoxGeometry(0.19, 0.04, 0.04), dark, 0, -0.045, 0.29);
      f.add(new THREE.TorusGeometry(0.255, 0.05, 10, 32), f.M(0x16382a), 0, -0.24, 0, Math.PI / 2, 0, 0);
      f.chest(f.M(0xf6f1e6), 0.02, 0.32, -0.42);
      [-0.12, 0.12].forEach((x) => f.add(new THREE.BoxGeometry(0.025, 0.3, 0.02), f.M(0xf6f1e6), x, -0.4, Math.sqrt(Math.max(0, f.r(-0.4) ** 2 - x * x)) + 0.005));
      f.collar(gold(f), 0.235, 0.02, -0.27);
      f.add(new THREE.CylinderGeometry(0.045, 0.045, 0.012, 20), gold(f), 0, -0.35, f.r(-0.35) + 0.02, Math.PI / 2, 0, 0);
      f.add(new THREE.CylinderGeometry(0.022, 0.022, 0.19, 12), f.M(0x6b3e22), 0.1, -0.1, 0.34, Math.PI / 2, 0, 0.5);
      f.add(new THREE.CylinderGeometry(0.024, 0.024, 0.02, 12), gold(f), 0.075, -0.1, 0.29, Math.PI / 2, 0, 0.5);
      f.add(new THREE.SphereGeometry(0.024, 10, 8), f.M(0xff6a1a, { emissive: 0xff5a10, emissiveIntensity: 1.3 }), 0.145, -0.1, 0.43);
      return f.g;
    }
    // el grandote de la puerta: rapado, hombros anchos, lentes oscuros, chivita, chaqueta de cuero, camiseta blanca, cadena gruesa y mondadientes
    const f = F(api, { body: 0x1d1b1a, skin: 0xd9a77c });
    const leather = f.M(0x1d1b1a, { roughness: 0.35 });
    f.hair(f.M(0x2a2420), 0.3, 0.305);
    [-1, 1].forEach((s) => f.add(new THREE.SphereGeometry(0.17, 16, 12), leather, s * 0.24, -0.3, -0.02).scale.set(1, 0.75, 1));
    const shade = f.M(0x0d0d0d, { roughness: 0.1, metalness: 0.4 });
    [-0.1, 0.1].forEach((x) => f.add(new THREE.BoxGeometry(0.15, 0.085, 0.03), shade, x, 0.01, 0.31));
    f.add(new THREE.BoxGeometry(0.34, 0.02, 0.02), shade, 0, 0.05, 0.31);
    brows(f, f.M(0x2a2420), 0.085, -0.2, 0.11);
    f.add(new THREE.BoxGeometry(0.08, 0.07, 0.04), f.M(0x2a2420), 0, -0.165, 0.255);
    f.chest(f.M(0xf6f1e6), 0.13, 0.14, -0.31);
    f.add(new THREE.TorusGeometry(0.25, 0.04, 10, 32, Math.PI * 1.2), leather, 0, -0.25, 0, Math.PI / 2, 0, -0.1);
    f.collar(gold(f), 0.225, 0.03, -0.27);
    f.add(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 6), f.M(0xe2c99a), -0.06, -0.1, 0.32, Math.PI / 2, 0, -0.6);
    return f.g;
  }
};
