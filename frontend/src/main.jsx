import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ClaimFormPage from './pages/ClaimFormPage';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClaimFormPage />
  </StrictMode>
);
