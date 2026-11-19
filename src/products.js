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

export const PRODUCTS = [
  {
    id: 'p-001',
    nama: 'Ramy65 Aluminum Kit',
    kategori: 'Keyboard Kit',
    harga: 1450000,
    stok: 6,
    deskripsi: 'Kit 65% casing aluminium, hot-swap, plat PC.',
    imageUrl: '/images/placeholder-kit.svg',
    unggulan: true,
  },
  {
    id: 'p-002',
    nama: 'Ramy75 Gasket Kit Hot-swap',
    kategori: 'Keyboard Kit',
    harga: 1100000,
    stok: 4,
    deskripsi: 'Kit 75% dengan mount gasket dan PCB hot-swap.',
    imageUrl: '/images/placeholder-kit.svg',
    unggulan: false,
  },
  {
    id: 'p-003',
    nama: 'Ramy Tactile 68 Prebuilt',
    kategori: 'Prebuilt Keyboard',
    harga: 1850000,
    stok: 5,
    deskripsi: 'Keyboard 68 tombol siap pakai dengan switch tactile.',
    imageUrl: '/images/placeholder-prebuilt.svg',
    unggulan: true,
  },
  {
    id: 'p-004',
    nama: 'Ramy Compact 60 Prebuilt',
    kategori: 'Prebuilt Keyboard',
    harga: 950000,
    stok: 0,
    deskripsi: 'Keyboard ringkas 60% dengan layout minimalis.',
    imageUrl: '/images/placeholder-prebuilt.svg',
    unggulan: false,
  },
  {
    id: 'p-005',
    nama: 'Switch Linear "Cloud" (isi 70)',
    kategori: 'Switch',
    harga: 185000,
    stok: 40,
    deskripsi: 'Set berisi 70 switch linear dengan rasa tekan ringan.',
    imageUrl: '/images/placeholder-switch.svg',
    unggulan: true,
  },
  {
    id: 'p-006',
    nama: 'Switch Tactile "Ember" (isi 70)',
    kategori: 'Switch',
    harga: 210000,
    stok: 25,
    deskripsi: 'Set berisi 70 switch tactile dengan bump yang terasa.',
    imageUrl: '/images/placeholder-switch.svg',
    unggulan: false,
  },
  {
    id: 'p-007',
    nama: 'Keycaps PBT "Sakura" 135 tombol',
    kategori: 'Keycaps',
    harga: 420000,
    stok: 12,
    deskripsi: 'Set keycaps PBT 135 tombol dengan tema warna sakura.',
    imageUrl: '/images/placeholder-keycaps.svg',
    unggulan: false,
  },
  {
    id: 'p-008',
    nama: 'Kabel USB-C Coiled',
    kategori: 'Aksesori',
    harga: 175000,
    stok: 15,
    deskripsi: 'Kabel USB-C spiral untuk melengkapi setup keyboard.',
    imageUrl: '/images/placeholder-accessory.svg',
    unggulan: false,
  },
];

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

  return { valid: Object.keys(errors).length === 0, errors };
}

export function filterProducts(
  products,
  { search = '', category = 'all', sort = 'default' } = {},
) {
  const query = String(search ?? '')
    .trim()
    .toLocaleLowerCase('id');

  const filtered = products.filter((product) => {
    const matchesSearch =
      !query ||
      [product.nama, product.kategori, product.deskripsi].some((value) =>
        String(value ?? '')
          .toLocaleLowerCase('id')
          .includes(query),
      );
    const matchesCategory = category === 'all' || product.kategori === category;

    return matchesSearch && matchesCategory;
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
