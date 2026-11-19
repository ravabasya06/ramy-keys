/**
 * Titik masuk aplikasi.
 * Router hash untuk katalog, detail, halaman informasi, koleksi, dan dashboard.
 */

import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';
import {
  COMPARISON_STORAGE_KEY,
  loadProductIdList,
  loadProducts,
  saveProductIdList,
  saveProducts,
  WISHLIST_STORAGE_KEY,
} from './store.js';
import { renderApp } from './ui.js';

const root = document.querySelector('#app');
const initialState = loadProducts();
let products = initialState.products;
const productIds = new Set(products.map((product) => product.id));
const initialWishlist = loadProductIdList(WISHLIST_STORAGE_KEY, productIds);
const initialComparison = loadProductIdList(COMPARISON_STORAGE_KEY, productIds);
let wishlistIds = initialWishlist.ids;
let comparisonIds = initialComparison.ids;
let setupIds = [];
let catalogFilters = {
  search: '',
  category: 'all',
  stock: 'all',
  sort: 'default',
  minPrice: '',
  maxPrice: '',
  featured: false,
};
const initialNotices = [
  initialState.notice,
  initialWishlist.notice,
  initialComparison.notice,
].filter(Boolean);
let notice = initialNotices.length
  ? { message: initialNotices.join(' '), type: 'error' }
  : null;

const STATIC_ROUTES = new Map([
  ['#/dashboard', 'dashboard'],
  ['#/panduan', 'guide'],
  ['#/faq', 'faq'],
  ['#/tentang', 'about'],
  ['#/wishlist', 'wishlist'],
  ['#/perbandingan', 'comparison'],
  ['#/setup', 'setup'],
]);

function currentRoute() {
  const hash = window.location.hash;
  const staticPage = STATIC_ROUTES.get(hash);
  if (staticPage) return { page: staticPage };

  const productMatch = hash.match(/^#\/produk\/(.+)$/);
  if (productMatch) {
    try {
      return { page: 'product', productId: decodeURIComponent(productMatch[1]) };
    } catch {
      return { page: 'product', productId: '' };
    }
  }

  return { page: 'catalog' };
}

function render(nextNotice) {
  if (nextNotice !== undefined) notice = nextNotice;

  renderApp(root, {
    ...currentRoute(),
    products,
    wishlistIds,
    comparisonIds,
    setupIds,
    catalogFilters,
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
    onWishlistChange(nextIds) {
      const result = saveProductIdList(WISHLIST_STORAGE_KEY, nextIds);
      if (result.ok) wishlistIds = nextIds;
      return result;
    },
    onComparisonChange(nextIds) {
      const result = saveProductIdList(COMPARISON_STORAGE_KEY, nextIds);
      if (result.ok) comparisonIds = nextIds;
      return result;
    },
    onSetupChange(nextIds) {
      setupIds = nextIds;
    },
    onCatalogFiltersChange(nextFilters) {
      catalogFilters = { ...nextFilters };
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
