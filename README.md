# Ramy Keys

Ramy Keys adalah demo katalog statis untuk produk mechanical keyboard dan aksesori. Produk contoh dan datanya bersifat fiktif. Proyek ini dibuat dengan JavaScript vanilla dan Vite, tanpa backend.

## Fitur

- Katalog 8 produk contoh, harga Rupiah, informasi stok, dan gambar lokal dengan fallback placeholder SVG.
- Halaman detail produk di `#/produk/{id}` yang menampilkan gambar, kategori, deskripsi, harga, stok, fakta produk yang tersedia, produk sejenis, dan tautan pemesanan WhatsApp. ID yang tidak ditemukan menampilkan keadaan produk tidak tersedia.
- Spesifikasi terstruktur pada detail produk dan tabel spesifikasi berdampingan di halaman perbandingan. Data contoh hanya memuat informasi yang dicantumkan pada deskripsi produk.
- Halaman Panduan (`#/panduan`), FAQ (`#/faq`), dan Tentang (`#/tentang`) yang menjelaskan cara menjelajah katalog serta batasan data demo.
- Katalog dengan pencarian case-insensitive, filter kategori, ketersediaan stok, rentang harga, produk unggulan, dan pengurutan harga atau nama. Filter dapat digunakan bersama, ditampilkan sebagai chip aktif, dan dapat dihapus satu per satu.
- Wishlist (`#/wishlist`) dan perbandingan (`#/perbandingan`, maksimal 3 produk) dengan data ID produk yang disimpan di `localStorage` browser.
- Ekspor dan impor Wishlist JSON; impor memvalidasi format, menggabungkan ID unik, dan mengabaikan produk yang tidak tersedia di katalog.
- Perakit setup (`#/setup`) untuk memilih keyboard, switch, keycaps, dan aksesori serta melihat estimasi total katalog.
- Tombol pemesanan yang membuka WhatsApp dengan pesan produk terisi. Nomor default adalah nomor dummy; konfigurasi `WA_NUMBER` berada di `src/products.js`.
- Dashboard demo di `#/dashboard` untuk melihat ringkasan stok dan kategori serta menambah, mengubah, dan menghapus produk. Daftar mendukung pencarian, pratinjau gambar, dan penanda stok rendah. Form memvalidasi nama, kategori, harga, stok, deskripsi, spesifikasi, dan path gambar.
- Penyimpanan data pada `localStorage` dengan key `ramykeys:products:v1`, sehingga perubahan dashboard langsung digunakan katalog pada browser yang sama.
- Ekspor dan impor JSON tervalidasi, reset ke produk contoh, dan pemulihan data contoh dengan pemberitahuan jika data tersimpan rusak.
- Ikon Font Awesome Free dan tata letak responsif.

## Stack

- JavaScript vanilla, HTML, dan CSS
- [Vite](https://vite.dev/) untuk server pengembangan dan build
- [Font Awesome Free](https://fontawesome.com/)
- [Vitest](https://vitest.dev/) untuk unit test

## Instalasi dan menjalankan

Pastikan Node.js dan npm tersedia, lalu dari direktori proyek jalankan:

```sh
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal. Aplikasi dimulai di katalog; navigasi header dan footer menyediakan halaman Panduan, FAQ, Tentang, Perakit setup, Wishlist, Perbandingan, dan Dashboard. Detail produk dibuka melalui tautan “Lihat detail” pada kartu produk.

## Test dan build

Jalankan unit test:

```sh
npm test
```

Buat build produksi:

```sh
npm run build
```

Untuk memeriksa build secara lokal:

```sh
npm run preview
```

Jalankan `npm run build` terlebih dahulu sebelum `npm run preview`.

## Deployment

Build menghasilkan situs statis di direktori `dist/`. Deploy isi direktori tersebut ke layanan hosting statis yang dapat menyajikan `index.html` dan asetnya. Konfigurasi Vite menggunakan base relatif agar build dapat ditempatkan di root maupun subpath. Setelah deployment, uji katalog, `#/dashboard`, gambar lokal, serta penyimpanan di browser pada alamat situs tersebut.

Tidak ada server aplikasi yang perlu dijalankan untuk deployment ini. Karena data produk, wishlist, dan perbandingan disimpan di browser, data tidak otomatis tersedia di browser, perangkat, atau origin lain. Pilihan pada Perakit setup hanya tersimpan selama aplikasi aktif dan tidak disimpan permanen.

## Keterbatasan

- Data produk berada hanya di `localStorage` pada browser/profil dan origin setempat. Data tidak disinkronkan antarperangkat atau pengguna, dan dapat hilang jika penyimpanan browser dihapus. Ekspor JSON dapat digunakan sebagai salinan manual.
- Wishlist juga disimpan lokal; file ekspornya berisi ID produk, bukan salinan produk. Impor hanya memulihkan ID yang cocok dengan katalog saat ini.
- Perakit setup tidak memeriksa kompatibilitas komponen dan jumlahnya hanya estimasi dari harga katalog demo.
- Tidak ada backend atau database, autentikasi, sesi, maupun kontrol akses server. Dashboard demo dapat dibuka tanpa login; validasi di aplikasi ini bukan batas keamanan untuk data server.
- Tautan WhatsApp hanya menyiapkan pesan pemesanan. Tidak ada pemrosesan pesanan di backend atau payment gateway.
- Produk, stok, dan nomor WhatsApp bawaan ditujukan untuk demo; perbarui konfigurasi dan data sebelum penggunaan nyata.
