'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, Activity, HelpCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/**
 * Confidence levels a user can select for a symptom.
 * value: the user_cf sent to backend (only positive values 0.4-1.0).
 * IMPORTANT: "Tidak / Tidak Tahu" must NOT be sent — it means the symptom
 * is absent or unknown, so it is excluded from the payload entirely.
 */
const SEVERITIES = [
    { value: 0.4,  label: 'Sedikit',           desc: 'Gejala sangat ringan, hampir tidak terasa' },
    { value: 0.6,  label: 'Cukup Yakin',        desc: 'Gejala jelas terasa / dialami' },
    { value: 0.8,  label: 'Yakin',              desc: 'Gejala kuat, cukup mengganggu' },
    { value: 1.0,  label: 'Sangat Yakin',       desc: 'Gejala pasti ada & sangat jelas dirasakan' },
];

export default function Consultation() {
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [selected, setSelected] = useState<Record<number, number>>({});
    const [age, setAge] = useState<string>('');
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated && !localStorage.getItem('access_token')) {
            router.push('/login');
            return;
        }

        if (isAuthenticated) {
            api.get('symptoms/').then(res => {
                // Filter out S17, S18, S19, S20 (age category symptoms) from the checklist
                const filtered = res.data.filter((s: any) => !['S17', 'S18', 'S19', 'S20'].includes(s.code));
                setSymptoms(filtered);
            });
        }
    }, [isAuthenticated]);

    /**
     * Selects a severity for a symptom, or deselects if the same value is clicked again.
     * Passing val=0 explicitly deselects (Tidak / Tidak Ada).
     */
    const toggleSymptom = (id: number, val: number) => {
        setSelected(prev => {
            const next = { ...prev };
            if (val === 0 || next[id] === val) {
                delete next[id]; // deselect
            } else {
                next[id] = val;
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const numericAge = parseInt(age);
        if (isNaN(numericAge) || numericAge <= 0 || numericAge > 120) {
            return alert('Harap masukkan umur yang valid (1 - 120 tahun).');
        }

        // Only send symptoms with a positive user_cf (>0)
        const details = Object.entries(selected)
            .filter(([, user_cf]) => user_cf > 0)
            .map(([symptom, user_cf]) => ({
                symptom: parseInt(symptom),
                user_cf
            }));
        
        if (details.length === 0) {
            return alert('Pilih minimal satu gejala yang Anda rasakan dengan tingkat keyakinan tertentu.');
        }
        
        const res = await api.post('consultations/', { 
            details,
            age: numericAge
        });
        router.push(`/result/${res.data.id}`);
    };

    if (!mounted || !isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const selectedCount = Object.keys(selected).length;

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 mb-4">
                    <Activity className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Checklist Gejala & Umur</h1>
                <p className="text-lg text-slate-500">Pilih <strong>hanya gejala yang benar-benar Anda rasakan</strong>, lalu tentukan seberapa yakin Anda</p>
            </div>

            {/* Panduan pengisian */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1">Cara mengisi yang benar:</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-700 font-medium">
                        <li>Jika Anda <strong>tidak merasakan</strong> suatu gejala → biarkan kosong (tidak perlu diklik)</li>
                        <li>Jika Anda <strong>tidak yakin / tidak tahu</strong> → biarkan kosong juga</li>
                        <li>Pilih tingkat keyakinan <strong>hanya untuk gejala yang memang Anda rasakan</strong></li>
                        <li>Klik gejala yang sudah dipilih untuk <strong>membatalkan</strong> pilihan</li>
                    </ul>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
                {/* Input Umur */}
                <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                    <label htmlFor="age" className="block text-lg font-bold text-slate-800 mb-2">
                        Berapa Umur Anda? (Tahun)
                    </label>
                    <p className="text-sm text-slate-500 mb-4">Umur diperlukan sebagai parameter analisis klinis sistem pakar.</p>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Masukkan umur Anda..."
                        min="1"
                        max="120"
                        required
                        className="w-full md:w-64 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 text-lg font-semibold"
                    />
                </div>

                {/* Symptom Checklist */}
                <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h2 className="text-lg font-bold text-slate-800">Daftar Gejala</h2>
                        {selectedCount > 0 && (
                            <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {selectedCount} gejala dipilih
                            </span>
                        )}
                    </div>
                    {symptoms.map(symp => {
                        const isSelected = symp.id in selected;
                        return (
                            <div
                                key={symp.id}
                                className={`border rounded-2xl p-4 transition-all ${
                                    isSelected
                                        ? 'border-teal-300 bg-teal-50/40 shadow-sm shadow-teal-100'
                                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3 gap-3">
                                    <span className="font-semibold text-slate-800 text-base flex items-center gap-2">
                                        {isSelected
                                            ? <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                                            : <div className="w-5 h-5 border-2 border-slate-300 rounded-full shrink-0" />
                                        }
                                        {symp.name}
                                    </span>
                                    {/* "Tidak Ada" deselect button — only visible if selected */}
                                    {isSelected && (
                                        <button
                                            type="button"
                                            onClick={() => toggleSymptom(symp.id, 0)}
                                            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-bold shrink-0 px-2 py-1 rounded-lg hover:bg-rose-50 transition"
                                        >
                                            <XCircle className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    )}
                                </div>
                                {symp.description && (
                                    <p className="text-xs text-slate-400 mb-3 ml-7 italic">{symp.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 ml-7">
                                    {SEVERITIES.map(sev => (
                                        <button
                                            key={sev.value}
                                            type="button"
                                            title={sev.desc}
                                            onClick={() => toggleSymptom(symp.id, sev.value)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                selected[symp.id] === sev.value
                                                    ? 'bg-teal-500 text-white shadow-md shadow-teal-200 ring-2 ring-teal-500 ring-offset-2'
                                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            {sev.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="sticky bottom-4">
                    <button type="submit" className="w-full bg-teal-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-600 transition-all shadow-xl shadow-teal-200 flex items-center justify-center gap-2 group">
                        Mulai Analisis <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
        </div>
    );
}

