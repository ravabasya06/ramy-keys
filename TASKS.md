# TASKS — Ramy Keys (`ramy-keys`)

| Item           | Isi                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Versi dokumen  | 0.1 (Draft untuk latihan 1 hari)                                                                                           |
| Sumber         | `SPEC.md` v0.1 (fitur F-xx, NFR-xx, AC-01…AC-42) dan `UI-SPEC.md` v0.1 (token, komponen, UI-AC-01…UI-AC-25)                |
| Tujuan dokumen | Memecah pekerjaan menjadi milestone dan tugas kecil yang dapat dikerjakan, diperiksa manual, dan di-_commit_ satu per satu |
| Total estimasi | ±7,75 jam (±465 menit), termasuk deployment demo opsional                                                                  |
| Status kode    | **Belum ada.** Dokumen ini tidak mengubah atau membuat kode aplikasi.                                                      |

---

## 0. Cara memakai dokumen ini

### 0.1 Aturan kerja

1. Kerjakan milestone berurutan (M0 → M9). Dalam milestone, ikuti urutan tugas kecuali kolom "Bergantung pada" menyatakan lain.
2. Satu tugas = satu perubahan kecil yang dapat diperiksa. Satu milestone = minimal satu _commit_ (contoh pesan: `M2: pencarian, filter, sorting`).
3. Tugas selesai hanya jika **semua** acceptance criteria (AC) tugas tersebut tercentang dan tidak ada error merah di console.
4. Label: **P0** wajib MVP, **P1** opsional (boleh dilewati sesuai _cut-line_ di Bagian 12).
5. Kolom "Berkas yang mungkin berubah" bersifat perkiraan; berkas bertanda **(baru)** tidak ada di struktur `SPEC.md` Bagian 10.1 dan boleh digabung ke berkas lain bila lebih ringkas.

### 0.2 Batasan keamanan (berlaku untuk semua tugas)

- Jangan menyimpan API key, token, password, atau `.env` berisi rahasia. Aplikasi tidak memerlukan satu pun.
- Perintah yang diperbolehkan hanya: `npm create vite@latest`, `npm install`, `npm ci`, `npm run dev|build|preview`, `npm audit` (baca saja), dan perintah baca-saja seperti `grep`, `ls`, `git status|diff|log`.
- **Dilarang:** `sudo`, `curl … | sh`, `rm -rf` di luar folder build yang dibuat Vite, `npm audit fix --force`, instal paket global yang tidak dikenal, atau menjalankan skrip dari sumber tidak jelas.
- Data contoh dan nomor WhatsApp bersifat fiktif/dummy dan nonpribadi.

### 0.3 Catatan penyesuaian terhadap urutan `SPEC.md`

Urutan milestone di bawah menaruh **localStorage (M5) setelah CRUD (M4)**, sedangkan `SPEC.md` 10.2 menaruh data layer lebih awal. Agar urutan tetap berjalan tanpa pekerjaan ulang:

- `src/lib/storage.js` dibuat di **M1** sebagai _stub_ memori dengan API final (`loadProducts()`, `saveProducts()`), lalu diganti isinya menjadi localStorage sungguhan di **M5**. Seluruh UI hanya memanggil API ini.
- Pada M1–M4 data hilang saat reload; itu diharapkan.

`SPEC.md` Bagian 7 menyebut _deployment produksi_ sebagai out-of-scope. Milestone M9 hanya mencakup **hosting statis untuk demo** (tanpa server, tanpa rahasia) dan berstatus P1; ini tidak mengubah `SPEC.md`.

### 0.4 Ringkasan milestone

| Milestone | Fokus                              |     Estimasi | Iterasi SPEC | AC utama yang diverifikasi    |
| --------- | ---------------------------------- | -----------: | ------------ | ----------------------------- |
| M0        | Scaffold                           |       40 mnt | 0            | AC-01, UI-AC-08, 11, 24       |
| M1        | Katalog                            |       70 mnt | 1–2          | AC-03…07, UI-AC-04…06, 22, 25 |
| M2        | Interaksi pencarian/filter/sorting |       60 mnt | 3            | AC-08…21, UI-AC-13, 14, 21    |
| M3        | WhatsApp                           |       25 mnt | 3            | AC-22, 23, UI-AC-15           |
| M4        | CRUD dashboard                     |      100 mnt | 4            | AC-24…33, UI-AC-09, 16…20     |
| M5        | localStorage                       |       45 mnt | 1 & 4        | AC-34…37                      |
| M6        | Testing (manual)                   |       50 mnt | 5            | Seluruh AC & UI-AC            |
| M7        | Security                           |       30 mnt | 5            | AC-02, 07, 28                 |
| M8        | Build                              |       20 mnt | 5            | AC-01, 42, UI-AC-23           |
| M9        | Deployment (demo, opsional)        |       25 mnt | —            | Smoke test pada URL publik    |
| **Total** |                                    | **±465 mnt** |              |                               |

---

## M0 — Scaffold (±40 menit)

Tujuan: proyek Vite kosong yang bersih dengan token desain, kerangka halaman, dan navigasi hash.

### T0.1 — Inisialisasi proyek Vite vanilla

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** —
- **Deskripsi:** Buat proyek dengan template `vanilla`, instal dependensi, bersihkan berkas contoh template, atur `base` relatif agar build dapat dihosting di sub-path.
- **Acceptance criteria:**
  - [ ] `npm install` selesai tanpa error; `npm run dev` melayani halaman di `localhost`.
  - [ ] `package.json`: `name` = `ramy-keys`; skrip `dev`, `build`, `preview` ada; **tanpa** `dependencies` runtime (Vite hanya di `devDependencies`).
  - [ ] Berkas contoh template dihapus (counter, logo Vite/JS, gaya bawaan); halaman tidak menampilkan konten template.
  - [ ] `vite.config.js` memakai `base: './'`.
  - [ ] `.gitignore` memuat `node_modules`, `dist`, `.env`, `.env.*`, `*.log`.
  - [ ] `package-lock.json` ada dan akan di-_commit_.
  - [ ] `npm run build` berhasil (AC-01).
- **Berkas yang mungkin berubah:** `package.json`, `package-lock.json`, `vite.config.js`, `.gitignore`, `index.html`, `src/main.js`, `src/styles.css`, `README.md` (kerangka awal)

### T0.2 — Struktur folder dan konfigurasi

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T0.1
- **Deskripsi:** Siapkan struktur folder sesuai `SPEC.md` 10.1 dan konstanta aplikasi di satu tempat.
- **Acceptance criteria:**
  - [ ] Folder `src/data`, `src/lib`, `src/ui`, `public/images` ada.
  - [ ] `src/config.js` memuat: `STORAGE_KEY = 'ramyKeys.products.v1'`, `SCHEMA_VERSION = 1`, `CATEGORIES` (5 nilai persis seperti SPEC 4.1), `WA_NUMBER` (nomor **dummy**, digit saja, mis. `6280000000000`), `LOW_STOCK = 5`.
  - [ ] Ada komentar singkat di `WA_NUMBER`: nomor dummy, ganti sebelum dipakai sungguhan.
  - [ ] Tidak ada nilai rahasia atau data pribadi di berkas mana pun.
- **Berkas yang mungkin berubah:** `src/config.js`, struktur folder `src/*`, `public/images/`

### T0.3 — Design tokens, reset, dan gaya dasar

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T0.1
- **Deskripsi:** Implementasikan UI-SPEC Bagian 3–4: token warna/tipografi/spacing, reset, fokus, gerak, dan meta dokumen.
- **Acceptance criteria:**
  - [ ] Semua token warna pada UI-SPEC 3.1 ada sebagai CSS custom property di `:root` dengan nilai hex yang sama.
  - [ ] `--font-sans` memakai font sistem; tab Network tidak menampilkan unduhan font/ikon (UI-AC-11).
  - [ ] `index.html` memiliki `lang="id"`, viewport `width=device-width, initial-scale=1` (tanpa `user-scalable=no`), `color-scheme: dark`, `theme-color: #120B1F`, dan `<title>` bermakna (UI-AC-24).
  - [ ] `:focus-visible` menampilkan cincin kuning 3 px dengan offset 2 px pada elemen interaktif.
  - [ ] Utilitas `.visually-hidden` tersedia; `prefers-reduced-motion: reduce` mematikan transisi.
  - [ ] Latar halaman `#120B1F`, teks `#F4EFFC`; ukuran font dasar 1rem.
- **Berkas yang mungkin berubah:** `src/styles.css`, `index.html`

### T0.4 — Kerangka halaman, navbar, dan router hash

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T0.2, T0.3
- **Deskripsi:** Skip link, `<header>` + navbar, `<main id="main">`, footer, dan router `location.hash` (F-15).
- **Acceptance criteria:**
  - [ ] `#/` menampilkan halaman katalog (kerangka) dan `#/dashboard` menampilkan dashboard (kerangka); hash tak dikenal atau kosong jatuh ke katalog.
  - [ ] Pindah halaman lewat navbar tidak memuat ulang halaman; tombol Back/Forward browser berfungsi.
  - [ ] Tautan aktif memakai `aria-current="page"` dan garis bawah aksen; label ponsel "Katalog"/"Dashboard", `md`+ "Katalog"/"Dashboard Demo".
  - [ ] Skip link "Lewati ke konten utama" muncul saat `Tab` pertama dan memindahkan fokus ke `#main` (UI-AC-08).
  - [ ] Navbar sticky, tinggi tautan ≥ 44 px; tersedia `<footer>` dengan teks dari UI-SPEC Bagian 8.
  - [ ] Pada setiap halaman hanya ada satu `<h1>`.
- **Berkas yang mungkin berubah:** `index.html`, `src/main.js`, `src/ui/dom.js`, `src/ui/catalog.js`, `src/ui/dashboard.js`, `src/styles.css`

### T0.5 — Placeholder gambar lokal dan hero

- **Prioritas:** P0 (hero), P1 (ilustrasi keycap) · **Estimasi:** 5 mnt · **Bergantung pada:** T0.3, T0.4
- **Deskripsi:** Buat 6 SVG placeholder lokal dan hero sesuai UI-SPEC 6.2 (chip jumlah produk/stok diisi data sungguhan di T1.6).
- **Acceptance criteria:**
  - [ ] `public/images/` berisi `placeholder-kit.svg`, `placeholder-prebuilt.svg`, `placeholder-switch.svg`, `placeholder-keycaps.svg`, `placeholder-accessory.svg`, `placeholder-default.svg`; masing-masing memiliki `viewBox`, rasio 4:3, tanpa referensi eksternal dan tanpa `<script>`.
  - [ ] Hero: gradien `--gradient-hero`, H1 dan paragraf sesuai UI-SPEC 8, tombol "Lihat Katalog".
  - [ ] Klik "Lihat Katalog" menggulir ke `#katalog` tanpa mengubah rute hash menjadi bukan-rute (tidak keluar dari halaman katalog).
  - [ ] (P1) Ilustrasi hanya tampil ≥ 768 px dan berstatus `aria-hidden="true"`.
- **Berkas yang mungkin berubah:** `public/images/*.svg`, `src/ui/catalog.js`, `src/styles.css`

**Selesai M0 bila:** T0.1–T0.5 lulus; AC-01 dan UI-AC-08, 11, 24 terpenuhi.

---

## M1 — Katalog (±70 menit)

Tujuan: katalog menampilkan 8 produk contoh dengan kartu sesuai UI-SPEC 6.4.

### T1.1 — Data contoh 8 produk

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T0.2
- **Deskripsi:** Buat `seed.js` persis sesuai tabel SPEC 4.4 beserta deskripsi satu kalimat per produk.
- **Acceptance criteria:**
  - [ ] Tepat 8 objek dengan field `id`, `nama`, `kategori`, `harga`, `stok`, `deskripsi`, `imageUrl`, `unggulan`; `id` unik dan stabil (`p-001`…`p-008`).
  - [ ] Nama, kategori, harga, stok, unggulan, dan gambar cocok dengan SPEC 4.4; `deskripsi` ≤ 300 karakter.
  - [ ] Semua `imageUrl` mengarah ke berkas yang ada di `public/images/`.
  - [ ] Nilai turunan: total produk 8, total stok 107, stok habis 1, unggulan 3, tersedia 7.
  - [ ] Tidak ada nama orang, nomor telepon, alamat, atau merek dagang pihak lain.
- **Berkas yang mungkin berubah:** `src/data/seed.js`

### T1.2 — Format Rupiah dan resolusi path gambar

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T0.1
- **Deskripsi:** Fungsi murni `formatRupiah()` dan `assetUrl()` agar path `/images/…` tetap benar di sub-path hosting.
- **Acceptance criteria:**
  - [ ] `formatRupiah(1450000)` tampil sebagai `Rp 1.450.000`; `950000` → `Rp 950.000`; `0` → `Rp 0` (menggunakan `Intl.NumberFormat('id-ID', …, maximumFractionDigits: 0)`; spasi non-pecah di antara "Rp" dan angka dapat diterima).
  - [ ] Input bukan angka terhingga tidak melempar error (mengembalikan `Rp 0`).
  - [ ] `assetUrl('/images/a.svg')` menghasilkan `/images/a.svg` jika `BASE_URL` = `/`, `./images/a.svg` jika `./`, dan `/ramy-keys/images/a.svg` jika `/ramy-keys/` (diperiksa lewat console/dev).
  - [ ] Nilai yang disimpan di data tetap `/images/…` (resolusi hanya saat render).
- **Berkas yang mungkin berubah:** `src/lib/format.js`

### T1.3 — Stub penyimpanan (memori)

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T1.1
- **Deskripsi:** `storage.js` dengan API final namun isi sementara di memori (lihat 0.3).
- **Acceptance criteria:**
  - [ ] `loadProducts()` mengembalikan **salinan dalam** (deep clone) dari seed; mengubah hasilnya tidak mengubah `seed.js`.
  - [ ] `saveProducts(products)` ada, tidak melempar error, dan mengembalikan objek hasil (mis. `{ ok: true }`).
  - [ ] Komentar di kepala berkas menjelaskan kontrak API dan bahwa isi akan diganti di M5.
- **Berkas yang mungkin berubah:** `src/lib/storage.js`

### T1.4 — Fungsi ringkasan

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T1.1
- **Deskripsi:** `summarize(products)` sebagai fungsi murni (dipakai hero dan dashboard).
- **Acceptance criteria:**
  - [ ] `summarize(seed)` = total produk 8, total stok 107, stok habis 1.
  - [ ] `summarize([])` = 0 / 0 / 0.
  - [ ] Fungsi tidak mengubah array masukan.
- **Berkas yang mungkin berubah:** `src/lib/query.js`

### T1.5 — Komponen kartu produk

- **Prioritas:** P0 · **Estimasi:** 25 mnt · **Bergantung pada:** T1.1, T1.2, T0.3
- **Deskripsi:** Kartu sesuai UI-SPEC 6.4, dirender dengan `createElement`/`textContent` (tanpa `innerHTML`). Slot tombol WhatsApp disiapkan (diisi di M3).
- **Acceptance criteria:**
  - [ ] Kartu menampilkan gambar (`alt` = nama produk, rasio 4:3, `loading="lazy"`, `width`/`height` terisi), kategori, nama (maks. 2 baris lalu ellipsis), harga berformat, teks stok (AC-04).
  - [ ] Stok > 5 → "Stok: N"; 1–5 → "! Sisa N" (warna peringatan); 0 → badge "Habis" (UI-AC-05).
  - [ ] `unggulan = true` → badge "★ Unggulan"; unggulan + habis menampilkan keduanya.
  - [ ] Gambar gagal dimuat → otomatis memakai `placeholder-default.svg` tanpa ikon gambar rusak (AC-06, UI-AC-25).
  - [ ] Nama sangat panjang dan harga 9 digit tidak merusak tata letak; tombol sejajar di dasar kartu (UI-AC-22).
  - [ ] Teks yang berasal dari data tidak pernah diset melalui `innerHTML`.
  - [ ] Dengan color picker, pasangan warna teks kartu sesuai UI-SPEC 4.1 (UI-AC-01, sebagian).
- **Berkas yang mungkin berubah:** `src/ui/catalog.js`, `src/ui/dom.js`, `src/styles.css`

### T1.6 — Grid katalog, state kosong, dan chip hero

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T1.3, T1.4, T1.5
- **Deskripsi:** Render daftar produk dari `loadProducts()`; grid `auto-fill`; isi chip hero dari `summarize()`.
- **Acceptance criteria:**
  - [ ] Pembukaan `#/` menampilkan tepat 8 kartu sesuai tabel SPEC 4.4 (AC-03).
  - [ ] Grid: 1 kolom di 360 px, 2 di ±768 px, 3 di ±1024 px, 4 di ≥ 1200 px (UI-AC-04); tanpa scroll horizontal di 360 dan 320 px (UI-AC-02, 03).
  - [ ] Chip hero menampilkan "8 produk | 107 stok" dari `summarize()`.
  - [ ] Jika daftar produk kosong, tampil state "Katalog masih kosong…" dengan tombol "Buka Dashboard" (UI-SPEC 7.9).
  - [ ] Di DevTools Network tidak ada permintaan ke domain luar (AC-07).
- **Berkas yang mungkin berubah:** `src/ui/catalog.js`, `src/main.js`, `src/styles.css`

### T1.7 — Verifikasi fallback gambar dan path

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T1.5, T1.2
- **Deskripsi:** Uji manual jalur gambar sebelum ada dashboard.
- **Acceptance criteria:**
  - [ ] Dengan mengubah satu `imageUrl` di `seed.js` ke path yang tidak ada, placeholder default tampil (AC-06); setelah uji, nilai dikembalikan.
  - [ ] `npm run build -- --base=/ramy-keys/` lalu `npm run preview`: gambar tetap tampil dari sub-path (catat hasil; jika gagal, perbaiki `assetUrl`).
- **Berkas yang mungkin berubah:** `src/lib/format.js` (jika ada perbaikan)

**Selesai M1 bila:** T1.1–T1.7 lulus; AC-03…07, UI-AC-04…06, 22, 25 terpenuhi.

---

## M2 — Interaksi pencarian, filter, dan sorting (±60 menit)

Tujuan: katalog dapat dicari, difilter, dan diurutkan, dengan UI sesuai UI-SPEC 6.3.

### T2.1 — Fungsi `applyQuery`

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T1.1
- **Deskripsi:** Fungsi murni `applyQuery(products, { search, category, onlyFeatured, onlyAvailable, sort })` sesuai SPEC 3.1.
- **Acceptance criteria (diperiksa dari console):**
  - [ ] `search`: di-_trim_, tak peka kapital, mencocokkan `nama`, `kategori`, `deskripsi`; kosong = semua produk.
  - [ ] `category` = `''`/`'Semua'` → semua; nilai kategori → hanya kategori itu (1 produk untuk `Keycaps`).
  - [ ] `onlyFeatured` → 3 produk; `onlyAvailable` → 7 produk; semua kondisi bekerja sebagai AND.
  - [ ] Sort: `default` mempertahankan urutan data; `price-asc` dimulai Rp 175.000 dan berakhir Rp 1.850.000; `price-desc` kebalikannya; `name-asc` memakai `localeCompare('id')`; `stock-desc` dimulai dari stok 40.
  - [ ] Fungsi tidak memodifikasi array masukan; opsi yang hilang tidak menyebabkan error.
- **Berkas yang mungkin berubah:** `src/lib/query.js`, `src/config.js` (daftar opsi sort)

### T2.2 — Toolbar: kontrol dan jumlah hasil

- **Prioritas:** P0 · **Estimasi:** 20 mnt · **Bergantung pada:** T2.1, T1.6
- **Deskripsi:** Input pencarian, select kategori dan urutkan, dua checkbox, tombol reset, dan teks jumlah hasil.
- **Acceptance criteria:**
  - [ ] Ketik `switch` menampilkan hanya produk yang cocok (AC-08); `SWITCH` dan `  switch  ` memberi hasil sama (AC-09); menghapus teks memulihkan 8 produk (AC-11).
  - [ ] Filter kategori `Keycaps` → 1 produk (AC-12); "Hanya unggulan" → 3 (AC-13); "Hanya tersedia" → 7 (AC-14).
  - [ ] Kombinasi `set` + `Switch` + "Hanya tersedia" → hasil memenuhi semua kondisi (AC-15).
  - [ ] "Reset filter" mengembalikan pencarian, filter, dan sort ke awal (AC-16).
  - [ ] Opsi sort bekerja sesuai AC-17…AC-20 dan tetap berlaku setelah filter diubah (AC-21).
  - [ ] Teks "Menampilkan {n} dari {total} produk" berubah dan memakai `role="status"` (UI-AC-14).
  - [ ] Setiap kontrol memiliki `<label>` (pencarian: label tersembunyi visual); tinggi kontrol ≥ 44 px.
  - [ ] State filter tidak disimpan ke localStorage atau URL (SPEC 3.1).
- **Berkas yang mungkin berubah:** `src/ui/catalog.js`, `src/styles.css`

### T2.3 — Toolbar responsif (`<details>`)

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T2.2
- **Deskripsi:** Di ponsel kontrol filter dilipat; di ≥ 768 px selalu terbuka (UI-SPEC 5).
- **Acceptance criteria:**
  - [ ] < 768 px: pencarian terlihat, kontrol lain di dalam `<details>` tertutup dengan ringkasan "Filter & urutkan (N aktif)"; N bertambah untuk tiap kategori ≠ Semua, sort ≠ Default, dan tiap checkbox aktif (UI-AC-13).
  - [ ] ≥ 768 px: `<details>` terbuka otomatis dan ringkasan tidak tampil; perubahan ukuran jendela memperbarui perilaku tanpa reload.
  - [ ] Ringkasan dapat dioperasikan dengan keyboard dan memiliki target ≥ 44 px.
- **Berkas yang mungkin berubah:** `src/ui/catalog.js`, `src/styles.css`

### T2.4 — State hasil kosong

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T2.2
- **Acceptance criteria:**
  - [ ] Ketik `zzzxxx` menampilkan "Tidak ada produk yang cocok…" dengan tombol "Reset filter"; tidak ada error di console (AC-10).
  - [ ] Menekan tombol tersebut memulihkan semua produk dan mengosongkan kontrol (UI-AC-21, sebagian).
  - [ ] State ini berbeda dari state "Katalog kosong" pada T1.6.
- **Berkas yang mungkin berubah:** `src/ui/catalog.js`, `src/styles.css`

### T2.5 — Perilaku render yang stabil

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T2.2
- **Deskripsi:** Pastikan mengetik tidak memutus fokus dan pembaruan terasa instan.
- **Acceptance criteria:**
  - [ ] Saat mengetik di pencarian, fokus dan posisi kursor tidak hilang (hanya grid dan jumlah hasil yang dirender ulang, bukan toolbar).
  - [ ] Dengan 100 produk (disuntik lewat console/storage), pembaruan setelah mengetik terasa instan (< 100 ms; NFR-P2).
  - [ ] Tidak ada _listener_ yang menumpuk setelah beberapa kali berpindah halaman katalog ↔ dashboard.
- **Berkas yang mungkin berubah:** `src/ui/catalog.js`, `src/main.js`

**Selesai M2 bila:** T2.1–T2.5 lulus; AC-08…AC-21 dan UI-AC-13, 14, 21 terpenuhi.

---

## M3 — WhatsApp (±25 menit)

### T3.1 — Pembuat tautan WhatsApp

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T0.2, T1.2
- **Deskripsi:** `buildWhatsAppUrl(product)` sesuai SPEC 3.1.
- **Acceptance criteria:**
  - [ ] Hasil berformat `https://wa.me/<WA_NUMBER>?text=<pesan ter-encode>` dengan pesan persis: `Halo Ramy Keys, saya ingin memesan: {nama} ({harga berformat}). Apakah masih tersedia?`
  - [ ] Karakter khusus (`&`, `#`, `"`, `?`, spasi, huruf non-ASCII) pada nama produk ter-_encode_ dengan `encodeURIComponent` dan tidak memutus parameter (cek dengan nama `A&B #1 "Kit"`).
  - [ ] Jika `WA_NUMBER` bukan digit saja, fungsi tidak menghasilkan tautan berbahaya (mis. mengembalikan `null`; UI menonaktifkan tombol).
- **Berkas yang mungkin berubah:** `src/lib/format.js`, `src/config.js`

### T3.2 — Tombol WhatsApp pada kartu

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T3.1, T1.5
- **Acceptance criteria:**
  - [ ] Stok > 0: elemen `<a>` bergaya tombol hijau `#25D366`, teks `#0B1F12`, label "Pesan via WhatsApp", `aria-label="Pesan {nama} via WhatsApp"`.
  - [ ] Klik membuka tab baru ke URL `wa.me` yang benar (AC-22); atribut `target="_blank"` dan `rel="noopener noreferrer"` ada (AC-23).
  - [ ] Stok 0: `<button disabled>` berlabel "Stok habis", gaya nonaktif UI-SPEC 6.5 (AC-05).
  - [ ] Tinggi tombol ≥ 44 px; dapat diaktifkan dengan keyboard (`Enter`); fokus terlihat.
  - [ ] Hijau WhatsApp tidak dipakai pada elemen lain di halaman (UI-AC-15).
  - [ ] Tombol memakai `<a>` biasa (bukan `window.open` dari JS).
- **Berkas yang mungkin berubah:** `src/ui/catalog.js`, `src/styles.css`

### T3.3 — Dokumentasi nomor dummy

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T3.2
- **Acceptance criteria:**
  - [ ] `README.md` menyebut bahwa nomor WhatsApp adalah dummy, lokasi penggantiannya (`src/config.js`), dan bahwa perlu build ulang setelah penggantian.
  - [ ] Footer menampilkan catatan nomor dummy (UI-SPEC 8).
- **Berkas yang mungkin berubah:** `README.md`, `src/config.js`, `index.html` / `src/main.js`

**Selesai M3 bila:** T3.1–T3.3 lulus; AC-22, 23, UI-AC-15 terpenuhi.

---

## M4 — CRUD dashboard (±100 menit)

Tujuan: dashboard demo berfungsi penuh. Pada tahap ini perubahan disimpan lewat `saveProducts()` (masih _stub_; persisten setelah M5).

### T4.1 — Validasi dan normalisasi produk

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T0.2
- **Deskripsi:** `validateProduct(input)` → `{ valid, errors }` dan `normalizeProduct(input)` (membuat objek **hanya** dari field yang dikenal) sesuai SPEC 4.1.
- **Acceptance criteria (uji dari console):**
  - [ ] `nama`: kosong, 1 karakter, spasi saja, dan 81 karakter ditolak; 2 dan 80 karakter (setelah _trim_) diterima.
  - [ ] `kategori` di luar 5 nilai ditolak.
  - [ ] `harga`: `-1`, `NaN`, `Infinity`, kosong, dan `1.5` ditolak; `0` dan `250000` diterima.
  - [ ] `stok`: `-1`, `1.5`, kosong ditolak; `0` dan `7` diterima.
  - [ ] `deskripsi`: 301 karakter ditolak; kosong diterima.
  - [ ] `imageUrl`: kosong atau `/images/placeholder-kit.svg` diterima; `http://…`, `https://…`, `data:…`, `javascript:…`, `//host/x`, dan path berisi `..` ditolak.
  - [ ] `unggulan` bukan boolean ditolak.
  - [ ] Pesan error per field memakai teks UI-SPEC Bagian 8.
  - [ ] `normalizeProduct` membuang field tak dikenal (mis. `__proto__`, `isAdmin`) dan mengonversi string numerik form menjadi angka.
- **Berkas yang mungkin berubah:** `src/lib/validate.js`

### T4.2 — Pembuat ID

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** —
- **Acceptance criteria:**
  - [ ] `newId()` memakai `crypto.randomUUID()` bila tersedia; jika tidak (mis. konteks non-HTTPS), memakai cadangan `p-<timestamp>-<acak>` (uji dengan `Crypto.prototype.randomUUID = undefined` di console).
  - [ ] 100 ID berturut-turut semuanya unik.
- **Berkas yang mungkin berubah:** `src/lib/id.js` **(baru)**, atau `src/lib/format.js`

### T4.3 — Cangkang dashboard dan ringkasan

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T0.4, T1.4
- **Acceptance criteria:**
  - [ ] `#/dashboard` (lewat navbar dan lewat mengetik URL langsung) menampilkan banner "Dashboard Demo — data tersimpan di browser ini saja. Tidak ada login." yang selalu terlihat; tidak ada form login/password (AC-24, UI-AC-17).
  - [ ] Tiga kartu ringkasan: total produk **8**, total stok **107**, stok habis **1** pada data awal (AC-25).
  - [ ] Tombol "Tambah produk" dan "Reset data contoh" ada; lebar penuh di ponsel.
  - [ ] Ringkasan dan hero memakai fungsi `summarize()` yang sama dan ikut berubah setelah setiap mutasi (T4.5–T4.7).
- **Berkas yang mungkin berubah:** `src/ui/dashboard.js`, `src/styles.css`

### T4.4 — Daftar produk (tabel dan kartu responsif)

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T4.3
- **Acceptance criteria:**
  - [ ] ≥ 768 px: tabel dengan kolom Produk, Kategori, Harga (rata kanan), Stok (rata kanan), Unggulan, Aksi; `<caption>` tersembunyi visual dan `<th scope="col">`.
  - [ ] < 768 px: tiap baris menjadi kartu dengan label dari `data-label`; tombol Ubah dan Hapus berdampingan (UI-AC-16, AC-38).
  - [ ] Stok 0 ditandai "(Habis)"; unggulan "Ya"/"–".
  - [ ] Tombol berlabel `aria-label="Ubah {nama}"` dan `"Hapus {nama}"`; tinggi ≥ 44 px.
  - [ ] Nama produk berisi markup (`<img src=x onerror=alert(1)>`) tampil sebagai teks biasa (AC-28, sebagian).
- **Berkas yang mungkin berubah:** `src/ui/dashboard.js`, `src/styles.css`

### T4.5 — Form dialog tambah/ubah

- **Prioritas:** P0 · **Estimasi:** 25 mnt · **Bergantung pada:** T4.1, T4.2, T4.4
- **Deskripsi:** Form sesuai UI-SPEC 6.8 dalam elemen `<dialog>` native (layar penuh di ponsel).
- **Acceptance criteria:**
  - [ ] Tambah produk valid (mis. "Wrist Rest Kayu", Aksesori, 250000, stok 7) → muncul di tabel dan di katalog; ringkasan menjadi 9 produk / 114 stok (AC-26).
  - [ ] Simpan dengan nama kosong, harga `-1`, harga kosong, stok `-1`, stok `1.5`, atau kategori belum dipilih ditolak: pesan error teks + "!" di bawah field, border `danger` 2 px, `aria-invalid="true"`, fokus pindah ke field invalid pertama; data tidak berubah (AC-27, UI-AC-18).
  - [ ] Ubah harga/stok produk → tabel, katalog, dan ringkasan ikut berubah (AC-29); `id` tidak berubah dan tidak dapat diedit.
  - [ ] Form edit terisi data produk yang dipilih; "Batal" atau `Esc` menutup tanpa mengubah data.
  - [ ] Fokus awal ke field Nama; fokus terkurung di dialog; setelah ditutup, fokus kembali ke tombol pemicu (UI-AC-09).
  - [ ] Penghitung deskripsi `n/300`; field gambar memiliki `<datalist>` berisi 6 path placeholder.
  - [ ] Menekan `Enter` pada field teks mengirim form; field harga/stok memakai `type="number"`, `min="0"`, `step="1"`.
  - [ ] Produk dengan nama `<img src=x onerror=alert(1)>` tersimpan dan tampil sebagai teks; tidak ada `alert` (AC-28).
  - [ ] Mengubah `imageUrl` ke path tidak ada menampilkan placeholder di katalog (AC-06).
- **Berkas yang mungkin berubah:** `src/ui/dashboard.js`, `src/ui/product-form.js` **(baru, opsional)**, `src/lib/validate.js`, `src/lib/storage.js`, `src/styles.css`

### T4.6 — Hapus dengan konfirmasi

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T4.4
- **Acceptance criteria:**
  - [ ] Klik Hapus membuka dialog konfirmasi berisi nama produk; fokus awal pada "Batal"; tombol Hapus berwarna bahaya solid (UI-AC-19).
  - [ ] Batal atau `Esc` → produk tetap ada (AC-30).
  - [ ] Setuju → produk hilang dari tabel dan katalog; ringkasan berkurang sesuai (AC-31).
  - [ ] Menghapus produk terakhir menampilkan state "Katalog masih kosong" tanpa error; data **tidak** di-seed ulang otomatis.
- **Berkas yang mungkin berubah:** `src/ui/dashboard.js`, `src/styles.css`

### T4.7 — Reset data contoh

- **Prioritas:** P1 · **Estimasi:** 5 mnt · **Bergantung pada:** T4.6
- **Acceptance criteria:**
  - [ ] "Reset data contoh" meminta konfirmasi ("Kembalikan ke 8 produk contoh? …"); setuju → daftar kembali ke 8 produk awal (AC-32); batal → tidak ada perubahan.
  - [ ] Setelah reset, objek yang tersimpan adalah salinan baru dari seed (mengubah produk tidak mengubah `seed.js`).
  - [ ] Berfungsi juga saat daftar produk kosong.
- **Berkas yang mungkin berubah:** `src/ui/dashboard.js`, `src/lib/storage.js`

### T4.8 — Notifikasi (toast)

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T0.3
- **Acceptance criteria:**
  - [ ] Fungsi `showToast(message, type)` dengan tipe info/sukses/error; `role="status"` untuk info/sukses dan `role="alert"` untuk error.
  - [ ] Selalu ada tombol "Tutup" (fokusable, ≥ 44 px); sukses hilang otomatis ±5 detik (P1); error bertahan sampai ditutup (UI-AC-20).
  - [ ] Pesan sukses setelah tambah/ubah/hapus/reset memakai teks UI-SPEC Bagian 8.
  - [ ] Tidak memakai `innerHTML` untuk isi pesan.
- **Berkas yang mungkin berubah:** `src/ui/toast.js` **(baru)**, `src/main.js`, `src/styles.css`

**Selesai M4 bila:** T4.1–T4.8 lulus; AC-24…AC-33 dan UI-AC-09, 16…20 terpenuhi (kecuali persistensi → M5).

---

## M5 — localStorage (±45 menit)

Tujuan: mengganti _stub_ `storage.js` dengan penyimpanan sungguhan sesuai SPEC 4.2.

### T5.1 — Pembacaan data dengan validasi dan fallback

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T4.1
- **Acceptance criteria:**
  - [ ] Key `ramyKeys.products.v1` tidak ada → muat 8 data contoh dan simpan.
  - [ ] Isi `{rusak` (JSON tidak valid), `version` tidak dikenal, atau `products` bukan array → fallback ke data contoh, simpan ulang, dan kembalikan penanda "data rusak" untuk notifikasi (AC-35).
  - [ ] Item yang gagal validasi dibuang, item valid dipertahankan (1 valid + 1 dengan `harga: -5` → 1 produk tampil) (AC-36).
  - [ ] `{"version":1,"products":[]}` dianggap valid dan menghasilkan daftar kosong.
  - [ ] Item dibangun lewat `normalizeProduct` (whitelist field); kunci seperti `__proto__` tidak mempengaruhi objek lain.
  - [ ] `getItem` dibungkus `try/catch`; jika storage tak dapat diakses, aplikasi tetap berjalan dengan data contoh di memori.
- **Berkas yang mungkin berubah:** `src/lib/storage.js`, `src/lib/validate.js`

### T5.2 — Penulisan data dengan penanganan error

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T5.1, T4.8
- **Acceptance criteria:**
  - [ ] `saveProducts()` menulis `{ "version": 1, "products": [...] }` ke key yang benar (periksa di _Application → Local Storage_).
  - [ ] `setItem` dibungkus `try/catch`; hasil `{ ok: false, error }` bila gagal.
  - [ ] Simulasi kegagalan (di console: `Storage.prototype.setItem = () => { throw new Error('quota') }`) → tampil toast error "Gagal menyimpan ke browser…"; aplikasi tidak crash; data tetap di memori sampai reload (R-03). Bila tidak dapat disimulasikan, tinjau kode jalur `catch` dan catat di `QA.md`.
- **Berkas yang mungkin berubah:** `src/lib/storage.js`, `src/ui/toast.js`

### T5.3 — Hubungkan persistensi ke semua mutasi

- **Prioritas:** P0 · **Estimasi:** 10 mnt · **Bergantung pada:** T5.2, T4.5, T4.6, T4.7
- **Acceptance criteria:**
  - [ ] Tambah, ubah, hapus, dan reset masing-masing memanggil `saveProducts()` dan perubahan bertahan setelah reload dan setelah menutup-membuka tab (AC-34).
  - [ ] Hapus semua produk → reload → katalog kosong, data tidak kembali sendiri; "Reset data contoh" memulihkan 8 produk (AC-37).
  - [ ] Tidak ada penulisan yang terjadi saat hanya menggunakan pencarian/filter/sort.
- **Berkas yang mungkin berubah:** `src/ui/dashboard.js`, `src/main.js`, `src/lib/storage.js`

### T5.4 — Notifikasi data rusak

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T5.1, T4.8
- **Acceptance criteria:**
  - [ ] Setelah AC-35, muncul notifikasi non-blocking "Data tersimpan rusak, data contoh dimuat ulang." yang bertahan sampai ditutup.
  - [ ] Notifikasi tidak muncul pada pemuatan normal atau saat key pertama kali dibuat.
- **Berkas yang mungkin berubah:** `src/main.js`, `src/lib/storage.js`

### T5.5 — Sinkronisasi antar-tab

- **Prioritas:** P1 (opsional) · **Estimasi:** 5 mnt · **Bergantung pada:** T5.3
- **Acceptance criteria:**
  - [ ] Perubahan data di tab A tercermin di tab B (lewat event `storage`) tanpa reload, atau perilaku "tab terakhir menang" dicatat di README (R-10).
- **Berkas yang mungkin berubah:** `src/main.js`, `README.md`

**Selesai M5 bila:** T5.1–T5.4 lulus; AC-34…AC-37 terpenuhi.

---

## M6 — Testing manual (±50 menit)

`SPEC.md` mengecualikan pengujian otomatis; pengujian di sini sepenuhnya manual dan terdokumentasi.

### T6.1 — Buat lembar QA

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** M5
- **Acceptance criteria:**
  - [ ] `QA.md` memuat tabel untuk AC-01…AC-42 dan UI-AC-01…UI-AC-25 dengan kolom: ID, Hasil (Lulus/Gagal/Tidak berlaku), Catatan, Tanggal.
  - [ ] Ada bagian "Lingkungan uji" (browser + versi, OS, ukuran layar) dan "Temuan & perbaikan".
- **Berkas yang mungkin berubah:** `QA.md` **(baru)**

### T6.2 — Uji fungsional (SPEC Bagian 9)

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T6.1
- **Acceptance criteria:**
  - [ ] Seluruh AC kelompok A–G dijalankan dari kondisi storage bersih dan hasilnya dicatat.
  - [ ] Tiap AC gagal memiliki catatan temuan; temuan P0 diperbaiki atau dijadwalkan sebelum M8.
  - [ ] Console bersih dari error merah pada seluruh alur normal (AC-40); teks UI konsisten berbahasa Indonesia (AC-41).
- **Berkas yang mungkin berubah:** `QA.md`, kode sesuai temuan

### T6.3 — Uji UI dan aksesibilitas (UI-SPEC Bagian 10)

- **Prioritas:** P0 · **Estimasi:** 15 mnt · **Bergantung pada:** T6.1
- **Acceptance criteria:**
  - [ ] UI-AC-01…UI-AC-25 dijalankan: kontras (color picker), responsif 320/360/768/1024/1200 px, keyboard-only, target 44 px, achromatopsia, `prefers-reduced-motion`, zoom 200%.
  - [ ] Lighthouse Accessibility ≥ 95 pada katalog dan dashboard (UI-AC-23); temuan kritis diperbaiki.
- **Berkas yang mungkin berubah:** `QA.md`, `src/styles.css`, `src/ui/*.js`

### T6.4 — Uji lintas browser dan perangkat

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T6.2
- **Acceptance criteria:**
  - [ ] Alur inti (lihat katalog, cari, pesan WA, tambah/ubah/hapus, reload) berjalan di Chrome, Firefox, dan Edge versi terbaru (NFR-R2).
  - [ ] Chrome Android diuji pada perangkat nyata; bila tidak tersedia, diganti emulasi perangkat dan dicatat.
  - [ ] Tampilan `<dialog>` dan `<details>` konsisten antar-browser (UR-06).
- **Berkas yang mungkin berubah:** `QA.md`, `src/styles.css`

### T6.5 — Uji kasus tepi data

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T6.2
- **Acceptance criteria:**
  - [ ] Nama 80 karakter, harga 9 digit, deskripsi 300 karakter: tampilan tetap utuh (UI-AC-22).
  - [ ] 100 produk (disuntik lewat console): pencarian/filter tetap instan; scroll dan render normal.
  - [ ] Storage kosong, rusak, dan berisi array kosong berperilaku sesuai SPEC 4.2.
  - [ ] Dua kali tambah cepat (klik ganda Simpan) tidak membuat produk ganda.
- **Berkas yang mungkin berubah:** `QA.md`, `src/ui/dashboard.js`

### T6.6 — Regresi setelah perbaikan

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T6.2, T6.3, T6.5
- **Acceptance criteria:**
  - [ ] Semua AC yang pernah gagal dijalankan ulang dan lulus; AC kritis (AC-03, 08, 22, 26, 34, 28) dijalankan ulang sebagai smoke test.
  - [ ] Ringkasan hasil (jumlah lulus/gagal/tidak berlaku) tercatat di `QA.md`.
- **Berkas yang mungkin berubah:** `QA.md`

**Selesai M6 bila:** T6.1–T6.6 lulus; seluruh AC P0 berstatus Lulus.

---

## M7 — Security (±30 menit)

### T7.1 — Audit XSS dan API berbahaya

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** M4
- **Acceptance criteria:**
  - [ ] Pencarian baca-saja (`grep -rnE "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function" src index.html`) tidak menemukan pemakaian untuk data pengguna/storage; jika ada pemakaian untuk konstanta statis, dibenarkan secara tertulis di `QA.md`.
  - [ ] Payload uji tampil sebagai teks pada katalog, tabel, form edit, dialog konfirmasi, toast, dan atribut `alt`/`aria-label`: `<img src=x onerror=alert(1)>`, `"><script>alert(1)</script>`, `' onmouseover='alert(1)` (AC-28).
  - [ ] Payload yang sama disuntik langsung ke localStorage lalu reload: tidak ada eksekusi skrip.
- **Berkas yang mungkin berubah:** `src/ui/*.js` (jika ada perbaikan), `QA.md`

### T7.2 — Audit rahasia, data pribadi, dan perintah

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** M5
- **Acceptance criteria:**
  - [ ] `grep -rniE "api[_-]?key|secret|token|password|bearer" src index.html public` tidak menemukan kredensial; `git ls-files` tidak memuat `.env*` (AC-02).
  - [ ] Data seed dan README tidak memuat nama orang, nomor telepon asli, alamat, atau email.
  - [ ] README hanya mencantumkan perintah dari daftar aman (Bagian 0.2).
- **Berkas yang mungkin berubah:** `.gitignore`, `README.md`, `src/data/seed.js`

### T7.3 — Audit jaringan

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** M3
- **Acceptance criteria:**
  - [ ] Tab Network (reload katalog dan dashboard) tidak menampilkan permintaan ke domain lain; satu-satunya tautan keluar adalah `wa.me` saat tombol ditekan (AC-07, NFR-S5).
  - [ ] `index.html` dan `src` tidak memuat skrip/gaya/font dari CDN; pencarian baca-saja `grep -rnE "fetch\(|XMLHttpRequest|WebSocket|https?://" src index.html` hanya menemukan `wa.me` dan atribut XML/SVG yang sah.
- **Berkas yang mungkin berubah:** `index.html`, `src/**`

### T7.4 — Pengerasan validasi input

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T4.1, T5.1
- **Acceptance criteria:**
  - [ ] `imageUrl` berbahaya (`javascript:alert(1)`, `data:text/html,…`, `/images/../../x`, `//evil.test/a.png`) ditolak di form **dan** dibuang saat dibaca dari storage.
  - [ ] Batas panjang (nama 80, deskripsi 300) ditegakkan di validasi, bukan hanya atribut `maxlength`.
  - [ ] Objek dari storage dengan field tambahan atau tipe salah (string untuk `harga`, `unggulan: "true"`) ditolak atau dinormalisasi sesuai aturan.
- **Berkas yang mungkin berubah:** `src/lib/validate.js`, `src/lib/storage.js`

### T7.5 — Audit dependensi

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T0.1
- **Acceptance criteria:**
  - [ ] `npm audit` dijalankan; tidak ada kerentanan _high/critical_ pada dependensi yang dipakai (hasil dicatat di `QA.md`).
  - [ ] Jika ada temuan, perbaikan hanya lewat pembaruan versi Vite yang terkontrol (`npm install vite@<versi>`) lalu `npm run build` + smoke test; **tidak** memakai `npm audit fix --force`.
  - [ ] `package-lock.json` ter-_commit_; hanya Vite sebagai dependensi pengembangan.
- **Berkas yang mungkin berubah:** `package.json`, `package-lock.json`, `QA.md`

### T7.6 — CSP dan header keamanan

- **Prioritas:** P1 (opsional) · **Estimasi:** 5 mnt · **Bergantung pada:** T8.2
- **Deskripsi:** Tambahkan _Content Security Policy_ ketat untuk build produksi; header hanya efektif di host yang mendukung.
- **Acceptance criteria:**
  - [ ] Kebijakan minimal: `default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'` (via `<meta http-equiv>` pada build atau berkas `public/_headers` untuk host yang mendukung).
  - [ ] Pada `npm run preview` tidak ada pelanggaran CSP di console dan seluruh fitur tetap berfungsi; jika ada pelanggaran, kebijakan dilonggarkan seperlunya dan alasannya dicatat.
  - [ ] Header tambahan (bila memakai `_headers`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`.
  - [ ] README mencatat bahwa GitHub Pages tidak dapat mengatur header HTTP kustom.
- **Berkas yang mungkin berubah:** `index.html`, `public/_headers` **(baru)**, `vite.config.js`, `README.md`

**Selesai M7 bila:** T7.1–T7.5 lulus (T7.6 opsional); AC-02, 07, 28 terpenuhi.

---

## M8 — Build (±20 menit)

### T8.1 — Build produksi bersih

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** M7
- **Acceptance criteria:**
  - [ ] `npm run build` selesai dengan kode keluar 0 dan tanpa peringatan yang berarti.
  - [ ] `dist/` berisi `index.html`, `assets/` (berkas ber-hash), dan `images/` (6 SVG).
  - [ ] Ukuran total JS + CSS di `dist/assets` kecil (target < 100 KB sebelum kompresi; NFR-P3).
  - [ ] `dist/` tidak memuat `.env`, _source map_ yang tidak diperlukan, atau berkas di luar kebutuhan.
- **Berkas yang mungkin berubah:** `vite.config.js`, `package.json`

### T8.2 — Smoke test `preview`

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T8.1
- **Acceptance criteria:**
  - [ ] `npm run preview`: AC-03, 08, 22, 26, 28, 34 lulus pada build produksi.
  - [ ] Build dengan `--base=/ramy-keys/` lalu preview: gambar tampil, `#/` dan `#/dashboard` berfungsi, tidak ada 404 di Network.
  - [ ] Console produksi bersih dari error (AC-40).
- **Berkas yang mungkin berubah:** `src/lib/format.js` (jika `assetUrl` perlu perbaikan), `vite.config.js`

### T8.3 — Lighthouse pada build produksi

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T8.2
- **Acceptance criteria:**
  - [ ] Lighthouse (mode mobile) pada `preview`: Accessibility ≥ 95, Best Practices ≥ 90, Performance ≥ 90 (target; deviasi dicatat beserta alasan).
  - [ ] Halaman awal interaktif < 2 detik pada `preview` di laptop biasa (NFR-P1).
- **Berkas yang mungkin berubah:** `QA.md`, `src/styles.css`, `index.html`

### T8.4 — README final

- **Prioritas:** P0 · **Estimasi:** 5 mnt · **Bergantung pada:** T6.6
- **Acceptance criteria:**
  - [ ] README memuat: deskripsi singkat, daftar fitur, cara `install` / `dev` / `build` / `preview`, struktur proyek ringkas, catatan nomor WhatsApp dummy, catatan bahwa data hanya di browser ini dan hilang bila data situs dibersihkan, tautan ke `SPEC.md`, `UI-SPEC.md`, `TASKS.md`, `QA.md` (AC-42).
  - [ ] README sesuai perilaku aplikasi sebenarnya (tidak menjanjikan fitur out-of-scope).
- **Berkas yang mungkin berubah:** `README.md`

**Selesai M8 bila:** T8.1–T8.4 lulus; AC-01, 42, UI-AC-23 terpenuhi.

---

## M9 — Deployment demo (±25 menit, P1 / opsional)

Hosting statis untuk demo. Tidak ada server, database, atau rahasia. Tugas ini boleh dilewati tanpa memengaruhi kelulusan MVP.

### T9.1 — Pilih target hosting statis

- **Prioritas:** P1 · **Estimasi:** 5 mnt · **Bergantung pada:** M8
- **Acceptance criteria:**
  - [ ] Satu opsi dipilih dan alasannya dicatat di README: (A) unggah folder `dist` secara manual ke penyedia hosting statis lewat antarmuka web (mis. Netlify Drop atau Cloudflare Pages _direct upload_), atau (B) GitHub Pages lewat GitHub Actions.
  - [ ] Tidak ada token/API key yang disalin ke repositori atau README; opsi B hanya memakai `GITHUB_TOKEN` bawaan.
  - [ ] Tidak ada instalasi CLI global dengan `sudo` atau skrip `curl | sh`.
- **Berkas yang mungkin berubah:** `README.md`

### T9.2 — Konfigurasi deploy

- **Prioritas:** P1 · **Estimasi:** 10 mnt · **Bergantung pada:** T9.1
- **Acceptance criteria:**
  - [ ] Opsi A: tidak ada perubahan kode selain (opsional) `public/_headers`; `dist` dari `npm run build` siap diunggah.
  - [ ] Opsi B: `.github/workflows/deploy.yml` berjalan pada `push` ke `main` dan `workflow_dispatch`; izin minimal (`contents: read`, `pages: write`, `id-token: write`); langkah: checkout → setup Node → `npm ci` → `npm run build` → unggah artefak `dist` → deploy Pages; tidak ada `secrets.*` kustom; versi action dipin ke versi mayor terbaru sesuai dokumentasi resmi masing-masing action.
  - [ ] Opsi B: `base` build sesuai (mis. `./` atau `/<nama-repo>/`) dan pengaturan _Pages → Source: GitHub Actions_ dilakukan manual lewat UI repositori.
  - [ ] `npm run build` lokal tetap berhasil setelah perubahan konfigurasi.
- **Berkas yang mungkin berubah:** `.github/workflows/deploy.yml` **(baru, opsi B)**, `vite.config.js`, `public/_headers` **(baru, opsional)**, `README.md`

### T9.3 — Deploy dan verifikasi URL publik

- **Prioritas:** P1 · **Estimasi:** 10 mnt · **Bergantung pada:** T9.2
- **Acceptance criteria:**
  - [ ] URL publik dapat dibuka lewat HTTPS; `#/` dan `#/dashboard` dapat dibuka langsung dan setelah _hard refresh_ (routing hash tidak memerlukan _rewrite_ server).
  - [ ] Smoke test di URL publik: AC-03, 08, 22, 26, 28, 34 lulus; gambar tidak 404; tab Network tidak menampilkan domain pihak ketiga.
  - [ ] Catatan di README: URL, cara deploy ulang, cara _rollback_ (deploy ulang `dist` sebelumnya / _revert commit_), dan bahwa data localStorage terpisah per alamat/origin dan per browser.
  - [ ] Nomor WhatsApp tetap dummy kecuali pemilik sengaja menggantinya (dicatat).
- **Berkas yang mungkin berubah:** `README.md`, `QA.md`

**Selesai M9 bila:** T9.1–T9.3 lulus, atau M9 dinyatakan dilewati di README.

---

## 10. Inventaris berkas dan tugas yang menyentuhnya

| Berkas                                              | Tugas                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------- |
| `package.json`, `package-lock.json`                 | T0.1, T7.5, T8.1                                                                |
| `vite.config.js`                                    | T0.1, T7.6, T8.1, T8.2, T9.2                                                    |
| `.gitignore`                                        | T0.1, T7.2                                                                      |
| `index.html`                                        | T0.3, T0.4, T3.3, T7.3, T7.6, T8.3                                              |
| `src/main.js`                                       | T0.4, T1.6, T2.5, T4.8, T5.3, T5.4, T5.5                                        |
| `src/config.js`                                     | T0.2, T2.1, T3.1, T3.3                                                          |
| `src/data/seed.js`                                  | T1.1, T7.2                                                                      |
| `src/lib/format.js`                                 | T1.2, T1.7, T3.1, T8.2                                                          |
| `src/lib/query.js`                                  | T1.4, T2.1                                                                      |
| `src/lib/validate.js`                               | T4.1, T4.5, T5.1, T7.4                                                          |
| `src/lib/storage.js`                                | T1.3, T4.5, T4.7, T5.1–T5.4, T7.4                                               |
| `src/lib/id.js` **(baru)**                          | T4.2                                                                            |
| `src/ui/dom.js`                                     | T0.4, T1.5                                                                      |
| `src/ui/catalog.js`                                 | T0.4, T0.5, T1.5, T1.6, T2.2–T2.5, T3.2                                         |
| `src/ui/dashboard.js`                               | T0.4, T4.3–T4.7, T6.5                                                           |
| `src/ui/product-form.js` **(baru, opsional)**       | T4.5                                                                            |
| `src/ui/toast.js` **(baru)**                        | T4.8, T5.2                                                                      |
| `src/styles.css`                                    | T0.1, T0.3–T0.5, T1.5, T1.6, T2.2–T2.4, T3.2, T4.3–T4.6, T4.8, T6.3, T6.4, T8.3 |
| `public/images/*.svg`                               | T0.5                                                                            |
| `public/_headers` **(baru, opsional)**              | T7.6, T9.2                                                                      |
| `.github/workflows/deploy.yml` **(baru, opsional)** | T9.2                                                                            |
| `README.md`                                         | T0.1, T3.3, T5.5, T7.2, T7.6, T8.4, T9.1–T9.3                                   |
| `QA.md` **(baru)**                                  | T6.1–T6.6, T7.1, T7.5, T8.3, T9.3                                               |

---

## 11. Keterlacakan: acceptance criteria → tugas

### 11.1 `SPEC.md` Bagian 9

| AC            | Tugas            | AC        | Tugas            |
| ------------- | ---------------- | --------- | ---------------- |
| AC-01         | T0.1, T8.1       | AC-22     | T3.2             |
| AC-02         | T7.2             | AC-23     | T3.2             |
| AC-03         | T1.6             | AC-24     | T4.3             |
| AC-04         | T1.5             | AC-25     | T4.3             |
| AC-05         | T1.5, T3.2       | AC-26     | T4.5             |
| AC-06         | T1.5, T1.7, T4.5 | AC-27     | T4.1, T4.5       |
| AC-07         | T1.6, T7.3       | AC-28     | T4.4, T4.5, T7.1 |
| AC-08, 09, 11 | T2.1, T2.2       | AC-29     | T4.5             |
| AC-10         | T2.4             | AC-30, 31 | T4.6             |
| AC-12…16      | T2.2             | AC-32     | T4.7             |
| AC-17…21      | T2.1, T2.2       | AC-33     | T1.5, T4.5       |
| AC-34         | T5.3             | AC-38     | T0.3, T4.4, T6.3 |
| AC-35, 36     | T5.1, T5.4       | AC-39     | T0.4, T6.3       |
| AC-37         | T4.6, T5.3       | AC-40, 41 | T6.2, T8.2       |
| AC-42         | T8.4             |           |                  |

### 11.2 `UI-SPEC.md` Bagian 10

| UI-AC        | Tugas            | UI-AC    | Tugas      |
| ------------ | ---------------- | -------- | ---------- |
| UI-AC-01     | T0.3, T1.5, T6.3 | UI-AC-14 | T2.2       |
| UI-AC-02, 03 | T1.6, T6.3       | UI-AC-15 | T3.2       |
| UI-AC-04     | T1.6, T6.3       | UI-AC-16 | T4.4       |
| UI-AC-05     | T1.5             | UI-AC-17 | T4.3       |
| UI-AC-06     | T6.3             | UI-AC-18 | T4.5       |
| UI-AC-07     | T0.4, T6.3       | UI-AC-19 | T4.6       |
| UI-AC-08     | T0.4             | UI-AC-20 | T4.8, T5.4 |
| UI-AC-09     | T4.5             | UI-AC-21 | T1.6, T2.4 |
| UI-AC-10     | T6.3             | UI-AC-22 | T1.5, T6.5 |
| UI-AC-11     | T0.3             | UI-AC-23 | T6.3, T8.3 |
| UI-AC-12     | T0.5             | UI-AC-24 | T0.3       |
| UI-AC-13     | T2.3             | UI-AC-25 | T1.5, T1.7 |

---

## 12. Urutan, estimasi, dan cut-line

### 12.1 Alur ketergantungan

```text
M0 Scaffold
  └─ M1 Katalog ─┬─ M2 Pencarian/Filter/Sort
                 └─ M3 WhatsApp
          M2 + M3 ─ M4 CRUD dashboard ─ M5 localStorage
                                          └─ M6 Testing ─ M7 Security ─ M8 Build ─ M9 Deployment (opsional)
```

### 12.2 Estimasi

| Milestone | Estimasi |           Kumulatif |
| --------- | -------: | ------------------: |
| M0        |   40 mnt |              40 mnt |
| M1        |   70 mnt |             110 mnt |
| M2        |   60 mnt |             170 mnt |
| M3        |   25 mnt |             195 mnt |
| M4        |  100 mnt |             295 mnt |
| M5        |   45 mnt |             340 mnt |
| M6        |   50 mnt |             390 mnt |
| M7        |   30 mnt |             420 mnt |
| M8        |   20 mnt |             440 mnt |
| M9        |   25 mnt | 465 mnt (±7,75 jam) |

### 12.3 Cut-line jika waktu mepet (korbankan berurutan dari atas)

1. M9 seluruhnya (deployment demo).
2. T7.6 (CSP), T5.5 (sinkronisasi antar-tab), T0.5 bagian ilustrasi hero.
3. T4.7 (Reset data contoh) dan opsi sort "Stok terbanyak"; penutupan otomatis toast.
4. Uji lintas browser selain Chrome (T6.4) — tetap catat browser yang diuji.

**Tidak boleh dikorbankan:** validasi data (T4.1, T7.4), penyimpanan localStorage (M5), proteksi XSS (T7.1), label "Dashboard Demo", kontras dan fokus (UI-SPEC 4), serta audit rahasia (T7.2).

---

## 13. Definition of Done (MVP)

- [ ] Semua tugas P0 pada M0–M8 berstatus selesai dan acceptance criteria-nya tercentang.
- [ ] `QA.md` menunjukkan seluruh AC-01…AC-42 dan UI-AC-01…UI-AC-25 berstatus **Lulus** (atau "Tidak berlaku" dengan alasan tertulis).
- [ ] `npm run build` sukses; `npm run preview` berjalan; console bersih pada alur normal.
- [ ] Tidak ada rahasia/API key/`.env` berisi kredensial; tidak ada permintaan jaringan pihak ketiga selain tautan `wa.me` saat tombol ditekan.
- [ ] README final sesuai perilaku aplikasi (AC-42).
- [ ] (Opsional) URL demo publik berfungsi sesuai T9.3.

## 14. Pelacakan Progres & Status Eksekusi (TASKS.md — Lanjutan)

### 14.1 Penyelarasan Detail Lintas-Dokumen

Sebelum memulai M0, pastikan dua poin berikut ikut diperiksa pada milestone terkait:

1. **UI-AC-12 (Scroll halus & prefers-reduced-motion)**  
   Sudah dipetakan ke T0.5 (klik "Lihat Katalog" menggulir ke `#katalog` tanpa mengubah rute hash). Tambahkan verifikasi eksplisit bahwa `scroll-behavior: smooth` pada `html` dimatikan saat `@media (prefers-reduced-motion: reduce)` aktif (diatur di T0.3 / T0.5).

2. **T8.1 (`dist/` output)**  
   Jika T7.6 (P1) dikerjakan dan `public/_headers` dibuat, folder `dist/` juga akan menyertakan `_headers` selain `index.html`, `assets/`, dan `images/`.

### 14.2 Papan Status Milestone (Checklist Eksekusi)

Gunakan tabel berikut untuk mencatat progres harian saat mengerjakan M0–M9:

| Milestone                    | Tugas       | Prioritas               | Status          | Berkas Utama Terdampak                                                                                                                   | Commit Hash / Catatan |
| ---------------------------- | ----------- | ----------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| M0 — Scaffold                | T0.1 – T0.5 | P0 (T0.5 ilustrasi: P1) | [ ] Belum mulai | `package.json`, `vite.config.js`, `index.html`, `src/config.js`, `src/main.js`, `src/styles.css`, `src/ui/dom.js`, `public/images/*.svg` | —                     |
| M1 — Katalog                 | T1.1 – T1.7 | P0                      | [ ] Belum mulai | `src/data/seed.js`, `src/lib/format.js`, `src/lib/storage.js`, `src/lib/query.js`, `src/ui/catalog.js`, `src/styles.css`                 | —                     |
| M2 — Pencarian, Filter, Sort | T2.1 – T2.5 | P0                      | [ ] Belum mulai | `src/lib/query.js`, `src/config.js`, `src/ui/catalog.js`, `src/main.js`, `src/styles.css`                                                | —                     |
| M3 — WhatsApp                | T3.1 – T3.3 | P0                      | [ ] Belum mulai | `src/lib/format.js`, `src/config.js`, `src/ui/catalog.js`, `src/styles.css`, `README.md`                                                 | —                     |
| M4 — CRUD Dashboard          | T4.1 – T4.8 | P0 (T4.7: P1)           | [ ] Belum mulai | `src/lib/validate.js`, `src/lib/id.js`, `src/ui/dashboard.js`, `src/ui/toast.js`, `src/styles.css`                                       | —                     |
| M5 — localStorage            | T5.1 – T5.5 | P0 (T5.5: P1)           | [ ] Belum mulai | `src/lib/storage.js`, `src/lib/validate.js`, `src/ui/dashboard.js`, `src/main.js`                                                        | —                     |
| M6 — Testing Manual          | T6.1 – T6.6 | P0                      | [ ] Belum mulai | `QA.md`, `src/styles.css`, `src/ui/*.js`                                                                                                 | —                     |
| M7 — Security                | T7.1 – T7.6 | P0 (T7.6: P1)           | [ ] Belum mulai | `src/lib/validate.js`, `src/lib/storage.js`, `index.html`, `public/_headers`, `QA.md`                                                    | —                     |
| M8 — Build                   | T8.1 – T8.4 | P0                      | [ ] Belum mulai | `vite.config.js`, `dist/*`, `README.md`, `QA.md`                                                                                         | —                     |
| M9 — Deployment Demo         | T9.1 – T9.3 | P1 (Opsional)           | [ ] Belum mulai | `.github/workflows/deploy.yml`, `vite.config.js`, `README.md`, `QA.md`                                                                   | —                     |

### 14.3 Verifikasi Kesiapan Sebelum Mulai M0

- [x] `SPEC.md` v0.1 tersedia dan seluruh fitur (F-01–F-15), data model, serta AC-01–AC-42 terdefinisi.
- [x] `UI-SPEC.md` v0.1 tersedia dan seluruh token warna, kontras WCAG, wireframe, serta UI-AC-01–UI-AC-25 terdefinisi.
- [x] `TASKS.md` v0.1 lengkap dari M0 (Scaffold) sampai M9 (Deployment) dengan acceptance criteria, inventaris berkas, matriks keterlacakan, dan cut-line.
- [ ] Eksekusi M0 dimulai (belum ada kode yang dibuat sesuai status dokumen).
