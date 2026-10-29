import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomePage } from './components/pages/HomePage';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomePage />
  </StrictMode>
);
