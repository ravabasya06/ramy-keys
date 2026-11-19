/**
 * Penyimpanan produk berbasis array JSON pada localStorage.
 * Data rusak dipulihkan ke produk contoh dan disertai pemberitahuan.
 */

import { PRODUCTS, STORAGE_KEY, validateProduct } from './products.js';

const CORRUPT_DATA_NOTICE = 'Data tersimpan rusak, data contoh dimuat ulang.';
export const WISHLIST_STORAGE_KEY = 'ramykeys:wishlist:v1';
export const COMPARISON_STORAGE_KEY = 'ramykeys:comparison:v1';

function cloneProducts(products) {
  return products.map((product) => ({ ...product }));
}

function normalizeProducts(products) {
  return products.map((product) => ({
    id: product.id,
    nama: product.nama,
    kategori: product.kategori,
    harga: product.harga,
    stok: product.stok,
    deskripsi: product.deskripsi ?? '',
    imageUrl: product.imageUrl ?? '',
    unggulan: product.unggulan,
  }));
}

export function loadProductIdList(key, validProductIds) {
  let raw;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return {
      ids: [],
      notice: 'Daftar produk tersimpan tidak dapat dibaca dari browser.',
    };
  }

  if (raw === null) return { ids: [], notice: null };

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return recoverProductIdList(key, 'Daftar produk tersimpan rusak.');
  }

  if (
    !Array.isArray(parsed) ||
    parsed.some((id) => typeof id !== 'string' || id.trim().length === 0)
  ) {
    return recoverProductIdList(key, 'Daftar produk tersimpan rusak.');
  }

  const ids = [...new Set(parsed)].filter((id) => validProductIds.has(id));
  return { ids, notice: null };
}

function recoverProductIdList(key, notice) {
  const result = saveProductIdList(key, []);
  return {
    ids: [],
    notice: result.ok ? `${notice} Daftar dikosongkan.` : `${notice} Gagal memulihkan daftar.`,
  };
}

export function saveProductIdList(key, ids) {
  if (
    !Array.isArray(ids) ||
    ids.some((id) => typeof id !== 'string' || id.trim().length === 0)
  ) {
    return { ok: false, error: new TypeError('Daftar harus berisi ID produk yang valid.') };
  }

  try {
    localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function validateProducts(products) {
  if (!Array.isArray(products)) {
    return { valid: false, error: 'JSON harus berisi array produk.' };
  }

  const ids = new Set();
  for (const [index, product] of products.entries()) {
    const hasValidShape =
      product !== null &&
      typeof product === 'object' &&
      !Array.isArray(product) &&
      typeof product.id === 'string' &&
      product.id.trim().length > 0 &&
      typeof product.nama === 'string' &&
      typeof product.kategori === 'string' &&
      typeof product.harga === 'number' &&
      typeof product.stok === 'number' &&
      (!Object.prototype.hasOwnProperty.call(product, 'deskripsi') ||
        typeof product.deskripsi === 'string') &&
      (!Object.prototype.hasOwnProperty.call(product, 'imageUrl') ||
        typeof product.imageUrl === 'string') &&
      typeof product.unggulan === 'boolean';

    if (!hasValidShape) {
      return {
        valid: false,
        error: `Struktur produk ke-${index + 1} tidak valid.`,
      };
    }

    if (ids.has(product.id)) {
      return {
        valid: false,
        error: `ID produk ke-${index + 1} terduplikasi.`,
      };
    }
    ids.add(product.id);

    const validation = validateProduct(product);
    if (!validation.valid) {
      return {
        valid: false,
        error: `Data produk ke-${index + 1} tidak valid.`,
      };
    }
  }

  return { valid: true, error: null };
}

function recoverProducts(notice) {
  const products = cloneProducts(PRODUCTS);
  const result = saveProducts(products);

  return {
    products,
    notice: result.ok
      ? notice
      : `${notice} Gagal menyimpan pemulihan ke browser.`,
  };
}

export function loadProducts() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return recoverProducts(
      'Penyimpanan browser tidak dapat dibaca. Data contoh dimuat.',
    );
  }

  if (raw === null) {
    const products = cloneProducts(PRODUCTS);
    const result = saveProducts(products);
    return {
      products,
      notice: result.ok
        ? null
        : 'Gagal menyimpan data contoh ke browser. Perubahan tidak akan bertahan.',
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return recoverProducts(CORRUPT_DATA_NOTICE);
  }

  const validation = validateProducts(parsed);
  if (!validation.valid) {
    return recoverProducts(CORRUPT_DATA_NOTICE);
  }

  return { products: normalizeProducts(parsed), notice: null };
}

export function saveProducts(products) {
  const validation = validateProducts(products);
  if (!validation.valid) {
    return { ok: false, error: new TypeError(validation.error) };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProducts(products)));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function parseProductsJson(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'File JSON tidak valid.' };
  }

  const validation = validateProducts(parsed);
  if (!validation.valid) {
    return { ok: false, error: validation.error };
  }

  return { ok: true, products: normalizeProducts(parsed) };
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
