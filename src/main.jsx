import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomePage } from './components/pages/HomePage';
import { forcePerfTier, parsePerfParam } from './lib/perfTier';
import './styles/index.css';

// `?perf=full|lite|min` fija un nivel de rendimiento para revisarlo a mano (sin subidas automáticas).
const forced = parsePerfParam(window.location.search);
if (forced !== null) forcePerfTier(forced);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomePage />
  </StrictMode>
);
