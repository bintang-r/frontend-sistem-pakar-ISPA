'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, User, Mail, Lock, Stethoscope, ShieldCheck, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '' });
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuthStore();
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
            await api.post('auth/register/', formData);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.username?.[0] || 'Pendaftaran gagal. Silakan coba lagi.');
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
                        <h2 className="text-2xl font-extrabold leading-tight mb-4">Buat Akun Anda</h2>
                        <p className="text-teal-100 text-sm leading-relaxed mb-6">
                            Lakukan registrasi untuk menyimpan riwayat konsultasi medis Anda dan memantau status diagnosa kesehatan secara berkala.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-teal-200" />
                                </div>
                                <span className="text-sm font-semibold">Simpan Riwayat Konsultasi</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-teal-200" />
                                </div>
                                <span className="text-sm font-semibold">Pantau Kesehatan Pernapasan</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 mt-8 pt-6 border-t border-white/20 text-xs text-teal-100 font-medium">
                        Proses pembuatan akun mudah dan cepat, kurang dari 1 menit.
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="col-span-12 md:col-span-7 p-8 md:p-10 flex flex-col justify-center">
                    <div className="text-center md:text-left mb-6">
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 border border-teal-100/50 shadow-inner md:mx-0 mx-auto">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Daftar Akun Baru</h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">Buat akun untuk memulai konsultasi gejala ISPA</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 text-sm font-semibold border border-rose-100/50">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Nama Lengkap</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                        <User className="w-4 h-4" />
                                    </span>
                                    <input 
                                        type="text" 
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 font-semibold transition-all duration-300 text-xs"
                                        placeholder="Nama lengkap..."
                                        value={formData.full_name} 
                                        onChange={e => setFormData({...formData, full_name: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Username</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                        <User className="w-4 h-4" />
                                    </span>
                                    <input 
                                        type="text" 
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 font-semibold transition-all duration-300 text-xs"
                                        placeholder="Username..."
                                        value={formData.username} 
                                        onChange={e => setFormData({...formData, username: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                        <Mail className="w-4 h-4" />
                                    </span>
                                    <input 
                                        type="email" 
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 font-semibold transition-all duration-300 text-xs"
                                        placeholder="nama@email.com..."
                                        value={formData.email} 
                                        onChange={e => setFormData({...formData, email: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <input 
                                        type="password" 
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 font-semibold transition-all duration-300 text-xs"
                                        placeholder="Password..."
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md shadow-teal-100 hover:shadow-lg hover:shadow-teal-200 text-xs"
                        >
                            Daftar Akun
                        </button>
                    </form>
                    
                    <p className="text-center md:text-left mt-6 text-slate-500 text-xs font-medium">
                        Sudah punya akun? <Link href="/login" className="text-teal-600 font-bold hover:underline">Login di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
