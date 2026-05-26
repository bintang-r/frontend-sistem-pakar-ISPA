'use client';
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

    if (!result) return <div className="flex justify-center p-20"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div></div>;

    const topDiagnosis = result.diagnosis_results?.[0];

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <button onClick={() => router.push('/dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition">
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 mb-8 print:shadow-none print:border-none">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 md:p-12 text-white text-center">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
                    <h2 className="text-lg font-medium text-emerald-100 mb-2">Diagnosis Result</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{result.final_diagnosis}</h1>
                    <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold text-2xl border border-white/30">
                        {result.confidence_result}% Confidence
                    </div>
                </div>
                
                <div className="p-8 md:p-12">
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <Info className="w-6 h-6 text-emerald-500" /> Recommendation
                        </h3>
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-emerald-900 leading-relaxed text-lg">
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
