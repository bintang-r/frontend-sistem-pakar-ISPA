'use client';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Activity, BarChart3, Database, FileSearch, Stethoscope } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const dummyAgeData = [
  { name: 'Balita (0-5)', cases: 420 },
  { name: 'Anak (6-12)', cases: 310 },
  { name: 'Remaja (13-18)', cases: 150 },
  { name: 'Dewasa (19-50)', cases: 280 },
  { name: 'Lansia (>50)', cases: 390 },
];

const accuracyData = [
  { month: 'Jan', accuracy: 85 },
  { month: 'Feb', accuracy: 87 },
  { month: 'Mar', accuracy: 89 },
  { month: 'Apr', accuracy: 92 },
  { month: 'May', accuracy: 95 },
  { month: 'Jun', accuracy: 96 },
];

export default function Home() {
  return (
    <div className="w-full flex flex-col pt-16 -mx-4 md:-mx-8"> {/* Negative margins to break out of layout max-w */}
      
      {/* 1. HERO SECTION */}
      <section id="home" className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 mt-20 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-8 border border-emerald-200 shadow-sm mx-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Sistem Pakar ISPA AI Terpercaya
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Deteksi Dini & Cepat <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Infeksi Saluran Pernapasan</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Analisis gejala Anda menggunakan sistem cerdas berbasis <span className="font-semibold text-slate-800">Forward Chaining</span> dan <span className="font-semibold text-slate-800">Certainty Factor</span> untuk mendapatkan hasil diagnosis dalam hitungan detik.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200/50 hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center">
              Mulai Konsultasi <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="bg-white text-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all border border-slate-200 hover:-translate-y-1 w-full sm:w-auto justify-center shadow-sm">
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-200 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Keunggulan Sistem</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Mengapa Memilih ISPADiag?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">Akurasi Tinggi</h4>
              <p className="text-slate-600 leading-relaxed">Sistem ini dibangun berdasarkan basis pengetahuan medis dari para pakar menggunakan perhitungan Certainty Factor yang akurat.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">Hasil Instan</h4>
              <p className="text-slate-600 leading-relaxed">Tidak perlu menunggu lama. Dapatkan hasil diagnosis, persentase keyakinan, dan rekomendasi pengobatan secara langsung.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-lime-100 text-lime-600 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">Rekam Jejak</h4>
              <p className="text-slate-600 leading-relaxed">Semua riwayat konsultasi pasien disimpan dengan aman untuk memantau perkembangan dan perbandingan di masa mendatang.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATISTICS SECTION */}
      <section id="statistics" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Statistik ISPA</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Data dan Akurasi Sistem</h3>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Melihat gambaran distribusi kerentanan ISPA berdasarkan kelompok usia dan pemantauan peningkatan akurasi dari sistem kami secara berkala.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Chart 1: Bar Chart */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-emerald-600 w-6 h-6" />
                <h4 className="text-xl font-bold text-slate-800">Kerentanan Kasus per Usia</h4>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dummyAgeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="cases" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Area Chart */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-teal-600 w-6 h-6" />
                <h4 className="text-xl font-bold text-slate-800">Peningkatan Akurasi Diagnosis (%)</h4>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="accuracy" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-emerald-900 text-white px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Panduan Pengguna</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-16">Cara Kerja ISPADiag</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-emerald-700/50 -z-0"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-800 border-4 border-emerald-600 flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">1</div>
              <h4 className="text-xl font-bold mb-3">Buat Akun</h4>
              <p className="text-emerald-100/80">Registrasi akun secara gratis untuk dapat mengakses fitur konsultasi medis penuh.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-800 border-4 border-emerald-600 flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
                <FileSearch className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold mb-3">Pilih Gejala</h4>
              <p className="text-emerald-100/80">Pilih gejala yang Anda alami beserta tingkat keparahannya pada form konsultasi.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-800 border-4 border-emerald-600 flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
                <Stethoscope className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold mb-3">Dapatkan Diagnosis</h4>
              <p className="text-emerald-100/80">Sistem akan segera memberikan hasil diagnosis penyakit ISPA beserta saran penanganannya.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-2xl">
              <Stethoscope className="w-8 h-8 text-emerald-500" />
              <span>ISPA<span className="text-slate-500">Diag</span></span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#home" className="hover:text-white transition">Home</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#statistics" className="hover:text-white transition">Statistics</a>
            <a href="#how-it-works" className="hover:text-white transition">Guide</a>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} ISPADiag Expert System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
