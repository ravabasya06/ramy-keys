/**
 * Lapisan tampilan: membangun antarmuka dengan createElement dan textContent.
 * Tidak ada data pengguna yang dimasukkan lewat innerHTML.
 */

import {
  CATEGORIES,
  buildWhatsAppUrl,
  filterProducts,
  getProductImageCandidates,
  LOW_STOCK,
  parseProductSpecifications,
  PRODUCTS,
  WA_NUMBER,
  validateProduct,
} from './products.js';
import {
  parseProductsJson,
  parseWishlistJson,
  serializeWishlistJson,
  summarize,
} from './store.js';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const MAX_COMPARISON_PRODUCTS = 3;
const SETUP_GROUPS = [
  { id: 'keyboard', title: 'Keyboard', categories: ['Keyboard Kit', 'Prebuilt Keyboard'] },
  { id: 'switch', title: 'Switch', categories: ['Switch'] },
  { id: 'keycaps', title: 'Keycaps', categories: ['Keycaps'] },
  { id: 'accessory', title: 'Aksesori', categories: ['Aksesori'] },
];

const INFO_PAGES = {
  guide: {
    title: 'Panduan memilih keyboard',
    intro:
      'Mulai dari cara kamu memakai keyboard, lalu periksa kecocokan produk sebelum memutuskan.',
    sections: [
      {
        title: '1. Tentukan format yang nyaman',
        text:
          'Keyboard berukuran ringkas menyisakan lebih banyak ruang di meja, sedangkan format yang lebih besar menyediakan lebih banyak tombol khusus. Pertimbangkan alur kerja dan kebiasaan mengetikmu.',
      },
      {
        title: '2. Pilih kit atau prebuilt',
        text:
          'Keyboard kit memberi ruang untuk memilih komponen dan merakit setup sendiri. Prebuilt adalah pilihan siap pakai pada katalog demo ini. Periksa isi paket dan kebutuhan perakitan sebelum memesan.',
      },
      {
        title: '3. Cari karakter switch',
        text:
          'Switch linear terasa bergerak tanpa tonjolan tactile, sementara switch tactile memiliki umpan balik yang terasa saat ditekan. Preferensi suara dan rasa berbeda untuk tiap orang; bila memungkinkan, cobalah dahulu.',
      },
      {
        title: '4. Periksa kompatibilitas keycaps',
        text:
          'Cocokkan layout, ukuran tombol khusus, dan dukungan set keycaps dengan keyboard yang dipilih. Jumlah tombol saja tidak selalu memastikan kecocokan.',
      },
      {
        title: '5. Bandingkan dengan kebutuhanmu',
        text:
          'Gunakan filter harga dan stok, simpan pilihan ke wishlist, atau bandingkan hingga tiga produk. Informasi katalog ini masih data demo dan perlu dikonfirmasi sebelum transaksi.',
      },
    ],
  },
  faq: {
    title: 'Pertanyaan yang sering diajukan',
    intro: 'Informasi berikut menjelaskan cara kerja demo Ramy Keys saat ini.',
    questions: [
      {
        question: 'Apakah katalog ini menjual produk nyata?',
        answer:
          'Belum. Produk, harga, stok, dan gambar adalah contoh untuk demo; katalog ini tidak menjamin ketersediaan barang.',
      },
      {
        question: 'Apa yang terjadi saat saya menekan Pesan via WhatsApp?',
        answer:
          'Aplikasi membuka WhatsApp dengan pesan produk yang sudah disiapkan. Nomor yang terpasang saat ini adalah nomor dummy, jadi jangan gunakan untuk pemesanan nyata.',
      },
      {
        question: 'Apakah harga dan stok selalu terbaru?',
        answer:
          'Tidak. Data disimpan lokal di browser dan tidak disinkronkan dengan inventaris atau sistem backend.',
      },
      {
        question: 'Apakah wishlist dan perbandingan tersimpan?',
        answer:
          'Ya, daftar produk tersimpan di localStorage pada browser dan origin yang sama. Data tidak berpindah otomatis ke browser atau perangkat lain.',
      },
      {
        question: 'Apakah dashboard hanya bisa diakses pemilik?',
        answer:
          'Tidak. Dashboard ini tidak memiliki autentikasi dan bukan alat administrasi aman untuk data bisnis.',
      },
    ],
  },
  about: {
    title: 'Tentang Ramy Keys',
    intro:
      'Ramy Keys adalah konsep katalog untuk menjelajahi mechanical keyboard dan aksesori dalam satu tempat.',
    sections: [
      {
        title: 'Fokus pada pilihan yang jelas',
        text:
          'Katalog demo mengelompokkan keyboard kit, prebuilt keyboard, switch, keycaps, dan aksesori agar pengunjung dapat menyaring dan membandingkan pilihan.',
      },
      {
        title: 'Transparan sebagai demo',
        text:
          'Data produk yang tampil bersifat fiktif. Wishlist, perbandingan, dan perubahan dashboard disimpan di browser; belum ada layanan akun, inventaris bersama, atau pemrosesan transaksi.',
      },
      {
        title: 'Masih dalam pengembangan',
        text:
          'Panduan dan halaman informasi ini membantu mengeksplorasi prototipe. Detail produk nyata, kebijakan pengiriman, dan dukungan pelanggan belum tersedia di aplikasi.',
      },
    ],
  },
};

export function formatRupiah(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function assetUrl(path) {
  const clean = String(path || '/images/placeholder-default.svg').replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}

function faIcon(iconClass) {
  const icon = el('i', `fa-icon ${iconClass}`);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function appendIconLabel(node, iconClass, label) {
  node.append(faIcon(iconClass), el('span', null, label));
}

function navLink(label, wideLabel, href, active) {
  const link = el('a', 'navbar__link');
  link.href = href;

  if (active) {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  }

  if (wideLabel) {
    link.append(
      el('span', 'nav-label nav-label--mobile', label),
      el('span', 'nav-label nav-label--wide', wideLabel),
    );
  } else {
    link.textContent = label;
  }

  return link;
}

function renderPageMenu(page, wishlistCount, comparisonCount) {
  const entries = [
    { page: 'guide', label: 'Panduan', href: '#/panduan' },
    { page: 'faq', label: 'FAQ', href: '#/faq' },
    { page: 'about', label: 'Tentang', href: '#/tentang' },
    { page: 'setup', label: 'Perakit setup', href: '#/setup' },
    {
      page: 'wishlist',
      label: `Wishlist (${wishlistCount})`,
      href: '#/wishlist',
    },
    {
      page: 'comparison',
      label: `Bandingkan (${comparisonCount}/${MAX_COMPARISON_PRODUCTS})`,
      href: '#/perbandingan',
    },
  ];
  const menu = el('details', 'navbar__menu');
  const active = entries.some((entry) => entry.page === page);
  const summary = el('summary', 'navbar__link navbar__menu-trigger');
  summary.setAttribute('aria-label', 'Menu halaman lainnya');
  appendIconLabel(summary, 'fa-solid fa-ellipsis', 'Lainnya');
  if (active) summary.classList.add('is-active');

  const panel = el('div', 'navbar__menu-panel');
  for (const entry of entries) {
    const link = el('a', 'navbar__menu-link', entry.label);
    link.href = entry.href;
    if (entry.page === page) {
      link.setAttribute('aria-current', 'page');
    }
    panel.append(link);
  }
  menu.append(summary, panel);
  return menu;
}

function renderHeader(page, wishlistCount, comparisonCount) {
  const header = el('header', 'site-header');
  const ribbon = el('div', 'site-ribbon');
  const ribbonInner = el('div', 'container site-ribbon__inner');
  const whatsappRibbon = el('span', 'site-ribbon__whatsapp');
  appendIconLabel(whatsappRibbon, 'fa-brands fa-whatsapp', 'PESAN LANGSUNG VIA WHATSAPP');
  ribbonInner.append(
    el('span', null, 'MECHANICAL KEYBOARD · RAMY KEYS STUDIO'),
    whatsappRibbon,
  );
  ribbon.append(ribbonInner);

  const nav = el('nav', 'navbar container');
  nav.setAttribute('aria-label', 'Navigasi utama');

  const brand = el('a', 'brand');
  brand.href = '#/';
  const mark = el('span', 'brand__mark');
  mark.setAttribute('aria-hidden', 'true');
  mark.append(faIcon('fa-solid fa-keyboard'));
  brand.append(mark, el('span', 'brand__name', 'Ramy Keys'));

  const links = el('div', 'navbar__links');
  links.append(
    navLink('Katalog', null, '#/', page === 'catalog' || page === 'product'),
    navLink('Dashboard', 'Dashboard Demo', '#/dashboard', page === 'dashboard'),
    renderPageMenu(page, wishlistCount, comparisonCount),
  );

  const cta = el('a', 'navbar__cta');
  cta.append(
    el('span', null, page === 'catalog' ? 'Pilih produk' : 'Lihat katalog'),
    faIcon('fa-solid fa-arrow-right'),
  );
  cta.href = page === 'catalog' ? '#katalog' : '#/';

  nav.append(brand, links, cta);
  header.append(ribbon, nav);
  return header;
}

function renderHero(products) {
  const stats = summarize(products);
  const hero = el('section', 'hero');
  const inner = el('div', 'container hero__inner');
  const copy = el('div', 'hero__copy');

  copy.append(
    el('p', 'hero__eyebrow', 'RANGKAIAN 01 · UNTUK MEJA KERJAMU'),
    el(
      'h1',
      'hero__title',
      'Temukan feel mengetik yang terasa milikmu.',
    ),
    el(
      'p',
      'hero__text',
      'Dari keyboard kit sampai switch dan keycaps, pilih detail kecil yang mengubah seluruh ritme kerja.',
    ),
  );

  const cta = el('a', 'btn btn--primary hero__cta');
  cta.append(el('span', null, 'Jelajahi koleksi'), faIcon('fa-solid fa-arrow-down'));
  cta.href = '#katalog';
  copy.append(
    cta,
    el(
      'p',
      'hero__stats',
      `${stats.totalProducts} produk | ${stats.totalStock} stok`,
    ),
  );

  inner.append(copy, renderKeyboardIllustration());
  hero.append(inner);
  return hero;
}

function renderKeyboardIllustration() {
  const illustration = el('div', 'keyboard-illustration');
  illustration.setAttribute('aria-hidden', 'true');

  const caption = el('div', 'keyboard-illustration__caption');
  caption.append(
    el('span', 'keyboard-illustration__series', 'RAMY 65'),
    el('span', 'keyboard-illustration__detail', 'ALUMINUM · HOT-SWAP'),
  );

  const board = el('div', 'keyboard-illustration__board');
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  for (const [rowIndex, letters] of rows.entries()) {
    const row = el('div', `keyboard-illustration__row keyboard-illustration__row--${rowIndex + 1}`);
    for (const letter of letters) {
      const key = el('span', 'keyboard-illustration__key', letter);
      if (['Q', 'E', 'R', 'Y', 'C', 'V'].includes(letter)) {
        key.classList.add('keyboard-illustration__key--accent');
      }
      row.append(key);
    }
    board.append(row);
  }

  const bottomRow = el('div', 'keyboard-illustration__row');
  bottomRow.append(
    el('span', 'keyboard-illustration__key keyboard-illustration__key--wide', 'CTRL'),
    el('span', 'keyboard-illustration__key keyboard-illustration__key--space', 'SPACE'),
    el('span', 'keyboard-illustration__key keyboard-illustration__key--wide', 'FN'),
  );
  board.append(bottomRow);
  illustration.append(caption, board);
  return illustration;
}

function createBadge(text, variant) {
  const badge = el('span', `card__badge card__badge--${variant}`);
  if (variant === 'featured') {
    appendIconLabel(badge, 'fa-solid fa-star', text);
  } else {
    badge.textContent = text;
  }
  return badge;
}

function productDetailHref(product) {
  return `#/produk/${encodeURIComponent(product.id)}`;
}

function createProductImage(product, className, loading) {
  const image = el('img', className);
  const imageCandidates = getProductImageCandidates(product).map(assetUrl);
  let imageIndex = 0;
  image.alt = product.nama;
  image.width = 800;
  image.height = 600;
  image.loading = loading;
  image.addEventListener('error', () => {
    imageIndex += 1;
    if (imageIndex < imageCandidates.length) image.src = imageCandidates[imageIndex];
  });
  image.src = imageCandidates[imageIndex];
  return image;
}

function createOrderAction(product, className) {
  if (product.stok > 0) {
    const link = el('a', className);
    appendIconLabel(link, 'fa-brands fa-whatsapp', 'Pesan via WhatsApp');
    link.href = buildWhatsAppUrl(WA_NUMBER, product);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Pesan ${product.nama} via WhatsApp`);
    return link;
  }

  const button = el('button', className, 'Stok habis');
  button.type = 'button';
  button.disabled = true;
  return button;
}

function createSelectionButton(product, ids, settings) {
  const selected = ids.includes(product.id);
  const atLimit =
    settings.kind === 'comparison' &&
    !selected &&
    ids.length >= MAX_COMPARISON_PRODUCTS;
  const button = el(
    'button',
    `product-tool${selected ? ' is-selected' : ''}`,
  );
  button.type = 'button';
  button.disabled = atLimit;
  button.setAttribute('aria-pressed', String(selected));
  if (atLimit) button.title = `Maksimal ${MAX_COMPARISON_PRODUCTS} produk.`;
  appendIconLabel(
    button,
    selected ? settings.selectedIcon : settings.icon,
    atLimit ? 'Batas 3 produk' : selected ? settings.selectedLabel : settings.label,
  );
  button.addEventListener('click', () => {
    const nextIds = selected
      ? ids.filter((id) => id !== product.id)
      : [...ids, product.id];
    const result = settings.onChange(nextIds);
    if (!result.ok) {
      settings.onRefresh({
        message: settings.errorMessage,
        type: 'error',
      });
      return;
    }
    settings.onRefresh();
  });
  return button;
}

function createProductSelectionControls(product, state) {
  const controls = el('div', 'product-tools');
  controls.append(
    createSelectionButton(product, state.wishlistIds, {
      kind: 'wishlist',
      icon: 'fa-regular fa-heart',
      selectedIcon: 'fa-solid fa-heart',
      label: 'Simpan',
      selectedLabel: 'Tersimpan',
      onChange: state.onWishlistChange,
      onRefresh: state.onRefresh,
      errorMessage: 'Wishlist gagal disimpan di browser.',
    }),
    createSelectionButton(product, state.comparisonIds, {
      kind: 'comparison',
      icon: 'fa-solid fa-scale-balanced',
      selectedIcon: 'fa-solid fa-scale-balanced',
      label: 'Bandingkan',
      selectedLabel: 'Dipilih',
      onChange: state.onComparisonChange,
      onRefresh: state.onRefresh,
      errorMessage: 'Daftar perbandingan gagal disimpan di browser.',
    }),
  );
  return controls;
}

function createProductCard(product, state) {
  const card = el('article', 'card');
  const media = el('div', 'card__media');
  const badges = el('div', 'card__badges');

  if (product.unggulan) badges.append(createBadge('Unggulan', 'featured'));
  if (product.stok === 0) badges.append(createBadge('Habis', 'out'));

  media.append(createProductImage(product, 'card__image', 'lazy'), badges);

  const body = el('div', 'card__body');
  body.append(
    el('p', 'card__category', product.kategori),
    el('h3', 'card__title', product.nama),
    el('p', 'card__price', formatRupiah(product.harga)),
  );
  body.append(createProductSelectionControls(product, state));
  const detailLink = el('a', 'card__detail-link');
  appendIconLabel(detailLink, 'fa-solid fa-arrow-right', 'Lihat detail');
  detailLink.href = productDetailHref(product);
  detailLink.setAttribute('aria-label', `Lihat detail ${product.nama}`);
  body.append(detailLink);

  let stockText = `Stok: ${product.stok}`;
  let stockClass = 'card__stock';
  if (product.stok === 0) {
    stockClass += ' card__stock--out';
  } else if (product.stok <= LOW_STOCK) {
    stockText = `! Sisa ${product.stok}`;
    stockClass += ' card__stock--low';
  }
  body.append(el('p', stockClass, stockText));
  body.append(createOrderAction(product, 'btn btn--wa card__action'));

  card.append(media, body);
  return card;
}

function renderSpecificationList(specifications, className) {
  if (!specifications?.length) return null;

  const list = el('dl', `${className} spec-list`);
  for (const specification of specifications) {
    const item = el('div', 'spec-list__item');
    item.append(
      el('dt', 'spec-list__name', specification.nama),
      el('dd', 'spec-list__value', specification.nilai),
    );
    list.append(item);
  }
  return list;
}

function renderProductDetail(product, allProducts, state) {
  const section = el('section', 'product-detail container');
  const backLink = el('a', 'product-detail__back');
  appendIconLabel(backLink, 'fa-solid fa-arrow-left', 'Kembali ke katalog');
  backLink.href = '#/';
  section.append(backLink);

  if (!product) {
    const empty = el('div', 'empty-state');
    empty.append(
      el('h1', 'empty-state__title', 'Produk tidak ditemukan.'),
      el('p', 'empty-state__text', 'Produk mungkin sudah dihapus dari katalog.'),
    );
    const catalogLink = el('a', 'btn btn--primary', 'Kembali ke katalog');
    catalogLink.href = '#/';
    empty.append(catalogLink);
    section.append(empty);
    return section;
  }

  const layout = el('div', 'product-detail__layout');
  const media = el('div', 'product-detail__media');
  media.append(createProductImage(product, 'product-detail__image', 'eager'));

  const content = el('article', 'product-detail__content');
  content.append(
    el('p', 'product-detail__category', product.kategori),
    el('h1', 'product-detail__title', product.nama),
    el(
      'p',
      'product-detail__description',
      product.deskripsi || 'Deskripsi produk belum tersedia.',
    ),
    el('p', 'product-detail__price', formatRupiah(product.harga)),
  );

  let stockText = `Stok: ${product.stok}`;
  let stockLabel = 'Tersedia';
  let stockClass = 'product-detail__stock';
  if (product.stok === 0) {
    stockText = 'Stok habis';
    stockLabel = 'Habis';
    stockClass += ' product-detail__stock--out';
  } else if (product.stok <= LOW_STOCK) {
    stockText = `Stok terbatas · ${product.stok} tersisa`;
    stockLabel = 'Terbatas';
    stockClass += ' product-detail__stock--low';
  }
  const facts = el('dl', 'product-detail__facts');
  for (const [label, value] of [
    ['Kategori', product.kategori],
    ['Ketersediaan', stockLabel],
    ['Kurasi', product.unggulan ? 'Produk unggulan' : 'Koleksi'],
  ]) {
    const fact = el('div', 'product-detail__fact');
    fact.append(el('dt', null, label), el('dd', null, value));
    facts.append(fact);
  }
  content.append(facts, el('p', stockClass, stockText));
  const specifications = renderSpecificationList(
    product.spesifikasi,
    'product-detail__specs',
  );
  if (specifications) {
    const specificationsSection = el('section', 'product-detail__specifications');
    specificationsSection.append(
      el('h2', 'product-detail__specifications-title', 'Spesifikasi'),
      specifications,
    );
    content.append(specificationsSection);
  }

  const actions = el('div', 'product-detail__actions');
  actions.append(
    createProductSelectionControls(product, state),
    createOrderAction(product, 'btn btn--wa'),
  );
  content.append(actions);
  layout.append(media, content);
  section.append(layout);

  const relatedProducts = allProducts.filter(
    (item) => item.id !== product.id && item.kategori === product.kategori,
  );
  if (relatedProducts.length > 0) {
    const related = el('section', 'product-detail__related');
    related.append(
      el('h2', 'product-detail__related-title', `Pilihan lain · ${product.kategori}`),
    );
    const grid = el('div', 'product-grid');
    for (const relatedProduct of relatedProducts) {
      grid.append(createProductCard(relatedProduct, state));
    }
    related.append(grid);
    section.append(related);
  }
  return section;
}

function renderEmptyCatalog() {
  const empty = el('div', 'empty-state');
  empty.append(
    el('h3', 'empty-state__title', 'Katalog masih kosong.'),
    el(
      'p',
      'empty-state__text',
      'Pengelola dapat menambah produk di Dashboard Demo.',
    ),
  );
  const link = el('a', 'btn btn--primary', 'Buka Dashboard');
  link.href = '#/dashboard';
  empty.append(link);
  return empty;
}

function renderEmptyResults() {
  const empty = el('div', 'empty-state');
  empty.append(
    el('h3', 'empty-state__title', 'Tidak ada produk yang cocok.'),
    el(
      'p',
      'empty-state__text',
      'Coba kata kunci lain atau reset filter.',
    ),
  );
  return empty;
}

function renderCatalog(products, state) {
  const section = el('section', 'section container');
  section.id = 'katalog';
  const filters = { ...state.catalogFilters };

  const head = el('div', 'section__head');
  head.append(
    el('h2', 'section__title', 'Gear pilihan, tanpa tebakan.'),
    el(
      'p',
      'section__meta',
      `${products.length} item · dikurasi untuk setup berikutnya`,
    ),
  );

  const toolbar = el('div', 'catalog-toolbar');
  const searchField = el('label', 'catalog-toolbar__field catalog-toolbar__field--search');
  searchField.append(el('span', 'catalog-toolbar__label', 'Cari produk'));
  const searchInput = el('input', 'catalog-toolbar__control');
  searchInput.type = 'search';
  searchInput.placeholder = 'Cari nama, kategori, atau deskripsi…';
  searchInput.value = filters.search;
  searchField.append(searchInput);

  const categoryField = el('label', 'catalog-toolbar__field');
  categoryField.append(el('span', 'catalog-toolbar__label', 'Kategori'));
  const categorySelect = el('select', 'catalog-toolbar__control');
  categorySelect.append(createOption('all', 'Semua kategori'));
  for (const category of CATEGORIES) {
    categorySelect.append(createOption(category, category));
  }
  categorySelect.value = filters.category;
  categoryField.append(categorySelect);

  const stockField = el('label', 'catalog-toolbar__field');
  stockField.append(el('span', 'catalog-toolbar__label', 'Ketersediaan'));
  const stockSelect = el('select', 'catalog-toolbar__control');
  stockSelect.append(
    createOption('all', 'Semua stok'),
    createOption('available', 'Tersedia'),
    createOption('out', 'Stok habis'),
  );
  stockSelect.value = filters.stock;
  stockField.append(stockSelect);

  const sortField = el('label', 'catalog-toolbar__field');
  sortField.append(el('span', 'catalog-toolbar__label', 'Urutkan'));
  const sortSelect = el('select', 'catalog-toolbar__control');
  sortSelect.append(
    createOption('default', 'Default'),
    createOption('price-asc', 'Harga termurah'),
    createOption('price-desc', 'Harga termahal'),
    createOption('name-asc', 'Nama A–Z'),
  );
  sortSelect.value = filters.sort;
  sortField.append(sortSelect);

  const minPriceField = el('label', 'catalog-toolbar__field');
  minPriceField.append(el('span', 'catalog-toolbar__label', 'Harga minimum (Rp)'));
  const minPriceInput = el('input', 'catalog-toolbar__control');
  minPriceInput.type = 'number';
  minPriceInput.min = '0';
  minPriceInput.step = '1';
  minPriceInput.inputMode = 'numeric';
  minPriceInput.placeholder = 'Tanpa batas';
  minPriceInput.value = filters.minPrice;
  minPriceField.append(minPriceInput);

  const maxPriceField = el('label', 'catalog-toolbar__field');
  maxPriceField.append(el('span', 'catalog-toolbar__label', 'Harga maksimum (Rp)'));
  const maxPriceInput = el('input', 'catalog-toolbar__control');
  maxPriceInput.type = 'number';
  maxPriceInput.min = '0';
  maxPriceInput.step = '1';
  maxPriceInput.inputMode = 'numeric';
  maxPriceInput.placeholder = 'Tanpa batas';
  maxPriceInput.value = filters.maxPrice;
  maxPriceField.append(maxPriceInput);

  const featuredField = el('label', 'catalog-toolbar__field');
  featuredField.append(el('span', 'catalog-toolbar__label', 'Pilihan'));
  const featuredSelect = el('select', 'catalog-toolbar__control');
  featuredSelect.append(
    createOption('all', 'Semua produk'),
    createOption('featured', 'Produk unggulan'),
  );
  featuredSelect.value = filters.featured ? 'featured' : 'all';
  featuredField.append(featuredSelect);

  const resetButton = el('button', 'btn btn--secondary catalog-toolbar__reset', 'Reset filter');
  resetButton.type = 'button';
  toolbar.append(
    searchField,
    categoryField,
    stockField,
    sortField,
    minPriceField,
    maxPriceField,
    featuredField,
    resetButton,
  );

  const status = el('p', 'section__meta catalog-results__status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const activeFilters = el('div', 'catalog-active-filters');
  activeFilters.hidden = true;
  const results = el('div', 'catalog-results');

  function syncFilterControls() {
    searchInput.value = filters.search;
    categorySelect.value = filters.category;
    stockSelect.value = filters.stock;
    sortSelect.value = filters.sort;
    minPriceInput.value = filters.minPrice;
    maxPriceInput.value = filters.maxPrice;
    featuredSelect.value = filters.featured ? 'featured' : 'all';
  }

  function updateActiveFilters() {
    const active = [];
    if (filters.search.trim()) active.push(['search', `Cari: ${filters.search.trim()}`]);
    if (filters.category !== 'all') active.push(['category', `Kategori: ${filters.category}`]);
    if (filters.stock !== 'all') {
      active.push([
        'stock',
        `Stok: ${filters.stock === 'available' ? 'Tersedia' : 'Habis'}`,
      ]);
    }
    if (filters.sort !== 'default') {
      const sortLabels = {
        'price-asc': 'Harga termurah',
        'price-desc': 'Harga termahal',
        'name-asc': 'Nama A–Z',
      };
      active.push(['sort', `Urutan: ${sortLabels[filters.sort] || filters.sort}`]);
    }
    if (filters.minPrice !== '') {
      active.push(['minPrice', `Harga min: ${formatRupiah(Number(filters.minPrice))}`]);
    }
    if (filters.maxPrice !== '') {
      active.push(['maxPrice', `Harga maks: ${formatRupiah(Number(filters.maxPrice))}`]);
    }
    if (filters.featured) active.push(['featured', 'Produk unggulan']);

    activeFilters.replaceChildren();
    activeFilters.hidden = active.length === 0;
    for (const [key, label] of active) {
      const chip = el('button', 'catalog-filter-chip', label);
      chip.type = 'button';
      chip.setAttribute('aria-label', `Hapus filter ${label}`);
      chip.append(faIcon('fa-solid fa-xmark'));
      chip.addEventListener('click', () => {
        const defaults = {
          search: '',
          category: 'all',
          stock: 'all',
          sort: 'default',
          minPrice: '',
          maxPrice: '',
          featured: false,
        };
        filters[key] = defaults[key];
        syncFilterControls();
        updateResults();
      });
      activeFilters.append(chip);
    }
  }

  function updateResults() {
    state.onCatalogFiltersChange(filters);
    updateActiveFilters();
    const visibleProducts = filterProducts(products, filters);
    status.textContent = `Menampilkan ${visibleProducts.length} dari ${products.length} produk`;
    results.replaceChildren();

    if (products.length === 0) {
      results.append(renderEmptyCatalog());
      return;
    }

    if (visibleProducts.length === 0) {
      results.append(renderEmptyResults());
      return;
    }

    const grid = el('div', 'product-grid');
    for (const product of visibleProducts) {
      grid.append(createProductCard(product, state));
    }
    results.append(grid);
  }

  searchInput.addEventListener('input', () => {
    filters.search = searchInput.value;
    updateResults();
  });
  categorySelect.addEventListener('change', () => {
    filters.category = categorySelect.value;
    updateResults();
  });
  stockSelect.addEventListener('change', () => {
    filters.stock = stockSelect.value;
    updateResults();
  });
  sortSelect.addEventListener('change', () => {
    filters.sort = sortSelect.value;
    updateResults();
  });
  minPriceInput.addEventListener('input', () => {
    filters.minPrice = minPriceInput.value;
    updateResults();
  });
  maxPriceInput.addEventListener('input', () => {
    filters.maxPrice = maxPriceInput.value;
    updateResults();
  });
  featuredSelect.addEventListener('change', () => {
    filters.featured = featuredSelect.value === 'featured';
    updateResults();
  });
  resetButton.addEventListener('click', () => {
    Object.assign(filters, {
      search: '',
      category: 'all',
      stock: 'all',
      sort: 'default',
      minPrice: '',
      maxPrice: '',
      featured: false,
    });
    syncFilterControls();
    updateResults();
  });

  section.append(
    head,
    toolbar,
    renderCategoryOverview(products),
    activeFilters,
    status,
    results,
  );
  updateResults();
  return section;
}

function renderWishlistPage(products, state) {
  const savedProducts = products.filter((product) =>
    state.wishlistIds.includes(product.id),
  );
  const section = el('section', 'collection-page container');
  section.append(
    el('p', 'page-eyebrow', 'KOLEKSI PRIBADI · BROWSER INI'),
    el('h1', 'page-title', 'Wishlist'),
    el(
      'p',
      'collection-page__intro',
      `${savedProducts.length} produk tersimpan. Wishlist hanya tersedia di browser ini.`,
    ),
  );
  const actions = el('div', 'wishlist-actions');
  const exportButton = el('button', 'btn btn--secondary');
  appendIconLabel(exportButton, 'fa-solid fa-file-export', 'Ekspor Wishlist');
  exportButton.type = 'button';
  exportButton.disabled = savedProducts.length === 0;
  exportButton.addEventListener('click', () => {
    try {
      const blob = new Blob(
        [serializeWishlistJson(savedProducts.map((product) => product.id))],
        {
          type: 'application/json',
        },
      );
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = el('a');
      downloadLink.href = objectUrl;
      downloadLink.download = 'ramykeys-wishlist.json';
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      state.onRefresh({
        message: 'Wishlist diekspor sebagai file JSON.',
        type: 'success',
      });
    } catch {
      state.onRefresh({
        message: 'Gagal mengekspor Wishlist.',
        type: 'error',
      });
    }
  });

  const importInput = el('input');
  importInput.type = 'file';
  importInput.accept = '.json,application/json';
  importInput.hidden = true;
  importInput.addEventListener('change', async () => {
    const [file] = importInput.files || [];
    if (!file) return;
    if (file.size > 256 * 1024) {
      importInput.value = '';
      state.onRefresh({
        message: 'File Wishlist terlalu besar (maksimal 256 KB).',
        type: 'error',
      });
      return;
    }

    let raw;
    try {
      raw = await file.text();
    } catch {
      importInput.value = '';
      state.onRefresh({
        message: 'File Wishlist tidak dapat dibaca.',
        type: 'error',
      });
      return;
    }

    const validProductIds = new Set(products.map((product) => product.id));
    const imported = parseWishlistJson(raw, validProductIds);
    importInput.value = '';
    if (!imported.ok) {
      state.onRefresh({ message: imported.error, type: 'error' });
      return;
    }

    const nextIds = [...new Set([...state.wishlistIds, ...imported.ids])];
    const result = state.onWishlistChange(nextIds);
    if (!result.ok) {
      state.onRefresh({
        message: 'Wishlist gagal disimpan di browser.',
        type: 'error',
      });
      return;
    }
    state.onRefresh({
      message: `${imported.ids.length} produk Wishlist berhasil digabungkan.`,
      type: 'success',
    });
  });

  const importButton = el('button', 'btn btn--secondary');
  appendIconLabel(importButton, 'fa-solid fa-file-import', 'Impor Wishlist');
  importButton.type = 'button';
  importButton.addEventListener('click', () => importInput.click());
  actions.append(exportButton, importButton, importInput);
  section.append(actions);

  if (savedProducts.length === 0) {
    const empty = el('div', 'empty-state');
    empty.append(
      el('h2', 'empty-state__title', 'Wishlist masih kosong.'),
      el(
        'p',
        'empty-state__text',
        'Simpan produk dari kartu katalog atau halaman detail untuk menemukannya lagi.',
      ),
    );
    const link = el('a', 'btn btn--primary', 'Jelajahi katalog');
    link.href = '#/';
    empty.append(link);
    section.append(empty);
    return section;
  }

  const grid = el('div', 'product-grid');
  for (const product of savedProducts) {
    grid.append(createProductCard(product, state));
  }
  section.append(grid);
  return section;
}

function renderComparisonPage(products, state) {
  const selectedProducts = state.comparisonIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
  const section = el('section', 'collection-page container');
  section.append(
    el('p', 'page-eyebrow', 'BANDINGKAN PILIHAN'),
    el('h1', 'page-title', 'Perbandingan produk'),
    el(
      'p',
      'collection-page__intro',
      `Pilih hingga ${MAX_COMPARISON_PRODUCTS} produk untuk membandingkan kategori, harga, stok, dan deskripsi.`,
    ),
  );

  if (selectedProducts.length === 0) {
    const empty = el('div', 'empty-state');
    empty.append(
      el('h2', 'empty-state__title', 'Belum ada produk untuk dibandingkan.'),
      el(
        'p',
        'empty-state__text',
        'Tambahkan produk ke perbandingan dari kartu katalog atau halaman detail.',
      ),
    );
    const link = el('a', 'btn btn--primary', 'Jelajahi katalog');
    link.href = '#/';
    empty.append(link);
    section.append(empty);
    return section;
  }

  if (selectedProducts.length === 1) {
    section.append(
      el(
        'p',
        'comparison-page__hint',
        'Tambahkan satu produk lagi untuk membandingkan pilihan secara berdampingan.',
      ),
    );
  }

  const actions = el('div', 'comparison-page__actions');
  const clearButton = el('button', 'btn btn--secondary', 'Kosongkan perbandingan');
  clearButton.type = 'button';
  clearButton.addEventListener('click', () => {
    const result = state.onComparisonChange([]);
    if (!result.ok) {
      state.onRefresh({
        message: 'Daftar perbandingan gagal disimpan di browser.',
        type: 'error',
      });
      return;
    }
    state.onRefresh();
  });
  actions.append(clearButton);

  const grid = el('div', 'comparison-grid');
  for (const product of selectedProducts) {
    const card = el('article', 'comparison-card');
    const media = el('div', 'comparison-card__media');
    media.append(createProductImage(product, 'comparison-card__image', 'lazy'));

    const content = el('div', 'comparison-card__content');
    content.append(
      el('p', 'product-detail__category', product.kategori),
      el('h2', 'comparison-card__title', product.nama),
      el('p', 'comparison-card__price', formatRupiah(product.harga)),
      el(
        'p',
        product.stok > 0
          ? 'comparison-card__stock'
          : 'comparison-card__stock comparison-card__stock--out',
        product.stok > 0 ? `Stok: ${product.stok}` : 'Stok habis',
      ),
      el(
        'p',
        'comparison-card__description',
        product.deskripsi || 'Deskripsi produk belum tersedia.',
      ),
    );
    const detailLink = el('a', 'card__detail-link');
    appendIconLabel(detailLink, 'fa-solid fa-arrow-right', 'Lihat detail');
    detailLink.href = productDetailHref(product);
    content.append(detailLink);

    const removeButton = el('button', 'btn btn--secondary comparison-card__remove');
    appendIconLabel(removeButton, 'fa-solid fa-xmark', 'Hapus dari daftar');
    removeButton.type = 'button';
    removeButton.addEventListener('click', () => {
      const nextIds = state.comparisonIds.filter((id) => id !== product.id);
      const result = state.onComparisonChange(nextIds);
      if (!result.ok) {
        state.onRefresh({
          message: 'Daftar perbandingan gagal disimpan di browser.',
          type: 'error',
        });
        return;
      }
      state.onRefresh();
    });
    card.append(media, content, removeButton);
    grid.append(card);
  }
  section.append(actions, grid);

  const specificationNames = [
    ...new Set(
      selectedProducts.flatMap((product) =>
        (product.spesifikasi || []).map((specification) => specification.nama),
      ),
    ),
  ];
  if (specificationNames.length > 0) {
    const tableWrap = el('div', 'comparison-table-wrap');
    const table = el('table', 'comparison-table');
    table.append(
      el('caption', 'visually-hidden', 'Perbandingan spesifikasi produk'),
    );
    const head = el('thead');
    const headerRow = el('tr');
    const attributeHeading = el('th', null, 'Spesifikasi');
    attributeHeading.scope = 'col';
    headerRow.append(attributeHeading);
    for (const product of selectedProducts) {
      const heading = el('th', null, product.nama);
      heading.scope = 'col';
      headerRow.append(heading);
    }
    head.append(headerRow);
    const body = el('tbody');
    for (const name of specificationNames) {
      const row = el('tr');
      const label = el('th', null, name);
      label.scope = 'row';
      row.append(label);
      for (const product of selectedProducts) {
        const specification = (product.spesifikasi || []).find(
          (item) => item.nama === name,
        );
        row.append(el('td', null, specification?.nilai || '—'));
      }
      body.append(row);
    }
    table.append(head, body);
    tableWrap.append(table);
    section.append(
      el('h2', 'comparison-table-title', 'Spesifikasi berdampingan'),
      tableWrap,
    );
  }
  return section;
}

function renderSetupPage(products, state) {
  const section = el('section', 'setup-page container');
  section.append(
    el('p', 'page-eyebrow', 'RANCANGAN SEMENTARA'),
    el('h1', 'page-title', 'Perakit setup'),
    el(
      'p',
      'setup-page__intro',
      'Pilih satu keyboard, switch, keycaps, dan aksesori untuk melihat ringkasan serta estimasi harga.',
    ),
    el(
      'p',
      'setup-page__notice',
      'Ini hanya penjumlahan katalog demo. Kompatibilitas antarproduk tidak diperiksa; pastikan kecocokan layout, konektor, dan komponen sebelum membeli.',
    ),
  );

  const fields = el('div', 'setup-fields');
  const selectedProducts = [];
  for (const group of SETUP_GROUPS) {
    const categoryProducts = products.filter((product) =>
      group.categories.includes(product.kategori),
    );
    const selectedId = state.setupIds.find((id) =>
      categoryProducts.some((product) => product.id === id),
    );
    const field = el('label', 'setup-field');
    field.append(
      el('span', 'setup-field__label', group.title),
      el('span', 'setup-field__hint', group.categories.join(' / ')),
    );
    const select = el('select', 'catalog-toolbar__control');
    select.append(createOption('', 'Tidak dipilih'));
    for (const product of categoryProducts) {
      select.append(
        createOption(
          product.id,
          `${product.nama} · ${formatRupiah(product.harga)}${product.stok > 0 ? '' : ' · Stok habis'}`,
        ),
      );
    }
    select.value = selectedId || '';
    select.addEventListener('change', () => {
      const nextIds = state.setupIds.filter(
        (id) => !categoryProducts.some((product) => product.id === id),
      );
      if (select.value) nextIds.push(select.value);
      state.onSetupChange(nextIds);
      state.onRefresh();
    });
    field.append(select);
    fields.append(field);

    const selectedProduct = categoryProducts.find(
      (product) => product.id === selectedId,
    );
    if (selectedProduct) selectedProducts.push(selectedProduct);
  }

  const summary = el('section', 'setup-summary');
  summary.append(
    el('h2', 'setup-summary__title', 'Ringkasan pilihan'),
    el('p', 'setup-summary__note', `${selectedProducts.length} item dipilih`),
  );
  const total = selectedProducts.reduce((sum, product) => sum + product.harga, 0);
  summary.append(
    el('p', 'setup-summary__total-label', 'Estimasi total katalog'),
    el('p', 'setup-summary__total', formatRupiah(total)),
  );

  if (selectedProducts.length === 0) {
    summary.append(
      el(
        'p',
        'setup-summary__empty',
        'Pilih item di atas untuk mulai menyusun setup.',
      ),
    );
  } else {
    const list = el('ul', 'setup-summary__list');
    for (const product of selectedProducts) {
      const item = el('li', 'setup-summary__item');
      const info = el('div', 'setup-summary__product');
      info.append(
        el('span', 'setup-summary__category', product.kategori),
        el('span', 'setup-summary__name', product.nama),
        el('span', 'setup-summary__price', formatRupiah(product.harga)),
        el(
          'span',
          product.stok > 0
            ? 'setup-summary__stock'
            : 'setup-summary__stock setup-summary__stock--out',
          product.stok > 0 ? `Stok: ${product.stok}` : 'Stok habis',
        ),
      );
      const removeButton = el('button', 'btn btn--secondary setup-summary__remove');
      appendIconLabel(removeButton, 'fa-solid fa-xmark', 'Hapus');
      removeButton.type = 'button';
      removeButton.setAttribute('aria-label', `Hapus ${product.nama} dari setup`);
      removeButton.addEventListener('click', () => {
        state.onSetupChange(state.setupIds.filter((id) => id !== product.id));
        state.onRefresh();
      });
      item.append(info, removeButton);
      list.append(item);
    }
    summary.append(list);
  }

  section.append(fields, summary);
  return section;
}

function renderInfoPage(page) {
  const content = INFO_PAGES[page];
  const section = el('section', 'info-page container');
  const header = el('div', 'info-page__header');
  header.append(
    el('p', 'page-eyebrow', page === 'guide' ? 'PANDUAN' : page === 'faq' ? 'BANTUAN' : 'RAMY KEYS'),
    el('h1', 'page-title', content.title),
    el('p', 'info-page__intro', content.intro),
  );
  section.append(header);

  const entries = page === 'faq' ? content.questions : content.sections;
  const list = el('div', page === 'faq' ? 'faq-list' : 'info-card-grid');
  for (const entry of entries) {
    if (page === 'faq') {
      const item = el('details', 'faq-item');
      item.append(
        el('summary', 'faq-item__question', entry.question),
        el('p', 'faq-item__answer', entry.answer),
      );
      list.append(item);
      continue;
    }

    const card = el('article', 'info-card');
    card.append(
      el('h2', 'info-card__title', entry.title),
      el('p', 'info-card__text', entry.text),
    );
    list.append(card);
  }
  section.append(list);

  const catalogLink = el('a', 'btn btn--primary info-page__cta', 'Jelajahi katalog');
  catalogLink.href = '#/';
  section.append(catalogLink);
  return section;
}

function createOption(value, label) {
  const option = el('option', null, label);
  option.value = value;
  return option;
}

function renderCategoryOverview(products, title = 'Pilih jalur eksplorasi') {
  const overview = el('div', 'category-overview');
  overview.append(el('h3', 'category-overview__title', title));

  const categories = el('ul', 'category-list');
  categories.setAttribute('aria-label', 'Kategori produk');
  const categoryIcons = {
    'Keyboard Kit': 'fa-keyboard',
    'Prebuilt Keyboard': 'fa-keyboard',
    Switch: 'fa-toggle-on',
    Keycaps: 'fa-key',
    Aksesori: 'fa-plug',
  };

  for (const category of CATEGORIES) {
    const count = products.filter((product) => product.kategori === category).length;
    const item = el('li', 'category-chip');
    item.append(
      faIcon(`category-chip__icon fa-solid ${categoryIcons[category]}`),
      el('span', 'category-chip__name', category),
      el('span', 'category-chip__count', `${count} produk`),
    );
    categories.append(item);
  }

  overview.append(categories);
  return overview;
}

function renderSummaryCard(label, value, note, iconClass) {
  const card = el('div', 'summary-card');
  const heading = el('div', 'summary-card__heading');
  heading.append(
    faIcon(`summary-card__icon ${iconClass}`),
    el('p', 'summary-card__label', label),
  );
  card.append(
    heading,
    el('p', 'summary-card__value', String(value)),
    el('p', 'summary-card__note', note),
  );
  return card;
}

function createProductField(name, labelText, control, required = false) {
  const field = el('div', 'form-field');
  const label = el(
    'label',
    'form-field__label',
    required ? `${labelText} *` : labelText,
  );
  const error = el('p', 'form-field__error');

  control.id = `product-${name}`;
  control.name = name;
  control.classList.add('form-field__control');
  label.htmlFor = control.id;
  error.id = `${control.id}-error`;
  error.hidden = true;
  control.setAttribute('aria-describedby', error.id);
  field.append(label, control, error);

  return { field, control, error };
}

function createProductId() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function openProductForm(products, product, trigger, onProductsChange, onRefresh) {
  const dialog = el('dialog', 'product-dialog');
  dialog.setAttribute('aria-labelledby', 'product-dialog-title');

  const form = el('form', 'product-form');
  form.noValidate = true;
  const heading = el(
    'h2',
    'product-form__title',
    product ? 'Ubah produk' : 'Tambah produk',
  );
  heading.id = 'product-dialog-title';

  const nameInput = el('input');
  nameInput.type = 'text';
  nameInput.required = true;
  nameInput.maxLength = 80;
  nameInput.autocomplete = 'off';
  const nameField = createProductField('nama', 'Nama produk', nameInput, true);

  const categorySelect = el('select');
  categorySelect.required = true;
  categorySelect.append(createOption('', 'Pilih kategori'));
  for (const category of CATEGORIES) {
    categorySelect.append(createOption(category, category));
  }
  const categoryField = createProductField(
    'kategori',
    'Kategori',
    categorySelect,
    true,
  );

  const priceInput = el('input');
  priceInput.type = 'number';
  priceInput.inputMode = 'numeric';
  priceInput.min = '0';
  priceInput.step = '1';
  priceInput.required = true;
  const priceField = createProductField('harga', 'Harga (Rp)', priceInput, true);

  const stockInput = el('input');
  stockInput.type = 'number';
  stockInput.inputMode = 'numeric';
  stockInput.min = '0';
  stockInput.step = '1';
  stockInput.required = true;
  const stockField = createProductField('stok', 'Stok', stockInput, true);

  const numericFields = el('div', 'product-form__grid');
  numericFields.append(categoryField.field, priceField.field, stockField.field);

  const descriptionInput = el('textarea');
  descriptionInput.maxLength = 300;
  descriptionInput.rows = 4;
  const descriptionField = createProductField(
    'deskripsi',
    'Deskripsi (opsional)',
    descriptionInput,
  );
  const descriptionCount = el('span', 'form-field__count', '0/300');
  descriptionField.field.append(descriptionCount);
  descriptionInput.addEventListener('input', () => {
    descriptionCount.textContent = `${descriptionInput.value.length}/300`;
  });

  const specificationsInput = el('textarea');
  specificationsInput.rows = 5;
  specificationsInput.maxLength = 1000;
  specificationsInput.placeholder = 'Layout: 65%\nCasing: Aluminium';
  const specificationsField = createProductField(
    'spesifikasi',
    'Spesifikasi (opsional, satu per baris)',
    specificationsInput,
  );
  specificationsField.field.append(
    el(
      'span',
      'form-field__count',
      'Gunakan format nama: nilai, maksimal 8 baris.',
    ),
  );

  const imageInput = el('input');
  imageInput.type = 'text';
  imageInput.setAttribute('list', 'product-image-options');
  imageInput.placeholder = '/images/placeholder-default.svg';
  const imageField = createProductField(
    'imageUrl',
    'Gambar (path lokal)',
    imageInput,
  );

  const datalist = el('datalist');
  datalist.id = 'product-image-options';
  for (const imagePath of [
    '/images/placeholder-kit.svg',
    '/images/placeholder-prebuilt.svg',
    '/images/placeholder-switch.svg',
    '/images/placeholder-keycaps.svg',
    '/images/placeholder-accessory.svg',
    '/images/placeholder-default.svg',
  ]) {
    datalist.append(createOption(imagePath, imagePath));
  }

  const featuredInput = el('input');
  featuredInput.type = 'checkbox';
  featuredInput.name = 'unggulan';
  featuredInput.id = 'product-unggulan';
  const featuredLabel = el('label', 'product-form__checkbox');
  featuredLabel.append(
    featuredInput,
    el('span', null, 'Tandai sebagai produk unggulan'),
  );

  const formMessage = el('p', 'product-form__message');
  formMessage.setAttribute('role', 'alert');
  formMessage.hidden = true;

  const actions = el('div', 'product-form__actions');
  const cancelButton = el('button', 'btn btn--secondary');
  appendIconLabel(cancelButton, 'fa-solid fa-xmark', 'Batal');
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', () => dialog.close());
  const saveButton = el('button', 'btn btn--primary');
  appendIconLabel(saveButton, 'fa-solid fa-floppy-disk', 'Simpan');
  saveButton.type = 'submit';
  actions.append(cancelButton, saveButton);

  form.append(
    heading,
    el('p', 'product-form__hint', '* wajib diisi'),
    nameField.field,
    numericFields,
    descriptionField.field,
    specificationsField.field,
    imageField.field,
    datalist,
    featuredLabel,
    formMessage,
    actions,
  );
  dialog.append(form);

  const fields = {
    nama: nameField,
    kategori: categoryField,
    harga: priceField,
    stok: stockField,
    deskripsi: descriptionField,
    spesifikasi: specificationsField,
    imageUrl: imageField,
  };

  for (const field of Object.values(fields)) {
    const clearError = () => {
      field.control.removeAttribute('aria-invalid');
      field.control.classList.remove('is-invalid');
      field.error.textContent = '';
      field.error.hidden = true;
    };
    field.control.addEventListener('input', clearError);
    field.control.addEventListener('change', clearError);
  }

  if (product) {
    nameInput.value = product.nama;
    categorySelect.value = product.kategori;
    priceInput.value = String(product.harga);
    stockInput.value = String(product.stok);
    descriptionInput.value = product.deskripsi || '';
    descriptionCount.textContent = `${descriptionInput.value.length}/300`;
    specificationsInput.value = (product.spesifikasi || [])
      .map((item) => `${item.nama}: ${item.nilai}`)
      .join('\n');
    imageInput.value = product.imageUrl || '';
    featuredInput.checked = product.unggulan;
  }

  let imagePreview = createProductImage(
    {
      id: product?.id || '',
      nama: nameInput.value.trim() || 'Pratinjau gambar produk',
      kategori: categorySelect.value || 'Aksesori',
      imageUrl: imageInput.value.trim() || '/images/placeholder-default.svg',
    },
    'product-form__image-preview',
    'lazy',
  );
  imageField.field.append(imagePreview);
  const updateImagePreview = () => {
    const previewProduct = {
      id: product?.id || '',
      nama: nameInput.value.trim() || 'Pratinjau gambar produk',
      kategori: categorySelect.value || 'Aksesori',
      imageUrl: imageInput.value.trim() || '/images/placeholder-default.svg',
    };
    const nextPreview = createProductImage(
      previewProduct,
      'product-form__image-preview',
      'lazy',
    );
    imagePreview.replaceWith(nextPreview);
    imagePreview = nextPreview;
  };
  imageInput.addEventListener('input', updateImagePreview);
  categorySelect.addEventListener('change', updateImagePreview);
  nameInput.addEventListener('input', updateImagePreview);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage.hidden = true;
    formMessage.textContent = '';

    const input = {
      nama: nameInput.value,
      kategori: categorySelect.value,
      harga: priceInput.value,
      stok: stockInput.value,
      deskripsi: descriptionInput.value,
      spesifikasi: specificationsInput.value,
      imageUrl: imageInput.value,
      unggulan: featuredInput.checked,
    };
    const parsedSpecifications = parseProductSpecifications(input.spesifikasi);
    const validation = validateProduct({
      ...input,
      spesifikasi: parsedSpecifications.specifications,
    });
    if (!parsedSpecifications.valid) {
      validation.valid = false;
      validation.errors.spesifikasi = parsedSpecifications.error;
    }
    let firstInvalidField;

    for (const [name, field] of Object.entries(fields)) {
      const errorMessage = validation.errors[name];
      if (errorMessage) {
        field.error.textContent = `! ${errorMessage}`;
        field.error.hidden = false;
        field.control.setAttribute('aria-invalid', 'true');
        field.control.classList.add('is-invalid');
        if (!firstInvalidField) firstInvalidField = field.control;
      } else {
        field.error.textContent = '';
        field.error.hidden = true;
        field.control.removeAttribute('aria-invalid');
        field.control.classList.remove('is-invalid');
      }
    }

    if (!validation.valid) {
      firstInvalidField?.focus();
      return;
    }

    const normalizedProduct = {
      id: product ? product.id : createProductId(),
      nama: input.nama.trim(),
      kategori: input.kategori,
      harga: Number(input.harga),
      stok: Number(input.stok),
      deskripsi: input.deskripsi.trim(),
      spesifikasi: parsedSpecifications.specifications,
      imageUrl: input.imageUrl.trim() || '/images/placeholder-default.svg',
      unggulan: input.unggulan,
    };
    const nextProducts = product
      ? products.map((current) =>
          current.id === product.id ? normalizedProduct : current,
        )
      : [...products, normalizedProduct];
    const result = onProductsChange(nextProducts);

    if (!result.ok) {
      formMessage.textContent =
        'Gagal menyimpan ke browser. Perubahan tidak disimpan.';
      formMessage.hidden = false;
      return;
    }

    dialog.close();
    onRefresh({
      message: product ? 'Perubahan disimpan.' : 'Produk ditambahkan.',
      type: 'success',
    });
  });

  dialog.addEventListener('close', () => {
    dialog.remove();
    if (trigger.isConnected) trigger.focus();
  });
  document.body.append(dialog);
  dialog.showModal();
  nameInput.focus();
}

function renderProductTable(
  products,
  onProductsChange,
  onRefresh,
  allProducts = products,
) {
  if (products.length === 0) {
    const empty = el('div', 'empty-state');
    empty.append(
      el('h3', 'empty-state__title', 'Belum ada produk.'),
      el('p', 'empty-state__text', 'Tambahkan produk untuk menampilkannya di sini.'),
    );
    return empty;
  }

  const wrapper = el('div', 'dashboard-table-wrap');
  const table = el('table', 'dashboard-table');
  const caption = el('caption', 'visually-hidden', 'Daftar produk Ramy Keys');
  const head = el('thead');
  const headerRow = el('tr');
  for (const title of ['Produk', 'Kategori', 'Harga', 'Stok', 'Unggulan', 'Aksi']) {
    const cell = el('th', null, title);
    cell.scope = 'col';
    headerRow.append(cell);
  }
  head.append(headerRow);
  const body = el('tbody');

  for (const product of products) {
    const row = el('tr');
    const addCell = (label, text) => {
      const cell = el('td', null, text);
      cell.setAttribute('data-label', label);
      row.append(cell);
      return cell;
    };

    const productCell = addCell('Produk', '');
    productCell.classList.add('dashboard-table__product-cell');
    const productInfo = el('div', 'dashboard-table__product');
    productInfo.append(
      createProductImage(product, 'dashboard-table__image', 'lazy'),
      el('span', 'dashboard-table__product-name', product.nama),
    );
    productCell.append(productInfo);
    addCell('Kategori', product.kategori);
    addCell('Harga', formatRupiah(product.harga)).classList.add(
      'dashboard-table__numeric',
    );
    const stockCell = addCell('Stok', '');
    stockCell.classList.add('dashboard-table__numeric');
    const stockStatus = product.stok === 0
      ? 'dashboard-stock dashboard-stock--out'
      : product.stok <= LOW_STOCK
        ? 'dashboard-stock dashboard-stock--low'
        : 'dashboard-stock';
    stockCell.append(
      el(
        'span',
        stockStatus,
        product.stok === 0
          ? 'Habis'
          : product.stok <= LOW_STOCK
            ? `Rendah · ${product.stok}`
            : String(product.stok),
      ),
    );
    addCell('Unggulan', product.unggulan ? 'Ya' : '–');

    const actionsCell = addCell('Aksi', '');
    const actions = el('div', 'dashboard-table__actions');
    const editButton = el('button', 'btn btn--secondary');
    appendIconLabel(editButton, 'fa-solid fa-pen-to-square', 'Ubah');
    editButton.type = 'button';
    editButton.setAttribute('aria-label', `Ubah ${product.nama}`);
    editButton.addEventListener('click', () => {
      openProductForm(allProducts, product, editButton, onProductsChange, onRefresh);
    });

    const deleteButton = el('button', 'btn btn--danger');
    appendIconLabel(deleteButton, 'fa-solid fa-trash-can', 'Hapus');
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Hapus ${product.nama}`);
    deleteButton.addEventListener('click', () => {
      const confirmed = window.confirm(
        `Hapus "${product.nama}"? Tindakan ini tidak dapat dibatalkan.`,
      );
      if (!confirmed) return;

      const result = onProductsChange(
        allProducts.filter((current) => current.id !== product.id),
      );
      if (!result.ok) {
        onRefresh({
          message: 'Gagal menyimpan ke browser. Perubahan tidak disimpan.',
          type: 'error',
        });
        return;
      }
      onRefresh({ message: 'Produk dihapus.', type: 'success' });
    });
    actions.append(editButton, deleteButton);
    actionsCell.replaceChildren(actions);
    body.append(row);
  }

  table.append(caption, head, body);
  wrapper.append(table);
  return wrapper;
}

function renderDashboard(products, onProductsChange, onRefresh) {
  const stats = summarize(products);
  const section = el('section', 'dashboard container');

  const banner = el('div', 'banner');
  const bannerIcon = el('span', 'banner__icon');
  bannerIcon.append(faIcon('fa-solid fa-circle-info'));
  banner.append(
    bannerIcon,
    el(
      'span',
      'banner__text',
      'Dashboard Demo — data tersimpan di browser ini saja. Tidak ada login.',
    ),
  );

  section.append(
    banner,
    el('h1', 'page-title', 'Dashboard Pengelola (Demo)'),
  );

  const summary = el('div', 'summary-grid');
  summary.append(
    renderSummaryCard(
      'Total produk',
      stats.totalProducts,
      'item di katalog',
      'fa-solid fa-boxes-stacked',
    ),
    renderSummaryCard(
      'Total stok',
      stats.totalStock,
      'unit semua produk',
      'fa-solid fa-box',
    ),
    renderSummaryCard(
      'Stok habis',
      stats.outOfStock,
      'produk bernilai 0',
      'fa-solid fa-box-open',
    ),
  );

  const actions = el('div', 'dashboard-actions');
  const addButton = el('button', 'btn btn--primary');
  appendIconLabel(addButton, 'fa-solid fa-plus', 'Tambah produk');
  addButton.type = 'button';
  addButton.addEventListener('click', () => {
    openProductForm(products, null, addButton, onProductsChange, onRefresh);
  });

  const exportButton = el('button', 'btn btn--secondary');
  appendIconLabel(exportButton, 'fa-solid fa-file-export', 'Ekspor JSON');
  exportButton.type = 'button';
  exportButton.addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify(products, null, 2)], {
        type: 'application/json',
      });
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = el('a');
      downloadLink.href = objectUrl;
      downloadLink.download = 'ramykeys-products.json';
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      onRefresh({ message: 'Data produk diekspor ke JSON.', type: 'success' });
    } catch {
      onRefresh({ message: 'Gagal mengekspor data produk.', type: 'error' });
    }
  });

  const importInput = el('input');
  importInput.type = 'file';
  importInput.accept = '.json,application/json';
  importInput.hidden = true;
  importInput.addEventListener('change', async () => {
    const [file] = importInput.files || [];
    if (!file) return;

    let raw;
    try {
      raw = await file.text();
    } catch {
      importInput.value = '';
      onRefresh({ message: 'File JSON tidak dapat dibaca.', type: 'error' });
      return;
    }

    const imported = parseProductsJson(raw);
    if (!imported.ok) {
      importInput.value = '';
      onRefresh({ message: imported.error, type: 'error' });
      return;
    }

    const result = onProductsChange(imported.products);
    importInput.value = '';
    if (!result.ok) {
      onRefresh({
        message: 'Gagal menyimpan data impor ke browser.',
        type: 'error',
      });
      return;
    }
    onRefresh({ message: 'Data produk berhasil diimpor.', type: 'success' });
  });

  const importButton = el('button', 'btn btn--secondary');
  appendIconLabel(importButton, 'fa-solid fa-file-import', 'Impor JSON');
  importButton.type = 'button';
  importButton.addEventListener('click', () => importInput.click());

  const resetButton = el('button', 'btn btn--secondary');
  appendIconLabel(resetButton, 'fa-solid fa-arrow-rotate-left', 'Reset demo');
  resetButton.type = 'button';
  resetButton.addEventListener('click', () => {
    const confirmed = window.confirm(
      'Kembalikan ke 8 produk contoh? Perubahan Anda akan hilang.',
    );
    if (!confirmed) return;

    const result = onProductsChange(PRODUCTS.map((product) => ({ ...product })));
    if (!result.ok) {
      onRefresh({
        message: 'Gagal menyimpan data contoh ke browser.',
        type: 'error',
      });
      return;
    }
    onRefresh({ message: 'Data contoh dipulihkan.', type: 'success' });
  });

  actions.append(addButton, exportButton, importButton, resetButton, importInput);

  const productsSection = el('section', 'dashboard-products');
  const productSearchField = el('label', 'dashboard-products__search');
  productSearchField.append(el('span', 'catalog-toolbar__label', 'Cari produk'));
  const productSearch = el('input', 'catalog-toolbar__control');
  productSearch.type = 'search';
  productSearch.placeholder = 'Cari nama atau kategori…';
  productSearchField.append(productSearch);
  const productTableStatus = el('p', 'dashboard-products__status');
  productTableStatus.setAttribute('role', 'status');
  productTableStatus.setAttribute('aria-live', 'polite');
  const productTableContainer = el('div', 'dashboard-products__table');
  function updateProductTable() {
    const query = productSearch.value.trim().toLocaleLowerCase('id');
    const filteredProducts = products.filter((product) =>
      [product.nama, product.kategori].some((value) =>
        value.toLocaleLowerCase('id').includes(query),
      ),
    );
    productTableStatus.textContent = `Menampilkan ${filteredProducts.length} dari ${products.length} produk`;
    if (products.length > 0 && filteredProducts.length === 0) {
      const empty = el('div', 'empty-state');
      empty.append(
        el('h3', 'empty-state__title', 'Produk tidak ditemukan.'),
        el('p', 'empty-state__text', 'Coba kata kunci atau kategori lain.'),
      );
      productTableContainer.replaceChildren(empty);
      return;
    }

    productTableContainer.replaceChildren(
      renderProductTable(
        filteredProducts,
        onProductsChange,
        onRefresh,
        products,
      ),
    );
  }
  productSearch.addEventListener('input', updateProductTable);
  updateProductTable();
  productsSection.append(
    el('h2', 'dashboard-products__title', 'Daftar produk'),
    productSearchField,
    productTableStatus,
    productTableContainer,
  );

  section.append(
    summary,
    renderCategoryOverview(products, 'Kategori produk'),
    actions,
    productsSection,
  );
  return section;
}

function renderFooter() {
  const footer = el('footer', 'site-footer');
  const footerInner = el('div', 'container site-footer__inner');
  const footerBrand = el('a', 'site-footer__brand');
  footerBrand.href = '#/';
  appendIconLabel(footerBrand, 'fa-solid fa-keyboard', 'Ramy Keys');
  const footerCopy = el('div', 'site-footer__copy');
  footer.append(
    footerInner,
  );
  footerCopy.append(
    el('p', 'site-footer__text', 'Keyboard gear untuk ritme harianmu.'),
    el('p', 'site-footer__text', 'Produk dan stok adalah data demo fiktif.'),
  );
  const footerMeta = el('p', 'site-footer__meta');
  appendIconLabel(footerMeta, 'fa-brands fa-whatsapp', 'PESAN VIA WHATSAPP · RAMY KEYS');
  const footerLinks = el('nav', 'site-footer__links');
  footerLinks.setAttribute('aria-label', 'Halaman Ramy Keys');
  for (const [label, href] of [
    ['Panduan', '#/panduan'],
    ['FAQ', '#/faq'],
    ['Tentang', '#/tentang'],
    ['Perakit setup', '#/setup'],
    ['Wishlist', '#/wishlist'],
    ['Perbandingan', '#/perbandingan'],
  ]) {
    const link = el('a', 'site-footer__link', label);
    link.href = href;
    footerLinks.append(link);
  }
  footerInner.append(
    footerBrand,
    footerCopy,
    footerMeta,
    footerLinks,
  );
  return footer;
}

function renderNotice(notice, onDismissNotice) {
  if (!notice) return null;

  const type = notice.type === 'success' ? 'success' : 'error';
  const notification = el('div', `app-notice app-notice--${type}`);
  notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
  notification.setAttribute(
    'aria-live',
    type === 'error' ? 'assertive' : 'polite',
  );
  notification.append(el('p', 'app-notice__message', notice.message));

  const closeButton = el('button', 'btn btn--secondary', 'Tutup');
  closeButton.type = 'button';
  closeButton.addEventListener('click', onDismissNotice);
  notification.append(closeButton);
  return notification;
}

export function renderApp(
  root,
  {
    page,
    productId,
    products,
    wishlistIds,
    comparisonIds,
    setupIds,
    catalogFilters,
    notice,
    onDismissNotice,
    onProductsChange,
    onWishlistChange,
    onComparisonChange,
    onSetupChange,
    onCatalogFiltersChange,
    onRefresh,
  },
) {
  root.replaceChildren();

  const main = el('main', 'site-main');
  main.id = 'main';
  main.tabIndex = -1;
  const detailProduct =
    page === 'product' ? products.find((product) => product.id === productId) : null;
  const productIds = new Set(products.map((product) => product.id));
  const validWishlistIds = wishlistIds.filter((id) => productIds.has(id));
  const validComparisonIds = comparisonIds
    .filter((id) => productIds.has(id))
    .slice(0, MAX_COMPARISON_PRODUCTS);
  const validSetupIds = setupIds.filter((id) => productIds.has(id));
  const state = {
    wishlistIds: validWishlistIds,
    comparisonIds: validComparisonIds,
    setupIds: validSetupIds,
    catalogFilters,
    onWishlistChange,
    onComparisonChange,
    onSetupChange,
    onCatalogFiltersChange,
    onRefresh,
  };
  const wishlistCount = validWishlistIds.length;
  const comparisonCount = validComparisonIds.length;

  if (page === 'dashboard') {
    main.append(renderDashboard(products, onProductsChange, onRefresh));
  } else if (page === 'product') {
    main.append(renderProductDetail(detailProduct, products, state));
  } else if (page === 'wishlist') {
    main.append(renderWishlistPage(products, state));
  } else if (page === 'comparison') {
    main.append(renderComparisonPage(products, state));
  } else if (page === 'setup') {
    main.append(renderSetupPage(products, state));
  } else if (Object.prototype.hasOwnProperty.call(INFO_PAGES, page)) {
    main.append(renderInfoPage(page));
  } else {
    main.append(renderHero(products), renderCatalog(products, state));
  }

  root.append(renderHeader(page, wishlistCount, comparisonCount));
  const notification = renderNotice(notice, onDismissNotice);
  if (notification) root.append(notification);
  root.append(main, renderFooter());

  const pageTitles = {
    dashboard: 'Dashboard Demo — Ramy Keys',
    guide: 'Panduan — Ramy Keys',
    faq: 'FAQ — Ramy Keys',
    about: 'Tentang — Ramy Keys',
    wishlist: 'Wishlist — Ramy Keys',
    comparison: 'Perbandingan — Ramy Keys',
    setup: 'Perakit setup — Ramy Keys',
  };
  document.title =
    page === 'product'
      ? `${detailProduct ? detailProduct.nama : 'Produk tidak ditemukan'} — Ramy Keys`
      : pageTitles[page] || 'Katalog — Ramy Keys';
}
