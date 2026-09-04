import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header';
import ProducerHeader from '../components/ProducerHeader';

export default function ChatbotPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Re-Source AI assistant. How can I help you optimize your industrial symbiosis today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Added loading state

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const isProducer = user?.role === 'producer';
    const isAdmin = user?.role === 'admin';

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userText = inputValue.trim();
        setInputValue("");

        const newUserMsg = { id: Date.now(), text: userText, sender: 'user' };
        const updatedMessages = [...messages, newUserMsg];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Filter out the initial bot greeting (id: 1) so history starts with a 'user' role
            const historyForAPI = updatedMessages
                .filter(msg => msg.id !== 1)
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                }));

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}chatbot`, {
                messages: historyForAPI
            });

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: response.data.reply,
                sender: 'bot'
            }]);

        } catch (error) {
            console.error("Chat API Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Protocol Error: Unable to reach the AI mainframe.",
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col font-sans text-white overflow-hidden relative">
            <div className="bg-grain"></div>

            {/* ── Colorful 3D Ambient Elements ── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: '1200px' }}>

                {/* Large rotating emerald cube — top right */}
                <motion.div
                    animate={{ rotateY: [0, 360], rotateX: [0, 20, -20, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute -top-20 -right-20 w-96 h-96 opacity-60"
                >
                    <div className="w-full h-full rounded-3xl border-2 border-emerald-400/70 bg-gradient-to-br from-emerald-500/40 to-teal-500/20 shadow-[inset_0_0_80px_rgba(16,185,129,0.4),0_0_80px_rgba(16,185,129,0.3)]" />
                </motion.div>

                {/* Medium purple orb — left mid */}
                <motion.div
                    animate={{ rotateZ: [0, 360], rotateX: [15, -15, 15], y: [0, -30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute top-[28%] -left-16 w-72 h-72 opacity-55"
                >
                    <div className="w-full h-full rounded-full border border-purple-400/60 bg-gradient-to-br from-purple-500/40 via-violet-500/30 to-transparent shadow-[0_0_100px_rgba(168,85,247,0.4)]" />
                </motion.div>

                {/* Small spinning cyan diamond — bottom left */}
                <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute bottom-[15%] left-[8%] w-44 h-44 opacity-60"
                >
                    <div className="w-full h-full rotate-45 border-2 border-cyan-400/70 bg-gradient-to-br from-cyan-400/35 to-blue-500/20 shadow-[0_0_60px_rgba(34,211,238,0.5),inset_0_0_40px_rgba(34,211,238,0.2)]" />
                </motion.div>

                {/* Floating teal orb — top left area */}
                <motion.div
                    animate={{ y: [0, -50, 0], x: [0, 20, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[8%] left-[18%] w-64 h-64 opacity-50"
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400/50 to-emerald-600/25 blur-2xl" />
                </motion.div>

                {/* Glowing amber accent ring — bottom right */}
                <motion.div
                    animate={{ rotateX: [30, -30, 30], rotateY: [0, 180, 360], scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute -bottom-10 right-[12%] w-60 h-60 opacity-55"
                >
                    <div className="w-full h-full rounded-full border-2 border-amber-400/60 bg-gradient-to-t from-amber-500/30 to-orange-400/15 shadow-[0_0_80px_rgba(251,191,36,0.4),inset_0_0_40px_rgba(251,191,36,0.15)]" />
                </motion.div>

                {/* Concentric ring system — center background */}
                <motion.div
                    animate={{ rotateZ: [0, 360] }}
                    transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                    style={{ transformStyle: 'preserve-3d', rotateX: '60deg' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] opacity-20"
                >
                    <div className="w-full h-full rounded-full border border-white/50" />
                    <div className="absolute inset-8 rounded-full border-2 border-emerald-400/80" />
                    <div className="absolute inset-20 rounded-full border border-purple-400/60" />
                    <div className="absolute inset-32 rounded-full border border-cyan-400/50" />
                </motion.div>

                {/* Indigo bloom — top center */}
                <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px]"
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-indigo-500/50 to-transparent blur-[80px]" />
                </motion.div>

                {/* Extra: pink accent — center right */}
                <motion.div
                    animate={{ y: [0, 30, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute top-[45%] right-[5%] w-48 h-48"
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-500/40 to-pink-600/20 blur-2xl shadow-[0_0_60px_rgba(244,63,94,0.3)]" />
                </motion.div>
            </div>


            {/* Admin Back Button */}
            {isAdmin && (
                <div className="relative z-50 px-8 pt-8">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 px-6 py-4 bg-white/[0.04] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 rounded-2xl text-neutral-300 hover:text-emerald-400 transition-all duration-300 group shadow-xl"
                    >
                        <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-emerald-500/10 border border-white/10 group-hover:border-emerald-500/20 flex items-center justify-center transition-all duration-300">
                            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
                        </div>
                        <span className="text-base font-semibold tracking-tight">Back to Dashboard</span>
                    </motion.button>
                </div>
            )}

            {/* Header — hidden for admin users */}
            {!isAdmin && (
                <div className="relative z-50">
                    {isProducer ? <ProducerHeader /> : <Header />}
                </div>
            )}

            {/* Chat Area */}
            <div className={`relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 md:px-6 ${isAdmin ? 'pt-8' : 'pt-32'} pb-24 overflow-hidden`}>
                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className={`flex gap-4 md:gap-6 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform hover:scale-110 ${msg.sender === 'user'
                                ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                                : 'bg-white/5 border border-white/10 text-emerald-400 backdrop-blur-xl'
                                }`}>
                                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>

                            <div className={`relative px-6 py-4 md:px-8 md:py-5 rounded-[2rem] max-w-[85%] md:max-w-[70%] leading-relaxed shadow-2xl backdrop-blur-3xl border transition-all hover:bg-white/[0.08] ${msg.sender === 'user'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-50 rounded-tr-none'
                                : 'bg-white/[0.04] border-white/10 text-neutral-200 rounded-tl-none'
                                }`}>
                                <p className="text-base md:text-lg font-medium tracking-tight whitespace-pre-wrap">
                                    {msg.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 md:gap-6"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl bg-white/5 border border-white/10 text-emerald-400 backdrop-blur-xl">
                                <Bot size={20} className="animate-pulse" />
                            </div>
                            <div className="relative px-6 py-4 md:px-8 md:py-5 rounded-[2rem] bg-white/[0.04] border border-white/10 text-neutral-400 rounded-tl-none flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm font-medium tracking-widest uppercase font-mono">Analyzing...</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="relative z-20 w-full max-w-4xl mx-auto px-4 pb-8">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-2 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden group"
                >
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                            placeholder={isLoading ? "Please wait..." : "Type your message to AI assistant..."}
                            className="flex-1 pl-8 pr-16 py-5 md:py-6 bg-transparent border-none focus:outline-none text-base md:text-lg font-medium text-white placeholder:text-neutral-500 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="absolute right-2.5 w-11 h-11 md:w-12 md:h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-black rounded-full flex items-center justify-center transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group-hover:scale-105"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin md:w-5 md:h-5" /> : <Send size={18} className="md:w-5 md:h-5" />}
                        </button>
                    </form>
                </motion.div>

                {/* Floating Decoration */}
                <p className="mt-4 text-[10px] text-center font-bold text-neutral-600 uppercase tracking-[0.3em] font-mono">
                    Re-Source AI Network Protocol Active
                </p>
            </div>
        </div>
    );
}