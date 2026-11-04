import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { caseSlugs } from './src/content/projects.js';

// "Visita mi oficina" vive en /oficina/ y cada proyecto en /proyectos/<slug>/: se copia el index.html del build a
// cada ruta (dist/oficina/index.html, dist/proyectos/<slug>/index.html) para que Amplify la sirva como un archivo,
// sin depender de reglas de reescritura. main.jsx elige la página por la ruta.
const ROUTES = ['oficina', ...caseSlugs.map((slug) => `proyectos/${slug}`)];
const staticRoutes = () => ({
  name: 'static-routes',
  apply: 'build',
  closeBundle() {
    const out = resolve(import.meta.dirname, 'dist');
    for (const route of ROUTES) {
      mkdirSync(resolve(out, route), { recursive: true });
      copyFileSync(resolve(out, 'index.html'), resolve(out, route, 'index.html'));
    }
  },
});

export default defineConfig({
  plugins: [react(), staticRoutes()],
});
