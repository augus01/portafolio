import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// "Visita mi oficina" vive en /oficina/: se copia el index.html del build a dist/oficina/index.html para que
// Amplify sirva esa ruta como un archivo, sin depender de reglas de reescritura. main.jsx elige la página por la ruta.
const officeRoute = () => ({
  name: 'office-route',
  apply: 'build',
  closeBundle() {
    const out = resolve(__dirname, 'dist');
    mkdirSync(resolve(out, 'oficina'), { recursive: true });
    copyFileSync(resolve(out, 'index.html'), resolve(out, 'oficina', 'index.html'));
  },
});

export default defineConfig({
  plugins: [react(), officeRoute()],
});
