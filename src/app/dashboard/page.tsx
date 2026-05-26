'use client';
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
