'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, User, Lock, Stethoscope, ShieldCheck, Activity } from 'lucide-react';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated]);

    if (isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('auth/login/', { username, password });
            const token = res.data.access;
            const profileRes = await axios.get('http://localhost:8000/api/auth/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            login(profileRes.data, token);
            router.push('/dashboard');
        } catch (err: any) {
            setError('Username atau password salah.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-tr from-slate-50 via-teal-50/10 to-teal-50/20 px-4 py-6">
            <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100/80 hover:shadow-2xl hover:shadow-slate-200/80 transition-shadow duration-500 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                {/* Left Side: Info & Visual (hidden on mobile) */}
                <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-600 p-8 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-white font-extrabold text-xl mb-8">
                            <Stethoscope className="w-6 h-6" />
                            <span>ISPA<span className="text-teal-200">Diag</span></span>
                        </div>
                        <h2 className="text-2xl font-extrabold leading-tight mb-4">Sistem Pakar Deteksi ISPA</h2>
                        <p className="text-teal-100 text-sm leading-relaxed mb-6">
                            Analisis kesehatan saluran pernapasan Anda dengan metode Certainty Factor & Forward Chaining yang tervalidasi.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-teal-200" />
                                </div>
                                <span className="text-sm font-semibold">90%+ Akurasi Diagnosis</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-teal-200" />
                                </div>
                                <span className="text-sm font-semibold">Real-time Hasil Analisis</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 mt-8 pt-6 border-t border-white/20 text-xs text-teal-100 font-medium">
                        Dipercaya oleh ratusan pasien & divalidasi oleh dokter paru spesialis.
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="col-span-12 md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center md:text-left mb-6">
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 border border-teal-100/50 shadow-inner md:mx-0 mx-auto">
                            <LogIn className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Selamat Datang</h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">Masuk untuk memulai konsultasi Anda</p>
                    </div>
                    
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 text-sm font-semibold border border-rose-100/50">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                    <User className="w-5 h-5" />
                                </span>
                                <input 
                                    type="text" 
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 font-semibold transition-all duration-300 text-sm"
                                    placeholder="Masukkan username..."
                                    value={username} 
                                    onChange={e => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </span>
                                <input 
                                    type="password" 
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 font-semibold transition-all duration-300 text-sm"
                                    placeholder="Masukkan password..."
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md shadow-teal-100 hover:shadow-lg hover:shadow-teal-200 text-sm"
                        >
                            Masuk Sekarang
                        </button>
                    </form>
                    
                    <p className="text-center md:text-left mt-6 text-slate-500 text-xs font-medium">
                        Belum punya akun? <Link href="/register" className="text-teal-600 font-bold hover:underline">Daftar di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
