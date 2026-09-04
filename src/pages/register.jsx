/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { TbRecycle } from "react-icons/tb";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'customer' // Default role
    });
    const [documentFile, setDocumentFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleRegister(e) {
        e.preventDefault();

        if (!documentFile) {
            toast.error("Verification document is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert file to Base64 string
            const reader = new FileReader();
            reader.readAsDataURL(documentFile);
            
            reader.onload = async () => {
                const documentData = reader.result;
                
                const submissionData = {
                    ...formData,
                    documentData,
                };

                try {
                    await axios.post(import.meta.env.VITE_BACKEND_URL + "users", submissionData);
                    toast.success("Registration submitted! Pending admin approval.");
                    navigate('/login');
                } catch (e) {
                    toast.error(e.response?.data?.message || "Registration failed. Please try again.");
                    setIsSubmitting(false);
                }
            };
            
            reader.onerror = (error) => {
                toast.error("Error reading verification document.");
                setIsSubmitting(false);
            };

        } catch (error) {
            toast.error("An unexpected error occurred.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans overflow-hidden bg-neutral-950 selection:bg-emerald-500/30 selection:text-emerald-400">
            
            {/* --- Left Column: Premium Imagery --- */}
            <div className="hidden lg:block relative w-full h-full order-2 lg:order-1">
                <img 
                    src="/assets/auth/register_bg.png" 
                    alt="Sustainable Future Rendering" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/40 to-neutral-950"></div>
                <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                
                {/* --- System Branding overlaid on Image --- */}
                <div className="absolute top-10 left-10 z-20 flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
                    <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-500">
                        <TbRecycle size={32} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-3xl font-bricolage tracking-tighter text-white drop-shadow-lg">Re<span className="text-emerald-500">-Source</span></span>
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em] mt-0.5 font-mono drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                            Connecting the Circular Economy
                        </span>
                    </div>
                </div>
            </div>

            {/* --- Right Column: The Form --- */}
            <div className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 py-20 md:px-16 lg:px-12 xl:px-20 bg-neutral-950 order-1 lg:order-2">
                
                {/* Mobile Branding */}
                <div className="lg:hidden absolute top-8 left-8 z-20 flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-black shadow-lg shadow-emerald-500/20">
                        <TbRecycle size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-2xl font-bricolage tracking-tighter text-white">Re<span className="text-emerald-500">-Source</span></span>
                    </div>
                </div>

                <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay pointer-events-none"></div>

                {/* --- Glass Card --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 w-full max-w-lg lg:max-w-md xl:max-w-lg p-10 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-3xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-500 overflow-hidden group"
                >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000"></div>

                <div className="text-left mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6 font-mono">
                        Create Account
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 font-display tracking-tight leading-tight">Create Account</h1>
                    <p className="text-neutral-400 text-base font-medium tracking-normal">Join the network and manage resources.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">

                    {/* --- Role Selection --- */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 backdrop-blur-sm border border-white/5">
                        {['customer', 'producer'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setFormData({ ...formData, role })}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${formData.role === role
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-300 ml-1">First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="E.g. John"
                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all text-base"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-300 ml-1">Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="E.g. Doe"
                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all text-base"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-300 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all text-base"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-300 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all text-base"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-300 ml-1">Verification Document</label>
                        <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => setDocumentFile(e.target.files[0])}
                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                            required
                        />
                        <p className="text-xs text-neutral-500 ml-1">Required for admin approval (Business Registration or ID).</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 mt-4 bg-emerald-500 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-neutral-400 font-medium">
                    Already have an account? <Link to="/login" className="text-emerald-500 font-bold hover:underline ml-1">Sign in</Link>
                </p>

                </motion.div>
            </div>
        </div>
    );
}