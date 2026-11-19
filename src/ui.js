/**
 * Lapisan tampilan: membangun antarmuka dengan createElement dan textContent.
 * Tidak ada data pengguna yang dimasukkan lewat innerHTML.
 */

import {
  CATEGORIES,
  buildWhatsAppUrl,
  filterProducts,
  LOW_STOCK,
  WA_NUMBER,
} from './products.js';
import { summarize } from './store.js';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

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

function renderHeader(page) {
  const header = el('header', 'site-header');
  const nav = el('nav', 'navbar container');
  nav.setAttribute('aria-label', 'Navigasi utama');

  const brand = el('a', 'brand');
  brand.href = '#/';
  const mark = el('span', 'brand__mark', 'RK');
  mark.setAttribute('aria-hidden', 'true');
  brand.append(mark, el('span', 'brand__name', 'Ramy Keys'));

  const links = el('div', 'navbar__links');
  links.append(
    navLink('Katalog', null, '#/', page === 'catalog'),
    navLink('Dashboard', 'Dashboard Demo', '#/dashboard', page === 'dashboard'),
  );

  nav.append(brand, links);
  header.append(nav);
  return header;
}

function renderHero(products) {
  const stats = summarize(products);
  const hero = el('section', 'hero');
  const inner = el('div', 'container hero__inner');
  const copy = el('div', 'hero__copy');

  copy.append(
    el('p', 'hero__eyebrow', 'Ramy Keys · Keyboard & aksesori'),
    el(
      'h1',
      'hero__title',
      'Mechanical keyboard & aksesori untuk setiap gaya mengetik.',
    ),
    el(
      'p',
      'hero__text',
      'Kit, prebuilt, switch, dan keycaps — siap dipesan lewat WhatsApp.',
    ),
  );

  const cta = el('a', 'btn btn--primary hero__cta', 'Lihat Katalog');
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

  const board = el('div', 'keyboard-illustration__board');
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  for (const [rowIndex, letters] of rows.entries()) {
    const row = el('div', `keyboard-illustration__row keyboard-illustration__row--${rowIndex + 1}`);
    for (const letter of letters) {
      row.append(el('span', 'keyboard-illustration__key', letter));
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
  illustration.append(board);
  return illustration;
}

function createBadge(text, variant) {
  return el('span', `card__badge card__badge--${variant}`, text);
}

function createProductCard(product) {
  const card = el('article', 'card');
  const media = el('div', 'card__media');
  const badges = el('div', 'card__badges');

  if (product.unggulan) badges.append(createBadge('★ Unggulan', 'featured'));
  if (product.stok === 0) badges.append(createBadge('Habis', 'out'));

  const image = el('img', 'card__image');
  image.src = assetUrl(product.imageUrl);
  image.alt = product.nama;
  image.width = 800;
  image.height = 600;
  image.loading = 'lazy';
  image.addEventListener(
    'error',
    () => {
      image.src = assetUrl('/images/placeholder-default.svg');
    },
    { once: true },
  );

  media.append(image, badges);

  const body = el('div', 'card__body');
  body.append(
    el('p', 'card__category', product.kategori),
    el('h3', 'card__title', product.nama),
    el('p', 'card__price', formatRupiah(product.harga)),
  );

  let stockText = `Stok: ${product.stok}`;
  let stockClass = 'card__stock';
  if (product.stok === 0) {
    stockClass += ' card__stock--out';
  } else if (product.stok <= LOW_STOCK) {
    stockText = `! Sisa ${product.stok}`;
    stockClass += ' card__stock--low';
  }
  body.append(el('p', stockClass, stockText));

  if (product.stok > 0) {
    const link = el('a', 'btn btn--wa card__action', 'Pesan via WhatsApp');
    link.href = buildWhatsAppUrl(WA_NUMBER, product);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Pesan ${product.nama} via WhatsApp`);
    body.append(link);
  } else {
    const button = el('button', 'btn btn--wa card__action', 'Stok habis');
    button.type = 'button';
    button.disabled = true;
    body.append(button);
  }

  card.append(media, body);
  return card;
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

function renderCatalog(products) {
  const section = el('section', 'section container');
  section.id = 'katalog';
  const filters = { search: '', category: 'all', sort: 'default' };

  const head = el('div', 'section__head');
  head.append(
    el('h2', 'section__title', 'Produk Ramy Keys'),
  );

  const toolbar = el('div', 'catalog-toolbar');
  const searchField = el('label', 'catalog-toolbar__field catalog-toolbar__field--search');
  searchField.append(el('span', 'catalog-toolbar__label', 'Cari produk'));
  const searchInput = el('input', 'catalog-toolbar__control');
  searchInput.type = 'search';
  searchInput.placeholder = 'Cari nama, kategori, atau deskripsi…';
  searchField.append(searchInput);

  const categoryField = el('label', 'catalog-toolbar__field');
  categoryField.append(el('span', 'catalog-toolbar__label', 'Kategori'));
  const categorySelect = el('select', 'catalog-toolbar__control');
  categorySelect.append(createOption('all', 'Semua kategori'));
  for (const category of CATEGORIES) {
    categorySelect.append(createOption(category, category));
  }
  categoryField.append(categorySelect);

  const sortField = el('label', 'catalog-toolbar__field');
  sortField.append(el('span', 'catalog-toolbar__label', 'Urutkan'));
  const sortSelect = el('select', 'catalog-toolbar__control');
  sortSelect.append(
    createOption('default', 'Default'),
    createOption('price-asc', 'Harga termurah'),
    createOption('price-desc', 'Harga termahal'),
    createOption('name-asc', 'Nama A–Z'),
  );
  sortField.append(sortSelect);

  const resetButton = el('button', 'btn btn--secondary catalog-toolbar__reset', 'Reset filter');
  resetButton.type = 'button';
  toolbar.append(searchField, categoryField, sortField, resetButton);

  const status = el('p', 'section__meta catalog-results__status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const results = el('div', 'catalog-results');

  function updateResults() {
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
      grid.append(createProductCard(product));
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
  sortSelect.addEventListener('change', () => {
    filters.sort = sortSelect.value;
    updateResults();
  });
  resetButton.addEventListener('click', () => {
    filters.search = '';
    filters.category = 'all';
    filters.sort = 'default';
    searchInput.value = '';
    categorySelect.value = 'all';
    sortSelect.value = 'default';
    updateResults();
  });

  section.append(
    head,
    toolbar,
    renderCategoryOverview(products),
    status,
    results,
  );
  updateResults();
  return section;
}

function createOption(value, label) {
  const option = el('option', null, label);
  option.value = value;
  return option;
}

function renderCategoryOverview(products) {
  const overview = el('div', 'category-overview');
  overview.append(el('h3', 'category-overview__title', 'Jelajahi kategori'));

  const categories = el('ul', 'category-list');
  categories.setAttribute('aria-label', 'Kategori produk');

  for (const category of CATEGORIES) {
    const count = products.filter((product) => product.kategori === category).length;
    const item = el('li', 'category-chip');
    item.append(
      el('span', 'category-chip__name', category),
      el('span', 'category-chip__count', `${count} produk`),
    );
    categories.append(item);
  }

  overview.append(categories);
  return overview;
}

function renderSummaryCard(label, value, note) {
  const card = el('div', 'summary-card');
  card.append(
    el('p', 'summary-card__label', label),
    el('p', 'summary-card__value', String(value)),
    el('p', 'summary-card__note', note),
  );
  return card;
}

function renderDashboard(products) {
  const stats = summarize(products);
  const section = el('section', 'dashboard container');

  const banner = el('div', 'banner');
  banner.append(
    el('span', 'banner__icon', '(!)'),
    el(
      'span',
      'banner__text',
      'Dashboard Demo — data tersimpan di browser ini saja. Tidak ada login.',
    ),
  );

  section.append(
    banner,
    el('h1', 'page-title', 'Dashboard Demo'),
  );

  const summary = el('div', 'summary-grid');
  summary.append(
    renderSummaryCard('Total produk', stats.totalProducts, 'item di katalog'),
    renderSummaryCard('Total stok', stats.totalStock, 'unit semua produk'),
    renderSummaryCard('Stok habis', stats.outOfStock, 'produk bernilai 0'),
  );

  const note = el('div', 'panel');
  note.append(
    el('h2', 'panel__title', 'Pengelolaan produk'),
    el(
      'p',
      'panel__text',
      'Pengelolaan produk akan tersedia pada tahap berikutnya.',
    ),
  );

  const catalogLink = el('a', 'btn btn--secondary', 'Kembali ke Katalog');
  catalogLink.href = '#/';
  note.append(catalogLink);

  section.append(summary, note);
  return section;
}

function renderFooter() {
  const footer = el('footer', 'site-footer');
  footer.append(
    el(
      'p',
      'site-footer__text',
      'Ramy Keys — katalog demo latihan. Data contoh fiktif.',
    ),
    el(
      'p',
      'site-footer__text',
      'Nomor WhatsApp pada tombol pesan adalah nomor dummy.',
    ),
  );
  return footer;
}

export function renderApp(root, { page, products }) {
  root.replaceChildren();

  const main = el('main', 'site-main');
  main.id = 'main';
  main.tabIndex = -1;

  if (page === 'dashboard') {
    main.append(renderDashboard(products));
  } else {
    main.append(renderHero(products), renderCatalog(products));
  }

  root.append(renderHeader(page), main, renderFooter());

  document.title =
    page === 'dashboard'
      ? 'Dashboard Demo — Ramy Keys'
      : 'Katalog — Ramy Keys';
}
