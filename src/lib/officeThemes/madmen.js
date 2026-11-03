// Oficina "madmen" del artefacto "Oficina · cambio de serie" (copiada de su artboard, sin cambios de diseño).
// Mad Men: agencia de publicidad de los años 60 (nogal, latón, mostaza y verde oliva).
// Los colores son de la maqueta 3D (excepción aprobada, ver design-system/INTEGRACION.md), no de la UI.

export const madmenScene = {
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
