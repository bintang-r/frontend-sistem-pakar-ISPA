import Link from 'next/link';
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
