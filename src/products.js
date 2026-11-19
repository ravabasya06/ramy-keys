/** Konfigurasi dan data contoh Ramy Keys. Seluruh data produk bersifat fiktif. */
export const STORAGE_KEY = 'ramyKeys.products.v1';
export const SCHEMA_VERSION = 1;
export const LOW_STOCK = 5;

// Nomor dummy; ganti sebelum aplikasi dipakai untuk toko sungguhan.
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
