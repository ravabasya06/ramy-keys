# UI-SPEC — Ramy Keys (`ramy-keys`)

| Item | Isi |
|---|---|
| Versi dokumen | 0.1 (Draft untuk latihan 1 hari) |
| Dokumen induk | `SPEC.md` v0.1 (fitur F-xx, NFR-xx, AC-xx dirujuk dari sana) |
| Cakupan | Spesifikasi visual, layout, komponen, perilaku antarmuka, dan wireframe teks |
| Tema | Ungu elegan & gelap (dark-only), sans-serif, mobile-first |
| Stack | Vite + JavaScript vanilla + CSS biasa (tanpa framework CSS, tanpa font/ikon eksternal) |
| Status kode | Belum ada. Dokumen ini hanya spesifikasi. |

---

## 1. Tujuan dan hubungan dengan SPEC.md

1. Menetapkan tampilan dan perilaku antarmuka agar implementasi cukup mengikuti dokumen ini tanpa mengambil keputusan desain baru di tengah jalan.
2. Menjamin aksesibilitas kontras dan keterbacaan sesuai NFR-U1 s.d. NFR-U5 pada `SPEC.md`.
3. Menyediakan kriteria penerimaan UI (Bagian 10) yang dapat diperiksa manual.

Dokumen ini **tidak menambah fitur** pada `SPEC.md`. Hero dan footer adalah elemen presentasi; angka di hero diambil dari `summarize()` yang sama dengan dashboard. Bila ada konflik, `SPEC.md` menang untuk perilaku/data, `UI-SPEC.md` menang untuk tampilan.

---

## 2. Prinsip desain

1. **Gelap tapi terbaca.** Latar ungu-hitam, teks terang. Semua teks lolos WCAG AA, sebagian besar AAA.
2. **Ungu sebagai identitas, bukan dekorasi.** Ungu dipakai untuk aksi utama, aksen, dan hero. Area baca (kartu, tabel, form) tetap tenang.
3. **Satu aksi hijau.** Hijau WhatsApp hanya dipakai pada tombol pesan agar mudah dikenali sebagai aksi pembelian.
4. **Mobile-first.** CSS dasar = layar 360 px; peningkatan lewat `@media (min-width: …)`.
5. **Jangan hanya warna.** Status (unggulan, habis, error, sisa stok) selalu punya teks atau simbol selain warna.
6. **Ringan.** Tanpa gambar hero, font web, atau pustaka ikon; hanya SVG lokal dan CSS.

---

## 3. Design tokens

Semua nilai didefinisikan sebagai CSS custom properties pada `:root` di `src/styles.css`.

### 3.1 Warna

| Token | Hex | Peran |
|---|---|---|
| `--color-bg` | `#120B1F` | Latar halaman |
| `--color-surface` | `#1A1230` | Navbar, toolbar, dialog, footer |
| `--color-card` | `#221840` | Kartu produk, kartu ringkasan, baris tabel |
| `--color-card-alt` | `#2A1F4D` | Hover baris tabel |
| `--color-input` | `#170F29` | Latar input/select/textarea |
| `--color-border` | `#4B3A7A` | Garis dekoratif (kartu, pemisah) |
| `--color-border-strong` | `#7C6BB0` | Batas kontrol interaktif (input, select, checkbox, tombol sekunder) |
| `--color-text` | `#F4EFFC` | Teks utama |
| `--color-text-muted` | `#BDB2D6` | Teks sekunder, label kecil |
| `--color-text-placeholder` | `#9A8FB8` | Placeholder input |
| `--color-primary` | `#6D28D9` | Tombol utama |
| `--color-primary-hover` | `#5B21B6` | Hover tombol utama |
| `--color-primary-active` | `#4C1D95` | Active tombol utama |
| `--color-primary-edge` | `#A78BFA` | Garis tepi tombol utama, hover border kartu |
| `--color-on-primary` | `#FFFFFF` | Teks di atas tombol utama |
| `--color-accent` | `#C4B5FD` | Tautan, nav aktif, judul aksen, kategori |
| `--color-wa` | `#25D366` | Tombol WhatsApp |
| `--color-wa-hover` | `#34D07A` | Hover tombol WhatsApp |
| `--color-on-wa` | `#0B1F12` | Teks di atas tombol WhatsApp |
| `--color-danger` | `#FCA5A5` | Teks/garis error dan status "Habis" |
| `--color-danger-solid` | `#B91C1C` | Latar tombol Hapus pada dialog konfirmasi |
| `--color-danger-active` | `#991B1B` | Active tombol Hapus |
| `--color-success` | `#86EFAC` | Notifikasi sukses |
| `--color-warning` | `#FCD34D` | Stok menipis ("Sisa N") |
| `--color-focus` | `#FACC15` | Cincin fokus |
| `--color-badge-featured-bg` / `-fg` | `#3B2A6B` / `#FDE68A` | Badge "Unggulan" |
| `--color-badge-out-bg` / `-fg` | `#3A1B2E` / `#FCA5A5` | Badge "Habis" |
| `--color-secondary-bg` / `-fg` | `#2E2257` / `#E9DDFF` | Tombol sekunder |
| `--color-secondary-hover` | `#3A2B6B` | Hover tombol sekunder |
| `--color-disabled-bg` / `-fg` | `#2A1F4A` / `#8F84AD` | Kontrol nonaktif |
| `--gradient-hero` | `linear-gradient(135deg, #2A1659 0%, #120B1F 100%)` | Latar hero |
| `--color-backdrop` | `rgba(10, 5, 20, 0.72)` | Latar belakang dialog |

Aturan: tidak ada warna lain di luar tabel ini tanpa memperbarui dokumen. Tema **hanya gelap**; `<meta name="color-scheme" content="dark">` dan `<meta name="theme-color" content="#120B1F">`. (Larangan "mode gelap" di `SPEC.md` Bagian 7 merujuk pada *tombol pengalih tema*, bukan tema gelap bawaan ini.)

### 3.2 Tipografi

Font **sans-serif sistem** (tanpa unduhan; sesuai NFR-S5):

```
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

Satu keluarga untuk semua teks. Angka harga/stok memakai `font-variant-numeric: tabular-nums`. Semua ukuran dalam `rem` (basis 16 px) agar mengikuti pengaturan ukuran teks pengguna.

| Peran | Mobile | ≥ 768 px | Berat | Line-height |
|---|---|---|---|---|
| H1 hero | `clamp(2rem, 1.2rem + 3.5vw, 3.25rem)` | (fluid) | 700 | 1.15 |
| H1 halaman dashboard | 1.5rem | 1.875rem | 700 | 1.2 |
| H2 judul seksi | 1.5rem | 1.875rem | 700 | 1.25 |
| H3 nama produk | 1.0625rem | 1.125rem | 600 | 1.3 |
| Body | 1rem | 1rem | 400 | 1.6 |
| Label / teks kecil | 0.875rem | 0.875rem | 500 | 1.4 |
| Harga | 1.125rem | 1.25rem | 700 | 1.2 |
| Angka ringkasan | 2rem | 2.25rem | 700 | 1.1 |
| Tombol | 1rem | 1rem | 600 | 1.2 |

Ukuran terkecil yang diizinkan: **0.875rem (14 px)**. Tidak ada teks kapital semua; panjang baris teks bacaan maksimal ±65 karakter.

### 3.3 Spacing, radius, bayangan

| Token | Nilai |
|---|---|
| `--space-1 … --space-8` | 4, 8, 12, 16, 24, 32, 48, 64 px |
| `--radius-sm` | 8 px (input, tombol, badge persegi) |
| `--radius-md` | 14 px (kartu, dialog) |
| `--radius-pill` | 999 px (chip, badge) |
| `--shadow-card` | `0 8px 24px rgba(0, 0, 0, 0.35)` |
| `--tap-min` | 44 px (tinggi/lebar minimum target sentuh) |

### 3.4 Breakpoint dan container

Mobile-first: gaya dasar untuk lebar 320–767 px, peningkatan dengan `min-width`.

| Nama | Lebar | Perubahan utama |
|---|---|---|
| base | 320–767 px | 1 kolom; filter dalam `<details>`; tabel dashboard menjadi kartu; form layar penuh |
| `md` | ≥ 768 px | Hero 2 kolom; toolbar inline & selalu terbuka; tabel dashboard; form berupa dialog tengah |
| `lg` | ≥ 1024 px | Padding container lebih longgar |
| `xl` | ≥ 1200 px | Container mencapai lebar maksimum |

- Container: `max-width: 1200px; margin-inline: auto;` padding inline 16 px (base), 24 px (`md`), 32 px (`lg`).
- Ritme vertikal antar-seksi: 32 px (base), 48 px (`md`+).
- **Grid produk:** `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` dengan gap 16 px (base) / 24 px (`md`+). Hasil: 1 kolom pada ponsel, 2 kolom pada tablet, 3 kolom pada ≥ 1024 px, 4 kolom pada ≥ 1200 px. Tidak perlu media query terpisah.

### 3.5 Gerak

- Transisi hanya `color`, `background-color`, `border-color`, `box-shadow`; durasi 150 ms, `ease`.
- Tidak ada animasi otomatis, parallax, atau carousel.
- `@media (prefers-reduced-motion: reduce)`: semua transisi dan `scroll-behavior: smooth` dimatikan.

---

## 4. Aksesibilitas dan kontras

### 4.1 Rasio kontras (dihitung dengan rumus luminans relatif WCAG 2.x)

Teks normal wajib ≥ 4,5:1; komponen UI/grafis non-teks ≥ 3:1.

| Pasangan | Rasio | Kriteria |
|---|---:|---|
| `text` `#F4EFFC` di atas `bg` `#120B1F` | 17,01 | AAA |
| `text` di atas `surface` `#1A1230` | 15,85 | AAA |
| `text` di atas `card` `#221840` | 14,61 | AAA |
| `text` di atas hero `#2A1659` | 13,70 | AAA |
| `text-muted` `#BDB2D6` di atas `bg` / `surface` / `card` | 9,61 / 8,95 / 8,25 | AAA |
| `text-muted` di atas hero `#2A1659` | 7,74 | AAA |
| Placeholder `#9A8FB8` di atas `input` `#170F29` | 6,15 | AA |
| Teks input `#F4EFFC` di atas `input` | 16,36 | AAA |
| `on-primary` `#FFFFFF` di atas `primary` `#6D28D9` | 7,10 | AAA |
| `#FFFFFF` di atas `primary-hover` `#5B21B6` / `primary-active` `#4C1D95` | 8,98 / 10,95 | AAA |
| `accent` `#C4B5FD` di atas `bg` / `surface` / `card` | 10,40 / 9,70 / 8,94 | AAA |
| `on-wa` `#0B1F12` di atas `wa` `#25D366` / `wa-hover` `#34D07A` | 8,69 / 8,57 | AAA |
| `danger` `#FCA5A5` di atas `card` / `bg` / `input` | 8,69 / 10,12 / 9,73 | AAA |
| `#FFFFFF` di atas `danger-solid` `#B91C1C` / `danger-active` `#991B1B` | 6,47 / 8,31 | AA / AAA |
| `success` `#86EFAC` di atas `card` | 11,75 | AAA |
| `warning` `#FCD34D` di atas `card` | 11,44 | AAA |
| Badge Unggulan `#FDE68A` di atas `#3B2A6B` | 9,75 | AAA |
| Badge Habis `#FCA5A5` di atas `#3A1B2E` | 8,04 | AAA |
| Tombol sekunder `#E9DDFF` di atas `#2E2257` / hover `#3A2B6B` | 10,96 / 9,35 | AAA |
| **Non-teks:** `border-strong` `#7C6BB0` di atas `input` / `surface` / `card` / `bg` | 4,04 / 3,91 / 3,60 / 4,20 | ≥ 3:1 |
| **Non-teks:** `primary-edge` `#A78BFA` di atas `card` / `bg` | 6,06 / 7,06 | ≥ 3:1 |
| **Non-teks:** cincin fokus `#FACC15` di atas `bg` / `surface` / `card` / `primary` | 12,54 / 11,69 / 10,77 / 4,64 | ≥ 3:1 |
| Dikecualikan: teks nonaktif `#8F84AD` di atas `#2A1F4A` | 4,36 | Komponen nonaktif dikecualikan; label tetap menjelaskan ("Stok habis") |
| Dekoratif saja: `border` `#4B3A7A` di atas `card` / `bg` | 1,72 / 2,00 | Tidak boleh menjadi satu-satunya penanda batas kontrol |

Catatan: tombol utama (`#6D28D9`) hanya 2,70:1 terhadap `bg`, sehingga **wajib** memiliki garis tepi 1 px `#A78BFA` agar batas tombol terlihat ≥ 3:1. Verifikasi ulang dengan DevTools (Bagian 10).

### 4.2 Aturan aksesibilitas wajib

1. **Fokus terlihat:** `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }` untuk semua elemen interaktif. Dilarang `outline: none` tanpa pengganti.
2. **Target sentuh ≥ 44 × 44 px** untuk tombol, tautan navbar, checkbox/toggle (area label ikut diklik), dan tombol di tabel.
3. **Bukan hanya warna:** unggulan = teks "Unggulan" + simbol `★`; habis = teks "Habis"; stok menipis = teks "Sisa N" + simbol `!`; error = teks + simbol `!` + `aria-invalid`.
4. **Bahasa & zoom:** `<html lang="id">`; viewport `width=device-width, initial-scale=1` (tanpa `user-scalable=no`); konten tetap utuh pada zoom 200% dan reflow pada lebar 320 px (zoom 400%) tanpa scroll horizontal pada halaman.
5. **Teks di atas gradien:** teks hero hanya di area gradien terang `#2A1659` ke gelap; kontras terendah tetap ≥ 7:1 (lihat tabel).
6. **Gerak:** hormati `prefers-reduced-motion` (Bagian 3.5).
7. **Gambar:** `alt` = nama produk; ilustrasi dekoratif (hero, ikon) memakai `aria-hidden="true"` dan `alt=""`.

### 4.3 Struktur semantik

| Elemen | Aturan |
|---|---|
| Skip link | Tautan pertama di `<body>`: "Lewati ke konten utama" → `#main`; tersembunyi sampai fokus |
| Landmark | `<header>` (berisi `<nav aria-label="Navigasi utama">`), `<main id="main">`, `<footer>` |
| Navbar | Tautan halaman aktif memakai `aria-current="page"` |
| Heading | Satu `<h1>` per halaman; urutan `h1 → h2 → h3` tanpa lompat |
| Pencarian | `<input type="search">` dengan `<label>` tersembunyi visual ("Cari produk") |
| Filter | `<select>` dan checkbox memakai `<label>` terlihat |
| Jumlah hasil | Elemen `role="status"` (`aria-live="polite"`): "Menampilkan 5 dari 8 produk" |
| Kartu produk | `<article>` dengan `<h3>` nama produk |
| Tombol WA | Stok > 0: `<a>` bergaya tombol dengan `aria-label="Pesan {nama} via WhatsApp"`; stok 0: `<button disabled>` |
| Tabel dashboard | `<table>` dengan `<caption>` (tersembunyi visual), `<th scope="col">`; tombol Ubah/Hapus memakai `aria-label="Ubah {nama}"` / `"Hapus {nama}"` |
| Form | Tiap field: `<label for>`, `required`, `aria-invalid`, `aria-describedby` ke pesan error/bantuan; saat gagal validasi fokus pindah ke field invalid pertama |
| Dialog | Elemen `<dialog>` native (`showModal()`): fokus awal ke field pertama (form) atau tombol "Batal" (konfirmasi); `Esc` menutup; fokus kembali ke pemicu |
| Notifikasi | `role="status"` (info/sukses), `role="alert"` (error penyimpanan) |

---

## 5. Layout global dan pola responsif

- **Urutan halaman katalog (`#/`):** skip link → navbar → hero → toolbar (`id="katalog"`) → grid produk → footer.
- **Urutan halaman dashboard (`#/dashboard`):** skip link → navbar → banner demo → judul + ringkasan → aksi → daftar produk → footer.
- **Navbar:** `position: sticky; top: 0`, latar `surface`, garis bawah `border`. Hanya dua tautan, jadi **tidak memakai hamburger**; keduanya selalu terlihat. Label ponsel: "Katalog" dan "Dashboard"; label `md`+: "Katalog" dan "Dashboard Demo".
- **Hero:** hanya di halaman katalog. Ponsel: teks saja, CTA lebar penuh. `md`+: 2 kolom (teks kiri, ilustrasi keycap SVG dekoratif kanan).
- **Toolbar:** ponsel: kolom pencarian selalu terlihat; kontrol lain di dalam `<details>` ("Filter & urutkan (N aktif)") yang tertutup. `md`+: semua kontrol terlihat inline; `<details>` dibuka otomatis dan ringkasannya disembunyikan (`matchMedia('(min-width: 768px)')`, ikut berubah saat ukuran jendela berubah).
- **Dashboard:** ringkasan 3 kolom pada semua ukuran (ringkas di ponsel); tombol aksi lebar penuh di ponsel; tabel pada `md`+ dan kartu bertumpuk di ponsel (pola *responsive table* dengan atribut `data-label`).
- **Form tambah/ubah:** ponsel = panel layar penuh (`100dvh`) dengan tombol Batal/Simpan menempel di bawah; `md`+ = dialog tengah lebar maks. 640 px.

---

## 6. Spesifikasi komponen

### 6.1 Navbar
- Tinggi 56 px (base) / 64 px (`md`+). Kiri: logo kotak 32 px (latar `accent`, teks "RK" warna `surface`, `aria-hidden`) + teks "Ramy Keys" (700). Kanan: dua tautan.
- Tautan: teks `text-muted`, hover `text`, aktif `text` + garis bawah 3 px `accent`. Tinggi area klik ≥ 44 px.

### 6.2 Hero
- Latar `--gradient-hero`; padding 32 px × 16 px (base), 64 px × 32 px (`md`+).
- Konten: H1 ("Mechanical keyboard & aksesori untuk setiap gaya mengetik."), paragraf pendukung (`text-muted`), tombol utama "Lihat Katalog" (tautan ke `#katalog`; lebar penuh di ponsel), chip info "N produk | N stok" (dari `summarize()`).
- Ilustrasi: SVG keycap inline, hanya tampil ≥ `md`, dekoratif. **Boleh dilewati jika waktu mepet** (hero tetap valid tanpa ilustrasi).

### 6.3 Toolbar pencarian, filter, sorting
| Kontrol | Spesifikasi |
|---|---|
| Pencarian | `type="search"`, placeholder "Cari nama, kategori, atau deskripsi…", tinggi 44 px, lebar penuh |
| Kategori | `<select>`: "Semua kategori" + 5 kategori dari SPEC 4.1 |
| Urutkan | `<select>`: Default, Harga termurah, Harga termahal, Nama A–Z, Stok terbanyak |
| Toggle | Dua checkbox: "Hanya unggulan", "Hanya tersedia" |
| Reset | Tombol sekunder "Reset filter"; selalu aktif |
| Jumlah hasil | Teks `role="status"`: "Menampilkan {n} dari {total} produk" |
| Ringkasan `<details>` (ponsel) | "Filter & urutkan ({k} aktif)" dengan k = jumlah kontrol selain default (kategori ≠ Semua, sort ≠ Default, tiap toggle on) |

Wadah toolbar: latar `surface`, border `border`, radius `md`, padding 16 px; jarak antar-kontrol 12 px. Input/select: latar `input`, border 1 px `border-strong`, radius `sm`, teks `text`; hover border `accent`.

### 6.4 Kartu produk dan grid
- Latar `card`, border 1 px `border`, radius `md`, `overflow: hidden`; hover: border → `primary-edge` (tanpa naik/geser karena kartu bukan tautan).
- Gambar: rasio 4:3, `object-fit: cover`, atribut `width`/`height` diisi (hindari layout shift), `loading="lazy"`, `onerror` → `/images/placeholder-default.svg`.
- Badge "★ Unggulan" menimpa pojok kiri atas gambar; badge "Habis" menimpa pojok kiri atas bila stok 0 (jika unggulan *dan* habis, tampilkan keduanya bertumpuk, "Habis" di atas).
- Isi (padding 16 px): kategori (0.875rem, `accent`) → nama (H3, maks. 2 baris lalu ellipsis; tinggi 2 baris dicadangkan agar kartu sejajar) → harga → stok → tombol WhatsApp (lebar penuh, `margin-top: auto` agar tombol sejajar di dasar kartu).
- Teks stok: stok > 5 → "Stok: N" (`text-muted`); 1–5 → "! Sisa N" (`warning`); 0 → "Stok: 0" + badge "Habis". Ambang menipis `LOW_STOCK = 5` ada di `src/config.js`.
- Harga: format Rupiah dari SPEC (`Rp 1.450.000`), tidak pernah dipotong; boleh turun baris pada layar sangat sempit.

### 6.5 Tombol

| Varian | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| **Utama** (hero, Simpan, Tambah) | bg `#6D28D9`, teks `#FFFFFF`, border `#A78BFA` | bg `#5B21B6` | bg `#4C1D95` | bg `#2A1F4A`, teks `#8F84AD`, border `#4B3A7A` |
| **WhatsApp** | bg `#25D366`, teks `#0B1F12` | bg `#34D07A` | bg `#25D366` + geser 1 px ke bawah | bg `#2A1F4A`, teks `#8F84AD`, label "Stok habis" |
| **Sekunder** (Batal, Reset, Ubah) | bg `#2E2257`, teks `#E9DDFF`, border `#7C6BB0` | bg `#3A2B6B` | bg `#2E2257` | seperti Utama nonaktif |
| **Bahaya** (Hapus di tabel) | bg transparan, teks `#FCA5A5`, border `#FCA5A5` | bg `#3A1B2E` | bg `#2E1530` | seperti Utama nonaktif |
| **Bahaya solid** (Hapus di dialog) | bg `#B91C1C`, teks `#FFFFFF` | bg `#991B1B` | bg `#7F1D1D` | — |

Semua tombol: tinggi min. 44 px, radius `sm`, padding inline 16 px, berat 600, fokus memakai cincin kuning (4.2). Tombol WhatsApp memakai ikon opsional (SVG inline `aria-hidden`) di kiri teks "Pesan via WhatsApp".

### 6.6 Ringkasan dashboard
- Tiga kartu (`Total produk`, `Total stok`, `Stok habis`): latar `card`, angka 2rem/700, label 0.875rem `text-muted`. Ponsel: 3 kolom rapat (padding 12 px, label boleh membungkus 2 baris); `md`+: padding 16 px dengan keterangan kecil.

### 6.7 Tabel dashboard
- `md`+: tabel dalam wadah `overflow-x: auto`; kolom Produk, Kategori, Harga (rata kanan), Stok (rata kanan), Unggulan ("Ya"/"–"), Aksi (Ubah, Hapus). Header latar `surface`, baris latar `card`, garis antar-baris `border`, hover baris `card-alt`. Stok 0 diberi teks "0 (Habis)".
- Ponsel: tiap baris menjadi kartu (latar `card`, radius `md`); setiap sel diawali label dari `data-label` ("Harga", "Stok", …); Ubah dan Hapus berdampingan sama lebar.

### 6.8 Form tambah/ubah
- Urutan: Nama → Kategori, Harga, Stok → Deskripsi (penghitung `n/300`) → Gambar (input teks + `<datalist>` berisi 6 path placeholder) → checkbox "Tandai sebagai produk unggulan" → tombol Batal & Simpan.
- Label di atas field, penanda wajib `*` dengan teks bantuan "* wajib diisi". Harga/stok: `type="number"`, `inputmode="numeric"`, `min="0"`, `step="1"`.
- Error: teks `danger` diawali "!" di bawah field + border field `danger` (2 px) + `aria-invalid="true"`. Error ditampilkan saat Simpan ditekan dan dihapus saat field diperbaiki.
- Jarak antar-field 16 px; dialog `md`+: lebar 640 px, latar `surface`, border `border`, radius `md`, `--shadow-card`.

### 6.9 Dialog konfirmasi, notifikasi, dan state kosong
- **Konfirmasi hapus / reset:** `<dialog>` kecil (lebar maks. 420 px); fokus awal pada tombol "Batal"; tombol "Hapus"/"Reset" memakai Bahaya solid. (Implementasi boleh memakai `window.confirm()` sebagai cadangan sesuai SPEC 3.1.)
- **Notifikasi:** muncul di bawah tengah layar, lebar maks. 560 px, latar `surface`, border sesuai jenis (info = `accent`, sukses = `success`, error = `danger`), selalu ada tombol "Tutup". Sukses menutup otomatis setelah 5 detik; error/peringatan tetap sampai ditutup.
- **State kosong:** kotak berborder putus-putus `border` di tengah area grid, berisi judul, kalimat singkat, dan satu tombol aksi (Reset filter / Buka Dashboard).

---

## 7. Wireframe teks

Legenda: `[ Teks ]` tombol · `( … )` input teks · `[ … ▼ ]` select · `[ ]` / `[x]` checkbox · `░` gambar/placeholder · `═` penanda tautan nav aktif · `(!)` banner peringatan · `<-` anotasi (tidak tampil di UI).
Lebar mobile ±360 px; lebar desktop ±1200 px (wireframe diskalakan).

### 7.1 Desktop — Katalog (≥ 1024 px)

```text
┌─ SKIP LINK + NAVBAR (sticky) ──────────────────────────────────────────────────────┐
│  [Lewati ke konten utama]  <- muncul saat Tab pertama                              │
│  [RK] Ramy Keys                                         Katalog    Dashboard Demo  │
│                                                         ═══════                    │
├─ HERO ─────────────────────────────────────────────────────────────────────────────┤
│                                                  ┌──────────────────────────────┐  │
│  Mechanical keyboard & aksesori                  │                              │  │
│  untuk setiap gaya mengetik.                     │  [Q][W][E][R][T][Y][U][I]    │  │
│                                                  │   [A][S][D][F][G][H][J][K]   │  │
│  Kit, prebuilt, switch, dan keycaps              │  [Z][X][C][V][B][N][M][,]    │  │
│  siap dipesan lewat WhatsApp.                    │   [      SPACE       ]       │  │
│                                                  │                              │  │
│  [ Lihat Katalog ]  8 produk | 107 stok          │   ilustrasi dekoratif        │  │
│                                                  └──────────────────────────────┘  │
├─ TOOLBAR PENCARIAN, FILTER, SORT  (id: katalog) ───────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │ ( Cari nama, kategori, atau deskripsi...                                   ) │  │
│  │ Kategori [Semua kategori ▼]   Urutkan [Default ▼]           [ Reset filter ] │  │
│  │ [ ] Hanya unggulan   [ ] Hanya tersedia          Menampilkan 8 dari 8 produk │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
├─ GRID PRODUK (3 kolom; 4 kolom di >= 1200px) ──────────────────────────────────────┤
│                                                                                    │
│  Semua Produk                                                                      │
│                                                                                    │
│  ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐  │
│  │ [* Unggulan] ░░░░░░░░░░│ │░░░░░░░░░░░░░░░░░░░░░░░░│ │ [* Unggulan] ░░░░░░░░░░│  │
│  │░░░░░░ gambar 4:3 ░░░░░░│ │░░░░░░ gambar 4:3 ░░░░░░│ │░░░░░░ gambar 4:3 ░░░░░░│  │
│  │░░░░░░░░░░░░░░░░░░░░░░░░│ │░░░░░░░░░░░░░░░░░░░░░░░░│ │░░░░░░░░░░░░░░░░░░░░░░░░│  │
│  │ Keyboard Kit           │ │ Keyboard Kit           │ │ Prebuilt Keyboard      │  │
│  │ Ramy65 Aluminum Kit    │ │ Ramy75 Gasket Kit      │ │ Ramy Tactile 68        │  │
│  │                        │ │ Hot-swap               │ │ Prebuilt               │  │
│  │ Rp 1.450.000           │ │ Rp 1.100.000           │ │ Rp 1.850.000           │  │
│  │ Stok: 6                │ │ ! Sisa 4               │ │ ! Sisa 5               │  │
│  │ [ Pesan via WhatsApp ] │ │ [ Pesan via WhatsApp ] │ │ [ Pesan via WhatsApp ] │  │
│  └────────────────────────┘ └────────────────────────┘ └────────────────────────┘  │
│                                                                                    │
│  ... baris berikutnya (5 produk lagi) ...                                          │
│                                                                                    │
├─ FOOTER ───────────────────────────────────────────────────────────────────────────┤
│  Ramy Keys - katalog demo latihan. Data contoh fiktif.                             │
│  Nomor WhatsApp pada tombol pesan adalah nomor dummy.                              │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Anatomi kartu produk

```text
┌────────────────────────┐  
│ [* Unggulan] ░░░░░░░░░░│  <- badge Unggulan (overlay kiri atas gambar)
│░░░░░░ gambar 4:3 ░░░░░░│  <- gambar 4:3, alt = nama produk
│░░░░░░░░░░░░░░░░░░░░░░░░│  
│ Keyboard Kit           │  <- kategori (kecil, warna aksen)
│ Ramy65 Aluminum Kit    │  <- nama (maks. 2 baris, lalu ellipsis)
│                        │  
│ Rp 1.450.000           │  <- harga (tebal, angka tabular)
│ Stok: 6                │  <- stok: "Stok: N" / "! Sisa N" / "Habis"
│ [ Pesan via WhatsApp ] │  <- tombol WhatsApp (hijau, lebar penuh)
└────────────────────────┘  
```

### 7.3 Desktop — Dashboard demo (≥ 768 px)

```text
┌─ NAVBAR (Dashboard Demo aktif) ────────────────────────────────────────────────────┐
│  [RK] Ramy Keys                                         Katalog    Dashboard Demo  │
│                                                                    ══════════════  │
├─ BANNER DEMO (selalu tampil) ──────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │ (!) DASHBOARD DEMO - data tersimpan di browser ini saja. Tidak ada login.    │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
├─ JUDUL + RINGKASAN ────────────────────────────────────────────────────────────────┤
│  Dashboard Pengelola (Demo)                                                        │
│                                                                                    │
│  ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐  │
│  │ Total produk           │ │ Total stok             │ │ Stok habis             │  │
│  │ 8                      │ │ 107                    │ │ 1                      │  │
│  │ item di katalog        │ │ unit semua produk      │ │ produk bernilai 0      │  │
│  └────────────────────────┘ └────────────────────────┘ └────────────────────────┘  │
│                                                                                    │
├─ AKSI ─────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  [ + Tambah produk ]   [ Reset data contoh ]                                       │
│                                                                                    │
├─ TABEL PRODUK (>= 768px) ──────────────────────────────────────────────────────────┤
│                                                                                    │
│  Produk                Kategori           Harga         Stok  Ung.  Aksi           │
│  ────────────────────────────────────────────────────────────────────────────────  │
│  Ramy65 Aluminum Kit   Keyboard Kit       Rp 1.450.000  6     Ya    [Ubah][Hapus]  │
│  Ramy75 Gasket Kit     Keyboard Kit       Rp 1.100.000  4     -     [Ubah][Hapus]  │
│  Hot-swap                                                                          │
│  Ramy Tactile 68       Prebuilt Keyboard  Rp 1.850.000  5     Ya    [Ubah][Hapus]  │
│  Prebuilt                                                                          │
│  Ramy Compact 60       Prebuilt Keyboard  Rp 950.000    0     -     [Ubah][Hapus]  │
│  Prebuilt                                                                          │
│  ... 4 baris lagi (total 8) ...                                                    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.4 Desktop — Dialog form tambah/ubah (kasus ada error validasi)

```text
┌─ Tambah produk                              [X] ─────────────┐
│                                                              │
│  Nama produk *                                               │
│  ( Wrist Rest Kayu                                        )  │
│  ! Nama minimal 2 karakter.                                  │
│                                                              │
│  Kategori *                Harga (Rp) *      Stok *          │
│  [ Aksesori           ▼ ]  ( 250000       )  ( 7          )  │
│                                                              │
│  Deskripsi (opsional)                                 0/300  │
│  (                                                        )  │
│  (                                                        )  │
│                                                              │
│  Gambar (path lokal, diawali /images/)                       │
│  ( /images/placeholder-accessory.svg                      )  │
│                                                              │
│  [ ] Tandai sebagai produk unggulan                          │
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│                                      [ Batal ]   [ Simpan ]  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 7.5 Mobile — Katalog (360 px, filter tertutup)

```text
┌─ NAVBAR ───────────────────────────┐
│                                    │
│ [RK] Ramy Keys   Katalog Dashboard │
│                  ═══════           │
│                                    │
├─ HERO ─────────────────────────────┤
│                                    │
│ Mechanical keyboard &              │
│ aksesori untuk setiap              │
│ gaya mengetik.                     │
│                                    │
│ Kit, prebuilt, switch, dan         │
│ keycaps - pesan lewat              │
│ WhatsApp.                          │
│                                    │
│ [        Lihat Katalog         ]   │
│ 8 produk | 107 stok                │
│                                    │
├─ PENCARIAN + FILTER (ditutup) ─────┤
│                                    │
│ ( Cari produk...               )   │
│                                    │
│ [ ▶ Filter & urutkan (0 aktif) ]   │
│                                    │
│ Menampilkan 8 dari 8 produk        │
│                                    │
├─ GRID 1 KOLOM ─────────────────────┤
│                                    │
│ ┌────────────────────────────────┐ │
│ │ [* Unggulan] ░░░░░░░░░░░░░░░░░░│ │
│ │░░░░░░░░░░ gambar 4:3 ░░░░░░░░░░│ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │
│ │ Keyboard Kit                   │ │
│ │ Ramy65 Aluminum Kit            │ │
│ │ Rp 1.450.000                   │ │
│ │ Stok: 6                        │ │
│ │ [     Pesan via WhatsApp     ] │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ [Habis] ░░░░░░░░░░░░░░░░░░░░░░░│ │
│ │░░░░░░░░░░ gambar 4:3 ░░░░░░░░░░│ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │
│ │ Prebuilt Keyboard              │ │
│ │ Ramy Compact 60 Prebuilt       │ │
│ │ Rp 950.000                     │ │
│ │ Stok: 0                        │ │
│ │ [         Stok habis         ] │ │
│ └────────────────────────────────┘ │
│                                    │
│ ... 6 produk lagi (1 kolom) ...    │
│                                    │
├─ FOOTER ───────────────────────────┤
│ Ramy Keys - katalog demo.          │
│ Data contoh fiktif.                │
└────────────────────────────────────┘
```

### 7.6 Mobile — Filter & urutkan terbuka

```text
┌─ FILTER TERBUKA (details open) ────┐
│                                    │
│ ( Cari produk...               )   │
│                                    │
│ [ ▼ Filter & urutkan (2 aktif) ]   │
│                                    │
│ Kategori                           │
│ [ Switch                     ▼ ]   │
│                                    │
│ Urutkan                            │
│ [ Harga termurah             ▼ ]   │
│                                    │
│ [ ] Hanya unggulan                 │
│ [x] Hanya tersedia                 │
│                                    │
│ [         Reset filter         ]   │
│                                    │
│ Menampilkan 2 dari 8 produk        │
│                                    │
└────────────────────────────────────┘
```

### 7.7 Mobile — Dashboard demo

```text
┌─ NAVBAR (Dashboard aktif) ─────────┐
│                                    │
│ [RK] Ramy Keys   Katalog Dashboard │
│                          ═════════ │
│                                    │
├─ BANNER DEMO ──────────────────────┤
│                                    │
│ ┌────────────────────────────────┐ │
│ │ (!) DASHBOARD DEMO             │ │
│ │ Data tersimpan di browser      │ │
│ │ ini saja. Tanpa login.         │ │
│ └────────────────────────────────┘ │
│                                    │
├─ JUDUL + RINGKASAN (3 kolom) ──────┤
│ Dashboard Pengelola (Demo)         │
│                                    │
│ ┌────────┐  ┌────────┐  ┌────────┐ │
│ │ Total  │  │ Total  │  │ Stok   │ │
│ │ produk │  │ stok   │  │ habis  │ │
│ │ 8      │  │ 107    │  │ 1      │ │
│ └────────┘  └────────┘  └────────┘ │
│                                    │
├─ AKSI (lebar penuh) ───────────────┤
│                                    │
│ [       + Tambah produk        ]   │
│ [      Reset data contoh       ]   │
│                                    │
├─ DAFTAR (kartu, < 768px) ──────────┤
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Ramy65 Aluminum Kit     Ya     │ │
│ │ Keyboard Kit                   │ │
│ │ Harga  Rp 1.450.000            │ │
│ │ Stok   6                       │ │
│ │ [    Ubah    ] [   Hapus    ]  │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Ramy Compact 60 Prebuilt       │ │
│ │ Prebuilt Keyboard              │ │
│ │ Harga  Rp 950.000              │ │
│ │ Stok   0 (Habis)               │ │
│ │ [    Ubah    ] [   Hapus    ]  │ │
│ └────────────────────────────────┘ │
│                                    │
│ ... 6 produk lagi ...              │
│                                    │
└────────────────────────────────────┘
```

### 7.8 Mobile — Form tambah/ubah (layar penuh)

```text
┌─ FORM (layar penuh < 768px) ───────┐
│                                    │
│ < Tambah produk                    │
│ ────────────────────────────────   │
│                                    │
│ Nama produk *                      │
│ ( Wrist Rest Kayu              )   │
│                                    │
│ Kategori *                         │
│ [ Aksesori                   ▼ ]   │
│                                    │
│ Harga (Rp) *                       │
│ ( 250000                       )   │
│                                    │
│ Stok *                             │
│ ( 7                            )   │
│                                    │
│ Deskripsi (opsional)      0/300    │
│ (                              )   │
│                                    │
│ Gambar (path lokal)                │
│ ( /images/placeholder-kit.svg  )   │
│                                    │
│ [ ] Tandai sebagai unggulan        │
│                                    │
│   ... form dapat di-scroll ...     │
│                                    │
│ ────────────────────────────────   │
│ [    Batal    ] [    Simpan    ]   │
│                                    │
└────────────────────────────────────┘
```

### 7.9 State kosong

```text
┌─ Hasil pencarian kosong ───────┐  ┌─ Katalog kosong ───────────────────┐
│                                │  │                                    │
│        ( kaca pembesar )       │  │  Katalog masih kosong.             │
│  Tidak ada produk yang cocok.  │  │  Pengelola dapat menambah produk   │
│  Coba kata kunci lain atau     │  │  di Dashboard Demo.                │
│  [   Reset filter   ]          │  │  [  Buka Dashboard  ]              │
│                                │  │                                    │
└────────────────────────────────┘  └────────────────────────────────────┘
```

### 7.10 Dialog konfirmasi hapus

```text
┌─ Konfirmasi hapus ─────────────────┐
│                                    │
│  Hapus "Ramy65 Aluminum Kit"?      │
│  Tindakan ini tidak dapat          │
│  dibatalkan.                       │
│                                    │
│          [ Batal ]  [ Hapus ]      │
│                                    │
└────────────────────────────────────┘
```

### 7.11 Notifikasi

```text
┌─ Notifikasi (role=status) ───────────────────────────────────────┐
│ (i) Data tersimpan rusak, data contoh dimuat ulang.      [Tutup] │
└──────────────────────────────────────────────────────────────────┘
```

### 7.12 Catatan tablet (768–1023 px)
Katalog: hero 2 kolom, toolbar inline, grid 2 kolom. Dashboard: tabel penuh (scroll internal bila sempit), form berupa dialog tengah. Tidak ada wireframe terpisah; perilaku mengikuti aturan `md` di Bagian 3.4.

---

## 8. Microcopy (seluruh teks antarmuka berbahasa Indonesia)

| Elemen | Teks |
|---|---|
| Skip link | Lewati ke konten utama |
| Navbar | Ramy Keys · Katalog · Dashboard (ponsel) / Dashboard Demo (`md`+) |
| Hero H1 | Mechanical keyboard & aksesori untuk setiap gaya mengetik. |
| Hero paragraf | Kit, prebuilt, switch, dan keycaps — siap dipesan lewat WhatsApp. |
| Hero CTA | Lihat Katalog |
| Placeholder cari | Cari nama, kategori, atau deskripsi… |
| Jumlah hasil | Menampilkan {n} dari {total} produk |
| Tombol WA | Pesan via WhatsApp · (stok 0) Stok habis |
| Badge | ★ Unggulan · Habis |
| Hasil kosong | Tidak ada produk yang cocok. Coba kata kunci lain atau reset filter. |
| Katalog kosong | Katalog masih kosong. Pengelola dapat menambah produk di Dashboard Demo. |
| Banner demo | Dashboard Demo — data tersimpan di browser ini saja. Tidak ada login. |
| Ringkasan | Total produk · Total stok · Stok habis |
| Aksi dashboard | Tambah produk · Reset data contoh |
| Judul form | Tambah produk · Ubah produk |
| Error nama | Nama wajib diisi, 2–80 karakter. |
| Error kategori | Pilih salah satu kategori. |
| Error harga | Harga harus berupa bilangan bulat 0 atau lebih. |
| Error stok | Stok harus berupa bilangan bulat 0 atau lebih. |
| Error deskripsi | Deskripsi maksimal 300 karakter. |
| Error gambar | Path gambar harus diawali /images/. |
| Konfirmasi hapus | Hapus "{nama}"? Tindakan ini tidak dapat dibatalkan. |
| Konfirmasi reset | Kembalikan ke 8 produk contoh? Perubahan Anda akan hilang. |
| Sukses | Produk ditambahkan. · Perubahan disimpan. · Produk dihapus. · Data contoh dipulihkan. |
| Data rusak | Data tersimpan rusak, data contoh dimuat ulang. |
| Gagal simpan | Gagal menyimpan ke browser. Perubahan hanya berlaku sampai halaman ditutup. |
| Footer | Ramy Keys — katalog demo latihan. Data contoh fiktif. Nomor WhatsApp pada tombol pesan adalah nomor dummy. |

---

## 9. Pemetaan ke SPEC.md

| Fitur / NFR di SPEC.md | Diatur di UI-SPEC |
|---|---|
| F-01 Katalog, F-03 Gambar/placeholder | 6.4, 7.1, 7.2, 7.5 |
| F-04 Pencarian, F-05 Filter, F-06 Sorting | 6.3, 7.1, 7.6 |
| F-07 Tombol WhatsApp | 6.4, 6.5 |
| F-08 s.d. F-10 Dashboard (daftar, tambah/ubah, hapus) | 6.7, 6.8, 6.9, 7.3, 7.4, 7.7, 7.8, 7.10 |
| F-11 Ringkasan | 6.6, 7.3, 7.7 |
| F-13 Reset data contoh | 6.9, 8 |
| F-14 Empty/error state | 6.9, 7.9, 7.11 |
| F-15 Navigasi hash | 5, 6.1 |
| NFR-U1 Responsif 360 px | 3.4, 5, UI-AC-02 s.d. UI-AC-04 |
| NFR-U2 Keyboard & fokus | 4.2, UI-AC-07 s.d. UI-AC-09 |
| NFR-U3 Label, alt, disabled | 4.3 |
| NFR-U4 Kontras AA | 4.1, UI-AC-01 |
| NFR-U5 Teks Indonesia | 8 |
| NFR-S5 Tanpa permintaan pihak ketiga | 3.2 (font sistem), 6.2 (SVG lokal) |
| AC-04, AC-05, AC-38, AC-39 | Diperkuat oleh UI-AC-05, UI-AC-06, UI-AC-02 s.d. UI-AC-04, UI-AC-07 |

---

## 10. Acceptance Criteria UI (pemeriksaan manual)

Cara umum: jalankan aplikasi, buka Chrome/Edge DevTools. Alat bantu: *Elements → Computed*, color picker (menampilkan rasio kontras), *Device toolbar*, *Rendering → Emulate vision deficiencies / prefers-reduced-motion*, tab *Network*, dan Lighthouse (kategori Accessibility).

| ID | Langkah | Hasil yang diharapkan |
|---|---|---|
| UI-AC-01 | Periksa teks utama, teks muted, tombol utama, tombol WA, badge, error, placeholder dengan color picker. | Setiap pasangan mencapai rasio pada tabel 4.1 (toleransi ±0,05); tidak ada teks di bawah 4,5:1. |
| UI-AC-02 | Device toolbar 360 px pada katalog dan dashboard. | Tidak ada scroll horizontal halaman; semua kontrol terjangkau; grid 1 kolom. |
| UI-AC-03 | Ubah lebar ke 320 px dan zoom 200%. | Konten tetap terbaca; tidak ada teks terpotong atau tumpang tindih. |
| UI-AC-04 | Ubah lebar ke 768, 1024, 1200 px. | Grid berubah 2 → 3 → 4 kolom; hero 2 kolom sejak 768; toolbar inline sejak 768; tabel dashboard muncul sejak 768. |
| UI-AC-05 | Lihat kartu produk dengan stok > 5, 1–5, dan 0. | Teks stok sesuai 6.4 ("Stok: N", "! Sisa N", "Habis" + tombol WA nonaktif berlabel "Stok habis"). |
| UI-AC-06 | Aktifkan *Emulate vision deficiencies → Achromatopsia*. | Status unggulan, habis, sisa stok, dan error tetap dapat dibedakan lewat teks/simbol. |
| UI-AC-07 | Tekan `Tab` dari awal halaman katalog. | Urutan fokus: skip link → navbar → CTA hero → pencarian → ringkasan/filter → tombol WA kartu; cincin fokus kuning 3 px selalu terlihat. |
| UI-AC-08 | Tekan `Tab` pertama lalu `Enter` pada skip link. | Fokus pindah ke konten utama (`#main`). |
| UI-AC-09 | Buka form (Tambah produk), tekan `Tab` berulang, lalu `Esc`. | Fokus terkurung di dialog; `Esc` menutup; fokus kembali ke tombol "Tambah produk". |
| UI-AC-10 | Ukur tinggi tombol, tautan navbar, checkbox (termasuk label) di DevTools. | Semua ≥ 44 px pada sisi terpendek. |
| UI-AC-11 | Periksa *Computed → font-family* dan tab Network. | Font yang dipakai sans-serif sistem; tidak ada permintaan font/ikon/gambar dari domain lain. |
| UI-AC-12 | Klik "Lihat Katalog" di hero. | Halaman bergulir ke toolbar (`#katalog`); tanpa animasi bila *prefers-reduced-motion* aktif. |
| UI-AC-13 | Pada ponsel, buka/tutup "Filter & urutkan"; ubah dua filter. | Ringkasan menampilkan "(2 aktif)"; pada ≥ 768 px `<details>` terbuka otomatis dan ringkasan tidak tampil. |
| UI-AC-14 | Ketik di pencarian dan ubah filter; amati teks jumlah hasil dengan *Accessibility tree* / pembaca layar. | "Menampilkan n dari 8 produk" berubah dan diumumkan (`role="status"`). |
| UI-AC-15 | Periksa tombol WhatsApp aktif dan nonaktif. | Aktif: hijau `#25D366` + teks gelap; nonaktif: abu-ungu + label "Stok habis"; satu-satunya elemen hijau di halaman. |
| UI-AC-16 | Bandingkan dashboard di 360 px dan 768 px. | 360 px: baris tabel tampil sebagai kartu berlabel; 768 px: tabel dengan header kolom. |
| UI-AC-17 | Buka dashboard. | Banner "Dashboard Demo" selalu terlihat di atas konten; tidak ada elemen login/password. |
| UI-AC-18 | Kirim form dengan beberapa field tidak valid. | Pesan error teks + "!" di bawah tiap field invalid; border merah muda 2 px; `aria-invalid="true"`; fokus pindah ke field invalid pertama. |
| UI-AC-19 | Klik Hapus pada satu produk. | Dialog konfirmasi tampil, fokus awal di "Batal", tombol Hapus berwarna bahaya solid; `Esc`/Batal menutup tanpa menghapus. |
| UI-AC-20 | Picu notifikasi data rusak (SPEC AC-35) dan notifikasi sukses (tambah produk). | Notifikasi muncul dengan tombol "Tutup"; sukses hilang otomatis ±5 detik; data rusak bertahan sampai ditutup. |
| UI-AC-21 | Hapus semua produk, lalu cari "zzz". | Katalog menampilkan state kosong sesuai 7.9; pencarian tanpa hasil menampilkan state "Hasil pencarian kosong" dengan tombol Reset filter. |
| UI-AC-22 | Beri nama produk sangat panjang (80 karakter) dan harga 9 digit. | Nama dipotong ellipsis maks. 2 baris pada kartu; harga tidak terpotong; kartu sejajar. |
| UI-AC-23 | Jalankan Lighthouse → Accessibility pada katalog dan dashboard. | Skor ≥ 95 (target), tanpa temuan kritis terkait kontras, label, atau nama tombol. |
| UI-AC-24 | Periksa `<head>` dan struktur heading. | Ada `lang="id"`, viewport tanpa pembatas zoom, `color-scheme: dark`; satu `<h1>` per halaman, tanpa lompat level heading. |
| UI-AC-25 | Matikan gambar produk (ubah `imageUrl` rusak). | Placeholder default tampil dengan rasio 4:3; tidak ada ikon gambar rusak (konsisten dengan SPEC AC-06). |

---

## 11. Rencana implementasi UI per iterasi

Mengikuti iterasi pada `SPEC.md` Bagian 10; tidak menambah waktu total, hanya merinci pekerjaan visual di tiap iterasi.

| Iterasi SPEC | Pekerjaan UI | Selesai bila |
|---|---|---|
| 0 — Setup & fondasi | Tulis token (3.1–3.5), reset/base, container, utilitas `.visually-hidden`, skip link, navbar, hero (tanpa ilustrasi), footer; atur `<html lang>` dan meta | Navbar & hero sesuai 7.1/7.5; UI-AC-02, 07 (sebagian), 08, 11, 24 |
| 1 — Data layer | (Tidak ada UI.) Siapkan data pendukung tampilan: `LOW_STOCK`, label kategori | — |
| 2 — Katalog | Komponen kartu, badge, grid auto-fill, state stok, fallback gambar, state katalog kosong | UI-AC-04 (grid), 05, 06, 22, 25 |
| 3 — Cari/filter/sort + WA | Toolbar, `<details>` responsif, jumlah hasil `role="status"`, tombol WA & varian nonaktif, state hasil kosong | UI-AC-12 s.d. 15, 21 (sebagian) |
| 4 — Dashboard CRUD | Banner demo, kartu ringkasan, tabel responsif, form + dialog, konfirmasi, notifikasi | UI-AC-09, 16 s.d. 20 |
| 5 — Hardening & QA | Audit kontras, fokus, target sentuh, reduced-motion; ilustrasi hero (opsional); jalankan seluruh UI-AC; catat hasil di README | UI-AC-01 s.d. UI-AC-25 lulus |

**Urutan CSS di `styles.css`:** token → reset/base → tipografi → layout (container, grid) → komponen (tombol, form, kartu, badge, tabel, dialog, notifikasi) → halaman (katalog, dashboard) → `@media (min-width: …)` → `prefers-reduced-motion`. Penamaan kelas gaya BEM-ringan (`.card`, `.card__title`, `.btn--primary`).

**Cut-line UI** (korbankan berurutan jika waktu mepet): ilustrasi hero → ikon di tombol WA → penghitung karakter deskripsi → tombol "Tutup" otomatis 5 detik (cukup manual). **Tidak boleh dikorbankan:** kontras (4.1), cincin fokus, target 44 px, label form, pesan error teks, banner demo.

---

## 12. Risiko dan keputusan UI

| ID | Risiko / keputusan | Mitigasi |
|---|---|---|
| UR-01 | Ungu gelap membuat batas kontrol kurang terlihat. | Kontrol memakai `border-strong` (≥ 3,6:1); `border` dekoratif tidak dipakai untuk kontrol. |
| UR-02 | Tombol hijau WA bertabrakan dengan palet ungu. | Hijau hanya dipakai di tombol WA; teks gelap; ukuran penuh lebar kartu agar menjadi aksi utama kartu. |
| UR-03 | Filter memakan ruang di ponsel. | `<details>` tertutup; pencarian tetap terlihat; jumlah filter aktif ditampilkan di ringkasan. |
| UR-04 | Tabel dashboard sulit di layar sempit. | Pola kartu bertumpuk dengan `data-label`; cadangan: scroll horizontal dalam wadah. |
| UR-05 | Nama/harga panjang merusak tata letak. | Ellipsis 2 baris, tinggi nama dicadangkan, harga boleh membungkus. |
| UR-06 | `<dialog>` native berbeda tampilan antar-browser. | Gaya `::backdrop` dan dialog didefinisikan eksplisit; uji di Chrome dan Firefox. |
| UR-07 | Waktu 1 hari tidak cukup untuk polesan visual. | Gunakan cut-line di Bagian 11; fokus pada kontras dan fokus dahulu. |
| Keputusan | Tidak memakai hamburger (hanya 2 tautan); tema gelap saja; font sistem; tanpa pustaka ikon. | Menyederhanakan implementasi dan memenuhi NFR-S5. |

---

## 13. Out of scope (UI)

- Tema terang / tombol pengalih tema, kustomisasi warna oleh pengguna.
- Font web, pustaka ikon, gambar foto produk asli, gambar hero fotografi.
- Carousel, *skeleton loading*, animasi kompleks, drag-and-drop pengurutan.
- Halaman detail produk, *quick view*, galeri gambar.
- Stylesheet cetak, internasionalisasi, PWA/ikon aplikasi.
- Pengujian visual otomatis (screenshot testing) dan *design system* terpisah.
