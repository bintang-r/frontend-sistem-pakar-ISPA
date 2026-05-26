'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Activity, Clock, FileText, PlusCircle, User as UserIcon, MessageSquare, CheckCircle, Camera, Upload } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Dashboard() {
    const { user, login } = useAuthStore();
    const [history, setHistory] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'history' | 'profile' | 'testimonial'>('history');

    // Profile state
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileMsg, setProfileMsg] = useState('');
    const [profileMsgType, setProfileMsgType] = useState<'success' | 'error'>('success');

    // Avatar state
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        (user as any)?.profile_picture ? `${BACKEND_URL}${(user as any).profile_picture}` : null
    );
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Testimonial state
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [testiMsg, setTestiMsg] = useState('');
    const [hasSubmittedTesti, setHasSubmittedTesti] = useState(false);

    useEffect(() => {
        api.get('consultations/').then(res => setHistory(res.data)).catch(console.error);
        api.get('testimonials/').then(res => {
            if (res.data.some((t: any) => t.user_name === user?.full_name)) {
                setHasSubmittedTesti(true);
            }
        }).catch(console.error);
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;
        setIsUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('profile_picture', avatarFile);
            const res = await api.patch('auth/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            login(res.data, localStorage.getItem('access_token') || '');
            setProfileMsg('Foto profil berhasil diperbarui!');
            setProfileMsgType('success');
            setAvatarFile(null);
            setTimeout(() => setProfileMsg(''), 3000);
        } catch (err) {
            setProfileMsg('Gagal mengupload foto.');
            setProfileMsgType('error');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.patch('auth/profile/', { full_name: fullName, email });
            login(res.data, localStorage.getItem('access_token') || '');
            setProfileMsg('Profil berhasil diperbarui!');
            setProfileMsgType('success');
            setTimeout(() => setProfileMsg(''), 3000);
        } catch (err) {
            setProfileMsg('Gagal memperbarui profil.');
            setProfileMsgType('error');
        }
    };

    const handleSubmitTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('testimonials/', { rating, content });
            setTestiMsg('Testimonial submitted! Thank you.');
            setHasSubmittedTesti(true);
        } catch (err: any) {
            setTestiMsg(err.response?.data?.[0] || 'Failed to submit or already submitted.');
        }
    };

    const currentAvatar = (user as any)?.profile_picture
        ? `${BACKEND_URL}${(user as any).profile_picture}`
        : null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 px-4 md:px-8 py-8">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    {/* Avatar in header */}
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shrink-0">
                        {currentAvatar ? (
                            <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-7 h-7 text-emerald-500" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-0.5">Welcome back, <span className="text-emerald-600 font-semibold">{user?.full_name}</span></p>
                    </div>
                </div>
                <Link href="/consultation" className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                    <PlusCircle className="w-5 h-5" /> New Consultation
                </Link>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Activity /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Consultations</p>
                        <h2 className="text-2xl font-bold text-slate-900">{history.length}</h2>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button onClick={() => setActiveTab('history')} className={`pb-3 font-semibold transition-colors ${activeTab === 'history' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>
                    History
                </button>
                <button onClick={() => setActiveTab('profile')} className={`pb-3 font-semibold transition-colors ${activeTab === 'profile' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>
                    Profile
                </button>
                <button onClick={() => setActiveTab('testimonial')} className={`pb-3 font-semibold transition-colors ${activeTab === 'testimonial' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>
                    Testimonial
                </button>
            </div>

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <h3 className="font-bold text-lg text-slate-800">Recent History</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No consultations yet.</div>
                        ) : (
                            history.map((item: any) => (
                                <Link href={`/result/${item.id}`} key={item.id} className="block hover:bg-slate-50 transition p-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.final_diagnosis}</p>
                                                <p className="text-sm text-slate-500">{new Date(item.consultation_date).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                                            {item.confidence_result}%
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="max-w-2xl space-y-6">
                    {profileMsg && (
                        <div className={`p-3 rounded-lg text-sm font-medium border ${profileMsgType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {profileMsg}
                        </div>
                    )}

                    {/* Avatar Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Camera className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-lg text-slate-800">Foto Profil</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Avatar Preview */}
                            <div className="relative group shrink-0">
                                <div className="w-28 h-28 rounded-full overflow-hidden bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shadow-md">
                                    {avatarPreview || currentAvatar ? (
                                        <img
                                            src={avatarPreview || currentAvatar || ''}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-12 h-12 text-emerald-300" />
                                    )}
                                </div>
                                {/* Overlay on hover */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 text-center sm:text-left">
                                <div>
                                    <p className="font-semibold text-slate-800">{user?.full_name}</p>
                                    <p className="text-sm text-slate-500">{user?.email}</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                                    >
                                        <Camera className="w-4 h-4" /> Pilih Foto
                                    </button>
                                    {avatarFile && (
                                        <button
                                            type="button"
                                            onClick={handleUploadAvatar}
                                            disabled={isUploadingAvatar}
                                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {isUploadingAvatar ? 'Mengupload...' : 'Upload Foto'}
                                        </button>
                                    )}
                                </div>
                                {avatarFile && (
                                    <p className="text-xs text-slate-400">File: {avatarFile.name}</p>
                                )}
                                <p className="text-xs text-slate-400">Format: JPG, PNG, WEBP. Maks 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <UserIcon className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-lg text-slate-800">Informasi Akun</h3>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                                />
                            </div>
                            <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition">
                                Simpan Perubahan
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Testimonial Tab */}
            {activeTab === 'testimonial' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="w-5 h-5 text-slate-400" />
                        <h3 className="font-bold text-lg text-slate-800">Your Testimonial</h3>
                    </div>
                    {hasSubmittedTesti ? (
                        <div className="p-8 text-center bg-emerald-50 border border-emerald-100 rounded-xl">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                            <h4 className="font-bold text-emerald-800">Thank you!</h4>
                            <p className="text-emerald-600 text-sm mt-1">You have already submitted a testimonial.</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl">
                            <p className="text-slate-500">You must complete at least one consultation before submitting a testimonial.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                            {testiMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">{testiMsg}</div>}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}>★</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
                                <textarea value={content} onChange={e => setContent(e.target.value)} required rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="How did the system help you?"></textarea>
                            </div>
                            <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Submit Testimonial</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
