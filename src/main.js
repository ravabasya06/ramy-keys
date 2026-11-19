/**
 * Titik masuk aplikasi.
 * Router hash sederhana: "#/" untuk katalog dan "#/dashboard" untuk dashboard.
 */

import './style.css';
import { loadProducts, saveProducts } from './store.js';
import { renderApp } from './ui.js';

const root = document.querySelector('#app');
const initialState = loadProducts();
let products = initialState.products;
let notice = initialState.notice
  ? { message: initialState.notice, type: 'error' }
  : null;

function currentPage() {
  return window.location.hash === '#/dashboard' ? 'dashboard' : 'catalog';
}

function render(nextNotice) {
  if (nextNotice !== undefined) notice = nextNotice;

  renderApp(root, {
    page: currentPage(),
    products,
    notice,
    onDismissNotice() {
      notice = null;
      render();
    },
    onProductsChange(nextProducts) {
      const result = saveProducts(nextProducts);
      if (result.ok) products = nextProducts;
      return result;
    },
    onRefresh: render,
  });
}

// Abaikan hash yang bukan rute halaman (mis. "#main" dari skip link atau
// "#katalog" dari CTA hero) agar fokus/scroll tidak memicu render ulang.
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (hash === '' || hash.startsWith('#/')) render();
});

render();
