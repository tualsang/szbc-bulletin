import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// On iOS Safari the keyboard sometimes covers the focused input. Scroll it
// into the middle of the viewport after the keyboard animation starts.
document.addEventListener('focusin', (e) => {
  const t = e.target as HTMLElement | null;
  if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) {
    window.setTimeout(() => {
      t.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 200);
  }
});
