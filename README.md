# Ramy Keys

Ramy Keys adalah demo katalog statis untuk produk mechanical keyboard dan aksesori. Produk contoh dan datanya bersifat fiktif. Proyek ini dibuat dengan JavaScript vanilla dan Vite, tanpa backend.

## Fitur

- Katalog 8 produk contoh, harga Rupiah, informasi stok, dan gambar lokal dengan fallback placeholder SVG.
- Pencarian tanpa membedakan huruf besar/kecil pada nama, kategori, dan deskripsi; filter kategori; serta pengurutan harga atau nama. Filter dapat digunakan bersama.
- Tombol pemesanan yang membuka WhatsApp dengan pesan produk terisi. Nomor default adalah nomor dummy; konfigurasi `WA_NUMBER` berada di `src/products.js`.
- Dashboard demo di `#/dashboard` untuk melihat ringkasan stok dan kategori serta menambah, mengubah, dan menghapus produk. Form memvalidasi nama, kategori, harga, stok, deskripsi, dan path gambar.
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

Buka alamat lokal yang ditampilkan Vite di terminal. Aplikasi dimulai di katalog; dashboard dapat dibuka melalui tautan Dashboard atau dengan menambahkan `#/dashboard` pada alamat aplikasi.

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

Tidak ada server aplikasi yang perlu dijalankan untuk deployment ini. Karena data disimpan di browser, perubahan yang tersimpan di alamat deployment tidak otomatis tersedia di alamat lain.

## Keterbatasan

- Data produk berada hanya di `localStorage` pada browser/profil dan origin setempat. Data tidak disinkronkan antarperangkat atau pengguna, dan dapat hilang jika penyimpanan browser dihapus. Ekspor JSON dapat digunakan sebagai salinan manual.
- Tidak ada backend atau database, autentikasi, sesi, maupun kontrol akses server. Dashboard demo dapat dibuka tanpa login; validasi di aplikasi ini bukan batas keamanan untuk data server.
- Tautan WhatsApp hanya menyiapkan pesan pemesanan. Tidak ada pemrosesan pesanan di backend atau payment gateway.
- Produk, stok, dan nomor WhatsApp bawaan ditujukan untuk demo; perbarui konfigurasi dan data sebelum penggunaan nyata.
