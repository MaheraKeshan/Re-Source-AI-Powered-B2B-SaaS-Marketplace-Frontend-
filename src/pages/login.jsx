/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { GrGoogle, GrGithub, GrFacebookOption } from "react-icons/gr";
import { TbRecycle } from "react-icons/tb";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { parseJwt } from "../utils/auth";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRedirect = (role) => {
        switch (role) {
            case "admin": navigate("/admin"); break;
            case "rdc_staff": navigate("/staff/rdc"); break;
            case "logistics": navigate("/staff/logistics"); break;
            case "producer": navigate("/producer"); break; // ✅ Added Producer Redirect
            default: navigate("/");
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            const accessToken = response.access_token;
            try {
                setIsLoading(true);
                const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "users/login/google", { accessToken });
                localStorage.setItem("token", res.data.token);
                if (res.data.user) {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                } else {
                    const decodedUser = parseJwt(res.data.token);
                    if (decodedUser) {
                        localStorage.setItem("user", JSON.stringify(decodedUser));
                    }
                }

                const userRole = res.data.role || parseJwt(res.data.token)?.role;

                toast.success("Welcome back!");
                handleRedirect(userRole);
            } catch (error) {
                toast.error(error.response?.data?.message || "Google login failed");
            } finally {
                setIsLoading(false);
            }
        }
    });

    async function handleLogin(e) {
        if (e) e.preventDefault();
        if (!email || !password) return toast.error("Please fill in all fields");

        try {
            setIsLoading(true);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "users/login", { email, password });
            localStorage.setItem("token", response.data.token);
            if (response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            } else {
                const decodedUser = parseJwt(response.data.token);
                if (decodedUser) {
                    localStorage.setItem("user", JSON.stringify(decodedUser));
                } else {
                    toast.error("Login failed: Unable to retrieve user details");
                    return;
                }
            }

            const userRole = response.data.role || parseJwt(response.data.token)?.role;

            toast.success("Login successful");
            handleRedirect(userRole);
        } catch (e) {
            toast.error(e.response?.data?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans overflow-hidden bg-neutral-950 selection:bg-emerald-500/30 selection:text-emerald-400">
            
            {/* --- Left Column: Premium Imagery --- */}
            <div className="hidden lg:block relative w-full h-full">
                <img 
                    src="/assets/auth/login_bg.png" 
                    alt="Circular Economy Radiant Design" 
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
            <div className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 py-20 md:px-16 lg:px-16 bg-neutral-950">
                
                {/* Mobile Branding (hidden on large screens) */}
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
                    className="relative z-10 w-full max-w-md p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-3xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-500 overflow-hidden group"
                >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000"></div>

                <div className="text-left mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6 font-mono">
                        Login
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 font-display tracking-tight leading-tight">Welcome Back</h1>
                    <p className="text-neutral-400 text-base font-medium tracking-normal">Access your account to continue.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-300 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all text-base"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-semibold text-neutral-300 ml-1">Password</label>
                            <Link to="/forget-password" class="text-sm font-semibold text-neutral-400 hover:text-emerald-400 transition-colors">Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all text-base"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 mt-2 bg-emerald-500 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </motion.button>
                </form>

                <div className="mt-12">
                    <div className="relative flex items-center justify-center mb-8">
                        <div className="absolute inset-x-0 h-px bg-white/5"></div>
                        <span className="relative px-4 bg-transparent text-sm font-semibold text-neutral-500">Or continue with</span>
                    </div>

                    <div className="flex justify-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.1, y: -4 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => !isLoading && googleLogin()}
                            className="w-16 h-16 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
                        >
                            <GrGoogle size={24} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, y: -4 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-black hover:text-white transition-all duration-500 shadow-xl"
                        >
                            <GrGithub size={24} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, y: -4 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] hover:text-white transition-all duration-500 shadow-xl"
                        >
                            <GrFacebookOption size={24} />
                        </motion.button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-neutral-400 font-medium">
                    Don't have an account? <Link to="/register" className="text-emerald-500 font-bold hover:underline ml-1">Register</Link>
                </p>

                </motion.div>
            </div>
        </div>
    );
}
