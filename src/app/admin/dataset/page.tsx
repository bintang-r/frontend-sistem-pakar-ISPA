'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, X, Play, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useClientTable } from '@/hooks/useClientTable';
import { SortableHeader } from '@/components/SortableHeader';
import { PaginationControls } from '@/components/PaginationControls';
import { Search } from 'lucide-react';

export default function AdminDatasetPage() {
    const [dataset, setDataset] = useState<any[]>([]);
    const [datasetTotal, setDatasetTotal] = useState(0);
    const [datasetPage, setDatasetPage] = useState(1);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [trainMsg, setTrainMsg] = useState('');
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [diseases, setDiseases] = useState<any[]>([]);
    const [newRow, setNewRow] = useState<any>({ age: 0, diagnosis: '' });

    const datasetTable = useClientTable(dataset, ['id', 'age', 'diagnosis'], 10);

    const fetchInitialData = async () => {
        api.get('symptoms/').then(res => setSymptoms(res.data)).catch(console.error);
        api.get('diseases/').then(res => {
            setDiseases(res.data);
            if (res.data.length > 0) {
                setNewRow((prev: any) => ({ ...prev, diagnosis: res.data[0].name }));
            }
        }).catch(console.error);
    };

    const fetchDataset = async () => {
        api.get(`rules/dataset/?page=${datasetPage}`).then(res => {
            if (res.data.results) {
                setDataset(res.data.results);
                setDatasetTotal(res.data.count);
            } else {
                setDataset(res.data);
                setDatasetTotal(res.data.length);
            }
        }).catch(console.error);
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchDataset();
    }, [datasetPage]);

    const handleAddDatasetRow = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('rules/dataset/', newRow);
            setIsAddingRow(false);
            fetchDataset();
            alert('Data training berhasil ditambahkan!');
        } catch (err) {
            alert('Gagal menambahkan data training.');
        }
    };

    const handleDeleteDatasetRow = async (id: number) => {
        if (!confirm('Hapus baris data training ini?')) return;
        try {
            await api.delete(`rules/dataset/${id}/`);
            fetchDataset();
        } catch (err) {
            alert('Gagal menghapus baris data.');
        }
    };

    const handleTrainSystem = async () => {
        setIsTraining(true);
        setTrainMsg('');
        try {
            const res = await api.post('rules/train/');
            setTrainMsg(res.data.message);
        } catch (err) {
            alert('Gagal melakukan training sistem.');
        } finally {
            setIsTraining(false);
        }
    };

    const symptomFields = symptoms.map((s: any, idx: number) => ({
        key: `symptom_${idx + 1}`,
        label: `${s.code} - ${s.name}`
    }));

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px] relative">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Data Master Dataset Training</h2>
                        <p className="text-slate-500 text-sm mt-0.5">Total: <strong className="text-teal-600">{datasetTotal} baris data</strong> di database</p>
                    </div>
                    <div className="flex gap-2.5">
                        <button onClick={handleTrainSystem} disabled={isTraining} className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-teal-150 disabled:opacity-60">
                            <Play className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} /> 
                            {isTraining ? 'Training...' : 'Mulai Training (Retrain)'}
                        </button>
                        <button onClick={() => setIsAddingRow(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Tambah Row
                        </button>
                    </div>
                </div>

                {trainMsg && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 animate-pulse">
                        <CheckCircle className="w-5 h-5 text-emerald-600" /> {trainMsg}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
                    <h4 className="text-sm font-bold text-slate-800">Daftar Data Latih</h4>
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input 
                            type="text"
                            placeholder="Cari diagnosis atau umur..."
                            value={datasetTable.searchTerm}
                            onChange={e => datasetTable.setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 font-semibold"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                                <SortableHeader label="ID" sortKey="id" currentSort={datasetTable.sortConfig} onSort={datasetTable.requestSort} className="p-3" />
                                <SortableHeader label="Umur" sortKey="age" currentSort={datasetTable.sortConfig} onSort={datasetTable.requestSort} className="p-3" />
                                <th className="p-3">B.Kering</th>
                                <th className="p-3">B.Dahak</th>
                                <th className="p-3">Demam</th>
                                <th className="p-3">Pilek</th>
                                <th className="p-3">Sesak</th>
                                <th className="p-3">Nyeri Tenggorok</th>
                                <SortableHeader label="Diagnosis" sortKey="diagnosis" currentSort={datasetTable.sortConfig} onSort={datasetTable.requestSort} className="p-3" />
                                <th className="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium">
                            {datasetTable.paginatedData.map(row => (
                                <tr key={row.id} className="hover:bg-slate-50/50 transition">
                                    <td className="p-3 font-mono font-bold text-slate-400">Row #{row.id}</td>
                                    <td className="p-3 text-slate-700">{row.age} Thn</td>
                                    <td className="p-3">{row.batuk_kering === 1 ? 'Ya' : '-'}</td>
                                    <td className="p-3">{row.batuk_berdahak === 1 ? 'Ya' : '-'}</td>
                                    <td className="p-3">{row.demam === 1 ? 'Ya' : '-'}</td>
                                    <td className="p-3">{row.pilek === 1 ? 'Ya' : '-'}</td>
                                    <td className="p-3">{row.sesak_napas === 1 ? 'Ya' : '-'}</td>
                                    <td className="p-3">{row.nyeri_tenggorokan === 1 ? 'Ya' : '-'}</td>
                                    <td className="p-3 font-bold text-teal-600">{row.diagnosis}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleDeleteDatasetRow(row.id)} className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {datasetTable.paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="p-8 text-center text-slate-400 font-semibold italic">Tidak ada data latih ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationControls 
                    currentPage={datasetTable.currentPage}
                    totalPages={datasetTable.totalPages}
                    onPageChange={datasetTable.setCurrentPage}
                    pageSize={datasetTable.pageSize}
                    onPageSizeChange={datasetTable.setPageSize}
                    totalItems={datasetTable.totalItems}
                    pageSizeOptions={[10, 20, 50]}
                />

                <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
                    <span className="text-xs text-slate-400 font-semibold">Total Server Dataset: <span className="font-bold text-slate-700">{datasetTotal} baris</span> (Page {datasetPage})</span>
                    <div className="flex gap-2">
                        <button 
                            disabled={datasetPage <= 1}
                            onClick={() => setDatasetPage(prev => Math.max(1, prev - 1))}
                            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-40"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            disabled={dataset.length < 100}
                            onClick={() => setDatasetPage(prev => prev + 1)}
                            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-40"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ADD DATASET ROW MODAL */}
            {isAddingRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800">Tambah Data Latih Baru</h3>
                            <button onClick={() => setIsAddingRow(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddDatasetRow} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Umur Pasien (Tahun)</label>
                                    <input 
                                        type="number"
                                        value={newRow.age}
                                        onChange={e => setNewRow({...newRow, age: parseInt(e.target.value) || 0})}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Diagnosis Penyakit</label>
                                    <select
                                        value={newRow.diagnosis}
                                        onChange={e => setNewRow({...newRow, diagnosis: e.target.value})}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-800 bg-white"
                                    >
                                        {diseases.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tandai Gejala yang Muncul:</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {symptomFields.map(field => (
                                        <label key={field.key} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer select-none text-xs font-bold text-slate-700">
                                            <input 
                                                type="checkbox"
                                                checked={(newRow as any)[field.key] === 1}
                                                onChange={e => setNewRow({
                                                    ...newRow, 
                                                    [field.key]: e.target.checked ? 1 : 0
                                                })}
                                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                                            />
                                            {field.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full bg-teal-500 text-white py-3.5 rounded-xl font-bold hover:bg-teal-600 transition shadow-md shadow-teal-100 mt-4">
                                Simpan Data Latih
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
