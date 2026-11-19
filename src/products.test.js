import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppUrl,
  filterProducts,
  PRODUCTS,
  validateProduct,
} from './products.js';

const validInput = {
  nama: 'MK',
  kategori: 'Keyboard Kit',
  harga: '0',
  stok: '0',
  deskripsi: '',
  imageUrl: '',
  unggulan: false,
};

describe('filterProducts', () => {
  it('searches case-insensitively across product fields', () => {
    expect(filterProducts(PRODUCTS, { search: '  TACTILE ' }).map((p) => p.id))
      .toEqual(['p-003', 'p-006']);
    expect(filterProducts(PRODUCTS, { search: 'PLAT pc' }).map((p) => p.id))
      .toEqual(['p-001']);
  });

  it('filters by category', () => {
    expect(filterProducts(PRODUCTS, { category: 'Switch' }).map((p) => p.id))
      .toEqual(['p-005', 'p-006']);
  });

  it('combines search, category, and sorting', () => {
    expect(
      filterProducts(PRODUCTS, {
        search: 'set',
        category: 'Switch',
        sort: 'price-asc',
      }).map((p) => p.id),
    ).toEqual(['p-005', 'p-006']);
  });

  it('sorts prices from lowest to highest', () => {
    const result = filterProducts(PRODUCTS, { sort: 'price-asc' });
    expect(result[0].harga).toBe(175000);
    expect(result.at(-1).harga).toBe(1850000);
  });

  it('sorts prices from highest to lowest', () => {
    const result = filterProducts(PRODUCTS, { sort: 'price-desc' });
    expect(result[0].harga).toBe(1850000);
    expect(result.at(-1).harga).toBe(175000);
  });

  it('sorts names alphabetically', () => {
    const result = filterProducts(PRODUCTS, { sort: 'name-asc' });
    expect(result.map((p) => p.nama)).toEqual(
      [...PRODUCTS].map((p) => p.nama).sort((a, b) => a.localeCompare(b, 'id')),
    );
  });

  it('does not mutate the source array when sorting', () => {
    const original = [...PRODUCTS];
    filterProducts(PRODUCTS, { sort: 'price-asc' });
    expect(PRODUCTS).toEqual(original);
  });
});

describe('validateProduct', () => {
  it('accepts zero price and zero stock boundaries', () => {
    expect(validateProduct(validInput)).toEqual({ valid: true, errors: {} });
  });

  it.each(['-1', 'NaN', ''])('rejects invalid price %s', (harga) => {
    expect(validateProduct({ ...validInput, harga }).errors).toHaveProperty('harga');
  });

  it('rejects fractional prices', () => {
    expect(validateProduct({ ...validInput, harga: '1.5' }).errors)
      .toHaveProperty('harga');
  });

  it.each(['-1', '1.5', ''])('rejects invalid stock %s', (stok) => {
    expect(validateProduct({ ...validInput, stok }).errors).toHaveProperty('stok');
  });

  it('rejects categories outside the configured list', () => {
    expect(validateProduct({ ...validInput, kategori: 'Lainnya' }).errors)
      .toHaveProperty('kategori');
  });

  it('requires a trimmed name between two and eighty characters', () => {
    expect(validateProduct({ ...validInput, nama: ' ' }).errors).toHaveProperty('nama');
    expect(validateProduct({ ...validInput, nama: 'x'.repeat(81) }).errors)
      .toHaveProperty('nama');
  });
});

describe('buildWhatsAppUrl', () => {
  it('encodes a product order and formatted Rupiah price', () => {
    const url = buildWhatsAppUrl('6280000000000', PRODUCTS[0]);
    const parsed = new URL(url);

    expect(parsed.origin).toBe('https://wa.me');
    expect(parsed.pathname).toBe('/6280000000000');
    expect(parsed.searchParams.get('text')).toContain('Ramy65 Aluminum Kit');
    expect(parsed.searchParams.get('text')).toContain('1.450.000');
  });

  it('accepts a leading plus and strips it for wa.me', () => {
    expect(buildWhatsAppUrl('+6280000000000', PRODUCTS[0]))
      .toMatch(/^https:\/\/wa\.me\/6280000000000\?/);
  });

  it.each([
    '08123456789',
    '6281234',
    '62812345678901234',
    '++6280000000000',
    ' 6280000000000 ',
    6280000000000,
  ])('rejects invalid international number %s', (number) => {
    expect(() => buildWhatsAppUrl(number, PRODUCTS[0])).toThrow(TypeError);
  });
});
