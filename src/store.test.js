import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PRODUCTS, STORAGE_KEY } from './products.js';
import {
  loadProductIdList,
  loadProducts,
  parseProductsJson,
  saveProductIdList,
  saveProducts,
  validateProducts,
  WISHLIST_STORAGE_KEY,
} from './store.js';

let stored;

beforeEach(() => {
  stored = new Map();
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key) => (stored.has(key) ? stored.get(key) : null)),
    setItem: vi.fn((key, value) => stored.set(key, String(value))),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('localStorage product parser', () => {
  it('seeds missing storage and writes a raw product array at the configured key', () => {
    const result = loadProducts();

    expect(result.products).toHaveLength(8);
    expect(result.notice).toBeNull();
    expect(JSON.parse(stored.get(STORAGE_KEY))).toEqual(PRODUCTS);
    expect(stored.get(STORAGE_KEY)).toMatch(/^\[/);
  });

  it('loads a valid array and normalizes optional fields', () => {
    const product = { ...PRODUCTS[0] };
    delete product.deskripsi;
    delete product.imageUrl;
    stored.set(STORAGE_KEY, JSON.stringify([product]));

    const result = loadProducts();

    expect(result.notice).toBeNull();
    expect(result.products[0].deskripsi).toBe('');
    expect(result.products[0].imageUrl).toBe('');
  });

  it.each([
    '{broken',
    JSON.stringify({ version: 1, products: PRODUCTS }),
    JSON.stringify([{ ...PRODUCTS[0], stok: '6' }]),
  ])('recovers sample products and shows notice for invalid storage', (raw) => {
    stored.set(STORAGE_KEY, raw);

    const result = loadProducts();

    expect(result.products).toEqual(PRODUCTS);
    expect(result.notice).toMatch(/Data tersimpan rusak/);
    expect(JSON.parse(stored.get(STORAGE_KEY))).toEqual(PRODUCTS);
  });

  it('accepts an empty product array as valid data', () => {
    stored.set(STORAGE_KEY, '[]');

    expect(loadProducts()).toEqual({ products: [], notice: null });
  });
});

describe('JSON import validation', () => {
  it('accepts a valid array of products', () => {
    expect(parseProductsJson(JSON.stringify(PRODUCTS))).toEqual({
      ok: true,
      products: PRODUCTS,
    });
  });

  describe('saved product lists', () => {
    it('deduplicates stored IDs and ignores products no longer in the catalog', () => {
      stored.set(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(['p-001', 'p-missing', 'p-001']),
      );

      expect(loadProductIdList(WISHLIST_STORAGE_KEY, new Set(['p-001']))).toEqual({
        ids: ['p-001'],
        notice: null,
      });
    });

    it('recovers a corrupt saved list and reports the recovery', () => {
      stored.set(WISHLIST_STORAGE_KEY, '{broken');

      const result = loadProductIdList(WISHLIST_STORAGE_KEY, new Set());

      expect(result.ids).toEqual([]);
      expect(result.notice).toMatch(/Daftar produk tersimpan rusak/);
      expect(stored.get(WISHLIST_STORAGE_KEY)).toBe('[]');
    });

    it('persists unique IDs and rejects invalid list entries', () => {
      expect(
        saveProductIdList(WISHLIST_STORAGE_KEY, ['p-001', 'p-001']),
      ).toEqual({ ok: true });
      expect(stored.get(WISHLIST_STORAGE_KEY)).toBe('["p-001"]');
      expect(saveProductIdList(WISHLIST_STORAGE_KEY, [''])).toMatchObject({
        ok: false,
      });
    });
  });

  it('rejects malformed JSON and non-array payloads', () => {
    expect(parseProductsJson('{bad').ok).toBe(false);
    expect(parseProductsJson(JSON.stringify({ products: PRODUCTS })).ok).toBe(false);
  });

  it('rejects invalid field types and duplicate IDs', () => {
    expect(
      validateProducts([{ ...PRODUCTS[0], harga: '1450000' }]).valid,
    ).toBe(false);
    expect(validateProducts([PRODUCTS[0], PRODUCTS[0]]).valid).toBe(false);
  });

  it('does not write invalid products to localStorage', () => {
    const result = saveProducts([{ ...PRODUCTS[0], stok: -1 }]);

    expect(result.ok).toBe(false);
    expect(stored.has(STORAGE_KEY)).toBe(false);
  });
});
