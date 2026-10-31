// Escena "Original con más vida" del artefacto "Landing · oficina": la oficina original, con los mismos muebles,
// en tonos más vivos y cálidos, personajes con cara y dos huevos de pascua (cajón del rack y closet).
// Los colores son de la maqueta 3D (excepción aprobada, ver design-system/INTEGRACION.md), no de la UI.

// Dónde está cada agente, su zona de clic y a qué punto se acerca la cámara al abrirlo.
const spots = {
  recepcion: { pos: [2.6, 1.3, 1.55], hit: { c: [2.6, 1.0, 1.95], s: [3.0, 2.0, 1.6] }, focus: [2.6, 0.9, 1.9] },
  arquitecto: { pos: [-4.25, 1.3, 0], hit: { c: [-3.9, 1.0, 0], s: [1.9, 2.0, 2.8] }, focus: [-3.8, 1.0, 0] },
  stack: { pos: [1.3, 1.3, -4.25], hit: { c: [1.6, 1.0, -3.9], s: [3.2, 2.0, 1.9] }, focus: [1.8, 1.0, -3.8] },
};

function makeAgent(api, id) {
  const { THREE, M, part } = api;
  const g = new THREE.Group();
  const col = { recepcion: 0xf7c61b, arquitecto: 0x2f54d4, stack: 0xe0621f, cajon: 0x7c52c9, closet: 0x2fa86a }[id];
  const skin = M(col, { emissive: col, emissiveIntensity: 0.4 });
  const w = M(0xffffff), k = M(0x1b1d33);
  g.add(part(new THREE.SphereGeometry(0.3, 32, 20), skin, 0, 0, 0));
  const b = part(new THREE.ConeGeometry(0.27, 0.55, 24), skin, 0, -0.5, 0); b.rotation.x = Math.PI; g.add(b);
  [-0.1, 0.1].forEach((x) => { g.add(part(new THREE.SphereGeometry(0.075, 16, 12), w, x, 0.05, 0.25)); g.add(part(new THREE.SphereGeometry(0.038, 12, 10), k, x, 0.05, 0.31)); });
  const sm = part(new THREE.TorusGeometry(0.06, 0.014, 8, 16, Math.PI), k, 0, -0.05, 0.285); sm.rotation.z = Math.PI; g.add(sm);
  if (id === 'arquitecto') {
    // Lentes.
    const navy = M(0x232850);
    [-0.1, 0.1].forEach((x) => g.add(part(new THREE.TorusGeometry(0.085, 0.014, 8, 20), navy, x, 0.05, 0.27)));
    g.add(part(new THREE.BoxGeometry(0.06, 0.015, 0.015), navy, 0, 0.07, 0.28));
  } else if (id === 'stack') {
    // Antena.
    g.add(part(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), k, 0, 0.41, 0));
    g.add(part(new THREE.SphereGeometry(0.055, 12, 10), M(0xf5a9c0), 0, 0.54, 0));
  }
  return g;
}

function build(api) {
  const { M, box, cyl, sphere, torus } = api;
  const mat = {
    floor: M(0xffffff), wall: M(0xffffff), furn: M(0x5e657a), furn2: M(0x2f3a66), dark: M(0x2b3358), white: M(0xffffff),
    glass: M(0xcfe8f2), rug: M(0xf2dcc0), mat: M(0xe8c9a0), line: M(0x4a4d57),
    slate: M(0x2f6fe0), moss: M(0x2fa05a), brown: M(0xc46a2c), tealD: M(0x1f8a96), wine: M(0xc2385a), aub: M(0x8a4fc0), indigo: M(0x4a58c8),
  };
  const S = 5;
  // Sol más bajo: sombras más largas y legibles sobre piso y paredes blancas.
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

  // Habitación en corte: piso y dos muros.
  box(10, 0.2, 10, mat.floor, 0, -0.2, 0);
  box(0.2, 3.2, 10.2, mat.wall, -S - 0.1, 0, -0.1);
  box(10, 3.2, 0.2, mat.wall, 0, 0, -S - 0.1);
  // Zócalos: marcan dónde termina la pared y empieza el piso (la pared izquierda se corta donde está el closet).
  const baseb = M(0xc9c9c4);
  box(10, 0.16, 0.05, baseb, 0, 0, -S + 0.025);
  box(0.05, 0.16, 0.73, baseb, -S + 0.025, 0, -4.635);
  box(0.05, 0.16, 7.53, baseb, -S + 0.025, 0, 1.235);
  box(2.6, 1.5, 0.06, mat.glass, -1.6, 1.2, -S + 0.02);
  box(0.06, 1.5, 0.08, mat.white, -1.6, 1.2, -S + 0.05);

  // Estación del arquitecto: escritorio y pizarra.
  desk(-3.35, 0, 2.0, 0.9, false, mat.slate);
  box(0.06, 0.5, 0.9, mat.dark, -3.65, 0.79, 0);
  box(0.05, 1.3, 2.6, mat.white, -S + 0.03, 1.15, 0);
  [[-0.7, 1.95], [0.7, 1.95], [0, 1.45]].forEach(([zz, yy]) => box(0.02, 0.22, 0.42, mat.line, -S + 0.07, yy, zz));
  box(0.02, 0.03, 1.0, mat.line, -S + 0.07, 2.05, 0);
  box(0.02, 0.32, 0.03, mat.line, -S + 0.07, 1.67, 0);
  cyl(0.28, 0.45, M(0x17171c), -4.25, 0, 0);

  // Estación de stack: escritorio con dos pantallas y rack.
  desk(1.3, -3.4, 2.2, 0.9, true, mat.moss);
  box(0.75, 0.48, 0.06, mat.dark, 0.85, 0.79, -3.7);
  box(0.75, 0.48, 0.06, mat.dark, 1.75, 0.79, -3.7);
  cyl(0.28, 0.45, M(0x17171c), 1.3, 0, -4.25);
  box(0.9, 2.3, 0.8, M(0x34303a), 3.85, 0, -4.4);
  const rackF = M(0x3f3a45);
  [0.84, 1.6].forEach((y) => { box(0.78, 0.68, 0.03, rackF, 3.85, y, -3.985); box(0.4, 0.04, 0.03, silver, 3.85, y + 0.5, -3.955); });

  // Recepción.
  box(2.6, 1.0, 0.5, mat.furn2, 2.6, 0, 2.3);
  box(2.6, 0.06, 0.7, mat.aub, 2.6, 1.0, 2.35);
  cyl(0.28, 0.45, M(0x17171c), 2.6, 0, 1.55);

  // Sala de espera: alfombra en capas, mesa tulipán, lámpara de arco y sofá.
  box(3.8, 0.04, 2.7, M(0xa9441d), -0.9, 0, 1.3);
  box(3.4, 0.045, 2.3, M(0xefe0bd), -0.9, 0, 1.3);
  box(3.0, 0.05, 1.9, M(0xd1561f), -0.9, 0, 1.3);
  box(2.0, 0.055, 1.1, M(0xdba52b), -0.9, 0, 1.3);
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

  // Huevo 1: el último cajón del rack se abre y sale un agente acostado mirando hacia arriba.
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
  const lying = makeAgent(api, 'cajon');
  lying.rotation.x = -Math.PI / 2;
  const hidden = new T.Group();
  hidden.add(lying);
  hidden.rotation.y = Math.PI;
  hidden.position.set(0, 0.44, -0.3);
  dg.add(hidden);
  // El cajón cerrado queda dentro del rack: se recorta lo que asoma por detrás.
  const clipBack = new T.Plane(new T.Vector3(0, 0, 1), 4.78);
  dg.traverse((o) => { if (o.material) o.material.clippingPlanes = [clipBack]; });
  dg.position.set(3.85, 0, -3.97);
  api.scene.add(dg);
  const rackEgg = {
    c: [3.85, 0.43, -3.6], s: [0.9, 0.74, 1.6],
    anim(t) { dg.position.z = -3.97 + t * 0.95; },
  };

  // Huevo 2: closet de la esquina; la puerta derecha se abre y hay un agente parado.
  const cx = -4.62, cmat = mat.tealD, cin = M(0xf4f1ea);
  box(0.04, 1.9, 1.7, cin, -4.96, 0, -3.4);
  box(0.72, 1.9, 0.04, cmat, cx, 0, -4.23);
  box(0.72, 1.9, 0.04, cmat, cx, 0, -2.57);
  box(0.72, 0.04, 1.7, cmat, cx, 1.86, -3.4);
  box(0.72, 0.04, 1.7, cin, cx, 0, -3.4);
  box(0.03, 1.82, 0.8, cmat, -4.275, 0.04, -2.99);
  box(0.04, 0.45, 0.04, silver, -4.25, 0.85, -3.29);
  const doorR = new T.Group();
  doorR.position.set(-4.275, 0.04, -4.21);
  const dl = new T.Mesh(new T.BoxGeometry(0.03, 1.82, 0.8), cmat);
  dl.position.set(0, 0.91, 0.4); dl.castShadow = true; dl.receiveShadow = true; doorR.add(dl);
  const dh = new T.Mesh(new T.BoxGeometry(0.04, 0.45, 0.04), silver);
  dh.position.set(0.025, 0.81, 0.7); doorR.add(dh);
  api.scene.add(doorR);
  const standing = makeAgent(api, 'closet');
  standing.rotation.y = Math.PI / 3;
  standing.position.set(cx, 1.3, -3.82);
  api.scene.add(standing);
  const closetEgg = {
    c: [-4.1, 0.95, -3.5], s: [1.7, 1.9, 1.9],
    anim(t) { doorR.rotation.y = t * 1.75; },
  };

  plant(-4.35, 4.3);
  plant(4.4, -1.1);
  box(1.6, 0.02, 1.0, mat.mat, 2.6, 0, 4.35);
  return { eggs: [rackEgg, closetEgg] };
}

export const officeScene = {
  clear: 0xfbfbf9, hemi: [0xffffff, 0xffffff, 0.72], sun: [0xffffff, 0.4], ring: 0x0e0f12,
  labels: [],
  spots, build, makeAgent,
};
