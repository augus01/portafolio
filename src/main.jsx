import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomePage } from './components/pages/HomePage';
import { parsePerfParam, raisePerfTier } from './lib/perfTier';
import './styles/index.css';

// `?perf=lite|min` fuerza un nivel de rendimiento para revisarlo a mano.
const forced = parsePerfParam(window.location.search);
if (forced) raisePerfTier(forced);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomePage />
  </StrictMode>
);
