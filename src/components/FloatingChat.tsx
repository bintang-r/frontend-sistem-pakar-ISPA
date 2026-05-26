'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { MessageSquare, X, Send } from 'lucide-react';

export default function FloatingChat() {
    const { isAuthenticated, user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [unread, setUnread] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<any>(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role === 'admin') return;

        // Initial fetch to check for unread messages
        fetchMessages(false);

        // Periodically poll messages
        const interval = setInterval(() => {
            fetchMessages(isOpen);
        }, 4000);
        pollingIntervalRef.current = interval;

        return () => clearInterval(interval);
    }, [isAuthenticated, user, isOpen]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setUnread(0);
        }
    }, [messages, isOpen]);

    const fetchMessages = async (shouldScroll: boolean) => {
        try {
            const res = await api.get('chats/');
            setMessages(res.data);
            
            // Check for new messages if chat is closed
            if (!isOpen && res.data.length > 0) {
                const lastMsg = res.data[res.data.length - 1];
                if (lastMsg.sender_role === 'admin' && !lastMsg.is_read) {
                    setUnread(prev => prev + 1);
                }
            }
        } catch (err) {
            console.error('Error polling chat:', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input;
        setInput('');

        // Optimistic append
        const tempMsg = {
            id: Date.now(),
            sender: user?.id,
            sender_name: user?.full_name,
            sender_role: 'user',
            content,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        scrollToBottom();

        try {
            const res = await api.post('chats/', { content });
            // Replace with actual database msg
            setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.data : m));
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    if (!isAuthenticated || user?.role === 'admin') return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans print:hidden">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-[350px] h-[450px] rounded-3xl shadow-2xl border border-slate-150 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 text-white flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                                D
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Konsultasi Medis</h3>
                                <p className="text-[10px] text-teal-100 font-medium">Tanyakan gejala Anda kepada Dokter Pakar</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                                <MessageSquare className="w-8 h-8 mb-2 opacity-55 text-teal-500" />
                                <p className="text-xs font-semibold">Belum ada percakapan</p>
                                <p className="text-[10px] max-w-[180px] mt-0.5">Tulis pesan Anda untuk memulai konsultasi chat dengan dokter pakar kami.</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isAdmin = msg.sender_role === 'admin';
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${
                                            isAdmin 
                                                ? 'bg-white border border-slate-150 text-slate-800 rounded-tl-none' 
                                                : 'bg-teal-500 text-white rounded-tr-none shadow-md shadow-teal-100'
                                        }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Tulis pesan..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-slate-800"
                        />
                        <button type="submit" className="bg-teal-500 text-white p-2.5 rounded-xl hover:bg-teal-600 transition shadow-md shadow-teal-100 hover:scale-105 active:scale-95">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Bubble Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-4 shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center relative border border-teal-400/30"
            >
                <MessageSquare className="w-6 h-6" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                        {unread}
                    </span>
                )}
            </button>
        </div>
    );
}
