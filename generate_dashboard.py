import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# Dashboard
write_file("src/app/dashboard/page.tsx", """'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Activity, Clock, FileText, PlusCircle } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuthStore();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        api.get('consultations/').then(res => setHistory(res.data)).catch(console.error);
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.full_name}</p>
                </div>
                <Link href="/consultation" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200">
                    <PlusCircle className="w-5 h-5" /> New Consultation
                </Link>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Activity /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Consultations</p>
                        <h2 className="text-2xl font-bold text-slate-900">{history.length}</h2>
                    </div>
                </div>
                {/* Additional stats cards could go here */}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <h3 className="font-bold text-lg text-slate-800">Recent History</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {history.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No consultations yet.</div>
                    ) : (
                        history.map((item: any) => (
                            <Link href={`/result/${item.id}`} key={item.id} className="block hover:bg-slate-50 transition p-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{item.final_diagnosis}</p>
                                            <p className="text-sm text-slate-500">{new Date(item.consultation_date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                                        {item.confidence_result}%
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
""")

# Consultation
write_file("src/app/consultation/page.tsx", """'use client';
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
""")

# Result Page
write_file("src/app/result/[id]/page.tsx", """'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ShieldCheck, Info, ArrowLeft, Printer } from 'lucide-react';

export default function Result() {
    const { id } = useParams();
    const router = useRouter();
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        api.get(`consultations/${id}/`).then(res => setResult(res.data)).catch(console.error);
    }, [id]);

    if (!result) return <div className="flex justify-center p-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;

    const topDiagnosis = result.diagnosis_results?.[0];

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <button onClick={() => router.push('/dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition">
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 mb-8 print:shadow-none print:border-none">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 md:p-12 text-white text-center">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
                    <h2 className="text-lg font-medium text-blue-100 mb-2">Diagnosis Result</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{result.final_diagnosis}</h1>
                    <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold text-2xl border border-white/30">
                        {result.confidence_result}% Confidence
                    </div>
                </div>
                
                <div className="p-8 md:p-12">
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <Info className="w-6 h-6 text-blue-500" /> Recommendation
                        </h3>
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-900 leading-relaxed text-lg">
                            {topDiagnosis?.recommendation || "Consult a healthcare professional for a precise recommendation."}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Other Possibilities</h3>
                        <div className="space-y-3">
                            {result.diagnosis_results?.slice(1).map((res: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="font-semibold text-slate-700">{res.disease}</span>
                                    <span className="bg-white px-3 py-1 rounded-lg text-sm font-bold text-slate-600 border border-slate-200">{res.percentage}%</span>
                                </div>
                            ))}
                            {(!result.diagnosis_results || result.diagnosis_results.length <= 1) && (
                                <p className="text-slate-500 text-sm italic">No other significant diseases found based on symptoms.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center print:hidden">
                <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition shadow-lg flex items-center gap-2 mx-auto">
                    <Printer className="w-5 h-5" /> Print Result
                </button>
            </div>
        </div>
    );
}
""")

print("Dashboard pages generated")
