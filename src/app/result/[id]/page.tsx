'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ShieldCheck, Info, ArrowLeft, Printer, Pill, Heart, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Result() {
    const { id } = useParams();
    const router = useRouter();
    const [result, setResult] = useState<any>(null);
    const [matchingCases, setMatchingCases] = useState<any>(null);
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated && !localStorage.getItem('access_token')) {
            router.push('/login');
            return;
        }

        if (isAuthenticated && id) {
            api.get(`consultations/${id}/`).then(res => setResult(res.data)).catch(console.error);
            api.get(`consultations/${id}/matching_rows/`).then(res => setMatchingCases(res.data)).catch(console.error);
        }
    }, [id, isAuthenticated]);

    if (!mounted || !isAuthenticated || !result) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full"></div>
        </div>
    );

    const renderList = (text: string) => {
        if (!text) return <p className="text-slate-500 italic">No specific medicines/solutions recorded.</p>;
        return (
            <ul className="space-y-3.5">
                {text.split('\n').map((line, idx) => {
                    const cleanLine = line.replace(/^-\s*/, '').trim();
                    if (!cleanLine) return null;
                    return (
                        <li key={idx} className="flex items-start gap-3 text-slate-700 leading-relaxed text-base group">
                            <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-teal-500 mt-2 group-hover:scale-125 transition-transform duration-300"></span>
                            <span>{cleanLine}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderSteps = (text: string) => {
        if (!text) return <p className="text-slate-500 italic">No specific recovery steps recorded.</p>;
        return (
            <div className="space-y-4">
                {text.split('\n').map((line, idx) => {
                    const cleanLine = line.replace(/^-\s*/, '').trim();
                    if (!cleanLine) return null;
                    return (
                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                            </div>
                            <p className="text-slate-700 leading-relaxed text-base">{cleanLine}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
            <button 
                onClick={() => router.push('/dashboard')} 
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition group print:hidden"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali ke Dashboard
            </button>
            
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100/80 mb-10 print:shadow-none print:border-none">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 p-8 md:p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
                    <ShieldCheck className="w-20 h-20 mx-auto mb-4 opacity-95 animate-pulse" />
                    <h2 className="text-lg font-semibold text-teal-100 tracking-wider uppercase mb-2">Hasil Identifikasi Awal</h2>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-5 drop-shadow-sm">{result.final_diagnosis}</h1>
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        {result.age && (
                            <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold text-lg border border-white/30">
                                Umur: {result.age} Tahun
                            </div>
                        )}
                        <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-extrabold text-lg border border-white/30 shadow-inner">
                            {result.confidence_result}% Confidence
                        </div>
                    </div>
                </div>
                
                {/* Main Body */}
                <div className="p-8 md:p-12 space-y-10">
                    {/* Description Section */}
                    {result.description && (
                        <div className="bg-slate-50/50 border border-slate-100 p-6 md:p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5 mb-4">
                                <Info className="w-5 h-5 text-teal-600" /> Tentang Penyakit
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-base">
                                {result.description}
                            </p>
                        </div>
                    )}

                    {/* Solutions & Medicines */}
                    <div className="border border-teal-100 bg-teal-50/30 p-6 md:p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-teal-900 flex items-center gap-2.5 mb-4">
                            <Pill className="w-5 h-5 text-teal-600" /> Solusi & Obat-obatan
                        </h3>
                        <div className="bg-white/80 p-6 rounded-2xl border border-teal-100/50">
                            {renderList(result.treatment_solutions)}
                        </div>
                    </div>

                    {/* Recovery Steps */}
                    <div className="border border-teal-100 bg-teal-50/20 p-6 md:p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-teal-900 flex items-center gap-2.5 mb-4">
                            <Heart className="w-5 h-5 text-teal-600" /> Tindakan Pemulihan (Agar Sembuh)
                        </h3>
                        <div>
                            {renderSteps(result.recovery_steps)}
                        </div>
                    </div>

                    {/* General Recommendation */}
                    {result.recommendation && (
                        <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl">
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Rekomendasi Tambahan</h4>
                            <p className="text-slate-600 leading-relaxed text-sm">{result.recommendation}</p>
                        </div>
                    )}
                    
                    {/* Other Possibilities */}
                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-5">Kemungkinan Diagnosa Lain</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {result.diagnosis_results?.slice(1).map((res: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/50 transition duration-300">
                                    <span className="font-semibold text-slate-700">{res.disease}</span>
                                    <span className="bg-white px-3.5 py-1 rounded-xl text-sm font-bold text-slate-600 border border-slate-200">{res.percentage}%</span>
                                </div>
                            ))}
                            {(!result.diagnosis_results || result.diagnosis_results.length <= 1) && (
                                <p className="text-slate-500 text-sm italic col-span-2">Tidak ada diagnosis kemungkinan lain yang signifikan.</p>
                            )}
                        </div>
                    </div>

                    {/* Matching Dataset Cases (Dukungan Data Master) */}
                    {matchingCases && (
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-teal-600" /> Dukungan Kasus Dataset (Data Master)
                            </h3>
                            <p className="text-sm text-slate-500 mb-5">
                                Hasil diagnosis ini didukung oleh total <strong className="text-teal-600">{matchingCases.total_cases_in_dataset} kasus serupa</strong> dengan diagnosis <strong>{result.final_diagnosis}</strong> dari dataset training kami.
                            </p>
                            
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top 5 Kasus Serupa Terdekat:</h4>
                                <div className="grid gap-3">
                                    {matchingCases.matches?.slice(0, 5).map((match: any, idx: number) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                                            <div>
                                                <span className="inline-block bg-teal-50 text-teal-700 text-xs font-bold px-2 py-0.5 rounded mb-1.5 border border-teal-100">
                                                    Baris Dataset #{match.row_id} (Umur: {match.age} Tahun)
                                                </span>
                                                <div className="text-xs text-slate-600 leading-relaxed">
                                                    <strong>Gejala Cocok ({match.match_count}):</strong>{' '}
                                                    {match.matched_symptoms.length > 0 
                                                        ? match.matched_symptoms.join(', ')
                                                        : 'Tidak ada gejala spesifik yang cocok'
                                                    }
                                                </div>
                                            </div>
                                            <div className="text-xs text-teal-600 font-bold whitespace-nowrap bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                                                Skor Cocok: {match.match_count}
                                            </div>
                                        </div>
                                    ))}
                                    {(!matchingCases.matches || matchingCases.matches.length === 0) && (
                                        <p className="text-slate-400 text-xs italic">Tidak ada kasus dataset yang cocok.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="text-center print:hidden">
                <button 
                    onClick={() => window.print()} 
                    className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2.5 mx-auto"
                >
                    <Printer className="w-5 h-5" /> Cetak Hasil Diagnosis
                </button>
            </div>
        </div>
    );
}
