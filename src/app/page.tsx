'use client';
import Link from 'next/link';
import { ArrowRight, Search, Zap, Activity, BarChart3, ShieldCheck, Database, FileText, ChevronRight, Stethoscope, Phone, Video } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState('Gejala Umum');

  const tabsData: Record<string, any> = {
    'Gejala Umum': {
      title: 'Gejala Umum ISPA',
      desc: 'ISPA (Infeksi Saluran Pernapasan Akut) biasanya ditandai dengan batuk kering atau berdahak, pilek, hidung tersumbat, sakit tenggorokan, dan demam. Pada kasus yang parah, bisa terjadi sesak napas. Pengenalan gejala sejak dini sangat penting.',
      img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80'
    },
    'Pencegahan': {
      title: 'Langkah Pencegahan',
      desc: 'Pencegahan terbaik adalah menjaga kebersihan diri. Rutin mencuci tangan dengan sabun, menggunakan masker di tempat umum, menghindari kontak dekat dengan penderita, serta menjaga imunitas dengan makanan bergizi dan istirahat yang cukup.',
      img: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=600&q=80'
    },
    'Pengobatan': {
      title: 'Penanganan Pertama',
      desc: 'Sebagian besar kasus ISPA ringan yang disebabkan oleh virus dapat sembuh sendiri dengan istirahat yang cukup, banyak minum air putih, dan obat pereda demam/batuk yang dijual bebas. Konsultasikan ke dokter jika gejala memberat atau disertai sesak napas.',
      img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80'
    },
    'Komplikasi': {
      title: 'Waspada Komplikasi',
      desc: 'Jika dibiarkan, ISPA dapat memicu komplikasi serius seperti pneumonia (paru-paru basah), bronkitis akut, hingga kegagalan pernapasan. Deteksi dini melalui sistem pakar ini membantu Anda mengambil langkah medis dengan tepat waktu.',
      img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80'
    },
  };

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* 1. HERO SECTION (Split Layout) */}
      <section id="home" className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20 pb-32 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text */}
          <div className="lg:w-1/2 z-10 text-center lg:text-left mt-8 lg:mt-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.15] mb-6">
              Deteksi Dini ISPA,<br/>
              <span className="text-teal-500">Cepat & Akurat</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Analisis gejala Anda menggunakan sistem pakar cerdas berbasis *Forward Chaining* dan *Certainty Factor* untuk hasil yang dipercaya ahli medis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
              <Link href="/register" className="bg-teal-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-600 transition shadow-lg shadow-teal-200/50 hover:-translate-y-1">
                Mulai Konsultasi
              </Link>
              <Link href="/login" className="bg-white text-slate-700 px-8 py-4 rounded-full font-bold text-lg border border-slate-200 hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2 hover:-translate-y-1">
                <Search className="w-5 h-5"/> Masuk Akun
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start bg-white/50 backdrop-blur-sm w-fit p-3 pr-6 rounded-full border border-teal-100 mx-auto lg:mx-0">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover'}}></div>)}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs shadow-sm">+</div>
              </div>
              <p className="text-sm font-semibold text-slate-700">95K+ Pasien<br/><span className="text-slate-500 font-normal">Telah terbantu</span></p>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 relative mt-16 lg:mt-0">
            {/* Decorative background shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[450px] h-[450px] md:h-[550px] bg-teal-400 rounded-t-full mix-blend-multiply filter blur-[80px] opacity-20"></div>
            
            <div className="relative z-10 w-full max-w-sm md:max-w-md mx-auto">
                {/* Doctor Image */}
                <div className="rounded-b-full rounded-t-full overflow-hidden shadow-2xl border-8 border-white bg-teal-100 aspect-[3/4] relative">
                    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80" alt="Doctor" className="w-full h-full object-cover object-top" />
                </div>
                
                {/* Floating Card 1 - Left */}
                <div className="absolute top-16 -left-6 md:-left-16 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Akurasi Sistem</p>
                        <p className="text-lg font-extrabold text-slate-900">95%+</p>
                    </div>
                </div>

                {/* Floating Card 2 - Right */}
                <div className="absolute bottom-24 -right-4 md:-right-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex flex-col items-center animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-2">
                        <Video className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Konsultasi AI</p>
                    <p className="text-xs text-slate-500">24/7 Tersedia</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="bg-teal-500 pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Kemudahan Cek Gejala</h2>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">Dirancang untuk memberikan diagnosis awal dengan pendekatan certainty factor berbasis keahlian dokter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center text-center transform hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Akurasi Tinggi</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Sistem pakar menggunakan pengetahuan yang diekstrak langsung dari para dokter spesialis.</p>
            </div>
            
            <div className="bg-teal-600/30 p-8 rounded-[2rem] border border-teal-400/30 flex flex-col items-center text-center hover:bg-teal-600/50 transition duration-300">
              <div className="w-16 h-16 bg-white text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hasil Instan</h3>
              <p className="text-teal-100 text-sm leading-relaxed">Diagnosis realtime dalam hitungan detik setelah Anda melengkapi form gejala konsultasi.</p>
            </div>
            
            <div className="bg-teal-600/30 p-8 rounded-[2rem] border border-teal-400/30 flex flex-col items-center text-center hover:bg-teal-600/50 transition duration-300">
              <div className="w-16 h-16 bg-white text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <Database className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Rekam Jejak</h3>
              <p className="text-teal-100 text-sm leading-relaxed">Simpan semua riwayat konsultasi Anda dengan aman sebagai referensi di kemudian hari.</p>
            </div>

            <div className="bg-teal-600/30 p-8 rounded-[2rem] border border-teal-400/30 flex flex-col items-center text-center hover:bg-teal-600/50 transition duration-300">
              <div className="w-16 h-16 bg-white text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Spesialis Medis</h3>
              <p className="text-teal-100 text-sm leading-relaxed">Formula perhitungan sistem divalidasi langsung oleh ahli saluran pernapasan profesional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABBED INFO SECTION */}
      <section id="informasi" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold text-teal-600 mb-2">Informasi <span className="text-slate-800">dan Pengetahuan</span></h3>
            <p className="text-slate-500">Pahami lebih jauh tentang Infeksi Saluran Pernapasan Akut</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3 w-full flex flex-col gap-2 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-100 rounded-full"></div>
              {Object.keys(tabsData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`text-left px-8 py-5 font-bold text-lg transition-all relative ${
                    activeTab === key 
                      ? 'bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-r-2xl shadow-lg shadow-teal-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {activeTab === key && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-full"></div>}
                  {key}
                </button>
              ))}
            </div>

            <div className="lg:w-2/3 w-full">
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center min-h-[350px]">
                <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-full min-h-[250px] rounded-3xl overflow-hidden relative shadow-md border-4 border-slate-50">
                  <img src={tabsData[activeTab].img} alt={activeTab} className="w-full h-full object-cover absolute inset-0" />
                </div>
                <div className="w-full md:w-1/2">
                  <h4 className="text-2xl font-extrabold text-slate-900 mb-4">{tabsData[activeTab].title}</h4>
                  <p className="text-slate-600 leading-relaxed mb-8">{tabsData[activeTab].desc}</p>
                  <Link href="/consultation" className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-600 transition shadow-lg shadow-teal-200">
                    Pelajari Lebih Lanjut
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section id="statistics" className="py-24 bg-slate-50 px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Statistik <span className="text-teal-600">Sistem</span></h3>
            <p className="text-slate-500">Distribusi kerentanan dan akurasi diagnosis kami</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-teal-600 w-6 h-6" />
                <h4 className="text-xl font-bold text-slate-800">Kasus ISPA per Kelompok Usia</h4>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dummyAgeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="cases" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-emerald-600 w-6 h-6" />
                <h4 className="text-xl font-bold text-slate-800">Evaluasi Akurasi Diagnosis (%)</h4>
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
                    <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="accuracy" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TIM DOKTER SPESIALIS */}
      <section id="dokter" className="py-24 bg-white px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Tim <span className="text-teal-600">Pakar Medis</span></h3>
            <p className="text-slate-500 max-w-2xl mx-auto">Sistem pakar kami dikembangkan dan divalidasi bersama para ahli penyakit dalam dan saluran pernapasan terkemuka.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 text-center hover:shadow-lg transition">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-md">
                  <img src={`https://images.unsplash.com/photo-${i === 1 ? '1559839734-2b71ea197ec2' : i === 2 ? '1594824436999-05e810ebc252' : '1622253692010-33bfdf050d40'}?auto=format&fit=crop&w=400&q=80`} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">Dr. {i === 1 ? 'Budi Santoso' : i === 2 ? 'Siti Aminah' : 'Andi Wijaya'}, Sp.P</h4>
                <p className="text-teal-600 font-medium text-sm mb-4">Spesialis Paru & Pernapasan</p>
                <p className="text-slate-500 text-sm">Berpengalaman lebih dari 15 tahun dalam menangani berbagai kasus infeksi saluran pernapasan akut dan kronis.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONI PASIEN */}
      <section id="testimoni" className="py-24 bg-teal-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Apa Kata <span className="text-teal-600">Pasien Kami</span></h3>
            <p className="text-slate-500">Ribuan orang telah terbantu dengan deteksi dini ISPA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Sangat membantu! Saya bisa langsung tahu penanganan awal untuk anak saya yang sedang batuk pilek hebat tanpa harus panik ke UGD tengah malam.', 'Sistemnya sangat akurat. Hasil diagnosisnya sama persis dengan yang dikatakan dokter saat saya periksa keesokan harinya.', 'Mudah digunakan dan sangat informatif. Saya jadi lebih waspada terhadap komplikasi ISPA. Terima kasih ISPADiag!'].map((text, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
                <div className="flex text-amber-400 mb-4">
                  {[1,2,3,4,5].map(star => <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/></svg>)}
                </div>
                <p className="text-slate-600 italic mb-6 flex-1">"{text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+25})`, backgroundSize: 'cover'}}></div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{i === 0 ? 'Rina M.' : i === 1 ? 'Ahmad F.' : 'Diana K.'}</h5>
                    <p className="text-xs text-slate-500">Pasien</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-24 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Pertanyaan <span className="text-teal-600">Umum</span></h3>
            <p className="text-slate-500">Jawaban untuk pertanyaan yang paling sering diajukan.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Apakah hasil diagnosis ini 100% akurat?', a: 'Sistem ini menggunakan perhitungan probabilitas (Certainty Factor) dari basis pengetahuan pakar. Meskipun tingkat akurasinya tinggi (di atas 90%), sistem ini dirancang untuk deteksi awal dan TIDAK menggantikan diagnosis resmi dari dokter.' },
              { q: 'Apakah data medis saya aman?', a: 'Tentu. Semua data riwayat konsultasi dan identitas Anda dienkripsi dan disimpan dengan aman. Kami tidak pernah membagikan data medis Anda kepada pihak ketiga.' },
              { q: 'Bagaimana cara mulai berkonsultasi?', a: 'Sangat mudah! Anda hanya perlu membuat akun gratis, login, lalu masuk ke menu Konsultasi. Centang gejala yang Anda rasakan beserta tingkat keparahannya, dan hasil akan langsung keluar.' }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm mt-0.5">Q</div>
                  {faq.q}
                </h4>
                <p className="text-slate-600 pl-10 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-12 bg-white px-4 md:px-8 mb-10">
        <div className="max-w-7xl mx-auto bg-teal-500 rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-teal-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="md:w-1/2 relative z-10 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    Konsultasi Diagnosis ISPA Secara Online
                </h2>
                <p className="text-teal-100 text-lg mb-8 max-w-lg">
                    Tidak perlu ke rumah sakit untuk pemeriksaan awal. Sistem pakar cerdas kami siap membantu Anda 24/7.
                </p>
                <Link href="/register" className="inline-block bg-white text-teal-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition shadow-lg hover:-translate-y-1">
                    Mulai Sekarang
                </Link>
            </div>
            
            <div className="md:w-1/2 relative z-10 flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm">
                    <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" alt="Medical Team" className="w-full rounded-[2rem] shadow-xl border-4 border-teal-400" />
                    <div className="absolute -top-6 -left-6 text-white opacity-50 font-bold text-5xl animate-pulse">+</div>
                    <div className="absolute -bottom-4 right-10 text-teal-200 opacity-60 font-bold text-4xl animate-bounce">+</div>
                </div>
            </div>
        </div>
      </section>

      {/* 9. EXPANDED FOOTER */}
      <footer className="bg-slate-900 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-white font-bold text-2xl mb-6">
                  <Stethoscope className="w-8 h-8 text-teal-500" />
                  <span>ISPA<span className="text-slate-500">Diag</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sistem Pakar Diagnosis Awal Infeksi Saluran Pernapasan Akut menggunakan metode Forward Chaining dan Certainty Factor. Membantu masyarakat mendeteksi ISPA lebih dini.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Tautan Cepat</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#home" className="hover:text-teal-400 transition">Beranda</a></li>
                <li><a href="#features" className="hover:text-teal-400 transition">Fasilitas & Fitur</a></li>
                <li><a href="#informasi" className="hover:text-teal-400 transition">Pusat Informasi</a></li>
                <li><a href="#statistics" className="hover:text-teal-400 transition">Statistik Data</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Layanan Bantuan</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#faq" className="hover:text-teal-400 transition">Tanya Jawab (FAQ)</a></li>
                <li><a href="#dokter" className="hover:text-teal-400 transition">Tim Spesialis</a></li>
                <li><Link href="/login" className="hover:text-teal-400 transition">Masuk Akun</Link></li>
                <li><Link href="/register" className="hover:text-teal-400 transition">Daftar Akun Baru</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Kontak Kami</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-teal-500" /> +62 812 3456 7890</li>
                <li className="flex items-center gap-3"><svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> cs@ispadiag.com</li>
                <li className="flex items-start gap-3"><svg className="w-4 h-4 text-teal-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Jl. Kesehatan No.123, Jakarta Selatan, Indonesia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} ISPADiag Expert System. Hak Cipta Dilindungi.
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
