# 🫁 Sistem Pakar Diagnosis ISPA — Frontend

> **Next.js 16 (App Router)** · **TypeScript** · **Tailwind CSS** · **Axios**

Antarmuka web modern untuk sistem pakar diagnosis awal Infeksi Saluran Pernapasan Akut (ISPA). Tersedia dua mode tampilan: **User** (untuk pasien melakukan konsultasi) dan **Admin** (untuk manajemen sistem pakar dan monitoring).

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Struktur Halaman](#struktur-halaman)
- [Tampilan Aplikasi](#tampilan-aplikasi)
- [Instalasi & Setup](#instalasi--setup)
- [Environment Variables](#environment-variables)
- [Menjalankan Dev Server](#menjalankan-dev-server)
- [Struktur Direktori](#struktur-direktori)
- [Fitur Utama](#fitur-utama)
- [Alur Penggunaan](#alur-penggunaan)

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (dark-mode premium design) |
| HTTP Client | Axios |
| State Management | React useState / useEffect |
| Chart | Recharts |
| Icons | Lucide React |
| Font | Google Fonts (Inter / Outfit) |

---

## Struktur Halaman

| Route | Halaman | Akses |
|-------|---------|-------|
| `/` | Landing Page (Hero, Fitur, Statistik, Testimonial) | Public |
| `/login` | Halaman Login | Public |
| `/register` | Halaman Registrasi | Public |
| `/dashboard` | Dashboard pasien (riwayat konsultasi) | User |
| `/consultation` | Form konsultasi — pilih gejala + intensitas | User |
| `/result` | Hasil diagnosis + trace perhitungan | User |
| `/admin` | Dashboard admin (statistik global) | Admin |
| `/admin/users` | Daftar pengguna + detail konsultasi + modal perhitungan CF | Admin |
| `/admin/symptoms` | CRUD katalog gejala | Admin |
| `/admin/diseases` | CRUD katalog penyakit | Admin |
| `/admin/dataset` | Manajemen dataset rekam medis | Admin |
| `/admin/matrix` | Heatmap matriks Certainty Factor | Admin |

---

## Tampilan Aplikasi

### 1. Landing Page (Dashboard Publik)

![Dashboard](image1.png)

> Tampilan utama aplikasi yang berisi hero section, statistik sistem (total pasien, konsultasi, rata-rata confidence), distribusi penyakit, fitur unggulan, dan testimonial pengguna.

---

### 2. Halaman Login

![Login](image2.png)

> Form login dengan validasi, desain glassmorphism, dan animasi micro-interaction. Mendukung JWT authentication.

---

### 3. Form Konsultasi

![Konsultasi](image3.png)

> Pasien memilih gejala yang dialami dari 16 gejala ISPA yang tersedia. Setiap gejala memiliki 5 tingkat intensitas:
> - `0.2` — Sangat Ringan
> - `0.4` — Ringan
> - `0.6` — Sedang
> - `0.8` — Berat
> - `1.0` — Sangat Berat
>
> Input usia pasien juga disertakan.

---

### 4. Hasil Diagnosis

![Hasil](image4.png)

> Menampilkan:
> - Penyakit terdiagnosis beserta confidence score (%)
> - Daftar gejala yang cocok
> - Rekomendasi penanganan & solusi pengobatan
> - Langkah pemulihan
> - Tombol "Lihat Perhitungan" untuk melihat trace CF step-by-step

---

### 5. Dashboard Admin — Statistik Global

![Admin Dashboard](image5.png)

> Halaman administrasi yang menampilkan:
> - Total pasien & konsultasi
> - Rata-rata confidence diagnosis
> - Grafik distribusi penyakit (Bar Chart)
> - Tren konsultasi & akurasi per bulan (Line Chart)
> - Gejala paling sering dilaporkan
> - Scatter plot konsultasi (usia vs confidence)

---

### 6. Admin — Daftar Pengguna & Riwayat Konsultasi

![Admin Users](image6.png)

> Menampilkan seluruh pengguna terdaftar beserta:
> - Riwayat konsultasi lengkap
> - Scatter plot per pengguna
> - Dataset rows yang paling cocok
> - **Modal Perhitungan CF** — trace langkah demi langkah setiap rumus MYCIN

---

### 7. Modal Detail Perhitungan CF

![Modal CF](image7.png)

> Modal interaktif yang menampilkan **jejak kalkulasi** untuk setiap penyakit kandidat:
> - Nama gejala yang dievaluasi
> - Rumus CF current: `CF = user_cf × expert_cf`
> - Rumus kombinasi CF MYCIN: `CF_combined = CF1 + CF2 × (1 - CF1)`
> - Nilai CF akhir dan persentase confidence

---

### 8. Admin — Matriks Certainty Factor

![Matriks CF](image8.png)

> Heatmap interaktif yang menampilkan nilai `expert_cf` untuk setiap kombinasi penyakit × gejala. Semakin gelap warnanya, semakin tinggi nilai CF-nya.

---

### 9. Admin — Dataset Rekam Medis

![Dataset](image9.png)

> Tabel paginasi berisi semua baris dataset yang digunakan untuk training sistem. Admin dapat:
> - Melihat data per halaman (konfigurasi page size)
> - Menambah baris data baru
> - Menghapus baris data
> - Trigger ulang training setelah perubahan

---

## Instalasi & Setup

```bash
# 1. Clone repo
git clone <repository-url>
cd analisis-penyakit-ispa-frontend

# 2. Install dependencies
npm install
# atau:
yarn install

# 3. Buat file .env.local
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL sesuai URL backend Anda

# 4. Jalankan dev server
npm run dev
```

---

## Environment Variables

Buat file `.env.local` di root direktori frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> Pastikan backend Django sudah berjalan di URL tersebut sebelum menjalankan frontend.

---

## Menjalankan Dev Server

```bash
npm run dev
# Aplikasi berjalan di http://localhost:3000
```

Build production:

```bash
npm run build
npm run start
```

---

## Struktur Direktori

```
src/
├── app/
│   ├── page.tsx                  # Landing page (Hero, Stats, Testimonial)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── login/
│   │   └── page.tsx              # Halaman login
│   ├── register/
│   │   └── page.tsx              # Halaman registrasi
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard user (riwayat konsultasi)
│   ├── consultation/
│   │   └── page.tsx              # Form konsultasi pilih gejala
│   ├── result/
│   │   └── page.tsx              # Hasil diagnosis
│   └── admin/
│       ├── layout.tsx            # Admin layout + sidebar navigation
│       ├── page.tsx              # Admin dashboard (statistik global)
│       ├── users/
│       │   └── page.tsx          # Daftar users + modal perhitungan CF
│       ├── symptoms/
│       │   └── page.tsx          # CRUD gejala
│       ├── diseases/
│       │   └── page.tsx          # CRUD penyakit
│       ├── dataset/
│       │   └── page.tsx          # Dataset rekam medis
│       └── matrix/
│           └── page.tsx          # Heatmap matriks CF
```

---

## Fitur Utama

### Untuk Pasien (User)

| Fitur | Deskripsi |
|-------|-----------|
| 🩺 **Konsultasi Online** | Pilih gejala dari katalog 16 gejala ISPA dengan 5 level intensitas |
| 📊 **Hasil Diagnosis** | Tampil penyakit + confidence score + rekomendasi pengobatan |
| 🔬 **Trace Perhitungan** | Lihat langkah-langkah rumus CF yang menghasilkan diagnosis |
| 📋 **Riwayat Konsultasi** | Semua konsultasi sebelumnya tersimpan dan bisa diakses kembali |
| 💬 **Chat dengan Dokter** | Tanya jawab langsung dengan admin/dokter melalui fitur chat |
| ⭐ **Testimonial** | Berikan ulasan pengalaman menggunakan sistem |

### Untuk Admin

| Fitur | Deskripsi |
|-------|-----------|
| 📈 **Dashboard Statistik** | Grafik distribusi penyakit, tren konsultasi, scatter plot |
| 👥 **Manajemen Pengguna** | Lihat semua user + riwayat konsultasi + detail perhitungan CF |
| 🔬 **Modal CF Detail** | Trace step-by-step rumus MYCIN per konsultasi |
| 🗂️ **Dataset Management** | Upload, lihat, hapus baris rekam medis |
| ⚡ **Training Ulang** | Trigger ulang Knowledge Acquisition dari dataset terbaru |
| 🌡️ **Matriks CF** | Heatmap visualisasi expert_cf (penyakit × gejala) |
| 🦠 **CRUD Penyakit** | Kelola katalog penyakit beserta deskripsi & solusi pengobatan |
| 💊 **CRUD Gejala** | Kelola katalog gejala ISPA |

---

## Alur Penggunaan

### Pasien (User)

```
Register/Login
     ↓
Pilih Gejala (Form Konsultasi)
  - Centang gejala yang dialami
  - Pilih intensitas (Ringan / Sedang / Berat / ...)
  - Isi usia
     ↓
Sistem Proses (Backend)
  - Forward Chaining filter penyakit
  - Certainty Factor MYCIN hitung confidence
     ↓
Hasil Diagnosis
  - Penyakit + Confidence %
  - Gejala yang cocok
  - Rekomendasi & Solusi
  - [Lihat Perhitungan] → detail trace CF
```

### Admin

```
Login sebagai Admin
     ↓
Dashboard → lihat statistik global
     ↓
Users → pilih user → lihat riwayat
     ↓
Klik konsultasi → Lihat Perhitungan
     → Modal trace CF step-by-step
     ↓
Dataset → tambah/hapus data
     ↓
Training Ulang → Rules & CF terupdate
```

---

## License

MIT License — lihat file `LICENSE`.
