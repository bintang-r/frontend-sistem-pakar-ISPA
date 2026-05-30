"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Activity,
  Stethoscope,
  FileText,
  Users,
  Calendar,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "#0D9488",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#EF4444",
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api
      .get("statistics/")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px]">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Statistik dan analisis data sistem pakar ISPA
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 p-6 rounded-3xl border border-teal-100/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-teal-500 rounded-2xl text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
                Total Pasien
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {stats?.total_patients || 0}
              </h3>
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 p-6 rounded-3xl border border-sky-100/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-sky-500 rounded-2xl text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-sky-700 font-bold uppercase tracking-wider">
                Total Konsultasi
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {stats?.total_consultations || 0}
              </h3>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-3xl border border-purple-100/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-2xl text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">
                Rata-rata CF
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {stats?.avg_confidence || 0}%
              </h3>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Bar & Pie Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-500" /> Kasus per Jenis
                Penyakit (Bar Chart)
              </h3>
              {stats?.disease_distribution &&
              stats.disease_distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.disease_distribution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E2E8F0"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(13, 148, 136, 0.05)" }} />
                    <Bar dataKey="cases" fill="#0D9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-xs text-slate-400 font-bold italic">
                  Belum ada data distribusi penyakit.
                </div>
              )}
            </div>

            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-500" /> Proporsi
                Diagnosis (Pie Chart)
              </h3>
              {stats?.disease_distribution &&
              stats.disease_distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.disease_distribution}
                      dataKey="cases"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ percent = 0 }: { percent?: number }) =>
                        `${Math.round(percent * 100)}%`
                      }
                    >
                      {stats.disease_distribution.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend
                      formatter={(value) => (
                        <span className="text-slate-600 text-[10px] font-bold">
                          {value}
                        </span>
                      )}
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-xs text-slate-400 font-bold italic">
                  Belum ada data proporsi diagnosis.
                </div>
              )}
            </div>
          </div>

          {/* Line Chart / Dot Chart */}
          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-500" /> Tren Aktivitas
              Konsultasi Pasien (Line/Dot Chart)
            </h3>
            {stats?.consultation_trend &&
            stats.consultation_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.consultation_trend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0D9488"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    dot={{
                      stroke: "#0D9488",
                      strokeWidth: 3,
                      r: 4,
                      fill: "#FFFFFF",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-xs text-slate-400 font-bold italic">
                Belum ada data tren konsultasi.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
