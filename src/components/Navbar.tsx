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
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                        <Stethoscope className="w-8 h-8" />
                        <span>ISPA<span className="text-slate-800">Diag</span></span>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link href="/admin" className="text-emerald-700 hover:text-emerald-500 font-medium flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Admin</Link>
                                )}
                                <Link href="/dashboard" className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-1"><Activity className="w-4 h-4"/> Dashboard</Link>
                                <Link href="/consultation" className="text-slate-600 hover:text-emerald-600 font-medium">Consultation</Link>
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
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
                            <>
                                <Link href="/login" className="text-slate-600 hover:text-emerald-600 font-medium">Login</Link>
                                <Link href="/register" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition shadow-md shadow-emerald-200">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
