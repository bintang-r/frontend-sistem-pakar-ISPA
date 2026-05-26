'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const SEVERITIES = [
    { value: 0.2, label: 'Tidak Tahu' },
    { value: 0.4, label: 'Mungkin' },
    { value: 0.6, label: 'Kemungkinan Besar' },
    { value: 0.8, label: 'Hampir Pasti' },
    { value: 1.0, label: 'Pasti' }
];

export default function Consultation() {
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [selected, setSelected] = useState<Record<number, number>>({});
    const router = useRouter();

    useEffect(() => {
        api.get('symptoms/').then(res => setSymptoms(res.data));
    }, []);

    const toggleSymptom = (id: number, val: number) => {
        setSelected(prev => {
            const next = { ...prev };
            if (next[id] === val) delete next[id];
            else next[id] = val;
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const details = Object.entries(selected).map(([symptom, user_cf]) => ({
            symptom: parseInt(symptom),
            user_cf
        }));
        
        if (details.length === 0) return alert('Select at least one symptom');
        
        const res = await api.post('consultations/', { details });
        router.push(`/result/${res.data.id}`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
                    <Activity className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Symptom Checklist</h1>
                <p className="text-lg text-slate-500">Select the symptoms you are experiencing and their severity</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
                <div className="space-y-4 mb-10">
                    {symptoms.map(symp => (
                        <div key={symp.id} className="border border-slate-200 rounded-2xl p-4 hover:border-blue-300 transition bg-slate-50/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                                    {selected[symp.id] ? <CheckCircle2 className="w-5 h-5 text-blue-500" /> : <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />}
                                    {symp.name}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {SEVERITIES.map(sev => (
                                    <button
                                        key={sev.value}
                                        type="button"
                                        onClick={() => toggleSymptom(symp.id, sev.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            selected[symp.id] === sev.value
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-600 ring-offset-2'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {sev.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sticky bottom-4">
                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
                        Diagnose Now <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
        </div>
    );
}
