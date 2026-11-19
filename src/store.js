/**
 * Lapisan penyimpanan produk.
 *
 * Kontrak:
 * - loadProducts() selalu mengembalikan array produk (salinan baru).
 * - saveProducts(products) mengembalikan { ok: true } atau { ok: false, error }.
 * - summarize(products) menghitung angka turunan tanpa mengubah masukan.
 */

import { PRODUCTS, SCHEMA_VERSION, STORAGE_KEY } from './products.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      saveProducts(PRODUCTS);
      return clone(PRODUCTS);
    }

    const parsed = JSON.parse(raw);
    const isValid =
      parsed &&
      parsed.version === SCHEMA_VERSION &&
      Array.isArray(parsed.products);

    if (!isValid) {
      saveProducts(PRODUCTS);
      return clone(PRODUCTS);
    }

    return clone(parsed.products);
  } catch {
    // Storage tidak tersedia atau isinya rusak: tetap jalankan aplikasi
    // dengan data contoh di memori.
    return clone(PRODUCTS);
  }
}

export function saveProducts(products) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SCHEMA_VERSION, products }),
    );
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function summarize(products) {
  return products.reduce(
    (result, product) => {
      result.totalProducts += 1;
      result.totalStock += product.stok;
      if (product.stok === 0) result.outOfStock += 1;
      return result;
    },
    { totalProducts: 0, totalStock: 0, outOfStock: 0 },
  );
}
