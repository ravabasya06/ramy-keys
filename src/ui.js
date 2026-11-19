/**
 * Lapisan tampilan: membangun antarmuka dengan createElement dan textContent.
 * Tidak ada data pengguna yang dimasukkan lewat innerHTML.
 */

import { LOW_STOCK, WA_NUMBER } from './products.js';
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

function whatsAppUrl(product) {
  const message = `Halo Ramy Keys, saya ingin memesan: ${product.nama} (${formatRupiah(product.harga)}). Apakah masih tersedia?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
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

  inner.append(copy);
  hero.append(inner);
  return hero;
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
    link.href = whatsAppUrl(product);
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

function renderCatalog(products) {
  const section = el('section', 'section container');
  section.id = 'katalog';

  const head = el('div', 'section__head');
  head.append(
    el('h2', 'section__title', 'Produk Ramy Keys'),
    el(
      'p',
      'section__meta',
      `Menampilkan ${products.length} dari ${products.length} produk`,
    ),
  );
  section.append(head);

  if (products.length === 0) {
    section.append(renderEmptyCatalog());
    return section;
  }

  const grid = el('div', 'product-grid');
  for (const product of products) {
    grid.append(createProductCard(product));
  }
  section.append(grid);
  return section;
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
