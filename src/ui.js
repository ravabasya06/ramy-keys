/**
 * Lapisan tampilan: membangun antarmuka dengan createElement dan textContent.
 * Tidak ada data pengguna yang dimasukkan lewat innerHTML.
 */

import {
  CATEGORIES,
  buildWhatsAppUrl,
  filterProducts,
  LOW_STOCK,
  PRODUCTS,
  WA_NUMBER,
  validateProduct,
} from './products.js';
import { parseProductsJson, summarize } from './store.js';

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
  const ribbon = el('div', 'site-ribbon');
  const ribbonInner = el('div', 'container site-ribbon__inner');
  ribbonInner.append(
    el('span', null, 'MECHANICAL KEYBOARD · RAMY KEYS STUDIO'),
    el('span', null, 'PESAN LANGSUNG VIA WHATSAPP ↗'),
  );
  ribbon.append(ribbonInner);

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

  const cta = el(
    'a',
    'navbar__cta',
    page === 'catalog' ? 'Pilih produk' : 'Lihat katalog',
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

  const cta = el('a', 'btn btn--primary hero__cta', 'Jelajahi koleksi');
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

function renderCategoryOverview(products, title = 'Pilih jalur eksplorasi') {
  const overview = el('div', 'category-overview');
  overview.append(el('h3', 'category-overview__title', title));

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
  const cancelButton = el('button', 'btn btn--secondary', 'Batal');
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', () => dialog.close());
  const saveButton = el('button', 'btn btn--primary', 'Simpan');
  saveButton.type = 'submit';
  actions.append(cancelButton, saveButton);

  form.append(
    heading,
    el('p', 'product-form__hint', '* wajib diisi'),
    nameField.field,
    numericFields,
    descriptionField.field,
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
    imageInput.value = product.imageUrl || '';
    featuredInput.checked = product.unggulan;
  }

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
      imageUrl: imageInput.value,
      unggulan: featuredInput.checked,
    };
    const validation = validateProduct(input);
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

function renderProductTable(products, onProductsChange, onRefresh) {
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

    addCell('Produk', product.nama);
    addCell('Kategori', product.kategori);
    addCell('Harga', formatRupiah(product.harga)).classList.add(
      'dashboard-table__numeric',
    );
    addCell(
      'Stok',
      product.stok === 0 ? '0 (Habis)' : String(product.stok),
    ).classList.add('dashboard-table__numeric');
    addCell('Unggulan', product.unggulan ? 'Ya' : '–');

    const actionsCell = addCell('Aksi', '');
    const actions = el('div', 'dashboard-table__actions');
    const editButton = el('button', 'btn btn--secondary', 'Ubah');
    editButton.type = 'button';
    editButton.setAttribute('aria-label', `Ubah ${product.nama}`);
    editButton.addEventListener('click', () => {
      openProductForm(products, product, editButton, onProductsChange, onRefresh);
    });

    const deleteButton = el('button', 'btn btn--danger', 'Hapus');
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Hapus ${product.nama}`);
    deleteButton.addEventListener('click', () => {
      const confirmed = window.confirm(
        `Hapus "${product.nama}"? Tindakan ini tidak dapat dibatalkan.`,
      );
      if (!confirmed) return;

      const result = onProductsChange(
        products.filter((current) => current.id !== product.id),
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
    el('h1', 'page-title', 'Dashboard Pengelola (Demo)'),
  );

  const summary = el('div', 'summary-grid');
  summary.append(
    renderSummaryCard('Total produk', stats.totalProducts, 'item di katalog'),
    renderSummaryCard('Total stok', stats.totalStock, 'unit semua produk'),
    renderSummaryCard('Stok habis', stats.outOfStock, 'produk bernilai 0'),
  );

  const actions = el('div', 'dashboard-actions');
  const addButton = el('button', 'btn btn--primary', 'Tambah produk');
  addButton.type = 'button';
  addButton.addEventListener('click', () => {
    openProductForm(products, null, addButton, onProductsChange, onRefresh);
  });

  const exportButton = el('button', 'btn btn--secondary', 'Ekspor JSON');
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

  const importButton = el('button', 'btn btn--secondary', 'Impor JSON');
  importButton.type = 'button';
  importButton.addEventListener('click', () => importInput.click());

  const resetButton = el('button', 'btn btn--secondary', 'Reset demo');
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
  productsSection.append(
    el('h2', 'dashboard-products__title', 'Daftar produk'),
    renderProductTable(products, onProductsChange, onRefresh),
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
  const footerBrand = el('a', 'site-footer__brand', 'Ramy Keys');
  footerBrand.href = '#/';
  const footerCopy = el('div', 'site-footer__copy');
  footer.append(
    footerInner,
  );
  footerCopy.append(
    el('p', 'site-footer__text', 'Keyboard gear untuk ritme harianmu.'),
    el('p', 'site-footer__text', 'Produk dan stok adalah data demo fiktif.'),
  );
  footerInner.append(
    footerBrand,
    footerCopy,
    el('p', 'site-footer__meta', 'PESAN VIA WHATSAPP · RAMY KEYS'),
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
    products,
    notice,
    onDismissNotice,
    onProductsChange,
    onRefresh,
  },
) {
  root.replaceChildren();

  const main = el('main', 'site-main');
  main.id = 'main';
  main.tabIndex = -1;

  if (page === 'dashboard') {
    main.append(renderDashboard(products, onProductsChange, onRefresh));
  } else {
    main.append(renderHero(products), renderCatalog(products));
  }

  root.append(renderHeader(page));
  const notification = renderNotice(notice, onDismissNotice);
  if (notification) root.append(notification);
  root.append(main, renderFooter());

  document.title =
    page === 'dashboard'
      ? 'Dashboard Demo — Ramy Keys'
      : 'Katalog — Ramy Keys';
}
