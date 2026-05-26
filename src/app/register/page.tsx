'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('auth/register/', formData);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.username?.[0] || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
                <p className="text-slate-500 mt-2">Join to start consultations</p>
            </div>

            {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-sm border border-rose-100">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition"
                        value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition"
                        value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition"
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 mt-6">
                    Sign Up
                </button>
            </form>
            <p className="text-center mt-6 text-slate-500 text-sm">
                Already have an account? <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Login</Link>
            </p>
        </div>
    );
}
