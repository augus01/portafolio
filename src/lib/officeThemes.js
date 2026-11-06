// Las cuatro oficinas del artefacto "Hero · Augusto Pinto" (office-themes.js), como módulo.
// Cada una trae su decorado en build(api) y sus personajes en makeAgent(api, id); los colores son de la maqueta 3D
// (excepción aprobada, ver design-system/INTEGRACION.md).
import { kit, figure } from './officeKit';

const T = {};

  /* Oficina-C-Original */
T.original = {
  clear: 0xfbfbf9, hemi: [0xffffff, 0xffffff, 0.72], sun: [0xffffff, 0.4], ring: 0x0e0f12,
  labels: [],
  build(api) {
    const { M, box, cyl, sphere, torus } = api;
    /* Misma oficina original, mismos muebles y mismos tonos, pero un paso más vivos y cálidos. */
    const mat = {
      floor: M(0xffffff), wall: M(0xffffff), furn: M(0x5e657a), furn2: M(0x2f3a66), dark: M(0x2b3358), white: M(0xffffff),
      glass: M(0xcfe8f2), rug: M(0xf2dcc0), mat: M(0xe8c9a0), line: M(0x4a4d57),
      slate: M(0x2f6fe0), moss: M(0x2fa05a), brown: M(0xc46a2c), tealD: M(0x1f8a96), wine: M(0xc2385a), aub: M(0x8a4fc0), indigo: M(0x4a58c8)
    };
    const S = 5;
    /* Sol más bajo: sombras más largas y legibles sobre piso y paredes blancas */
    const sunL = api.scene.children.find((o) => o.isDirectionalLight);
    if (sunL) sunL.position.set(7, 11, 9);
    const silver = M(0xc9cdd4, { metalness: 0.25, roughness: 0.35 });
    const desk = (x, z, len, depth, alongX, top) => {
      const w = alongX ? len : depth, d = alongX ? depth : len;
      box(w, 0.07, d, top || mat.furn, x, 0.72, z);
      if (alongX) { box(0.07, 0.72, d, mat.furn2, x - w / 2 + 0.05, 0, z); box(0.07, 0.72, d, mat.furn2, x + w / 2 - 0.05, 0, z); }
      else { box(w, 0.72, 0.07, mat.furn2, x, 0, z - d / 2 + 0.05); box(w, 0.72, 0.07, mat.furn2, x, 0, z + d / 2 - 0.05); }
    };
    const plant = (x, z) => { cyl(0.22, 0.45, mat.furn2, x, 0, z); sphere(0.42, M(0x3fa35e), x, 0.8, z); };
    box(10, 0.2, 10, mat.floor, 0, -0.2, 0);
    box(0.2, 3.2, 10.2, mat.wall, -S - 0.1, 0, -0.1);
    box(10, 3.2, 0.2, mat.wall, 0, 0, -S - 0.1);
    /* Zócalos: marcan dónde termina la pared y empieza el piso (la pared izquierda se corta donde está el closet) */
    const baseb = M(0xc9c9c4);
    box(10, 0.16, 0.05, baseb, 0, 0, -S + 0.025);
    box(0.05, 0.16, 0.73, baseb, -S + 0.025, 0, -4.635);
    box(0.05, 0.16, 7.53, baseb, -S + 0.025, 0, 1.235);
    box(2.6, 1.5, 0.06, mat.glass, -1.6, 1.2, -S + 0.02);
    box(0.06, 1.5, 0.08, mat.white, -1.6, 1.2, -S + 0.05);
    desk(-3.35, 0, 2.0, 0.9, false, mat.slate);
    box(0.06, 0.5, 0.9, mat.dark, -3.65, 0.79, 0);
    box(0.05, 1.3, 2.6, mat.white, -S + 0.03, 1.15, 0);
    [[-0.7, 1.95], [0.7, 1.95], [0, 1.45]].forEach(([zz, yy]) => box(0.02, 0.22, 0.42, mat.line, -S + 0.07, yy, zz));
    box(0.02, 0.03, 1.0, mat.line, -S + 0.07, 2.05, 0);
    box(0.02, 0.32, 0.03, mat.line, -S + 0.07, 1.67, 0);
    cyl(0.28, 0.45, M(0x17171c), -4.25, 0, 0);
    desk(1.3, -3.4, 2.2, 0.9, true, mat.moss);
    box(0.75, 0.48, 0.06, mat.dark, 0.85, 0.79, -3.7);
    box(0.75, 0.48, 0.06, mat.dark, 1.75, 0.79, -3.7);
    cyl(0.28, 0.45, M(0x17171c), 1.3, 0, -4.25);
    box(0.9, 2.3, 0.8, M(0x34303a), 3.85, 0, -4.4);
    const rackF = M(0x3f3a45);
    [0.84, 1.6].forEach((y) => { box(0.78, 0.68, 0.03, rackF, 3.85, y, -3.985); box(0.4, 0.04, 0.03, silver, 3.85, y + 0.5, -3.955); });
    
    box(2.6, 1.0, 0.5, mat.furn2, 2.6, 0, 2.3);
    box(2.6, 0.06, 0.7, mat.aub, 2.6, 1.0, 2.35);
    cyl(0.28, 0.45, M(0x17171c), 2.6, 0, 1.55);
    box(3.8, 0.04, 2.7, M(0xa9441d), -0.9, 0, 1.3);
    box(3.4, 0.045, 2.3, M(0xefe0bd), -0.9, 0, 1.3);
    box(3.0, 0.05, 1.9, M(0xd1561f), -0.9, 0, 1.3);
    box(2.0, 0.055, 1.1, M(0xdba52b), -0.9, 0, 1.3);
    /* Mesa tulipán y lámpara de arco, copiadas de la opción 2 */
    const brass = M(0xc89a3c, { metalness: 0.5, roughness: 0.4 }), tAmber = M(0xd8892b, { roughness: 0.3 }), tGlass = M(0xd9c9a4);
    cyl(0.1, 0.35, M(0xfaf3e0), -0.9, 0.04, 1.3, 0.2);
    cyl(0.52, 0.04, M(0xefe0bd), -0.9, 0.39, 1.3);
    cyl(0.07, 0.2, tAmber, -0.9, 0.43, 1.2, 0.09);
    sphere(0.04, brass, -0.9, 0.69, 1.2);
    cyl(0.035, 0.09, tGlass, -0.65, 0.43, 1.4);
    cyl(0.035, 0.09, tGlass, -0.55, 0.43, 1.25);
    cyl(0.22, 0.04, brass, 0.9, 0, 3.0);
    cyl(0.02, 1.6, brass, 0.9, 0.04, 3.0);
    torus(0.45, 0.02, brass, 0.45, 1.64, 3.0, Math.PI / 2, 0, 0, 0);
    sphere(0.2, M(0xfff3d0, { emissive: 0xfff3d0, emissiveIntensity: 0.7 }), 0.45, 1.9, 3.0);
    const sofaO = M(0xe0621f), sofaY = M(0xf0b429), sofaT = M(0x22a39a), sofaW = M(0x6b4226);
    box(2.6, 0.34, 0.85, sofaO, -0.9, 0.2, 2.75);
    [-2.05, 0.25].forEach((x) => [2.45, 3.05].forEach((z) => cyl(0.035, 0.2, sofaW, x, 0, z, 0.05)));
    box(2.6, 0.55, 0.18, sofaO, -0.9, 0.54, 3.07);
    box(0.2, 0.5, 0.85, sofaO, -2.3, 0.2, 2.75);
    box(0.2, 0.5, 0.85, sofaO, 0.5, 0.2, 2.75);
    box(0.55, 0.5, 0.14, sofaY, -1.6, 0.54, 2.9);
    box(0.5, 0.45, 0.14, sofaT, -0.2, 0.54, 2.9);
    /* Huevo 1: último cajón del rack, sale un agente acostado mirando hacia arriba */
    const T = api.THREE;
    const dg = new T.Group();
    const dPart = (w, h, d, m, x, y, z) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y + h / 2, z); o.castShadow = true; o.receiveShadow = true; dg.add(o); };
    const dFront = M(0x3f3a45), dIn = M(0xf0b429);
    dPart(0.78, 0.68, 0.03, dFront, 0, 0.08, -0.015);
    dPart(0.4, 0.04, 0.03, silver, 0, 0.58, 0.015);
        dPart(0.72, 0.04, 1.07, dIn, 0, 0.1, -0.565);
    dPart(0.04, 0.4, 1.07, dIn, -0.37, 0.1, -0.565);
    dPart(0.04, 0.4, 1.07, dIn, 0.37, 0.1, -0.565);
    dPart(0.72, 0.4, 0.04, dIn, 0, 0.1, -1.08);
    const lying = this.makeAgent(api, 'cajon');
    lying.rotation.x = -Math.PI / 2;
    const hidden = new T.Group();
    hidden.add(lying);
    hidden.rotation.y = Math.PI;
    hidden.position.set(0, 0.44, -0.3);
    dg.add(hidden);
    const clipBack = new T.Plane(new T.Vector3(0, 0, 1), 4.78);
    dg.traverse((o) => { if (o.material) o.material.clippingPlanes = [clipBack]; });
    dg.position.set(3.85, 0, -3.97);
    api.scene.add(dg);
    const rackEgg = {
      c: [3.85, 0.43, -3.6], s: [0.9, 0.74, 1.6],
      anim(t) { dg.position.z = -3.97 + t * 0.95; }
    };
    /* Huevo 2: closet de la esquina; la puerta derecha se abre y hay un agente parado */
    const cx = -4.62, cmat = mat.tealD, cin = M(0xf4f1ea);
    // El fondo y la base (crema) van por dentro de los costados y las puertas: si comparten cara con la caja turquesa, parpadean (z-fighting).
    box(0.04, 1.86, 1.62, cin, -4.96, 0, -3.4);
    box(0.72, 1.9, 0.04, cmat, cx, 0, -4.23);
    box(0.72, 1.9, 0.04, cmat, cx, 0, -2.57);
    box(0.72, 0.04, 1.7, cmat, cx, 1.86, -3.4);
    box(0.64, 0.04, 1.62, cin, -4.615, 0, -3.4);
    box(0.03, 1.82, 0.8, cmat, -4.275, 0.04, -2.99);
    box(0.04, 0.45, 0.04, silver, -4.25, 0.85, -3.29);
    const doorR = new T.Group();
    doorR.position.set(-4.275, 0.04, -4.21);
    const dl = new T.Mesh(new T.BoxGeometry(0.03, 1.82, 0.8), cmat);
    dl.position.set(0, 0.91, 0.4); dl.castShadow = true; dl.receiveShadow = true; doorR.add(dl);
    const dh = new T.Mesh(new T.BoxGeometry(0.04, 0.45, 0.04), silver);
    dh.position.set(0.025, 0.81, 0.7); doorR.add(dh);
    api.scene.add(doorR);
    const standing = this.makeAgent(api, 'closet');
    standing.rotation.y = Math.PI / 3;
    standing.position.set(cx, 1.3, -3.82);
    api.scene.add(standing);
    const closetEgg = {
      c: [-4.1, 0.95, -3.5], s: [1.7, 1.9, 1.9],
      anim(t) { doorR.rotation.y = t * 1.75; }
    };
    plant(-4.35, 4.3);
    plant(4.4, -1.1);
    box(1.6, 0.02, 1.0, mat.mat, 2.6, 0, 4.35);
    return { eggs: [rackEgg, closetEgg] };
  },
  makeAgent(api, id) {
    const { THREE, M, part } = api;
    const g = new THREE.Group();
    const col = { recepcion: 0xf7c61b, arquitecto: 0x2f54d4, stack: 0xe0621f, cajon: 0x7c52c9, closet: 0x2fa86a }[id];
    const skin = M(col, { emissive: col, emissiveIntensity: 0.4 });
    const w = M(0xffffff), k = M(0x1b1d33);
    g.add(part(new THREE.SphereGeometry(0.3, 32, 20), skin, 0, 0, 0));
    const b = part(new THREE.ConeGeometry(0.27, 0.55, 24), skin, 0, -0.5, 0); b.rotation.x = Math.PI; g.add(b);
    [-0.1, 0.1].forEach((x) => { g.add(part(new THREE.SphereGeometry(0.075, 16, 12), w, x, 0.05, 0.25)); g.add(part(new THREE.SphereGeometry(0.038, 12, 10), k, x, 0.05, 0.31)); });
    const sm = part(new THREE.TorusGeometry(0.06, 0.014, 8, 16, Math.PI), k, 0, -0.05, 0.285); sm.rotation.z = Math.PI; g.add(sm);
    if (id === 'recepcion') {
    } else if (id === 'arquitecto') {
      const navy = M(0x232850);
      [-0.1, 0.1].forEach((x) => g.add(part(new THREE.TorusGeometry(0.085, 0.014, 8, 20), navy, x, 0.05, 0.27)));
      g.add(part(new THREE.BoxGeometry(0.06, 0.015, 0.015), navy, 0, 0.07, 0.28));
    } else if (id === 'stack') {
      g.add(part(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), k, 0, 0.41, 0));
      g.add(part(new THREE.SphereGeometry(0.055, 12, 10), M(0xf5a9c0), 0, 0.54, 0));
    }
    return g;
  }
};

  /* Oficina-B-MadMen */
T.madmen = {
  clear: 0x2b1d14, hemi: [0xfff0d6, 0x6b4226, 0.9], sun: [0xffe2b8, 0.8], ring: 0xc89a3c,
  labels: [],
  build(api) {
    const { THREE, scene, M, box, cyl, sphere, cone, torus, discZ } = api;
    const d = {
      wal: M(0x6b4226), wal2: M(0x7a4a2b), walD: M(0x4f2f1a), walL: M(0x8a5a36), cream: M(0xefe0bd), burnt: M(0xd1561f), must: M(0xdba52b),
      avo: M(0x7d8c3a), olive: M(0x5f6b2c), teal: M(0x2f8f8a), brass: M(0xc89a3c, { metalness: 0.5, roughness: 0.4 }), char: M(0x2a2622),
      white: M(0xfaf3e0), glass: M(0xd9c9a4), leather: M(0x5a3320), rust: M(0xa9441d), amber: M(0xd8892b, { roughness: 0.3 }),
      globe: M(0xfff3d0, { emissive: 0xfff3d0, emissiveIntensity: 0.7 }), win: M(0xcfe0e6, { emissive: 0xcfe0e6, emissiveIntensity: 0.25 })
    };
    const S = 5;
    const fl = [d.wal, d.wal2, d.walD];
    for (let i = 0; i < 20; i++) box(10, 0.2, 0.5, fl[i % 3], 0, -0.2, -4.75 + i * 0.5);
    box(0.2, 3.2, 10.2, d.walD, -S - 0.1, 0, -0.1);
    for (let i = 0; i < 20; i++) box(0.08, 3.2, 0.46, i % 2 ? d.wal : d.walL, -S + 0.04, 0, -4.75 + i * 0.5);
    box(10, 3.2, 0.2, d.cream, 0, 0, -S - 0.1);
    box(10, 0.22, 0.05, d.walD, 0, 0, -S + 0.025);
    box(4.6, 3.0, 0.05, d.teal, 2.3, 0, -S + 0.03);
    // ventana, cortinas y varilla
    box(2.9, 1.8, 0.08, d.brass, -1.6, 0.95, -S + 0.04);
    box(2.6, 1.5, 0.1, d.win, -1.6, 1.1, -S + 0.05);
    box(0.05, 1.5, 0.12, d.brass, -1.6, 1.1, -S + 0.06);
    box(2.6, 0.05, 0.12, d.brass, -1.6, 1.8, -S + 0.06);
    box(0.55, 2.2, 0.12, d.burnt, -3.2, 0.7, -S + 0.1);
    box(0.55, 2.2, 0.12, d.burnt, 0.0, 0.7, -S + 0.1);
    box(3.9, 0.05, 0.07, d.brass, -1.6, 2.9, -S + 0.1);
    // cuadro geométrico
    box(0.9, 1.25, 0.05, d.char, -4.25, 0.85, -S + 0.04);
    box(0.7, 1.05, 0.06, d.cream, -4.25, 0.95, -S + 0.05);
    box(0.5, 0.3, 0.07, d.must, -4.25, 1.4, -S + 0.06);
    discZ(0.16, 0.07, d.burnt, -4.25, 1.2, -S + 0.07);
    box(0.5, 0.18, 0.07, d.teal, -4.25, 1.0, -S + 0.06);
    // reloj sol
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.025, 0.025), d.brass);
      sp.rotation.z = a; sp.position.set(2.4 + Math.cos(a) * 0.36, 2.35 + Math.sin(a) * 0.36, -S + 0.09); scene.add(sp);
      sphere(0.035, d.brass, 2.4 + Math.cos(a) * 0.72, 2.35 + Math.sin(a) * 0.72, -S + 0.09);
    }
    discZ(0.17, 0.05, d.white, 2.4, 2.35, -S + 0.09);
    // pizarra enmarcada
    box(0.05, 1.3, 2.6, d.cream, -S + 0.1, 1.15, 0);
    box(0.07, 0.06, 2.72, d.brass, -S + 0.1, 2.45, 0);
    box(0.07, 0.06, 2.72, d.brass, -S + 0.1, 1.09, 0);
    box(0.07, 1.42, 0.06, d.brass, -S + 0.1, 1.09, -1.33);
    box(0.07, 1.42, 0.06, d.brass, -S + 0.1, 1.09, 1.33);
    [[-0.7, 1.95], [0.7, 1.95], [0, 1.45]].forEach(([zz, yy]) => box(0.02, 0.22, 0.42, d.char, -S + 0.14, yy, zz));
    box(0.02, 0.03, 1.0, d.char, -S + 0.14, 2.05, 0);
    box(0.02, 0.32, 0.03, d.char, -S + 0.14, 1.67, 0);
    // escritorios
    const desk = (x, z, len, depth, alongX, top, leg) => {
      const w = alongX ? len : depth, dd = alongX ? depth : len;
      box(w, 0.07, dd, top, x, 0.72, z);
      if (alongX) { box(0.07, 0.72, dd, leg, x - w / 2 + 0.05, 0, z); box(0.07, 0.72, dd, leg, x + w / 2 - 0.05, 0, z); }
      else { box(w, 0.72, 0.07, leg, x, 0, z - dd / 2 + 0.05); box(w, 0.72, 0.07, leg, x, 0, z + dd / 2 - 0.05); }
    };
    const glow = M(0xffc36b, { emissive: 0xffc36b, emissiveIntensity: 0.5 });
    desk(-3.35, 0, 2.0, 0.9, false, d.walL, d.walD);
    box(0.06, 0.5, 0.9, d.char, -3.65, 0.79, 0);
    box(0.02, 0.4, 0.78, glow, -3.62, 0.84, 0);
    cyl(0.05, 0.4, d.brass, -4.25, 0, 0);
    cyl(0.32, 0.1, d.leather, -4.25, 0.4, 0);
    desk(1.3, -3.4, 2.2, 0.9, true, d.walL, d.walD);
    [0.85, 1.75].forEach((x) => { box(0.75, 0.48, 0.06, d.char, x, 0.79, -3.7); box(0.65, 0.38, 0.02, glow, x, 0.84, -3.66); });
    cyl(0.1, 0.03, d.brass, 0.4, 0.79, -3.5);
    cyl(0.015, 0.35, d.brass, 0.4, 0.82, -3.5);
    cyl(0.05, 0.12, d.brass, 0.4, 1.1, -3.5, 0.14);
    box(0.28, 0.1, 0.22, d.burnt, 2.2, 0.79, -3.3);
    box(0.3, 0.05, 0.07, d.burnt, 2.2, 0.89, -3.3);
    cyl(0.05, 0.4, d.brass, 1.3, 0, -4.25);
    cyl(0.3, 0.1, d.leather, 1.3, 0.4, -4.25);
    // torre de música
    box(0.9, 2.3, 0.8, d.wal, 3.85, 0, -4.4);
    box(0.72, 0.55, 0.02, d.must, 3.85, 0.15, -3.99);
    box(0.72, 0.55, 0.02, d.must, 3.85, 0.85, -3.99);
    [0, 1, 2].forEach((i) => discZ(0.07, 0.03, d.brass, 3.6 + i * 0.25, 1.65, -3.98));
    box(0.5, 0.1, 0.02, d.cream, 3.85, 1.95, -3.99);
    cyl(0.3, 0.03, d.char, 3.85, 2.3, -4.4);
    cyl(0.25, 0.02, M(0x111111), 3.85, 2.33, -4.4);
    cyl(0.07, 0.03, d.burnt, 3.85, 2.35, -4.4);
    // mostrador
    box(2.6, 1.0, 0.5, d.wal, 2.6, 0, 2.3);
    box(2.6, 0.06, 0.7, d.cream, 2.6, 1.0, 2.35);
    box(2.6, 0.04, 0.02, d.brass, 2.6, 0.88, 2.56);
    for (let i = 0; i < 10; i++) box(0.04, 0.8, 0.02, d.walL, 1.45 + i * 0.25, 0.05, 2.56);
    cyl(0.07, 0.25, d.teal, 1.8, 1.06, 2.35, 0.1);
    sphere(0.1, d.must, 1.8, 1.4, 2.35);
    cyl(0.04, 0.4, d.brass, 2.6, 0, 1.55);
    cyl(0.3, 0.1, d.burnt, 2.6, 0.4, 1.55);
    box(1.6, 0.02, 1.0, d.must, 2.6, 0, 3.85);
    [0, 1, 2].forEach((i) => box(1.6, 0.025, 0.1, d.walD, 2.6, 0, 4.15 + i * 0.2));
    // sala, versión nueva: alfombra redonda, sofá curvo, mesa boomerang y lámpara trípode
    const mesh = (geo, m, x, y, z, rx, ry, rz) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx || 0, ry || 0, rz || 0); o.castShadow = true; o.receiveShadow = true; scene.add(o); return o; };
    // alfombra redonda de pelo largo en anillos crema, café oscuro y naranja quemado
    [[1.65, d.cream, 0.03], [1.42, M(0x3a2414), 0.035], [1.18, d.cream, 0.04], [0.85, d.burnt, 0.045], [0.5, d.cream, 0.05], [0.22, M(0x3a2414), 0.055]].forEach(([r, m, h]) => cyl(r, h, m, -0.9, 0, 1.45));
    // sofá de cuero coñac de líneas suaves: brazos redondos, cojines, respaldo con botones y rulo, patas cónicas
    const sofaC = M(0x8a4a24, { roughness: 0.45 }), sofaD = M(0x5a2e14, { roughness: 0.4 });
    box(2.4, 0.3, 0.8, sofaC, -0.9, 0.24, 2.85);
    [-1.7, -0.9, -0.1].forEach((x) => box(0.78, 0.1, 0.72, sofaC, x, 0.54, 2.82));
    box(2.4, 0.5, 0.16, sofaC, -0.9, 0.54, 3.2);
    mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.4, 24), sofaC, -0.9, 1.04, 3.2, 0, 0, Math.PI / 2);
    for (let i = 0; i < 6; i++) sphere(0.025, sofaD, -2.0 + i * 0.44, 0.82, 3.115);
    [-2.2, 0.4].forEach((x) => {
      mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.82, 24), sofaC, x, 0.5, 2.86, Math.PI / 2, 0, 0);
      box(0.34, 0.26, 0.82, sofaC, x, 0.24, 2.86);
      [2.55, 3.15].forEach((z) => mesh(new THREE.CylinderGeometry(0.035, 0.015, 0.26, 10), d.wal, x + (x < 0 ? -0.05 : 0.05), 0.12, z, 0, 0, x < 0 ? -0.2 : 0.2));
    });
    mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.13, 24), d.cream, -1.75, 0.82, 3.02, Math.PI / 2 - 0.25, 0, 0);
    mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.13, 24), d.must, -0.05, 0.81, 3.02, Math.PI / 2 - 0.25, 0, 0);
    // el gato sigue en el sofá
    sphere(0.22, d.char, -0.95, 0.78, 2.75, 1.5, 0.8, 0.9);
    sphere(0.13, d.char, -0.62, 0.88, 2.75);
    cone(0.05, 0.1, d.char, -0.6, 0.96, 2.69);
    cone(0.05, 0.1, d.char, -0.6, 0.96, 2.81);
    [0, 1, 2].forEach((i) => sphere(0.06, d.char, -1.3 - i * 0.08, 0.71 + i * 0.07, 2.75));
    // mesa de centro boomerang de nogal con patas de horquilla
    mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 40), d.walL, -0.65, 0.4, 1.5, 0, 0.35, 0).scale.set(1.35, 1, 0.7);
    mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 40), d.walL, -1.3, 0.4, 1.25, 0, -0.55, 0).scale.set(1.2, 1, 0.65);
    [[-1.7, 1.15], [-1.15, 1.05], [-0.15, 1.6], [-0.85, 1.75], [-0.9, 1.3]].forEach(([x, z]) => {
      mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8), d.char, x - 0.03, 0.2, z, 0, 0, 0.08);
      mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8), d.char, x + 0.03, 0.2, z, 0, 0, -0.08);
    });
    cyl(0.09, 0.03, d.amber, -1.25, 0.45, 1.25);
    cyl(0.035, 0.12, d.glass, -0.45, 0.45, 1.55);
    cyl(0.035, 0.12, d.glass, -0.32, 0.45, 1.45);
    box(0.3, 0.04, 0.22, d.cream, -1.55, 0.45, 1.05, 0.3);
    box(0.28, 0.02, 0.2, d.burnt, -1.55, 0.49, 1.05, 0.4);
    sphere(0.09, d.burnt, -0.8, 0.53, 1.45, 1, 1.3, 1);
    // lámpara de pie trípode de nogal con pantalla de tambor mostaza
    const lx = 0.95, lz = 3.2, top = new THREE.Vector3(lx, 1.25, lz), up = new THREE.Vector3(0, 1, 0);
    for (let k = 0; k < 3; k++) {
      const a = k * Math.PI * 2 / 3 + 0.4, bot = new THREE.Vector3(lx + Math.cos(a) * 0.32, 0, lz + Math.sin(a) * 0.32);
      const dir = top.clone().sub(bot), len = dir.length();
      const leg = mesh(new THREE.CylinderGeometry(0.018, 0.022, len, 10), d.walD, (top.x + bot.x) / 2, len / 2 * dir.normalize().y, (top.z + bot.z) / 2);
      leg.quaternion.setFromUnitVectors(up, dir);
    }
    mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.38, 32, 1, true), M(0xdba52b, { side: THREE.DoubleSide, emissive: 0xffb84a, emissiveIntensity: 0.35 }), lx, 1.42, lz);
    sphere(0.08, d.globe, lx, 1.36, lz);
    const lampL = new THREE.PointLight(0xffd59a, 0.8, 4, 2); lampL.position.set(lx, 1.35, lz); scene.add(lampL);
    // sillón y otomana
    box(0.8, 0.18, 0.8, d.leather, -3.6, 0.3, 3.4);
    box(0.15, 0.75, 0.8, d.leather, -3.95, 0.3, 3.4);
    box(0.8, 0.22, 0.12, d.leather, -3.6, 0.38, 3.0);
    box(0.8, 0.22, 0.12, d.leather, -3.6, 0.38, 3.8);
    [-3.9, -3.3].forEach((x) => [3.1, 3.7].forEach((z) => cyl(0.025, 0.3, d.brass, x, 0, z)));
    box(0.55, 0.28, 0.55, d.leather, -2.85, 0, 3.4);
    // biblioteca
    box(0.42, 1.9, 1.7, d.walL, -4.75, 0, -3.4);
    const bk = [d.burnt, d.must, d.teal, d.cream, d.olive];
    [[-4.0, 0.45], [-3.5, 0.45], [-2.95, 0.45], [-4.0, 1.25], [-3.3, 1.25]].forEach(([zz, yy], i) => box(0.3, 0.32 + (i % 2) * 0.08, 0.36, bk[i % 5], -4.72, yy, zz));
    box(0.08, 0.05, 1.7, d.brass, -4.72, 0.4, -3.4);
    box(0.08, 0.05, 1.7, d.brass, -4.72, 1.2, -3.4);
    cyl(0.12, 0.2, d.brass, -4.75, 1.9, -3.4, 0.14);
    sphere(0.14, d.cream, -4.75, 2.25, -3.4);
    // carrito de bar
    [-0.4, 0.4].forEach((x) => [0.2, 0.6].forEach((z) => cyl(0.02, 0.75, d.brass, 4.3 + x, 0, z)));
    box(0.9, 0.03, 0.5, d.glass, 4.3, 0.75, 0.4);
    box(0.9, 0.03, 0.5, d.glass, 4.3, 0.3, 0.4);
    cyl(0.06, 0.22, d.amber, 4.1, 0.78, 0.4, 0.08);
    sphere(0.04, d.brass, 4.1, 1.03, 0.4);
    cyl(0.1, 0.15, d.brass, 4.5, 0.78, 0.45, 0.12);
    cyl(0.05, 0.25, d.avo, 4.0, 0.33, 0.4);
    cyl(0.05, 0.25, d.teal, 4.2, 0.33, 0.4);
    // plantas
    const plant = (x, z) => {
      cyl(0.26, 0.5, d.teal, x, 0, z, 0.2);
      for (let k = 0; k < 6; k++) { const a = k * 1.05; sphere(0.3, k % 2 ? d.avo : d.olive, x + Math.cos(a) * 0.28, 0.9 + 0.12 * (k % 3), z + Math.sin(a) * 0.28, 1, 0.35, 1); }
      sphere(0.26, d.avo, x, 1.25, z, 1, 0.5, 1);
    };
    plant(-4.35, 4.3);
    plant(4.4, -2.9);
    return {};
  },
  makeAgent(api, id) {
    const { THREE, M, part } = api;
    const g = new THREE.Group();
    const skin = M(0xf1d9b5);
    const suit = { recepcion: 0x2f8f8a, arquitecto: 0x2a2622, stack: 0x5f6b2c }[id];
    const sm = M(suit), w = M(0xffffff), k = M(0x2a2622), brass = M(0xc89a3c, { metalness: 0.5, roughness: 0.4 }), burnt = M(0xd1561f);
    g.add(part(new THREE.SphereGeometry(0.3, 32, 20), skin, 0, 0, 0));
    const b = part(new THREE.ConeGeometry(0.27, 0.55, 24), sm, 0, -0.5, 0); b.rotation.x = Math.PI; g.add(b);
    [-0.1, 0.1].forEach((x) => { g.add(part(new THREE.SphereGeometry(0.07, 16, 12), w, x, 0, 0.25)); g.add(part(new THREE.SphereGeometry(0.035, 12, 10), k, x, 0, 0.31)); });
    const sl = part(new THREE.TorusGeometry(0.06, 0.016, 8, 16, Math.PI), id === 'recepcion' ? M(0xc0392b) : k, 0, -0.09, 0.28); sl.rotation.z = Math.PI; g.add(sl);
    if (id === 'recepcion') {
      const hair = M(0x4a2c17);
      g.add(part(new THREE.SphereGeometry(0.31, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.38), hair, 0, 0, 0));
      g.add(part(new THREE.SphereGeometry(0.13, 16, 12), hair, 0, 0.22, -0.22));
      const pearls = part(new THREE.TorusGeometry(0.26, 0.022, 8, 28), M(0xefe0bd), 0, -0.27, 0); pearls.rotation.x = Math.PI / 2; g.add(pearls);
    } else if (id === 'arquitecto') {
      g.add(part(new THREE.CylinderGeometry(0.38, 0.38, 0.03, 28), k, 0, 0.2, 0));
      g.add(part(new THREE.CylinderGeometry(0.2, 0.22, 0.22, 24), k, 0, 0.31, 0));
      g.add(part(new THREE.CylinderGeometry(0.225, 0.225, 0.05, 24), brass, 0, 0.24, 0));
      g.add(part(new THREE.BoxGeometry(0.16, 0.07, 0.05), burnt, 0, -0.26, 0.26));
    } else {
      [-0.1, 0.1].forEach((x) => g.add(part(new THREE.TorusGeometry(0.085, 0.014, 8, 20), brass, x, 0, 0.27)));
      g.add(part(new THREE.BoxGeometry(0.06, 0.015, 0.015), brass, 0, 0.02, 0.28));
      g.add(part(new THREE.SphereGeometry(0.31, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.33), k, 0, 0, 0));
      g.add(part(new THREE.BoxGeometry(0.16, 0.07, 0.05), M(0xdba52b), 0, -0.26, 0.26));
    }
    return g;
  }
};

  /* Oficina-F-Jersey */
T.sopranos = {
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

  /* Oficina-E-Orbital */
T.odisea = {
  clear: 0x050608, hemi: [0xffffff, 0x8a9099, 1.05], sun: [0xffffff, 0.55], ring: 0xd8232a,
  labels: [['núcleo de IA', [4.0, 3.0, -4.5]]],
  build(api) {
    const { THREE, scene, M, box, cyl, sphere, torus, discZ } = api;
    const K = kit(api), S = K.S;
    const glowM = (c, i) => M(c, { emissive: c, emissiveIntensity: i == null ? 0.8 : i });
    const d = {
      white: M(0xf2f2ef, { roughness: 0.5 }), panel: M(0xe4e5e3, { roughness: 0.5 }), grey: M(0xb9bcbf), dark: M(0x1b1c1f), black: M(0x060708),
      red: M(0xc8102e, { roughness: 0.45 }), chrome: M(0xd0d4d8, { metalness: 0.85, roughness: 0.22 }),
      floor: M(0xf6f6f3, { emissive: 0xffffff, emissiveIntensity: 0.3, roughness: 0.4 }), strip: glowM(0xffffff, 0.7),
      star: glowM(0xffffff, 1), planet: M(0x3d6fb5, { emissive: 0x1d3f75, emissiveIntensity: 0.5 }), cloud: M(0xe8eef5, { emissive: 0x8899aa, emissiveIntensity: 0.4 })
    };
    const blink = [];
    const screen = (c) => { const m = glowM(c, 0.8); blink.push(m); return m; };

    // piso de paneles iluminados y muros blancos con nervaduras
    K.tiles([d.floor], d.dark, 8);
    K.walls(d.white, d.white);
    for (let i = 0; i < 10; i++) {
      const x = -S + 0.5 + i;
      if (x < -2.8 || x > -0.4) box(0.07, 3.2, 0.08, d.panel, x, 0, -S + 0.04);
      box(0.08, 3.2, 0.07, d.panel, -S + 0.04, 0, -S + 0.5 + i);
    }
    box(10, 0.08, 0.06, d.strip, 0, 2.95, -S + 0.06);
    box(0.06, 0.08, 10, d.strip, -S + 0.06, 2.95, 0);
    box(10, 0.14, 0.08, d.dark, 0, 0, -S + 0.04);
    box(0.08, 0.14, 10, d.dark, -S + 0.04, 0, 0);

    // ojo de buey con estrellas y un planeta
    const wx = -1.6, wy = 1.65, wz = -4.86;
    discZ(1.05, 0.06, d.black, wx, wy, wz);
    torus(1.08, 0.09, d.grey, wx, wy, wz + 0.04);
    const r = K.rnd(9);
    for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 0.95; sphere(0.01 + r() * 0.012, d.star, wx + Math.cos(a) * rr, wy + Math.sin(a) * rr, wz + 0.035); }
    sphere(0.5, d.planet, wx + 0.32, wy - 0.33, wz + 0.04, 1, 1, 0.06);
    sphere(0.42, d.cloud, wx + 0.22, wy - 0.25, wz + 0.05, 1, 0.22, 0.05);

    // muro de pantallas (tablero del arquitecto)
    K.board(d.dark, d.grey, 2.6, 1.3, 1.15);
    [[1.25, -0.85, 0x5fb7ff], [1.25, 0, 0xffb000], [1.25, 0.85, 0x5fb7ff], [1.85, -0.85, 0xffb000], [1.85, 0, 0x5fb7ff], [1.85, 0.85, 0x7dffb0]].forEach(([y, z, c]) => {
      box(0.03, 0.5, 0.72, screen(c), -S + 0.12, y, z);
      for (let k = 0; k < 3; k++) box(0.01, 0.035, 0.25 + (k % 2) * 0.2, d.dark, -S + 0.14, y + 0.1 + k * 0.12, z - 0.12);
    });

    // consola del arquitecto
    K.desk(-3.35, 0, 2.0, 0.9, false, d.white, d.white);
    for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 8; c++) box(0.08, 0.03, 0.08, rr === 1 && c % 3 === 0 ? d.red : d.panel, -3.55 + rr * 0.11, 0.79, -0.38 + c * 0.11);
    box(0.06, 0.42, 0.8, d.dark, -2.97, 0.79, 0);
    box(0.02, 0.34, 0.7, screen(0x5fb7ff), -3.01, 0.83, 0);
    cyl(0.05, 0.42, d.white, -4.25, 0, 0, 0.25);
    sphere(0.32, d.red, -4.25, 0.5, 0, 1, 0.32, 1);

    // consola del stack con pantallas y pilotos
    box(2.6, 0.75, 0.8, d.white, 1.3, 0, -3.45);
    box(2.7, 0.06, 0.9, d.grey, 1.3, 0.75, -3.45);
    box(2.4, 0.42, 0.1, d.dark, 1.3, 0.81, -3.8);
    [0.55, 1.3, 2.05].forEach((x, i) => box(0.62, 0.3, 0.02, screen(i === 1 ? 0xffb000 : 0x5fb7ff), x, 0.86, -3.74));
    for (let i = 0; i < 12; i++) box(0.07, 0.035, 0.03, i % 3 ? d.grey : d.red, 0.2 + i * 0.2, 0.83, -3.0);
    cyl(0.05, 0.42, d.white, 1.3, 0, -4.25, 0.25);
    sphere(0.32, d.red, 1.3, 0.5, -4.25, 1, 0.32, 1);

    // recepción curva
    box(2.0, 1.0, 0.6, d.white, 2.6, 0, 2.3);
    cyl(0.3, 1.0, d.white, 1.6, 0, 2.3);
    cyl(0.3, 1.0, d.white, 3.6, 0, 2.3);
    box(2.0, 0.06, 0.64, d.grey, 2.6, 1.0, 2.3);
    cyl(0.32, 0.06, d.grey, 1.6, 1.0, 2.3);
    cyl(0.32, 0.06, d.grey, 3.6, 1.0, 2.3);
    box(2.0, 0.05, 0.02, d.red, 2.6, 0.72, 2.61);
    box(0.3, 0.06, 0.22, d.white, 3.1, 1.06, 2.3);
    box(0.26, 0.04, 0.06, d.red, 3.1, 1.12, 2.3);
    box(0.32, 0.22, 0.03, d.dark, 2.0, 1.06, 2.2);
    box(0.28, 0.18, 0.02, screen(0x7dffb0), 2.0, 1.08, 2.22);
    cyl(0.05, 0.42, d.white, 2.6, 0, 1.55, 0.25);
    sphere(0.32, d.red, 2.6, 0.5, 1.55, 1, 0.32, 1);

    // sala de espera: mesa blanca y sillones rojos bajos
    cyl(0.12, 0.34, d.white, -0.9, 0, 1.3, 0.35);
    cyl(0.7, 0.04, d.white, -0.9, 0.34, 1.3);
    [[-0.75, 1.2], [-0.95, 1.45]].forEach(([x, z]) => cyl(0.12, 0.02, d.chrome, x, 0.38, z));
    const lounge = (x, z, fx, fz) => {
      cyl(0.05, 0.14, d.chrome, x, 0, z, 0.22);
      sphere(0.5, d.red, x, 0.3, z, 1, 0.38, 1);
      K.add(new THREE.TorusGeometry(0.42, 0.11, 12, 32, Math.PI), d.red, x - fx * 0.3, 0.4, z - fz * 0.3, 0, Math.atan2(fx, fz), 0);
    };
    lounge(-2.45, 1.3, 1, 0);
    lounge(0.65, 1.3, -1, 0);
    lounge(-0.9, 2.75, 0, -1);

    // maqueta de rueda orbital girando
    cyl(0.18, 0.95, d.white, 4.2, 0, -2.6, 0.32);
    const tilt = new THREE.Group();
    tilt.position.set(4.2, 1.45, -2.6);
    tilt.rotation.set(-0.45, 0.6, 0);
    const spin = new THREE.Group();
    spin.add(new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 12, 48), d.white));
    for (let i = 0; i < 4; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.025, 0.025), d.grey); sp.rotation.z = i * Math.PI / 4; spin.add(sp); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16), d.chrome);
    hub.rotation.x = Math.PI / 2;
    spin.add(hub);
    spin.traverse((o) => { o.castShadow = true; });
    tilt.add(spin);
    scene.add(tilt);

    // núcleo de IA: dos racks con módulos de memoria translúcidos, retroiluminados
    const card = M(0xdff3ff, { transparent: true, opacity: 0.42, roughness: 0.08, emissive: 0x9fd4ff, emissiveIntensity: 0.3 });
    const doorGlass = M(0xe8f4ff, { transparent: true, opacity: 0.1, roughness: 0.02, depthWrite: false });
    const coreRows = [];
    [3.55, 4.5].forEach((cx, ci) => {
      box(0.9, 2.75, 0.05, d.dark, cx, 0, -4.9);
      [-0.43, 0.43].forEach((dx) => box(0.06, 2.75, 0.78, d.dark, cx + dx, 0, -4.55));
      box(0.92, 0.14, 0.8, d.dark, cx, 2.62, -4.55);
      box(0.92, 0.18, 0.8, d.dark, cx, 0, -4.55);
      box(0.8, 0.02, 0.02, d.red, cx, 2.66, -4.14);
      for (let r = 0; r < 7; r++) {
        const y = 0.3 + r * 0.32;
        box(0.8, 0.02, 0.66, d.black, cx, y - 0.02, -4.57);
        const rowM = M(0x8fd0ff, { emissive: 0x8fd0ff, emissiveIntensity: 0.6 });
        coreRows.push({ m: rowM, r, ci });
        K.noShadow(box(0.78, 0.24, 0.02, rowM, cx, y + 0.01, -4.86));
        for (let c = 0; c < 6; c++) {
          const out = ci === 0 && r === 3 && c === 2 ? 0.32 : 0;
          box(0.05, 0.25, 0.52, card, cx - 0.3 + c * 0.12, y, -4.58 + out);
          box(0.04, 0.03, 0.02, c % 3 ? d.grey : d.red, cx - 0.3 + c * 0.12, y + 0.2, -4.31 + out);
        }
      }
      K.noShadow(box(0.82, 2.42, 0.02, doorGlass, cx, 0.18, -4.15));
    });
    K.light(0x8fd0ff, 0.9, 4, 4.0, 1.4, -3.8);
    // consola de acceso al núcleo
    box(0.9, 0.85, 0.5, d.white, 4.0, 0, -3.45);
    K.add(new THREE.BoxGeometry(0.9, 0.04, 0.55), d.grey, 4.0, 0.88, -3.42, -0.35, 0, 0);
    box(0.7, 0.02, 0.3, screen(0x8fd0ff), 4.0, 0.88, -3.4);

    // presencia de la IA: un anillo de voz integrado en la puerta del rack; gira en reposo y habla en onda al abrir al agente stack
    const rcx = 4.025, rcy = 1.95, rcz = -4.11;
    api.discZ(0.38, 0.02, d.black, rcx, rcy, rcz);
    torus(0.38, 0.016, d.chrome, rcx, rcy, rcz + 0.012);
    const voice = M(0x1f7fe0, { emissive: 0x2f9bff, emissiveIntensity: 0.8 });
    const core = M(0x1f7fe0, { emissive: 0x2f9bff, emissiveIntensity: 0.4 });
    K.noShadow(torus(0.12, 0.012, core, rcx, rcy, rcz + 0.015));
    const bars = [];
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2;
      bars.push({ a, m: K.noShadow(K.add(new THREE.BoxGeometry(0.11, 0.026, 0.012), voice, rcx + Math.cos(a) * 0.245, rcy + Math.sin(a) * 0.245, rcz + 0.018, 0, 0, a)) });
    }
    const voiceLight = K.light(0x2f9bff, 0.5, 2.5, rcx, rcy, -3.6);

    // columna de luz en la esquina
    cyl(0.22, 3.0, d.white, -4.45, 0, 4.45);
    box(0.06, 2.6, 0.06, d.strip, -4.27, 0.2, 4.27);

    return {
      tick(t) {
        spin.rotation.z = t * 0.5;
        const talking = api.isActive('stack');
        bars.forEach((b, i) => {
          const glow = Math.pow(Math.max(0, Math.cos(b.a - t * 1.4)), 3);
          b.m.scale.x = talking
            ? 0.5 + 1.4 * Math.abs(Math.sin(t * 7 + i * 0.7) * Math.sin(t * 2.1 + i * 0.33))
            : 0.55 + 0.75 * glow;
        });
        voice.emissiveIntensity = talking ? 0.95 + Math.sin(t * 9) * 0.2 : 0.55 + 0.15 * Math.sin(t * 1.2);
        core.emissiveIntensity = talking ? 0.6 + 0.4 * Math.abs(Math.sin(t * 6)) : 0.3 + 0.15 * Math.sin(t * 1.2);
        voiceLight.intensity = talking ? 0.9 : 0.4 + 0.15 * Math.sin(t * 1.2);
        coreRows.forEach((o) => { o.m.emissiveIntensity = 0.35 + 0.9 * Math.max(0, Math.sin(t * 2.2 - o.r * 0.7 - o.ci * 1.4)); });
        blink.forEach((m, i) => { m.emissiveIntensity = 0.65 + Math.sin(t * 1.4 + i * 1.7) * 0.25; });
      }
    };
  },
  makeAgent(api, id) {
    const { THREE } = api;
    const F = figure;
    // astronautas con trajes de colores: casco de color abierto al frente, visor, anillo de cuello, panel de pecho y mochila
    const suits = {
      recepcion: { suit: 0xe8b100, skin: 0xc68e62, hair: 0x1b1c1f },
      arquitecto: { suit: 0xc8102e, skin: 0xf1d9b5, hair: 0x8a6a4a },
      stack: { suit: 0x2a5db0, skin: 0xe2bd96, hair: 0x3b2a1e }
    };
    const o = suits[id];
    const f = F(api, { body: o.suit, skin: o.skin });
    const shell = f.M(o.suit, { roughness: 0.45, side: THREE.DoubleSide });
    const ring = f.M(0xd0d4d8, { metalness: 0.85, roughness: 0.22 });
    f.hair(f.M(o.hair), 0.36);
    f.add(new THREE.SphereGeometry(0.41, 32, 16, Math.PI / 2 + 0.95, Math.PI * 2 - 1.9, 0, Math.PI * 0.72), shell, 0, 0.02, -0.02);
    f.add(new THREE.SphereGeometry(0.4, 32, 20), f.M(0xcfe6ff, { transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.2, depthWrite: false }), 0, 0.02, 0.01);
    f.add(new THREE.TorusGeometry(0.33, 0.045, 10, 36), ring, 0, -0.26, 0, Math.PI / 2, 0, 0);
    f.chest(f.M(0xf2f2ef), 0.2, 0.13, -0.38);
    const leds = [0xffb000, 0x7dffb0, 0x5fb7ff];
    leds.forEach((c, i) => f.add(new THREE.BoxGeometry(0.03, 0.03, 0.02), f.M(c, { emissive: c, emissiveIntensity: 0.9 }), -0.05 + i * 0.05, -0.37, f.r(-0.37) + 0.02));
    f.add(new THREE.BoxGeometry(0.34, 0.36, 0.14), f.M(0xe4e5e3), 0, -0.4, -0.24);
    f.add(new THREE.CylinderGeometry(0.035, 0.035, 0.2, 12), ring, 0.12, -0.12, -0.3);
    return f.g;
  }
};


export const officeThemes = T;
