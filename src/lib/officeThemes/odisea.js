// Oficina "odisea" del artefacto "Oficina · cambio de serie" (copiada de su artboard, sin cambios de diseño).
// 2001 Odisea: estación orbital de 1968 (blanco, rojo y un núcleo de IA con anillo de voz).
// Los colores son de la maqueta 3D (excepción aprobada, ver design-system/INTEGRACION.md), no de la UI.
import { kit, figure } from '../officeKit';

export const odiseaScene = {
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
