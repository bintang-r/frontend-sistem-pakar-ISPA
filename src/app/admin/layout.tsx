'use client';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, Activity, Stethoscope, Database, Table, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        checkAuth();
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated && !localStorage.getItem('access_token')) {
                router.push('/login');
            } else if (isAuthenticated && user?.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [mounted, isAuthenticated, user, router]);

    if (!mounted || !isAuthenticated || user?.role !== 'admin') {
        return <div className="p-20 text-center font-bold text-slate-500">Memuat Halaman...</div>;
    }

    const tabs = [
        { id: '/admin', label: 'Dashboard Overview', icon: Activity },
        { id: '/admin/users', label: 'Daftar Pengguna & Riwayat', icon: Users },
        { id: '/admin/symptoms', label: 'Gejala (Symptoms)', icon: Activity },
        { id: '/admin/diseases', label: 'Penyakit (Diseases)', icon: Stethoscope },
        { id: '/admin/dataset', label: 'Dataset (Master)', icon: Database },
        { id: '/admin/matrix', label: 'Aturan & CF Matrix', icon: Table },
    ];

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-8 font-sans">
            {/* Sidebar */}
            <div className="w-full lg:w-64 shrink-0 space-y-1 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <div className="mb-4 p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center gap-3 text-teal-800 font-extrabold text-sm">
                    <ShieldAlert className="w-5 h-5 text-teal-600" /> Admin Portal
                </div>
                {tabs.map(tab => (
                    <Link
                        key={tab.id}
                        href={tab.id}
                        className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all duration-300 ${
                            pathname === tab.id 
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-100' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </Link>
                ))}
            </div>

            {/* Content Pane */}
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}
