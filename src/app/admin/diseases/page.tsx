'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, X } from 'lucide-react';

export default function AdminDiseasesPage() {
    const [diseases, setDiseases] = useState<any[]>([]);
    const [isAddingDisease, setIsAddingDisease] = useState(false);
    const [diseaseForm, setDiseaseForm] = useState({
        name: '', code: '', category: 'Ringan', description: '',
        recommendation: '', treatment_solutions: '', recovery_steps: ''
    });

    const fetchDiseases = async () => {
        api.get('diseases/').then(res => setDiseases(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchDiseases();
    }, []);

    const handleAddDiseaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('diseases/', diseaseForm);
            setIsAddingDisease(false);
            setDiseaseForm({
                name: '', code: '', category: 'Ringan', description: '',
                recommendation: '', treatment_solutions: '', recovery_steps: ''
            });
            fetchDiseases();
            alert('Penyakit berhasil ditambahkan!');
        } catch (err) {
            alert('Gagal menambahkan penyakit.');
        }
    };

    const deleteDisease = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus penyakit ini beserta aturan terkait?')) return;
        try {
            await api.delete(`diseases/${id}/`);
            fetchDiseases();
        } catch (err) {
            alert('Gagal menghapus penyakit.');
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px] relative">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daftar Jenis Penyakit</h2>
                        <p className="text-slate-500 text-sm mt-0.5">Kelola diagnosa ISPA & Rekomendasi medis</p>
                    </div>
                    <button onClick={() => setIsAddingDisease(true)} className="bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-600 transition flex items-center gap-2 shadow-md shadow-teal-100">
                        <Plus className="w-4 h-4" /> Tambah Penyakit
                    </button>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                                <th className="p-4">Kode</th>
                                <th className="p-4">Nama Penyakit</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Rekomendasi</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {diseases.map(d => (
                                <tr key={d.id} className="hover:bg-slate-50/50 transition">
                                    <td className="p-4 font-mono font-bold text-teal-600">{d.code}</td>
                                    <td className="p-4 font-bold text-slate-800">{d.name}</td>
                                    <td className="p-4 text-slate-500">{d.category}</td>
                                    <td className="p-4 text-slate-500 truncate max-w-xs">{d.recommendation || '-'}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => deleteDisease(d.id)} className="text-rose-500 hover:text-rose-700 transition font-bold text-xs flex items-center justify-end gap-1 ml-auto">
                                            <Trash2 className="w-4 h-4" /> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD DISEASE MODAL */}
            {isAddingDisease && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-6 max-w-xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-800">Tambah Jenis Penyakit</h3>
                            <button onClick={() => setIsAddingDisease(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddDiseaseSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Kode (Contoh: P10)</label>
                                    <input 
                                        type="text"
                                        placeholder="Kode penyakit..."
                                        value={diseaseForm.code}
                                        onChange={e => setDiseaseForm({...diseaseForm, code: e.target.value})}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Nama Penyakit</label>
                                    <input 
                                        type="text"
                                        placeholder="Nama penyakit..."
                                        value={diseaseForm.name}
                                        onChange={e => setDiseaseForm({...diseaseForm, name: e.target.value})}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Kategori Tingkat Bahaya</label>
                                <select 
                                    value={diseaseForm.category}
                                    onChange={e => setDiseaseForm({...diseaseForm, category: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold bg-white text-slate-800"
                                >
                                    <option value="Ringan">Ringan (Mild)</option>
                                    <option value="Sedang">Sedang (Moderate)</option>
                                    <option value="Berat">Berat (Severe)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Deskripsi Penyakit</label>
                                <textarea 
                                    placeholder="Tulis deskripsi penyakit..."
                                    value={diseaseForm.description}
                                    onChange={e => setDiseaseForm({...diseaseForm, description: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold min-h-[60px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Rekomendasi Medis</label>
                                <textarea 
                                    placeholder="Rekomendasi penanganan medis..."
                                    value={diseaseForm.recommendation}
                                    onChange={e => setDiseaseForm({...diseaseForm, recommendation: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold min-h-[60px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Solusi & Pengobatan</label>
                                <textarea 
                                    placeholder="Tindakan pengobatan & obat yang direkomendasikan..."
                                    value={diseaseForm.treatment_solutions}
                                    onChange={e => setDiseaseForm({...diseaseForm, treatment_solutions: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold min-h-[60px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Langkah Pemulihan</label>
                                <textarea 
                                    placeholder="Langkah-langkah pemulihan pasca sakit..."
                                    value={diseaseForm.recovery_steps}
                                    onChange={e => setDiseaseForm({...diseaseForm, recovery_steps: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold min-h-[60px]"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition shadow-md shadow-teal-100 mt-2">
                                Simpan Data Penyakit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
