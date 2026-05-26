'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, X } from 'lucide-react';

export default function AdminSymptomsPage() {
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [isAddingSymptom, setIsAddingSymptom] = useState(false);
    const [symptomForm, setSymptomForm] = useState({ name: '', code: '', description: '' });

    const fetchSymptoms = async () => {
        api.get('symptoms/').then(res => setSymptoms(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchSymptoms();
    }, []);

    const handleAddSymptomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('symptoms/', symptomForm);
            setIsAddingSymptom(false);
            setSymptomForm({ name: '', code: '', description: '' });
            fetchSymptoms();
            alert('Gejala berhasil ditambahkan!');
        } catch (err) {
            alert('Gagal menambahkan gejala.');
        }
    };

    const deleteSymptom = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus gejala ini?')) return;
        try {
            await api.delete(`symptoms/${id}/`);
            fetchSymptoms();
        } catch (err) {
            alert('Gagal menghapus gejala.');
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px] relative">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daftar Parameter Gejala</h2>
                        <p className="text-slate-500 text-sm mt-0.5">Kelola gejala penyakit pernapasan</p>
                    </div>
                    <button onClick={() => setIsAddingSymptom(true)} className="bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-600 transition flex items-center gap-2 shadow-md shadow-teal-100">
                        <Plus className="w-4 h-4" /> Tambah Gejala
                    </button>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                                <th className="p-4">Kode</th>
                                <th className="p-4">Nama Parameter</th>
                                <th className="p-4">Deskripsi Gejala</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {symptoms.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition">
                                    <td className="p-4 font-mono font-bold text-teal-600">{s.code}</td>
                                    <td className="p-4 font-bold text-slate-800">{s.name}</td>
                                    <td className="p-4 text-slate-500 max-w-xs truncate">{s.description || '-'}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => deleteSymptom(s.id)} className="text-rose-500 hover:text-rose-700 transition font-bold text-xs flex items-center justify-end gap-1 ml-auto">
                                            <Trash2 className="w-4 h-4" /> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD SYMPTOM MODAL */}
            {isAddingSymptom && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800">Tambah Gejala Baru</h3>
                            <button onClick={() => setIsAddingSymptom(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSymptomSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Kode (Contoh: G10)</label>
                                <input 
                                    type="text"
                                    placeholder="Kode gejala..."
                                    value={symptomForm.code}
                                    onChange={e => setSymptomForm({...symptomForm, code: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Nama Parameter Gejala</label>
                                <input 
                                    type="text"
                                    placeholder="Nama gejala..."
                                    value={symptomForm.name}
                                    onChange={e => setSymptomForm({...symptomForm, name: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Deskripsi (Opsional)</label>
                                <textarea 
                                    placeholder="Penjelasan detail gejala..."
                                    value={symptomForm.description}
                                    onChange={e => setSymptomForm({...symptomForm, description: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold min-h-[80px]"
                                />
                            </div>
                            <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition shadow-md shadow-teal-100 mt-2">
                                Simpan Gejala
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
