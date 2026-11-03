import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { forcePerfTier, parsePerfParam } from './lib/perfTier';
import './styles/index.css';

// `?perf=full|lite|min` fija un nivel de rendimiento para revisarlo a mano (sin subidas automáticas).
const forced = parsePerfParam(window.location.search);
if (forced !== null) forcePerfTier(forced);

// Dos páginas en un mismo bundle: el landing en / y "Visita mi oficina" en /oficina/.
// Cada una se descarga aparte, así el landing no carga la oficina ni la oficina el hero.
const isOffice = /^\/oficina\/?$/.test(window.location.pathname);
const load = isOffice
  ? import('./components/pages/OfficePage').then((m) => m.OfficePage)
  : import('./components/pages/HomePage').then((m) => m.HomePage);

load.then((Page) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Page />
    </StrictMode>
  );
});
