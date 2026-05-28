'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useClientTable } from '@/hooks/useClientTable';
import { SortableHeader } from '@/components/SortableHeader';
import { PaginationControls } from '@/components/PaginationControls';

export default function AdminMatrixPage() {
    const [matrix, setMatrix] = useState<any[]>([]);
    const [rules, setRules] = useState<any[]>([]);

    const {
        searchTerm, setSearchTerm, sortConfig, requestSort,
        currentPage, setCurrentPage, pageSize, setPageSize,
        totalPages, paginatedData, totalItems
    } = useClientTable(matrix, ['disease_code', 'disease_name', 'symptom_code', 'symptom_name', 'expert_cf'], 10);

    useEffect(() => {
        api.get('rules/matrix/').then(res => {
            setMatrix(res.data.matrix);
            setRules(res.data.rules);
        }).catch(console.error);
    }, []);

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px]">
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Aturan & Certainty Factor Matrix</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Audit basis pengetahuan sistem pakar hasil probabilitas dataset</p>
                </div>
                
                {/* Rules List */}
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800">1. Aturan Forward Chaining (Inclusion threshold P &gt;= 0.20)</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {rules.map(r => (
                            <div key={r.code} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                                    <span className="font-mono font-bold text-teal-600">{r.code}</span>
                                    <span className="font-bold text-slate-800">{r.disease_name}</span>
                                </div>
                                <div className="text-xs text-slate-500 leading-relaxed font-semibold">
                                    IF {r.symptoms.join(' AND ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certainty Factors Matrix */}
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800">2. Bobot Probabilitas Certainty Factor (expert_cf)</h3>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <div className="relative w-full sm:w-72">
                            <input 
                                type="text"
                                placeholder="Cari penyakit / gejala..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 font-semibold"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                                    <SortableHeader label="Kode Penyakit" sortKey="disease_code" currentSort={sortConfig} onSort={requestSort} className="p-3" />
                                    <SortableHeader label="Nama Penyakit" sortKey="disease_name" currentSort={sortConfig} onSort={requestSort} className="p-3" />
                                    <SortableHeader label="Kode Gejala" sortKey="symptom_code" currentSort={sortConfig} onSort={requestSort} className="p-3" />
                                    <SortableHeader label="Nama Gejala" sortKey="symptom_name" currentSort={sortConfig} onSort={requestSort} className="p-3" />
                                    <SortableHeader label="Nilai CF" sortKey="expert_cf" currentSort={sortConfig} onSort={requestSort} className="p-3 text-right" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium">
                                {paginatedData.map((cf, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition">
                                        <td className="p-3 font-mono font-bold text-slate-400">{cf.disease_code}</td>
                                        <td className="p-3 text-slate-700 font-bold">{cf.disease_name}</td>
                                        <td className="p-3 font-mono font-bold text-teal-600">{cf.symptom_code}</td>
                                        <td className="p-3 text-slate-600">{cf.symptom_name}</td>
                                        <td className="p-3 text-right">
                                            <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded font-bold text-[10px] border border-teal-100">
                                                {cf.expert_cf}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold italic">Tidak ada matrix ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <PaginationControls 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                        totalItems={totalItems}
                    />
                </div>
            </div>
        </div>
    );
}
