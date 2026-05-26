'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, Users, Stethoscope, Activity, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('symptoms');
    
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [diseases, setDiseases] = useState<any[]>([]);
    const [consultations, setConsultations] = useState<any[]>([]);

    useEffect(() => {
        if (isAuthenticated && user?.role !== 'admin') {
            router.push('/dashboard');
        } else if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, user]);

    const fetchData = async () => {
        api.get('symptoms/').then(res => setSymptoms(res.data));
        api.get('diseases/').then(res => setDiseases(res.data));
        api.get('consultations/').then(res => setConsultations(res.data));
    };

    if (user?.role !== 'admin') return <div className="p-20 text-center">Loading...</div>;

    const deleteSymptom = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        await api.delete(`symptoms/${id}/`);
        fetchData();
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0 space-y-2">
                <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-800 font-bold">
                    <ShieldAlert className="w-6 h-6" /> Admin Portal
                </div>
                {[
                    { id: 'symptoms', label: 'Symptoms', icon: Activity },
                    { id: 'diseases', label: 'Diseases', icon: Stethoscope },
                    { id: 'consultations', label: 'Consultations', icon: FileText },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <tab.icon className="w-5 h-5" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                {activeTab === 'symptoms' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Manage Symptoms</h2>
                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition">Add Symptom</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100 text-slate-500">
                                        <th className="p-3">Code</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {symptoms.map(s => (
                                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="p-3 font-mono text-sm text-slate-500">{s.code}</td>
                                            <td className="p-3 font-medium text-slate-800">{s.name}</td>
                                            <td className="p-3">
                                                <button className="text-blue-600 hover:underline mr-3">Edit</button>
                                                <button onClick={() => deleteSymptom(s.id)} className="text-rose-600 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'diseases' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Manage Diseases</h2>
                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition">Add Disease</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100 text-slate-500">
                                        <th className="p-3">Code</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Recommendation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {diseases.map(d => (
                                        <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="p-3 font-mono text-sm text-slate-500">{d.code}</td>
                                            <td className="p-3 font-medium text-slate-800">{d.name}</td>
                                            <td className="p-3 text-slate-600 truncate max-w-xs">{d.recommendation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'consultations' && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">All Consultations</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100 text-slate-500">
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Final Diagnosis</th>
                                        <th className="p-3">Confidence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consultations.map(c => (
                                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="p-3 text-slate-600">{new Date(c.consultation_date).toLocaleDateString()}</td>
                                            <td className="p-3 font-medium text-slate-800">{c.final_diagnosis}</td>
                                            <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md text-xs font-bold">{c.confidence_result}%</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
