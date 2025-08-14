// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import './index.css';

// --- ADD THESE TWO LINES FOR DEBUGGING ---
const apiUrl = import.meta.env.VITE_API_BASE_URL;
alert(`VITE_API_BASE_URL is: ${apiUrl}`);
// --- END OF DEBUGGING LINES ---

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// --- MODIFICATION START ---

// Only register the service worker in the production environment
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered in production: ', registration.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed: ', err);
      });
  });
}
