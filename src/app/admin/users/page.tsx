'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Search, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer,
  XAxis, YAxis,
  ScatterChart, Scatter, CartesianGrid, Tooltip, Legend
} from 'recharts';

const CHART_COLORS = ['#0D9488', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'];

export default function AdminUsersPage() {
    const [usersList, setUsersList] = useState<any[]>([]);
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
    
    // Dataset matcher for consultation detail view
    const [matcherPage, setMatcherPage] = useState(1);
    const [matcherPageSize, setMatcherPageSize] = useState(10);
    const [matcherDataset, setMatcherDataset] = useState<any[]>([]);
    const [matcherAllDataset, setMatcherAllDataset] = useState<any[]>([]);
    const [matcherTotal, setMatcherTotal] = useState(0);
    const [scatterViewMode, setScatterViewMode] = useState<'all' | 'paginated'>('all');
    const [showCalcModal, setShowCalcModal] = useState(false);

    useEffect(() => {
        api.get('admin/users/').then(res => setUsersList(res.data)).catch(console.error);
        api.get('symptoms/').then(res => setSymptoms(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedConsultation) {
            fetchMatcherDataset(matcherPage, matcherPageSize);
        }
    }, [selectedConsultation, matcherPage, matcherPageSize]);

    useEffect(() => {
        if (selectedConsultation) {
            fetchMatcherAllDataset();
        }
    }, [selectedConsultation]);

    const fetchMatcherDataset = async (page: number, size: number) => {
        api.get(`rules/dataset/?page=${page}&page_size=${size}`).then(res => {
            if (res.data.results) {
                setMatcherDataset(res.data.results);
                setMatcherTotal(res.data.count);
            } else {
                setMatcherDataset(res.data);
                setMatcherTotal(res.data.length);
            }
        }).catch(console.error);
    };

    const fetchMatcherAllDataset = async () => {
        api.get(`rules/dataset/?page=1&page_size=1000`).then(res => {
            if (res.data.results) {
                setMatcherAllDataset(res.data.results);
            } else {
                setMatcherAllDataset(res.data);
            }
        }).catch(console.error);
    };

    const symptomCodeToKey: Record<string, string> = {};
    symptoms.forEach((s: any, idx: number) => {
        symptomCodeToKey[s.code] = `symptom_${idx + 1}`;
    });

    const getRowHighlightColor = (row: any, activeSymptoms: string[], finalDiagnosis: string) => {
        if (!activeSymptoms || activeSymptoms.length === 0) return '';
        let matchCount = 0;
        activeSymptoms.forEach((code: string) => {
            const key = symptomCodeToKey[code];
            if (key && row[key] === 1) matchCount++;
        });
        const isSameDiagnosis = row.diagnosis === finalDiagnosis;
        if (matchCount === activeSymptoms.length && isSameDiagnosis) return 'bg-teal-50 hover:bg-teal-100/70 border-l-4 border-teal-500 font-semibold';
        else if (matchCount === activeSymptoms.length) return 'bg-emerald-50/70 hover:bg-emerald-100/60 border-l-4 border-emerald-400 font-semibold';
        else if (matchCount > 0 && isSameDiagnosis) return 'bg-sky-50/50 hover:bg-sky-100/40';
        else if (matchCount > 0) return 'bg-amber-50/30 hover:bg-amber-100/30';
        return '';
    };

    const filteredUsers = usersList.filter(u => 
        u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px]">
            {/* A. USERS LIST */}
            {!selectedUser && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daftar Pengguna & Riwayat</h2>
                            <p className="text-slate-500 text-sm mt-0.5">Kelola data pasien dan riwayat konsultasinya</p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input 
                                type="text"
                                placeholder="Cari pasien..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 font-semibold"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                                    <th className="p-4">Nama Lengkap</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Tanggal Daftar</th>
                                    <th className="p-4">Total Konsultasi</th>
                                    <th className="p-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                                        <td className="p-4 font-bold text-slate-800">{u.full_name}</td>
                                        <td className="p-4 text-slate-600 font-semibold">{u.email || '-'}</td>
                                        <td className="p-4 text-slate-500">{new Date(u.date_joined).toLocaleDateString('id-ID')}</td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                                                {u.consultations_count} Konsultasi
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => setSelectedUser(u)} 
                                                className="bg-teal-50 text-teal-700 border border-teal-100 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-teal-500 hover:text-white transition"
                                            >
                                                Lihat Riwayat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold italic">Tidak ada pengguna ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* B. USER DETAILS & CONSULTATION LIST */}
            {selectedUser && !selectedConsultation && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                        <div>
                            <button onClick={() => setSelectedUser(null)} className="text-xs font-bold text-teal-600 hover:underline mb-1">
                                &larr; Kembali ke Daftar Pengguna
                            </button>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedUser.full_name}</h2>
                            <p className="text-slate-500 text-xs mt-0.5">Username: <span className="font-bold">{selectedUser.username}</span> | Email: <span className="font-bold">{selectedUser.email || '-'}</span></p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-black text-sm text-slate-800 mb-4">Riwayat Diagnosis Pasien</h3>
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                                        <th className="p-4">Tanggal</th>
                                        <th className="p-4">Umur</th>
                                        <th className="p-4">Diagnosis Utama</th>
                                        <th className="p-4">Confidence</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {selectedUser.consultations.map((c: any) => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition">
                                            <td className="p-4 text-slate-500 font-semibold">{new Date(c.consultation_date).toLocaleString('id-ID')}</td>
                                            <td className="p-4 text-slate-600 font-semibold">{c.age ? `${c.age} Tahun` : '-'}</td>
                                            <td className="p-4 font-bold text-slate-800">{c.final_diagnosis}</td>
                                            <td className="p-4">
                                                <span className="bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-lg text-xs font-bold">
                                                    {c.confidence_result}%
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedConsultation(c);
                                                        setMatcherPage(1);
                                                    }} 
                                                    className="bg-teal-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-teal-600 transition"
                                                >
                                                    Detail Kasus & Dataset
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {selectedUser.consultations.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold italic">Pasien belum pernah melakukan konsultasi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* C. CONSULTATION DETAIL & DATASET MATCHER */}
            {selectedUser && selectedConsultation && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                        <div>
                            <button onClick={() => setSelectedConsultation(null)} className="text-xs font-bold text-teal-600 hover:underline mb-1">
                                &larr; Kembali ke Riwayat {selectedUser.full_name}
                            </button>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Analisis Hasil Diagnosis</h2>
                            <p className="text-slate-500 text-xs mt-0.5">Tanggal: <span className="font-bold">{new Date(selectedConsultation.consultation_date).toLocaleString('id-ID')}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="md:col-span-4 space-y-2">
                            <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">Hasil Diagnosis</p>
                            <h3 className="text-xl font-black text-slate-800 leading-tight">{selectedConsultation.final_diagnosis}</h3>
                            <div className="flex flex-wrap gap-2 items-center mt-2">
                                <div className="inline-block bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-teal-100">
                                    Confidence: {selectedConsultation.confidence_result}%
                                </div>
                                <button 
                                    onClick={() => setShowCalcModal(true)}
                                    className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white shadow-sm transition"
                                >
                                    Lihat Perhitungan
                                </button>
                            </div>
                        </div>
                        <div className="md:col-span-8 space-y-2 border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-6">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gejala yang Dialami Pasien (user_cf &gt; 0):</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedConsultation.active_symptoms.map((code: string) => {
                                    const name = symptoms.find(s => s.code === code)?.name || code;
                                    return (
                                        <span key={code} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                            {code} - {name}
                                        </span>
                                    );
                                })}
                                {selectedConsultation.active_symptoms.length === 0 && (
                                    <span className="text-slate-400 text-xs italic">Tidak ada gejala yang terdeteksi.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Scatter Plot Chart */}
                    {(() => {
                        const activeSyms: string[] = selectedConsultation.active_symptoms || [];
                        const plotData = scatterViewMode === 'all' ? matcherAllDataset : matcherDataset;
                        const allDiagnoses = Array.from(new Set(plotData.map((r: any) => r.diagnosis as string)));
                        const diagColorMap: Record<string, string> = {};
                        allDiagnoses.forEach((d, i) => { diagColorMap[d] = CHART_COLORS[i % CHART_COLORS.length]; });

                        const seriesMap: Record<string, { x: number; y: number; id: number }[]> = {};
                        plotData.forEach((row: any) => {
                            const matchCount = activeSyms.filter((code: string) => {
                                const key = symptomCodeToKey[code];
                                return key && row[key] === 1;
                            }).length;
                            const d = row.diagnosis || 'Unknown';
                            if (!seriesMap[d]) seriesMap[d] = [];
                            seriesMap[d].push({ x: matchCount, y: row.age, id: row.id });
                        });

                        const patientAge = selectedConsultation.age || 0;
                        const patientMatchCount = activeSyms.length;

                        return (
                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-teal-500" />
                                            Scatter Plot — Kemiripan Kasus Dataset
                                        </h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Titik = data latih • X = jumlah gejala cocok • Y = umur •{' '}
                                            <span className="text-teal-600 font-bold">⭐ = Posisi pasien ini</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-500">Tampilan Data:</span>
                                        <select 
                                            value={scatterViewMode} 
                                            onChange={(e) => setScatterViewMode(e.target.value as 'all' | 'paginated')}
                                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                                        >
                                            <option value="all">Semua Data (Global)</option>
                                            <option value="paginated">Sesuai Paginasi Tabel</option>
                                        </select>
                                    </div>
                                </div>
                                {plotData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis
                                                type="number"
                                                dataKey="x"
                                                name="Gejala Cocok"
                                                domain={[0, activeSyms.length || 10]}
                                                label={{ value: 'Jumlah Gejala Cocok', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#94A3B8' }}
                                                stroke="#94A3B8"
                                                fontSize={10}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                type="number"
                                                dataKey="y"
                                                name="Umur"
                                                label={{ value: 'Umur (Tahun)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#94A3B8' }}
                                                stroke="#94A3B8"
                                                fontSize={10}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ strokeDasharray: '3 3' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const d = payload[0].payload;
                                                        return (
                                                            <div className="bg-white border border-slate-100 rounded-2xl shadow-xl px-4 py-3 text-xs font-semibold">
                                                                <p className="font-black text-slate-800 mb-1">{d.diagnosis || 'Pasien Ini'}</p>
                                                                <p className="text-slate-500">Umur: <span className="text-slate-800 font-bold">{d.y} thn</span></p>
                                                                <p className="text-slate-500">Gejala cocok: <span className="text-teal-600 font-bold">{d.x}</span></p>
                                                                {d.id && <p className="text-slate-400">Row #{d.id}</p>}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="top"
                                                align="right"
                                                iconSize={8}
                                                formatter={(v) => <span className="text-[10px] font-bold text-slate-600">{v}</span>}
                                            />
                                            {Object.entries(seriesMap).map(([diag, points]) => (
                                                <Scatter
                                                    key={diag}
                                                    name={diag}
                                                    data={points.map(p => ({ ...p, diagnosis: diag }))}
                                                    fill={diagColorMap[diag] || '#CBD5E1'}
                                                    opacity={0.7}
                                                    r={5}
                                                />
                                            ))}
                                            <Scatter
                                                name="Pasien Ini ⭐"
                                                data={[{ x: patientMatchCount, y: patientAge, diagnosis: selectedConsultation.final_diagnosis }]}
                                                fill="#F59E0B"
                                                shape={(props: any) => {
                                                    const { cx, cy } = props;
                                                    if (cx == null || cy == null) return <g />;
                                                    const r = 12;
                                                    const pts = Array.from({ length: 5 }, (_, i) => {
                                                        const outerA = (Math.PI / 2) + (2 * Math.PI * i) / 5;
                                                        const innerA = outerA + Math.PI / 5;
                                                        return [
                                                            `${cx + r * Math.cos(outerA)},${cy - r * Math.sin(outerA)}`,
                                                            `${cx + (r * 0.45) * Math.cos(innerA)},${cy - (r * 0.45) * Math.sin(innerA)}`,
                                                        ];
                                                    }).flat().join(' ');
                                                    return (
                                                        <polygon
                                                            points={pts}
                                                            fill="#F59E0B"
                                                            stroke="#ffffff"
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                }}
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-xs text-slate-400 font-bold italic">
                                        Memuat data scatter plot...
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Dataset Matcher Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-black text-slate-800">Dataset Matcher (Analisis Kemiripan Kasus)</h3>
                                <p className="text-slate-500 text-xs">Pencocokan riwayat konsultasi pasien dengan data latih (master dataset) di database</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Baris per Halaman:</span>
                                <select 
                                    value={matcherPageSize} 
                                    onChange={(e) => {
                                        setMatcherPageSize(Number(e.target.value));
                                        setMatcherPage(1); // Reset page on resize
                                    }}
                                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                                >
                                    <option value={5}>5 Baris</option>
                                    <option value={10}>10 Baris</option>
                                    <option value={25}>25 Baris</option>
                                    <option value={50}>50 Baris</option>
                                    <option value={100}>100 Baris</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-bold">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded bg-teal-100 border border-teal-300 inline-block" />
                                <span>Match Sempurna (Gejala & Diagnosis)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 inline-block" />
                                <span>Match Gejala Saja</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded bg-sky-100/70 border border-sky-300 inline-block" />
                                <span>Match Diagnosis & Sebagian Gejala</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded bg-amber-100/40 border border-amber-300 inline-block" />
                                <span>Match Sebagian Gejala</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                                        <th className="p-3">ID Row</th>
                                        <th className="p-3">Umur</th>
                                        <th className="p-3">Diagnosis</th>
                                        <th className="p-3">Pencocokan Gejala Aktif</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {matcherDataset.map(row => {
                                        const activeSyms = selectedConsultation.active_symptoms || [];
                                        const matchedCodes = activeSyms.filter((code: string) => {
                                            const key = symptomCodeToKey[code];
                                            return key && row[key] === 1;
                                        });

                                        return (
                                            <tr key={row.id} className={`transition ${getRowHighlightColor(row, activeSyms, selectedConsultation.final_diagnosis)}`}>
                                                <td className="p-3 font-mono font-bold text-slate-400">Row #{row.id}</td>
                                                <td className="p-3 text-slate-700 font-bold">{row.age} Tahun</td>
                                                <td className="p-3 font-bold">{row.diagnosis}</td>
                                                <td className="p-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {matchedCodes.length > 0 ? matchedCodes.map((code: string) => (
                                                            <span key={code} className="bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">
                                                                {code}
                                                            </span>
                                                        )) : <span className="text-slate-400 italic">Tidak ada</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-500 font-semibold">
                                Menampilkan <span className="font-bold text-slate-800">{matcherDataset.length}</span> baris
                                dari total <span className="font-bold text-slate-800">{matcherTotal}</span> baris dataset.
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setMatcherPage(p => Math.max(1, p - 1))}
                                    disabled={matcherPage === 1}
                                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setMatcherPage(p => p + 1)}
                                    disabled={matcherPage * matcherPageSize >= matcherTotal}
                                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* D. CALCULATION MODAL */}
            {showCalcModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="font-black text-lg text-slate-800 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                Detail Perhitungan CF
                            </h2>
                            <button onClick={() => setShowCalcModal(false)} className="text-slate-400 font-bold text-xs hover:text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition">
                               Tutup
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                            {selectedConsultation?.diagnosis_results?.map((res: any, idx: number) => {
                                if (res.message) return null;
                                return (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg text-slate-800">{res.disease}</h3>
                                            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-lg font-bold text-sm">
                                                Hasil Akhir: {res.percentage}%
                                            </span>
                                        </div>
                                        
                                        {res.calculation_trace ? (
                                            <div className="space-y-4">
                                                {res.calculation_trace.map((step: any, sIdx: number) => (
                                                    <div key={sIdx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                                        <p className="font-bold text-slate-700 text-sm mb-2">{sIdx + 1}. Gejala: <span className="text-teal-600">{step.symptom}</span></p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-600">
                                                            <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                                <span className="block text-[10px] text-slate-400 font-sans font-bold uppercase mb-1">1. Hitung CF Gejala Saat Ini</span>
                                                                {step.formula}
                                                            </div>
                                                            <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                                <span className="block text-[10px] text-slate-400 font-sans font-bold uppercase mb-1">2. Kombinasi dengan CF Sebelumnya</span>
                                                                {step.combine_formula}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">Data perhitungan detail tidak tersedia untuk penyakit ini.</p>
                                        )}
                                    </div>
                                );
                            })}
                            {(!selectedConsultation?.diagnosis_results || selectedConsultation.diagnosis_results.length === 0 || selectedConsultation.diagnosis_results[0].message) && (
                                <div className="text-center p-8 bg-white rounded-2xl border border-slate-100">
                                    <p className="text-slate-500 font-bold">{selectedConsultation?.diagnosis_results?.[0]?.message || 'Tidak ada data perhitungan untuk ditampilkan.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
