'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { Stethoscope, LogOut, User, Activity, ShieldAlert } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        checkAuth();
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <nav className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-slate-200 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link href="/" className="flex items-center gap-2 text-teal-600 font-extrabold text-2xl">
                        <Stethoscope className="w-8 h-8" />
                        <span>ISPA<span className="text-slate-800">Diag</span></span>
                    </Link>
                    
                    <div className="flex items-center gap-8">
                        {!isAuthenticated && (
                            <div className="hidden md:flex items-center gap-8 mr-4">
                                <a href="/#home" className="text-slate-600 hover:text-teal-600 font-bold text-sm transition">Beranda</a>
                                <a href="/#features" className="text-slate-600 hover:text-teal-600 font-bold text-sm transition">Fasilitas & Fitur</a>
                                <a href="/#informasi" className="text-slate-600 hover:text-teal-600 font-bold text-sm transition">Informasi</a>
                                <a href="/#statistics" className="text-slate-600 hover:text-teal-600 font-bold text-sm transition">Statistik</a>
                            </div>
                        )}
                        
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link href="/admin" className="text-teal-700 hover:text-teal-500 font-bold flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Admin</Link>
                                )}
                                <Link href="/dashboard" className="text-slate-600 hover:text-teal-600 font-bold flex items-center gap-1"><Activity className="w-4 h-4"/> Dashboard</Link>
                                <Link href="/consultation" className="text-slate-600 hover:text-teal-600 font-bold">Konsultasi</Link>
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                                    <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                            <User className="w-4 h-4" />
                                        </div>
                                        {user?.full_name}
                                    </span>
                                    <button onClick={logout} className="text-rose-500 hover:text-rose-700 transition">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="bg-teal-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-teal-600 transition shadow-md shadow-teal-200">Hubungi Kami / Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
