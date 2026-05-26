import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# API
write_file("src/lib/api.ts", """import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
""")

# Store
write_file("src/store/authStore.ts", """import { create } from 'zustand';

interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user, token) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: () => {
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({ user: JSON.parse(user), isAuthenticated: true });
        }
    }
}));
""")

# Global Layout
write_file("src/app/layout.tsx", """import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISPA Expert System",
  description: "Early Diagnosis of Acute Respiratory Infection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
""")

# Navbar
write_file("src/components/Navbar.tsx", """'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { Stethoscope, LogOut, User, Activity } from 'lucide-react';

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
                    <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                        <Stethoscope className="w-8 h-8" />
                        <span>ISPA<span className="text-slate-800">Diag</span></span>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1"><Activity className="w-4 h-4"/> Dashboard</Link>
                                <Link href="/consultation" className="text-slate-600 hover:text-blue-600 font-medium">Consultation</Link>
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
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
                                <Link href="/login" className="text-slate-600 hover:text-blue-600 font-medium">Login</Link>
                                <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-md shadow-blue-200">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
""")

# Landing Page
write_file("src/app/page.tsx", """import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8 border border-blue-100">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        AI-Powered Diagnosis Engine
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl leading-tight">
        Early Detection of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Respiratory Infections</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
        Our expert system analyzes your symptoms using forward chaining and certainty factors to provide an accurate early diagnosis of Acute Respiratory Infections (ISPA).
      </p>
      
      <div className="flex gap-4">
        <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-1 flex items-center gap-2">
          Start Consultation <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/login" className="bg-white text-slate-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 transition-all border border-slate-200 hover:-translate-y-1">
          Login to Account
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">High Accuracy</h3>
          <p className="text-slate-600">Built upon knowledge from multiple respiratory experts using certainty factors.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-md transition">
          <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Instant Results</h3>
          <p className="text-slate-600">Get immediate diagnostic feedback and recommended actions.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-md transition">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Track History</h3>
          <p className="text-slate-600">Keep a record of your past consultations and symptom history.</p>
        </div>
      </div>
    </div>
  );
}
""")

print("Base files generated")
