# SPEC — Ramy Keys (`ramy-keys`)

| Item           | Isi                                                              |
| -------------- | ---------------------------------------------------------------- |
| Versi dokumen  | 0.1 (Draft untuk latihan 1 hari)                                 |
| Jenis aplikasi | Katalog produk UMKM mechanical keyboard & aksesori, berbasis web |
| Tech stack     | Vite + JavaScript vanilla (ES Modules), HTML, CSS                |
| Penyimpanan    | `localStorage` browser (tanpa backend)                           |
| Timebox        | ±8 jam kerja (termasuk buffer)                                   |
| Status kode    | Belum ada. Dokumen ini hanya spesifikasi.                        |

---

## 1. Tujuan

### 1.1 Tujuan produk

Menyediakan katalog digital sederhana bagi toko mechanical keyboard UMKM sehingga:

1. Calon pembeli dapat melihat, mencari, memfilter, dan mengurutkan produk, lalu memesan lewat WhatsApp.
2. Pengelola toko dapat mengelola data produk (tambah, ubah, hapus) dan melihat ringkasan stok pada perangkat yang sama.

### 1.2 Tujuan latihan

- Berlatih alur kerja System Analyst → Software Engineer: spesifikasi dulu, baru implementasi bertahap.
- Menghasilkan MVP yang berjalan penuh di browser dalam 1 hari, dengan kriteria penerimaan yang bisa diperiksa manual.

### 1.3 Indikator keberhasilan

- Seluruh _acceptance criteria_ di Bagian 9 berstatus lulus.
- `npm run build` berhasil tanpa error.
- Tidak ada rahasia (API key, token, password) di repositori.

---

## 2. Pengguna

Aplikasi dipakai pada **satu perangkat dan satu browser**. Tidak ada akun, tidak ada login.

| Pengguna           | Deskripsi                                   | Kebutuhan utama                                                             |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------------- |
| **Calon pembeli**  | Orang yang menelusuri katalog.              | Menemukan produk cepat, melihat harga & ketersediaan, memesan via WhatsApp. |
| **Pengelola toko** | Pemilik/admin toko yang memegang perangkat. | Menambah/mengubah/menghapus produk, memantau total produk & stok.           |

**Catatan keputusan:** pembeli dan pengelola dibedakan **hanya lewat halaman** (`#/` untuk katalog, `#/dashboard` untuk dashboard). Dashboard **tidak diproteksi** dan harus diberi label jelas _"Dashboard Demo — data tersimpan di browser ini saja"_. Tidak boleh ada form login, password, atau token palsu yang memberi kesan keamanan.

### Skenario utama

1. Pembeli membuka katalog → mencari "switch" → memfilter kategori → mengurutkan harga termurah → menekan **Pesan via WhatsApp**.
2. Pengelola membuka Dashboard → menambah produk baru → stok dan total di ringkasan ikut berubah → produk muncul di katalog → data tetap ada setelah reload.

---

## 3. Daftar Fitur

Prioritas: **P0** = wajib MVP, **P1** = sebaiknya ada jika waktu cukup.

| ID   | Fitur                        | Prioritas | Deskripsi singkat                                                                                  |
| ---- | ---------------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| F-01 | Katalog produk               | P0        | Menampilkan produk sebagai grid kartu: gambar, nama, kategori, harga Rupiah, stok, badge unggulan. |
| F-02 | Data contoh                  | P0        | 8 produk contoh nonpribadi dimuat saat penyimpanan masih kosong (lihat 4.4).                       |
| F-03 | Gambar/placeholder lokal     | P0        | Gambar dari folder lokal proyek; jika gagal dimuat, tampil placeholder.                            |
| F-04 | Pencarian                    | P0        | Kolom teks; mencari pada nama, kategori, dan deskripsi; tidak peka huruf besar/kecil.              |
| F-05 | Filter                       | P0        | Filter kategori, toggle "Hanya unggulan", toggle "Hanya tersedia (stok > 0)", tombol reset filter. |
| F-06 | Sorting                      | P0        | Opsi: Default, Harga termurah, Harga termahal, Nama A–Z, Stok terbanyak.                           |
| F-07 | Tombol pesan WhatsApp        | P0        | Membuka tautan `wa.me` dengan pesan otomatis berisi nama produk & harga. Nonaktif jika stok 0.     |
| F-08 | Dashboard demo — daftar      | P0        | Tabel semua produk dengan aksi Ubah dan Hapus.                                                     |
| F-09 | Dashboard demo — tambah/ubah | P0        | Form dengan validasi sesuai data model.                                                            |
| F-10 | Dashboard demo — hapus       | P0        | Hapus dengan konfirmasi.                                                                           |
| F-11 | Ringkasan                    | P0        | Kartu ringkasan: total produk, total stok. Tambahan kecil: jumlah produk stok habis.               |
| F-12 | Penyimpanan localStorage     | P0        | Semua perubahan tersimpan dan bertahan setelah reload.                                             |
| F-13 | Reset data contoh            | P1        | Tombol di dashboard untuk mengembalikan 8 produk contoh (dengan konfirmasi).                       |
| F-14 | Empty state & error state    | P0        | Pesan jelas untuk: hasil pencarian kosong, katalog kosong, data tersimpan rusak.                   |
| F-15 | Navigasi hash sederhana      | P0        | Dua halaman (`#/` dan `#/dashboard`) tanpa library router.                                         |

### 3.1 Aturan perilaku

**Pencarian (F-04)**

- Input di-_trim_; pencarian kosong = tampilkan semua.
- Pencocokan _substring_, tidak peka kapital, pada `nama`, `kategori`, `deskripsi`.

**Filter (F-05) dan sorting (F-06)**

- Semua kontrol bekerja **kombinasi (AND)**: pencarian + kategori + unggulan + tersedia, lalu hasilnya diurutkan.
- Sorting harga/stok bersifat numerik; sorting nama memakai `localeCompare('id')`.
- Default = urutan data tersimpan.
- State filter/sort tidak disimpan ke localStorage (kembali ke awal saat reload).

**Format Rupiah**

- Ditampilkan dengan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`, contoh: `Rp 1.450.000`.
- Nilai yang disimpan tetap angka mentah (bukan string berformat).

**Tombol WhatsApp (F-07)**

- Nomor tujuan berupa **konstanta konfigurasi** `WA_NUMBER` di `src/config.js` berisi nomor **dummy** (format internasional tanpa `+`, mis. `6280000000000`). Bukan nomor pribadi.
- Tautan: `https://wa.me/<WA_NUMBER>?text=<encodeURIComponent(pesan)>`.
- Templat pesan: `Halo Ramy Keys, saya ingin memesan: {nama} ({harga berformat}). Apakah masih tersedia?`
- Dibuka di tab baru dengan `target="_blank"` dan `rel="noopener noreferrer"`.
- Jika `stok === 0`: tombol `disabled`, label "Stok habis".

**Dashboard (F-08 s.d. F-13)**

- Hapus dan reset **wajib** konfirmasi (`confirm()` atau dialog sederhana).
- Jika semua produk dihapus: katalog menampilkan empty state; data **tidak** di-seed ulang otomatis (hanya lewat tombol reset).
- Saat simpan gagal validasi: tidak ada data yang berubah, pesan error tampil di dekat field terkait.

---

## 4. Data Model

### 4.1 Entitas `Product`

| Field       | Tipe             | Wajib | Aturan validasi                                                                                                                                                                    |
| ----------- | ---------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | string           | Ya    | Unik, dibuat otomatis (`crypto.randomUUID()`, fallback `p-<timestamp>-<acak>`). Tidak bisa diubah lewat form.                                                                      |
| `nama`      | string           | Ya    | Setelah di-_trim_: 2–80 karakter.                                                                                                                                                  |
| `kategori`  | string (enum)    | Ya    | Salah satu dari: `Keyboard Kit`, `Prebuilt Keyboard`, `Switch`, `Keycaps`, `Aksesori`.                                                                                             |
| `harga`     | number           | Ya    | Angka terhingga (bukan `NaN`/`Infinity`), **≥ 0**. Form hanya menerima bilangan bulat (Rupiah tanpa desimal).                                                                      |
| `stok`      | number (integer) | Ya    | `Number.isInteger`, **≥ 0**.                                                                                                                                                       |
| `deskripsi` | string           | Tidak | Maks. 300 karakter; boleh kosong.                                                                                                                                                  |
| `imageUrl`  | string           | Tidak | Hanya path lokal yang diawali `/images/` (mis. `/images/placeholder-kit.svg`). Kosong atau gagal dimuat → pakai `/images/placeholder-default.svg`. URL eksternal ditolak validasi. |
| `unggulan`  | boolean          | Ya    | `true`/`false`; default form `false`.                                                                                                                                              |

Contoh objek:

```json
{
  "id": "p-001",
  "nama": "Ramy65 Aluminum Kit",
  "kategori": "Keyboard Kit",
  "harga": 1450000,
  "stok": 6,
  "deskripsi": "Kit 65% casing aluminium, hot-swap, plat PC.",
  "imageUrl": "/images/placeholder-kit.svg",
  "unggulan": true
}
```

### 4.2 Skema penyimpanan localStorage

- **Key:** `ramyKeys.products.v1`
- **Value (JSON):**

```json
{
  "version": 1,
  "products": [
    /* array Product */
  ]
}
```

Aturan pembacaan:

1. Key tidak ada → muat 8 data contoh, lalu simpan.
2. JSON tidak valid / `version` tak dikenal / bukan array → anggap rusak: pakai data contoh, simpan ulang, tampilkan notifikasi non-blocking _"Data tersimpan rusak, data contoh dimuat ulang."_
3. Ada item yang tidak lolos validasi → item tersebut dibuang; item valid dipertahankan.
4. Array kosong `[]` adalah data **valid** (artinya toko sengaja dikosongkan).
5. Semua `getItem`/`setItem` dibungkus `try/catch` (mode privat, kuota penuh, storage dinonaktifkan). Jika gagal menulis, tampilkan pesan error dan aplikasi tetap berjalan dengan data di memori.

### 4.3 Data turunan (tidak disimpan)

| Nama              | Rumus                             |
| ----------------- | --------------------------------- |
| Total produk      | `products.length`                 |
| Total stok        | jumlah semua `stok`               |
| Produk stok habis | jumlah produk dengan `stok === 0` |

### 4.4 Data contoh (8 produk, nonpribadi, nama fiktif)

| #   | Nama                            | Kategori          | Harga (Rp) | Stok | Unggulan | Gambar                      |
| --- | ------------------------------- | ----------------- | ---------: | ---: | :------: | --------------------------- |
| 1   | Ramy65 Aluminum Kit             | Keyboard Kit      |  1.450.000 |    6 |    Ya    | `placeholder-kit.svg`       |
| 2   | Ramy75 Gasket Kit Hot-swap      | Keyboard Kit      |  1.100.000 |    4 |  Tidak   | `placeholder-kit.svg`       |
| 3   | Ramy Tactile 68 Prebuilt        | Prebuilt Keyboard |  1.850.000 |    5 |    Ya    | `placeholder-prebuilt.svg`  |
| 4   | Ramy Compact 60 Prebuilt        | Prebuilt Keyboard |    950.000 |    0 |  Tidak   | `placeholder-prebuilt.svg`  |
| 5   | Switch Linear "Cloud" (isi 70)  | Switch            |    185.000 |   40 |    Ya    | `placeholder-switch.svg`    |
| 6   | Switch Tactile "Ember" (isi 70) | Switch            |    210.000 |   25 |  Tidak   | `placeholder-switch.svg`    |
| 7   | Keycaps PBT "Sakura" 135 tombol | Keycaps           |    420.000 |   12 |  Tidak   | `placeholder-keycaps.svg`   |
| 8   | Kabel USB-C Coiled              | Aksesori          |    175.000 |   15 |  Tidak   | `placeholder-accessory.svg` |

Nilai turunan yang diharapkan pada data contoh awal: **Total produk = 8**, **Total stok = 107**, **Stok habis = 1**, **Unggulan = 3**, **Tersedia (stok > 0) = 7**.

Setiap produk contoh wajib punya `deskripsi` singkat (1 kalimat) saat implementasi. Tidak boleh memuat nama orang, nomor telepon, alamat, atau merek dagang pihak lain.

### 4.5 Aset gambar

- Folder `public/images/` berisi SVG placeholder buatan sendiri: `placeholder-kit.svg`, `placeholder-prebuilt.svg`, `placeholder-switch.svg`, `placeholder-keycaps.svg`, `placeholder-accessory.svg`, `placeholder-default.svg`.
- Tidak mengunduh gambar dari internet; tidak ada hotlink.

---

## 5. Non-Functional Requirements

### 5.1 Keamanan & privasi

- **NFR-S1:** Tidak ada API key, token, password, atau file `.env` berisi rahasia di repositori. Aplikasi tidak memerlukan satu pun.
- **NFR-S2:** Tanpa backend, tanpa login/otentikasi palsu. Dashboard diberi label demo yang jujur.
- **NFR-S3:** Anti-XSS: data produk dirender dengan `textContent`/`createElement`; **dilarang** `innerHTML` untuk data dari pengguna/localStorage.
- **NFR-S4:** `imageUrl` dibatasi ke path lokal `/images/…`; tidak ada skema `javascript:`, `data:`, atau `http(s)://`.
- **NFR-S5:** Tidak ada permintaan jaringan ke pihak ketiga (tanpa analytics, CDN, font eksternal). Satu-satunya tautan keluar adalah `wa.me` saat pembeli menekan tombol pesan.
- **NFR-S6:** Data contoh dan nomor WhatsApp bersifat dummy dan nonpribadi.
- **NFR-S7:** Proses pengembangan hanya memakai perintah standar (`npm create vite`, `npm install`, `npm run dev|build|preview`). Tidak memakai `sudo`, `rm -rf`, `curl | sh`, atau skrip yang tidak dikenal.

### 5.2 Kinerja

- **NFR-P1:** Halaman awal tampil interaktif < 2 detik pada `npm run preview` di laptop biasa.
- **NFR-P2:** Pencarian/filter/sort memperbarui tampilan terasa instan (< 100 ms untuk ≤ 100 produk).
- **NFR-P3:** Tanpa dependensi runtime selain Vite (devDependency). Ukuran build kecil.

### 5.3 Kegunaan, aksesibilitas, dan responsivitas

- **NFR-U1:** Tata letak responsif: 360 px hingga desktop tanpa scroll horizontal pada halaman.
- **NFR-U2:** Semua kontrol dapat dioperasikan dengan keyboard; fokus terlihat jelas.
- **NFR-U3:** Setiap input punya `<label>`; gambar punya `alt` bermakna; tombol nonaktif memakai atribut `disabled`.
- **NFR-U4:** Kontras teks memadai (target WCAG AA untuk teks utama).
- **NFR-U5:** Seluruh teks antarmuka berbahasa Indonesia.

### 5.4 Keandalan & kompatibilitas

- **NFR-R1:** Aplikasi tidak crash jika localStorage kosong, rusak, atau tidak tersedia.
- **NFR-R2:** Berjalan di Chrome, Firefox, dan Edge versi terbaru (desktop) serta Chrome Android.
- **NFR-R3:** Tidak ada error di console pada alur normal.

### 5.5 Keterpeliharaan

- **NFR-M1:** Kode dipisah per modul (data, storage, validasi, UI, format) — lihat 10.1.
- **NFR-M2:** Fungsi validasi dan format murni (_pure function_) agar mudah diuji manual dari console.
- **NFR-M3:** `README.md` singkat berisi cara menjalankan dan daftar fitur.

---

## 6. Risiko

| ID   | Risiko                                                                | Dampak        | Kemungkinan | Mitigasi                                                                                         |
| ---- | --------------------------------------------------------------------- | ------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| R-01 | Lingkup membengkak (menambah keranjang, checkout, dll.) dalam 1 hari. | Tinggi        | Sedang      | Patuhi Bagian 8 (out-of-scope); fitur P1 dikerjakan terakhir; gunakan _cut-line_ di 10.3.        |
| R-02 | Data localStorage rusak/diedit manual.                                | Sedang        | Sedang      | Validasi saat baca, fallback ke data contoh (4.2).                                               |
| R-03 | localStorage tidak tersedia atau penuh.                               | Sedang        | Rendah      | `try/catch`, pesan error, mode memori.                                                           |
| R-04 | XSS lewat nama/deskripsi yang diinput di dashboard.                   | Tinggi        | Sedang      | NFR-S3, tanpa `innerHTML`; diuji di AC-28.                                                       |
| R-05 | Dashboard tanpa proteksi disalahpahami sebagai aman.                  | Sedang        | Sedang      | Label demo jelas; tidak ada login palsu; dijelaskan di README.                                   |
| R-06 | Siapa pun di perangkat yang sama dapat mengubah/menghapus data.       | Rendah (demo) | Tinggi      | Diterima untuk MVP; konfirmasi hapus; tombol reset data contoh.                                  |
| R-07 | Data hilang jika pengguna membersihkan data browser.                  | Sedang        | Sedang      | Diterima; tercantum di README. Ekspor/impor ditunda (out-of-scope).                              |
| R-08 | Nomor WhatsApp dummy sehingga pesan tidak sampai ke siapa pun.        | Rendah        | Pasti       | Konstanta mudah diganti di `src/config.js`; dicatat di README. Jangan pakai nomor pribadi nyata. |
| R-09 | Gambar rusak atau path salah (terutama setelah deploy di sub-path).   | Rendah        | Sedang      | Fallback placeholder via `onerror`; gunakan path dari `public/`.                                 |
| R-10 | Perubahan di dua tab browser saling menimpa.                          | Rendah        | Rendah      | Diterima untuk MVP; opsional dengarkan event `storage` jika sisa waktu.                          |
| R-11 | Waktu 1 hari tidak cukup untuk QA.                                    | Sedang        | Sedang      | Sisihkan iterasi terakhir khusus QA; checklist AC sudah siap.                                    |

---

## 7. Out of Scope (tidak dikerjakan di MVP)

- Backend, database, API, server, deployment produksi.
- Login, registrasi, peran/otorisasi, manajemen pengguna.
- Keranjang belanja, checkout, pembayaran, ongkos kirim, pelacakan pesanan.
- Pemesanan multi-produk dalam satu pesan WhatsApp.
- Upload gambar dari perangkat, kamera, penyimpanan gambar sebagai base64.
- Ekspor/impor data (CSV/JSON), sinkronisasi antarperangkat.
- Multi-bahasa, multi-mata-uang, mode gelap, PWA/offline cache.
- Halaman detail produk, ulasan, rating, wishlist.
- Pagination, _infinite scroll_, filter rentang harga.
- Menyimpan state filter/sort di localStorage atau URL.
- Analytics, pelacakan, iklan, integrasi pihak ketiga.
- Framework (React/Vue/dll.), TypeScript, unit test otomatis, CI/CD.
- Integrasi AI atau penggunaan API key apa pun.

---

## 8. Catatan Keputusan & Asumsi

1. Kategori dibatasi 5 nilai tetap agar filter konsisten; menambah kategori baru = perubahan konstanta (bukan fitur dashboard).
2. `harga` bertipe angka ≥ 0, tetapi form hanya menerima bilangan bulat karena Rupiah tidak memakai desimal.
3. Produk dengan `stok = 0` tetap tampil di katalog (berlabel "Habis") agar pembeli tahu produknya ada.
4. Routing memakai `location.hash` agar tidak perlu konfigurasi server.
5. Nomor WhatsApp adalah placeholder; pengelola sungguhan menggantinya di `src/config.js`.

---

## 9. Acceptance Criteria (pemeriksaan manual)

Cara umum: jalankan `npm run dev` (atau `npm run preview` setelah build), buka browser dengan DevTools. Untuk pengujian dari kondisi bersih, hapus key `ramyKeys.products.v1` di _Application → Local Storage_ lalu reload.

### A. Setup & build

| ID    | Langkah                                                                                            | Hasil yang diharapkan                                       |
| ----- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| AC-01 | Di folder proyek: `npm install`, lalu `npm run dev`, lalu `npm run build`.                         | Dev server berjalan; build selesai tanpa error.             |
| AC-02 | Periksa repositori (pencarian teks `key`, `token`, `secret`, `password`; cek ada tidaknya `.env`). | Tidak ada rahasia; tidak ada file `.env` berisi kredensial. |

### B. Katalog & data contoh

| ID    | Langkah                                                                  | Hasil yang diharapkan                                                                                                 |
| ----- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| AC-03 | Buka `#/` dengan localStorage bersih.                                    | Tampil tepat 8 kartu produk sesuai tabel 4.4.                                                                         |
| AC-04 | Periksa satu kartu.                                                      | Ada gambar, nama, kategori, harga format `Rp 1.450.000`, informasi stok, dan badge "Unggulan" bila `unggulan = true`. |
| AC-05 | Perhatikan produk "Ramy Compact 60 Prebuilt" (stok 0).                   | Berlabel "Habis"; tombol WhatsApp nonaktif.                                                                           |
| AC-06 | Ubah `imageUrl` satu produk menjadi path yang tidak ada (via dashboard). | Gambar placeholder default tampil; tidak ada ikon gambar rusak.                                                       |
| AC-07 | Buka DevTools → Network, reload katalog.                                 | Tidak ada permintaan ke domain luar; semua gambar berasal dari origin lokal.                                          |

### C. Pencarian

| ID    | Langkah                          | Hasil yang diharapkan                                                                               |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| AC-08 | Ketik `switch`.                  | Hanya produk yang nama/kategori/deskripsinya memuat "switch" yang tampil (minimal 2 produk Switch). |
| AC-09 | Ketik `SWITCH` dan `  switch  `. | Hasil identik dengan AC-08.                                                                         |
| AC-10 | Ketik `zzzxxx`.                  | Muncul pesan "tidak ada produk yang cocok"; tidak ada error.                                        |
| AC-11 | Hapus teks pencarian.            | Seluruh produk tampil kembali.                                                                      |

### D. Filter & sorting

| ID    | Langkah                                                            | Hasil yang diharapkan                                                      |
| ----- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| AC-12 | Pilih kategori `Keycaps`.                                          | Hanya produk kategori Keycaps tampil (1 produk pada data awal).            |
| AC-13 | Aktifkan "Hanya unggulan".                                         | Tampil 3 produk (#1, #3, #5).                                              |
| AC-14 | Aktifkan "Hanya tersedia".                                         | Tampil 7 produk; produk stok 0 tidak ada.                                  |
| AC-15 | Gabungkan: pencarian `set` + kategori `Switch` + "Hanya tersedia". | Hasil memenuhi **semua** kondisi sekaligus (2 produk Switch).              |
| AC-16 | Tekan "Reset filter".                                              | Pencarian, filter, dan sort kembali ke awal; 8 produk tampil.              |
| AC-17 | Sort "Harga termurah".                                             | Urutan dimulai dari Rp 175.000 (Kabel USB-C) dan naik hingga Rp 1.850.000. |
| AC-18 | Sort "Harga termahal".                                             | Urutan dimulai dari Rp 1.850.000 dan turun.                                |
| AC-19 | Sort "Nama A–Z".                                                   | Nama terurut alfabetis naik.                                               |
| AC-20 | Sort "Stok terbanyak".                                             | Produk pertama adalah Switch Linear "Cloud" (stok 40).                     |
| AC-21 | Pilih sort lalu ubah filter.                                       | Sort tetap berlaku pada hasil terfilter.                                   |

### E. Pesan WhatsApp

| ID    | Langkah                                                | Hasil yang diharapkan                                                                                                             |
| ----- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| AC-22 | Klik "Pesan via WhatsApp" pada produk dengan stok > 0. | Tab baru terbuka ke `https://wa.me/<nomor dummy>?text=…`; teks berisi nama produk dan harga berformat, ter-_encode_ dengan benar. |
| AC-23 | Inspeksi elemen tombol/tautan.                         | Memiliki `target="_blank"` dan `rel="noopener noreferrer"`.                                                                       |

### F. Dashboard demo

| ID    | Langkah                                                                                                   | Hasil yang diharapkan                                                                                |
| ----- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| AC-24 | Buka `#/dashboard` (lewat menu dan lewat mengetik URL langsung).                                          | Dashboard tampil; ada label "Dashboard Demo"; **tidak ada** form login/password.                     |
| AC-25 | Lihat ringkasan pada data awal.                                                                           | Total produk **8**, total stok **107**, stok habis **1**.                                            |
| AC-26 | Tambah produk valid (mis. "Wrist Rest Kayu", Aksesori, 250000, stok 7).                                   | Muncul di tabel dan di katalog; ringkasan menjadi 9 produk / 114 stok.                               |
| AC-27 | Coba simpan dengan: nama kosong; harga `-1`; harga kosong; stok `-1`; stok `1.5`; kategori tidak dipilih. | Setiap kasus ditolak dengan pesan error di dekat field; data tidak berubah.                          |
| AC-28 | Tambah produk bernama `<img src=x onerror=alert(1)>`.                                                     | Nama tampil sebagai teks biasa; tidak ada `alert`; tidak ada elemen `<img>` baru dari nama tersebut. |
| AC-29 | Ubah harga dan stok suatu produk, simpan.                                                                 | Tabel, katalog, dan ringkasan ikut berubah.                                                          |
| AC-30 | Klik Hapus lalu batalkan konfirmasi.                                                                      | Produk tetap ada.                                                                                    |
| AC-31 | Klik Hapus lalu setujui konfirmasi.                                                                       | Produk hilang dari tabel & katalog; ringkasan berkurang sesuai.                                      |
| AC-32 | Tombol "Reset data contoh" → setujui.                                                                     | Data kembali ke 8 produk awal (4.4).                                                                 |
| AC-33 | Set stok sebuah produk menjadi 0.                                                                         | Di katalog tampil "Habis" dan tombol WhatsApp nonaktif; "stok habis" di ringkasan bertambah.         |

### G. Penyimpanan & ketahanan

| ID    | Langkah                                                                             | Hasil yang diharapkan                                                                          |
| ----- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| AC-34 | Lakukan tambah/ubah/hapus, lalu reload dan tutup-buka tab.                          | Perubahan tetap ada.                                                                           |
| AC-35 | Di DevTools, isi key `ramyKeys.products.v1` dengan teks acak `{rusak`, lalu reload. | Aplikasi tidak crash; data contoh dimuat; muncul notifikasi data rusak.                        |
| AC-36 | Isi storage dengan 1 item valid dan 1 item tidak valid (mis. `harga: -5`).          | Hanya item valid yang tampil.                                                                  |
| AC-37 | Hapus seluruh produk lewat dashboard, lalu reload.                                  | Katalog menampilkan empty state; data tidak otomatis kembali; reset data contoh memulihkannya. |

### H. Kualitas umum

| ID    | Langkah                                                                  | Hasil yang diharapkan                                                                                                            |
| ----- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| AC-38 | Ubah lebar viewport ke 360 px (device toolbar) di katalog dan dashboard. | Tidak ada scroll horizontal pada halaman; semua kontrol dapat dijangkau. Tabel dashboard boleh scroll di dalam wadahnya sendiri. |
| AC-39 | Navigasi hanya dengan keyboard (Tab, Shift+Tab, Enter, Space).           | Semua kontrol dapat dioperasikan; indikator fokus terlihat.                                                                      |
| AC-40 | Periksa console selama menjalankan AC-03 s.d. AC-37.                     | Tidak ada error merah pada alur normal.                                                                                          |
| AC-41 | Periksa teks antarmuka.                                                  | Seluruhnya berbahasa Indonesia dan konsisten.                                                                                    |
| AC-42 | Baca `README.md`.                                                        | Berisi cara install/jalankan/build, daftar fitur, catatan nomor WhatsApp dummy, dan catatan bahwa data hanya di browser ini.     |

---

## 10. Implementation Plan per Iterasi

Prinsip: setiap iterasi menghasilkan sesuatu yang **bisa dijalankan dan diperiksa**; commit di akhir setiap iterasi (mis. `iter-1: data layer`).

### 10.1 Struktur proyek (rencana)

```
ramy-keys/
├─ index.html
├─ package.json
├─ README.md
├─ SPEC.md
├─ public/
│  └─ images/            # SVG placeholder lokal
└─ src/
   ├─ main.js            # bootstrap + router hash
   ├─ config.js          # WA_NUMBER, STORAGE_KEY, daftar kategori
   ├─ data/seed.js       # 8 produk contoh
   ├─ lib/
   │  ├─ storage.js      # load/save + fallback
   │  ├─ validate.js     # validasi Product
   │  ├─ format.js       # format Rupiah, templat pesan WA
   │  └─ query.js        # fungsi murni search/filter/sort + ringkasan
   ├─ ui/
   │  ├─ catalog.js      # halaman katalog
   │  ├─ dashboard.js    # halaman dashboard + form
   │  └─ dom.js          # helper createElement
   └─ styles.css
```

### 10.2 Iterasi

#### Iterasi 0 — Setup & fondasi (±45 menit)

- Buat proyek: `npm create vite@latest ramy-keys -- --template vanilla`, lalu `npm install`.
- Bersihkan template bawaan; siapkan `index.html`, `styles.css` dasar (variabel warna, layout, responsif).
- Buat 6 SVG placeholder di `public/images/`.
- Buat router hash dua halaman (`#/` dan `#/dashboard`) dengan navigasi di header.
- **Output:** aplikasi kosong dengan header, navigasi, dan dua halaman kerangka.
- **Verifikasi:** AC-01, AC-02 (awal), navigasi antarhalaman berfungsi.

#### Iterasi 1 — Data layer (±75 menit)

- `config.js`: `STORAGE_KEY`, `CATEGORIES`, `WA_NUMBER` (dummy).
- `seed.js`: 8 produk sesuai 4.4 (lengkap dengan deskripsi).
- `validate.js`: validasi per field, mengembalikan daftar error per field.
- `storage.js`: `loadProducts()`, `saveProducts()` sesuai aturan 4.2 (try/catch, fallback, filter item invalid).
- `format.js`: `formatRupiah()`, `buildWhatsAppUrl(product)`.
- `query.js`: `applyQuery(products, {search, category, onlyFeatured, onlyAvailable, sort})` dan `summarize(products)`.
- **Output:** modul murni yang dapat diuji dari console browser.
- **Verifikasi:** AC-35, AC-36 (lewat console/DevTools), `summarize(seed)` = 8 / 107 / 1; `formatRupiah(1450000)` = `Rp 1.450.000`.

#### Iterasi 2 — Katalog (±75 menit)

- Render grid kartu dari data tersimpan (tanpa `innerHTML`).
- Badge unggulan, label stok/Habis, gambar dengan fallback `onerror`.
- Empty state katalog kosong.
- **Output:** halaman katalog menampilkan 8 produk contoh.
- **Verifikasi:** AC-03, AC-04, AC-05, AC-06, AC-07, AC-37 (sebagian).

#### Iterasi 3 — Pencarian, filter, sorting, WhatsApp (±75 menit)

- Toolbar: input cari, dropdown kategori, dua toggle, dropdown sort, tombol reset.
- Hubungkan ke `applyQuery`; render ulang hasil; empty state hasil kosong.
- Tombol WhatsApp pada kartu (nonaktif saat stok 0).
- **Output:** katalog interaktif penuh.
- **Verifikasi:** AC-08 s.d. AC-23.

#### Iterasi 4 — Dashboard CRUD & ringkasan (±120 menit)

- Kartu ringkasan (total produk, total stok, stok habis) dengan label demo.
- Tabel produk dengan tombol Ubah/Hapus.
- Form tambah/ubah (mode ganda), validasi per field, pesan error inline, tombol batal.
- Hapus dengan konfirmasi; reset data contoh dengan konfirmasi.
- Setiap aksi menyimpan ke localStorage dan memperbarui tampilan.
- **Output:** dashboard demo berfungsi penuh.
- **Verifikasi:** AC-24 s.d. AC-34, AC-37.

#### Iterasi 5 — Hardening, aksesibilitas, QA, dokumentasi (±75 menit)

- Notifikasi data rusak/gagal simpan; pastikan tidak ada `innerHTML` untuk data pengguna.
- Rapikan responsivitas 360 px, label form, fokus keyboard, kontras.
- Jalankan seluruh checklist Bagian 9; perbaiki temuan; catat hasil (lulus/gagal) di tabel QA pada README.
- Tulis `README.md` (jalankan, build, fitur, catatan nomor dummy, batasan data browser).
- `npm run build` dan cek dengan `npm run preview`.
- **Output:** MVP siap didemokan.
- **Verifikasi:** AC-01 s.d. AC-42 semuanya lulus.

### 10.3 Estimasi & cut-line

| Iterasi   | Estimasi                                                   |
| --------- | ---------------------------------------------------------- |
| 0         | 45 menit                                                   |
| 1         | 75 menit                                                   |
| 2         | 75 menit                                                   |
| 3         | 75 menit                                                   |
| 4         | 120 menit                                                  |
| 5         | 75 menit                                                   |
| **Total** | **±7,75 jam** (sisa buffer sekitar 15–30 menit dari 8 jam) |

Jika waktu mepet, korbankan berurutan dari yang paling akhir:

1. F-13 Reset data contoh (AC-32) dan sort "Stok terbanyak" (AC-20).
2. Statistik "stok habis" tambahan.
3. Polesan visual non-esensial.

**Tidak boleh dikorbankan:** validasi data, penyimpanan localStorage, proteksi XSS, label dashboard demo, dan tidak adanya rahasia di repositori.

### 10.4 Definition of Done (MVP)

- [ ] Semua AC di Bagian 9 lulus dan tercatat.
- [ ] `npm run build` sukses; `npm run preview` berjalan.
- [ ] Tidak ada rahasia/API key/file `.env` berisi kredensial; tidak ada permintaan jaringan pihak ketiga.
- [ ] Console bersih pada alur normal.
- [ ] README diperbarui dan sesuai dengan perilaku aplikasi.
