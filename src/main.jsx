import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { forcePerfTier, parsePerfParam } from './lib/perfTier';
import './styles/index.css';

// `?perf=full|lite|min` fija un nivel de rendimiento para revisarlo a mano (sin subidas automáticas).
const forced = parsePerfParam(window.location.search);
if (forced !== null) forcePerfTier(forced);

// Varias páginas en un mismo bundle: el landing en /, "Visita mi oficina" en /oficina/ y la página de cada
// proyecto en /proyectos/<slug>/. Cada una se descarga aparte, así el landing no carga la oficina ni los proyectos.
const path = window.location.pathname;
const caseSlug = (path.match(/^\/proyectos\/([a-z0-9-]+)\/?$/) || [])[1];
const load = /^\/oficina\/?$/.test(path)
  ? import('./components/pages/OfficePage').then((m) => m.OfficePage)
  : caseSlug
    ? import('./components/pages/ProjectPage').then((m) => m.ProjectPage)
    : import('./components/pages/HomePage').then((m) => m.HomePage);

load.then((Page) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Page slug={caseSlug} />
    </StrictMode>
  );
});
