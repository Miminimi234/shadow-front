import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import favicon from './assets/shadowlogo.png';
import './shadow-theme.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Ensure the site uses the project's shadow logo as the favicon.
// We set this at runtime so the image from `src/assets` (handled by webpack)
// is used and included in the built bundle without modifying `public/`.
try {
  const head = document.getElementsByTagName('head')[0];
  let icon = head.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
  if (!icon) {
    icon = document.createElement('link');
    icon.rel = 'icon';
    head.appendChild(icon);
  }
  icon.type = 'image/png';
  icon.href = favicon as string;
} catch (e) {
  // No-op on failure; app still works without favicon.
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
