/**
 * Titik masuk aplikasi.
 * Router hash sederhana: "#/" untuk katalog dan "#/dashboard" untuk dashboard.
 */

import './style.css';
import { loadProducts } from './store.js';
import { renderApp } from './ui.js';

const root = document.querySelector('#app');

function currentPage() {
  return window.location.hash === '#/dashboard' ? 'dashboard' : 'catalog';
}

function render() {
  renderApp(root, {
    page: currentPage(),
    products: loadProducts(),
  });
}

// Abaikan hash yang bukan rute halaman (mis. "#main" dari skip link atau
// "#katalog" dari CTA hero) agar fokus/scroll tidak memicu render ulang.
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (hash === '' || hash.startsWith('#/')) render();
});

render();
