/** Konfigurasi dan data contoh Ramy Keys. Seluruh data produk bersifat fiktif. */
export const STORAGE_KEY = 'ramykeys:products:v1';
export const LOW_STOCK = 5;

// Konfigurasi nomor tujuan nonrahasia; ini nomor dummy untuk demo.
export const WA_NUMBER = '6280000000000';

export const CATEGORIES = [
  'Keyboard Kit',
  'Prebuilt Keyboard',
  'Switch',
  'Keycaps',
  'Aksesori',
];

const PRODUCT_IMAGE_PATHS = Object.freeze({
  'p-001': '/images/products/ramy65-aluminum-kit.png',
  'p-002': '/images/products/ramy75-gasket-kit-hot-swap.png',
  'p-003': '/images/products/ramy-tactile-68-prebuilt.png',
  'p-004': '/images/products/ramy-compact-60-prebuilt.png',
  'p-005': '/images/products/switch-linear-cloud-70.png',
  'p-006': '/images/products/switch-tactile-ember-70.png',
  'p-007': '/images/products/keycaps-pbt-sakura-135.png',
  'p-008': '/images/products/kabel-usb-c-coiled.png',
});

const CATEGORY_PLACEHOLDERS = Object.freeze({
  'Keyboard Kit': '/images/placeholder-kit.svg',
  'Prebuilt Keyboard': '/images/placeholder-prebuilt.svg',
  Switch: '/images/placeholder-switch.svg',
  Keycaps: '/images/placeholder-keycaps.svg',
  Aksesori: '/images/placeholder-accessory.svg',
});

const DEFAULT_IMAGE = '/images/placeholder-default.svg';

export function getProductImageCandidates(product) {
  const imageUrl = typeof product.imageUrl === 'string' ? product.imageUrl.trim() : '';
  const productImage = PRODUCT_IMAGE_PATHS[product.id];
  const categoryImage = CATEGORY_PLACEHOLDERS[product.kategori] || DEFAULT_IMAGE;
  const candidates = [];

  if (productImage && (!imageUrl || imageUrl.startsWith('/images/placeholder-'))) {
    candidates.push(productImage);
  }
  if (imageUrl && imageUrl !== DEFAULT_IMAGE) candidates.push(imageUrl);
  if (productImage) candidates.push(productImage);
  candidates.push(categoryImage, imageUrl, DEFAULT_IMAGE);

  return [...new Set(candidates.filter(Boolean))];
}

export const PRODUCTS = [
  {
    id: 'p-001',
    nama: 'Ramy65 Aluminum Kit',
    kategori: 'Keyboard Kit',
    harga: 1450000,
    stok: 6,
    deskripsi: 'Kit 65% casing aluminium, hot-swap, plat PC.',
    spesifikasi: [
      { nama: 'Layout', nilai: '65%' },
      { nama: 'Casing', nilai: 'Aluminium' },
      { nama: 'PCB', nilai: 'Hot-swap' },
      { nama: 'Plat', nilai: 'PC' },
    ],
    imageUrl: '/images/products/ramy65-aluminum-kit.png',
    unggulan: true,
  },
  {
    id: 'p-002',
    nama: 'Ramy75 Gasket Kit Hot-swap',
    kategori: 'Keyboard Kit',
    harga: 1100000,
    stok: 4,
    deskripsi: 'Kit 75% dengan mount gasket dan PCB hot-swap.',
    spesifikasi: [
      { nama: 'Layout', nilai: '75%' },
      { nama: 'Mount', nilai: 'Gasket' },
      { nama: 'PCB', nilai: 'Hot-swap' },
    ],
    imageUrl: '/images/products/ramy75-gasket-kit-hot-swap.png',
    unggulan: false,
  },
  {
    id: 'p-003',
    nama: 'Ramy Tactile 68 Prebuilt',
    kategori: 'Prebuilt Keyboard',
    harga: 1850000,
    stok: 5,
    deskripsi: 'Keyboard 68 tombol siap pakai dengan switch tactile.',
    spesifikasi: [
      { nama: 'Jumlah tombol', nilai: '68' },
      { nama: 'Switch', nilai: 'Tactile' },
      { nama: 'Kondisi', nilai: 'Prebuilt' },
    ],
    imageUrl: '/images/products/ramy-tactile-68-prebuilt.png',
    unggulan: true,
  },
  {
    id: 'p-004',
    nama: 'Ramy Compact 60 Prebuilt',
    kategori: 'Prebuilt Keyboard',
    harga: 950000,
    stok: 0,
    deskripsi: 'Keyboard ringkas 60% dengan layout minimalis.',
    spesifikasi: [
      { nama: 'Layout', nilai: '60%' },
      { nama: 'Desain', nilai: 'Minimalis' },
      { nama: 'Kondisi', nilai: 'Prebuilt' },
    ],
    imageUrl: '/images/products/ramy-compact-60-prebuilt.png',
    unggulan: false,
  },
  {
    id: 'p-005',
    nama: 'Switch Linear "Cloud" (isi 70)',
    kategori: 'Switch',
    harga: 185000,
    stok: 40,
    deskripsi: 'Set berisi 70 switch linear dengan rasa tekan ringan.',
    spesifikasi: [
      { nama: 'Tipe switch', nilai: 'Linear' },
      { nama: 'Isi set', nilai: '70 switch' },
      { nama: 'Karakter', nilai: 'Rasa tekan ringan' },
    ],
    imageUrl: '/images/products/switch-linear-cloud-70.png',
    unggulan: true,
  },
  {
    id: 'p-006',
    nama: 'Switch Tactile "Ember" (isi 70)',
    kategori: 'Switch',
    harga: 210000,
    stok: 25,
    deskripsi: 'Set berisi 70 switch tactile dengan bump yang terasa.',
    spesifikasi: [
      { nama: 'Tipe switch', nilai: 'Tactile' },
      { nama: 'Isi set', nilai: '70 switch' },
      { nama: 'Karakter', nilai: 'Bump terasa' },
    ],
    imageUrl: '/images/products/switch-tactile-ember-70.png',
    unggulan: false,
  },
  {
    id: 'p-007',
    nama: 'Keycaps PBT "Sakura" 135 tombol',
    kategori: 'Keycaps',
    harga: 420000,
    stok: 12,
    deskripsi: 'Set keycaps PBT 135 tombol dengan tema warna sakura.',
    spesifikasi: [
      { nama: 'Material', nilai: 'PBT' },
      { nama: 'Isi set', nilai: '135 tombol' },
      { nama: 'Tema warna', nilai: 'Sakura' },
    ],
    imageUrl: '/images/products/keycaps-pbt-sakura-135.png',
    unggulan: false,
  },
  {
    id: 'p-008',
    nama: 'Kabel USB-C Coiled',
    kategori: 'Aksesori',
    harga: 175000,
    stok: 15,
    deskripsi: 'Kabel USB-C spiral untuk melengkapi setup keyboard.',
    spesifikasi: [
      { nama: 'Konektor', nilai: 'USB-C' },
      { nama: 'Bentuk kabel', nilai: 'Spiral' },
    ],
    imageUrl: '/images/products/kabel-usb-c-coiled.png',
    unggulan: false,
  },
];

export function parseProductSpecifications(raw) {
  if (typeof raw !== 'string') {
    return {
      valid: false,
      specifications: [],
      error: 'Spesifikasi harus berupa teks.',
    };
  }

  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 8) {
    return {
      valid: false,
      specifications: [],
      error: 'Maksimal 8 spesifikasi.',
    };
  }

  const specifications = [];
  const labels = new Set();
  for (const [index, line] of lines.entries()) {
    const separator = line.indexOf(':');
    const nama = separator < 0 ? '' : line.slice(0, separator).trim();
    const nilai = separator < 0 ? '' : line.slice(separator + 1).trim();
    const normalizedName = nama.toLocaleLowerCase('id');

    if (!nama || nama.length > 40 || !nilai || nilai.length > 80) {
      return {
        valid: false,
        specifications: [],
        error: `Format spesifikasi baris ${index + 1} tidak valid. Gunakan nama: nilai.`,
      };
    }
    if (labels.has(normalizedName)) {
      return {
        valid: false,
        specifications: [],
        error: `Nama spesifikasi "${nama}" tidak boleh duplikat.`,
      };
    }

    labels.add(normalizedName);
    specifications.push({ nama, nilai });
  }

  return { valid: true, specifications, error: null };
}

export function validateProduct(input) {
  const errors = {};
  const nama = String(input.nama ?? '').trim();
  const kategori = String(input.kategori ?? '');
  const hargaText = String(input.harga ?? '').trim();
  const stokText = String(input.stok ?? '').trim();
  const deskripsi = String(input.deskripsi ?? '');
  const imageUrl = String(input.imageUrl ?? '').trim();

  if (nama.length < 2 || nama.length > 80) {
    errors.nama = 'Nama wajib diisi, 2–80 karakter.';
  }
  if (!CATEGORIES.includes(kategori)) {
    errors.kategori = 'Pilih salah satu kategori.';
  }

  const harga = Number(hargaText);
  if (!hargaText || !Number.isFinite(harga) || harga < 0 || !Number.isInteger(harga)) {
    errors.harga = 'Harga harus berupa bilangan bulat 0 atau lebih.';
  }

  const stok = Number(stokText);
  if (!stokText || !Number.isInteger(stok) || stok < 0) {
    errors.stok = 'Stok harus berupa bilangan bulat 0 atau lebih.';
  }
  if (deskripsi.length > 300) {
    errors.deskripsi = 'Deskripsi maksimal 300 karakter.';
  }
  if (
    imageUrl &&
    (!imageUrl.startsWith('/images/') ||
      imageUrl.includes('..') ||
      imageUrl.includes('\\'))
  ) {
    errors.imageUrl = 'Path gambar harus diawali /images/.';
  }
  if (typeof input.unggulan !== 'boolean') {
    errors.unggulan = 'Status unggulan harus berupa pilihan ya atau tidak.';
  }
  if (input.spesifikasi !== undefined) {
    const specifications = input.spesifikasi;
    if (!Array.isArray(specifications) || specifications.length > 8) {
      errors.spesifikasi = 'Maksimal 8 spesifikasi dalam bentuk daftar.';
    } else {
      const labels = new Set();
      for (const item of specifications) {
        if (
          item === null ||
          typeof item !== 'object' ||
          typeof item.nama !== 'string' ||
          typeof item.nilai !== 'string' ||
          !item.nama.trim() ||
          item.nama.trim().length > 40 ||
          !item.nilai.trim() ||
          item.nilai.trim().length > 80 ||
          labels.has(item.nama.trim().toLocaleLowerCase('id'))
        ) {
          errors.spesifikasi = 'Format spesifikasi tidak valid atau memiliki nama duplikat.';
          break;
        }
        labels.add(item.nama.trim().toLocaleLowerCase('id'));
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function filterProducts(
  products,
  {
    search = '',
    category = 'all',
    sort = 'default',
    stock = 'all',
    minPrice = '',
    maxPrice = '',
    featured = false,
  } = {},
) {
  const query = String(search ?? '')
    .trim()
    .toLocaleLowerCase('id');
  const minimum = minPrice === '' || minPrice === null ? null : Number(minPrice);
  const maximum = maxPrice === '' || maxPrice === null ? null : Number(maxPrice);
  const hasMinimum = Number.isFinite(minimum) && minimum >= 0;
  const hasMaximum = Number.isFinite(maximum) && maximum >= 0;

  const filtered = products.filter((product) => {
    const matchesSearch =
      !query ||
      [product.nama, product.kategori, product.deskripsi].some((value) =>
        String(value ?? '')
          .toLocaleLowerCase('id')
          .includes(query),
      );
    const matchesCategory = category === 'all' || product.kategori === category;
    const matchesStock =
      stock === 'available'
        ? product.stok > 0
        : stock === 'out'
          ? product.stok === 0
          : true;
    const matchesPrice =
      (!hasMinimum || product.harga >= minimum) &&
      (!hasMaximum || product.harga <= maximum);
    const matchesFeatured = !featured || product.unggulan;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStock &&
      matchesPrice &&
      matchesFeatured
    );
  });

  switch (sort) {
    case 'price-asc':
      return filtered.sort((a, b) => a.harga - b.harga);
    case 'price-desc':
      return filtered.sort((a, b) => b.harga - a.harga);
    case 'name-asc':
      return filtered.sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
    default:
      return filtered;
  }
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function buildWhatsAppUrl(nomor, produk) {
  if (typeof nomor !== 'string' || !/^\+?[1-9]\d{7,14}$/.test(nomor)) {
    throw new TypeError('Nomor WhatsApp harus menggunakan format internasional E.164.');
  }

  const internationalNumber = nomor.replace(/^\+/, '');
  const harga = currencyFormatter.format(produk.harga);
  const pesan = `Halo Ramy Keys, saya ingin memesan: ${produk.nama} (${harga}). Apakah masih tersedia?`;

  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(pesan)}`;
}
