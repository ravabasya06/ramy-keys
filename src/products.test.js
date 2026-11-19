import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppUrl,
  filterProducts,
  getProductImageCandidates,
  parseProductSpecifications,
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

  it('filters inclusive price bounds together with stock and featured status', () => {
    expect(
      filterProducts(PRODUCTS, {
        minPrice: 185000,
        maxPrice: 420000,
        stock: 'available',
        featured: true,
      }).map((p) => p.id),
    ).toEqual(['p-005']);
  });

  it('can isolate out-of-stock products and accepts a zero minimum price', () => {
    expect(
      filterProducts(PRODUCTS, {
        minPrice: 0,
        maxPrice: 1000000,
        stock: 'out',
      }).map((p) => p.id),
    ).toEqual(['p-004']);
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

describe('getProductImageCandidates', () => {
  it('prefers a product-specific image and retains category placeholders', () => {
    expect(getProductImageCandidates(PRODUCTS[3])).toEqual([
      '/images/products/ramy-compact-60-prebuilt.png',
      '/images/placeholder-prebuilt.svg',
      '/images/placeholder-default.svg',
    ]);
  });

  it('keeps a custom image first and provides local fallback options', () => {
    expect(
      getProductImageCandidates({
        ...PRODUCTS[0],
        imageUrl: '/images/custom-keyboard.png',
      }),
    ).toEqual([
      '/images/custom-keyboard.png',
      '/images/products/ramy65-aluminum-kit.png',
      '/images/placeholder-kit.svg',
      '/images/placeholder-default.svg',
    ]);
  });

  it('uses the category placeholder when an unknown product has only a generic fallback', () => {
    expect(
      getProductImageCandidates({
        id: 'custom-item',
        kategori: 'Switch',
        imageUrl: '/images/placeholder-default.svg',
      }),
    ).toEqual([
      '/images/placeholder-switch.svg',
      '/images/placeholder-default.svg',
    ]);
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

  it('accepts structured product specifications and rejects malformed entries', () => {
    expect(
      validateProduct({
        ...validInput,
        spesifikasi: [{ nama: 'Layout', nilai: '65%' }],
      }).valid,
    ).toBe(true);
    expect(
      validateProduct({
        ...validInput,
        spesifikasi: [{ nama: 'Layout', nilai: '' }],
      }).errors,
    ).toHaveProperty('spesifikasi');
  });
});

describe('parseProductSpecifications', () => {
  it('parses trimmed name-value lines while preserving colons in values', () => {
    expect(parseProductSpecifications(' Layout: 65% \nKonektor: USB-C: detachable')).toEqual({
      valid: true,
      specifications: [
        { nama: 'Layout', nilai: '65%' },
        { nama: 'Konektor', nilai: 'USB-C: detachable' },
      ],
      error: null,
    });
  });

  it('rejects malformed, duplicate, and over-limit specifications', () => {
    expect(parseProductSpecifications('Layout 65%').valid).toBe(false);
    expect(parseProductSpecifications('Layout: 65%\nlayout: 75%').valid).toBe(false);
    expect(
      parseProductSpecifications(
        Array.from({ length: 9 }, (_, index) => `Fitur ${index}: Ada`).join('\n'),
      ).valid,
    ).toBe(false);
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
