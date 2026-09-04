/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiKey, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function ForgetPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Step 1: Send OTP
    async function sendOtp(e) {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        setIsLoading(true);
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "users/sent-otp", { email });
            toast.success("OTP sent! Check your inbox.");
            setStep(2);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    }

    // Step 2: Verify & Reset
    async function verifyAndReset(e) {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            return toast.error("Please fill all fields");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            const otpInNumberFormat = parseInt(otp, 10);
            await axios.post(import.meta.env.VITE_BACKEND_URL + "users/reset-password", {
                email,
                otp: otpInNumberFormat,
                newPassword,
            });

            toast.success("Password reset successfully!");
            navigate("/login");

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid OTP or Error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-neutral-950 font-sans p-4 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
            <div className="bg-grain"></div>
            <div className="liquid-glass-container">
                <div className="liquid-blob blob-1"></div>
                <div className="liquid-blob blob-2"></div>
            </div>

            {/* --- System Branding --- */}
            <div className="absolute top-10 left-10 z-20 flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-500">
                    <TbRecycle size={32} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-3xl font-bricolage tracking-tighter text-white">Re<span className="text-emerald-500">-Source</span></span>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em] mt-0.5 font-mono">
                        INDUSTRIAL_NEXUS_V2
                    </span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-lg bg-neutral-900/40 backdrop-blur-3xl border border-white/5 p-12 md:p-16 rounded-[3.5rem] shadow-2xl overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000"></div>

                <div className="text-left mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6 font-mono">
                        {step === 1 ? "AUTHORIZATION_RECOVERY" : "CREDENTIAL_RECONFIGURATION"}
                    </div>
                    <h2 className="text-5xl font-bold text-white font-bricolage tracking-tighter uppercase leading-none">
                        {step === 1 ? "Recovery" : "Update"}
                    </h2>
                    <p className="text-neutral-400 text-lg mt-4 font-light tracking-tight">
                        {step === 1
                            ? "Initiate secure key reset sequence."
                            : `Validating transmission to ${email}`
                        }
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={sendOtp}
                            className="space-y-8"
                        >
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-[0.3em] font-mono">Discovery_Target</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-neutral-600 group-focus-within:text-emerald-500 transition-colors">
                                        <FiMail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="entity@network.io"
                                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-neutral-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-lg font-light tracking-wide"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 bg-emerald-500 text-black font-extrabold rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-[0.2em] font-mono flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : "INITIALIZE_RECOVERY"}
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={verifyAndReset}
                            className="space-y-6"
                        >
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-[0.3em] font-mono">Auth_Factor_Alpha</label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-center text-3xl font-bold tracking-[0.5em] text-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm font-mono"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-[0.3em] font-mono">New_Key</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-[0.3em] font-mono">Verify_Key</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 bg-emerald-500 text-black font-extrabold rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all disabled:opacity-50 flex justify-center items-center gap-4 text-sm uppercase tracking-[0.2em] font-mono"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <FiCheckCircle size={20} /> EXECUTE_RESET
                                    </>
                                )}
                            </motion.button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full py-3 text-neutral-500 font-bold hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
                            >
                                RE_INITIALIZE_TRANSMISSION
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <Link to="/login" className="inline-flex items-center gap-3 text-xs font-bold text-neutral-400 hover:text-emerald-400 transition-all uppercase tracking-widest font-mono">
                        <FiArrowLeft /> RETREAT_TO_LOGIN
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}