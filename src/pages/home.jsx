/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Search,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    PlayCircle,
    Recycle,
    Factory,
    Zap,
    Cpu
} from "lucide-react";

// Assuming these components exist in your project structure
import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverviewPage from "./client/productOverviewPage";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkOut";
import SearchProductPage from "./client/searchProducts";
import AboutPage from "./client/about";
import ProductReviewsPage from "./client/reviews";
import TrackOrderPage from "./client/TrackOrderPage";
import CustomerOrderPage from "./client/CustomerOrderPage";

// VELOS-Style Animation Variants
const cinematicUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

export default function HomePage() {
    return (
        <>
            <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-50 font-sans w-full overflow-x-hidden selection:bg-white/20 selection:text-white relative">
                <div className="bg-grain"></div>
                <Header />

                <main className="flex-1 w-full relative z-10">
                    <Routes>
                        <Route path="/" element={<HomeLanding />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/overview/:id" element={<ProductOverviewPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/search" element={<SearchProductPage />} />
                        <Route path="/review" element={<ProductReviewsPage />} />
                        <Route path="/track-order" element={<TrackOrderPage />} />
                        <Route path="/customer-order" element={<CustomerOrderPage />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

function HomeLanding() {
    return (
        <div className="w-full relative">

            {/* ======== FULL-PAGE ANIMATED BACKGROUND ======== */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Slow-drifting large gradient orbs */}
                <div className="home-orb orb-a"></div>
                <div className="home-orb orb-b"></div>
                <div className="home-orb orb-c"></div>

                {/* Subtle animated grid */}
                <div className="home-grid"></div>

                {/* Floating particles */}
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="home-particle"
                        style={{
                            left: `${5 + (i * 5.5) % 95}%`,
                            top: `${10 + (i * 7.3) % 85}%`,
                            width: i % 3 === 0 ? "3px" : i % 3 === 1 ? "2px" : "1.5px",
                            height: i % 3 === 0 ? "3px" : i % 3 === 1 ? "2px" : "1.5px",
                            animationDelay: `${(i * 0.7) % 8}s`,
                            animationDuration: `${6 + (i * 1.1) % 6}s`,
                            opacity: i % 4 === 0 ? 0.6 : 0.3,
                        }}
                    />
                ))}
            </div>
            {/* =============================================== */}



            {/* HERO SECTION */}
            <header className="relative w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-24 min-h-screen md:h-screen pt-32">
                {/* Cinematic Background Image (Base Layer) */}
                <div className="absolute inset-0 z-0 bg-black">
                    {/* Using the dark industrial image from Option 1 */}
                    <img
                        src="https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=3840&auto=format&fit=crop"
                        className="w-full h-full object-cover animate-cinematic opacity-0"
                        alt="Industrial Infrastructure"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/20 opacity-90"></div>
                </div>

                {/* --- LIQUID GLASS EFFECT LAYERS --- */}
                <div className="liquid-glass-container">
                    {/* The moving liquid blobs */}
                    <div className="liquid-blob blob-1"></div>
                    <div className="liquid-blob blob-2"></div>
                </div>
                {/* The refractive glass pane sitting on top of the blobs but behind text */}
                <div className="glass-overlay"></div>
                {/* ---------------------------------- */}


                {/* Floating Data Point */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 1 }}
                    className="absolute top-32 right-6 md:right-12 z-20 flex flex-col items-end gap-2"
                >
                    <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3 shadow-2xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-mono tracking-wider uppercase text-white/90">v2.0 Live: AI Negotiation</span>
                    </div>
                </motion.div>

                <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

                    {/* Left Column: Primary Headline */}
                    <div className="md:col-span-7 relative">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-8 bg-white/60"></span>
                            <span className="text-xs font-mono uppercase tracking-widest text-white/80">Est. 2024</span>
                        </motion.div>

                        <h1 className="font-bricolage text-white leading-[0.85] tracking-tight font-semibold">
                            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1 }} className="block text-[15vw] md:text-[9rem] lg:text-[11rem] drop-shadow-2xl">
                                RE
                            </motion.span>
                            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }} className="flex items-baseline gap-4 md:gap-8 -mt-2 md:-mt-8">
                                <span className="text-[15vw] md:text-[9rem] lg:text-[11rem] font-serif italic font-thin text-white/60 opacity-50 blur-[1px]">
                                    -
                                </span>
                                <span className="text-[15vw] md:text-[9rem] lg:text-[11rem] text-white drop-shadow-2xl">
                                    SOURCE
                                </span>
                            </motion.div>
                        </h1>
                    </div>

                    {/* Right Column: Description & Specs */}
                    <div className="md:col-span-4 md:col-start-9 flex flex-col justify-end pb-4 md:pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 1 }}
                            className="overflow-hidden md:p-8 bg-neutral-950/60 border border-white/10 rounded-2xl ring-1 ring-white/5 p-6 relative shadow-2xl backdrop-blur-xl"
                        >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none animate-shimmer-effect"></div>
                            <div className="relative z-10">
                                <p className="text-lg md:text-xl text-white font-light leading-relaxed mb-8 antialiased">
                                    We bring transparency to industrial byproducts. A centralized network to reduce waste costs and connect with buyers autonomously.
                                </p>
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                                        <div>
                                            <span className="block text-xs uppercase tracking-widest text-neutral-300 mb-1">Waste Redirected</span>
                                            <span className="text-2xl font-bricolage text-white">30%</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase tracking-widest text-neutral-300 mb-1">Active Streams</span>
                                            <span className="text-2xl font-bricolage text-white">842</span>
                                        </div>
                                    </div>
                                    <Link to="/products" className="group flex items-center justify-between w-full p-1 border-b border-white/30 hover:border-white transition-colors pb-2">
                                        <span className="text-sm font-medium tracking-wide text-white">Start Free Trial</span>
                                        <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicators */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-white/80 font-mono">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                </motion.div>
            </header>

            {/* SEPARATOR SYNC LOG */}
            <div className="w-full bg-neutral-950 py-12 flex items-center justify-center relative z-20 overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10"></div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent w-3/4 mx-auto"></div>
                <div className="relative bg-neutral-950 p-3 border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse"></div>
                </div>
            </div>

            {/* VALUE PROPOSITION (Core Systems Style) */}
            <section className="py-32 bg-black relative overflow-hidden border-t border-white/5" id="features">
                <div className="z-10 max-w-7xl mr-auto ml-auto pr-6 pl-6 relative">

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div className="max-w-2xl">
                            <motion.div variants={cinematicUp} className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-[1px] bg-white/20"></div>
                                <span className="text-xs font-mono uppercase tracking-widest text-white/70">System Architecture</span>
                            </motion.div>
                            <motion.h2 variants={cinematicUp} className="text-5xl md:text-7xl font-bricolage text-white mb-6 tracking-tighter leading-none">
                                Core Value
                            </motion.h2>
                            <motion.p variants={cinematicUp} className="text-lg text-white/50 font-light leading-relaxed max-w-lg">
                                Infrastructure engineered to ensure no industrial material is landfilled unnecessarily. Closing the loop with actionable insights.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Bento Grid converted to Glass Cards */}
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">

                        {/* Card 1 */}
                        <motion.div variants={cinematicUp} className="group relative h-[400px] bg-neutral-900/40 border border-white/10 rounded-3xl p-8 overflow-hidden hover:bg-neutral-900/60 transition-all duration-500 hover:border-white/20 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-auto text-emerald-400 group-hover:scale-110 transition-all duration-500">
                                <Search size={24} />
                            </div>

                            <div className="relative z-10 mt-auto pt-32">
                                <h3 className="text-3xl text-white font-bricolage mb-3 tracking-tight group-hover:text-emerald-50 transition-colors">Automated Discovery</h3>
                                <p className="text-sm text-white/60 leading-relaxed group-hover:text-white transition-colors">
                                    Get usage insights into 100% of your production waste streams automatically using smart sensor integrations.
                                </p>
                                <div className="w-full bg-white/5 h-[2px] mt-6 relative overflow-hidden rounded-full">
                                    <div className="absolute inset-0 bg-emerald-500 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div variants={cinematicUp} className="group relative h-[400px] bg-neutral-900/40 border border-white/10 rounded-3xl p-8 overflow-hidden hover:bg-neutral-900/60 transition-all duration-500 hover:border-white/20 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-auto text-blue-400 group-hover:scale-110 transition-all duration-500">
                                <TrendingUp size={24} />
                            </div>

                            <div className="relative z-10 mt-auto pt-32">
                                <h3 className="text-3xl text-white font-bricolage mb-3 tracking-tight group-hover:text-blue-50 transition-colors">Revenue Ops</h3>
                                <p className="text-sm text-white/60 leading-relaxed group-hover:text-white transition-colors">
                                    Identify high-value buyers for specific material compositions instantly via our matching algorithm.
                                </p>
                                <div className="w-full bg-white/5 h-[2px] mt-6 relative overflow-hidden rounded-full">
                                    <div className="absolute inset-0 bg-blue-500 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div variants={cinematicUp} className="group relative h-[400px] bg-neutral-900/40 border border-white/10 rounded-3xl p-8 overflow-hidden hover:bg-neutral-900/60 transition-all duration-500 hover:border-white/20 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-auto text-purple-400 group-hover:scale-110 transition-all duration-500">
                                <ShieldCheck size={24} />
                            </div>

                            <div className="relative z-10 mt-auto pt-32">
                                <h3 className="text-3xl text-white font-bricolage mb-3 tracking-tight group-hover:text-purple-50 transition-colors">Compliance Shield</h3>
                                <p className="text-sm text-white/60 leading-relaxed group-hover:text-white transition-colors">
                                    Ensure all exchanges meet local and international environmental regulations with automated logs.
                                </p>
                                <div className="w-full bg-white/5 h-[2px] mt-6 relative overflow-hidden rounded-full">
                                    <div className="absolute inset-0 bg-purple-500 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </section>

            {/* SEPARATOR */}
            <div className="w-full bg-neutral-950 py-12 flex items-center justify-center relative z-20 overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/5"></div>
                <div className="relative bg-neutral-950 px-6 py-2 border border-white/5 rounded-full flex items-center gap-4">
                    <div className="flex gap-1">
                        <div className="w-0.5 h-3 bg-white/20"></div>
                        <div className="w-0.5 h-3 bg-white/20"></div>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/70">Scan</span>
                    <div className="flex gap-1">
                        <div className="w-0.5 h-3 bg-white/20"></div>
                        <div className="w-0.5 h-3 bg-emerald-500"></div>
                    </div>
                </div>
            </div>

            {/* TRUSTED BY / METRICS (Grayscale grid) */}
            <section className="bg-neutral-950 border-white/5 border-t pt-20 pb-20">
                <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/70">Trusted By The Network</span>
                    </div>

                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {["MAS", "BRANDIX", "TEEJAY", "HAYLEYS"].map((brand) => (
                            <div key={brand} className="flex items-center justify-center h-12 text-white font-bricolage font-bold text-2xl tracking-tighter">
                                {brand}
                                <span className="text-xs font-normal align-top ml-1 opacity-50">Org</span>
                            </div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5 mt-20 pt-12 gap-x-8 gap-y-8">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bricolage text-white font-light mb-2"><span>30</span><span className="text-lg text-emerald-500">%</span></div>
                            <div className="text-xs font-mono uppercase tracking-widest text-white/60">Waste Reduced</div>
                        </div>
                        <div class="text-center">
                            <div className="text-4xl md:text-5xl font-bricolage text-white font-light mb-2"><span>840</span><span className="text-lg text-emerald-500">+</span></div>
                            <div className="text-xs font-mono uppercase tracking-widest text-white/60">Active Listings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bricolage text-white font-light mb-2"><span>99.9</span><span className="text-lg text-emerald-500">%</span></div>
                            <div className="text-xs font-mono uppercase tracking-widest text-white/60">Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bricolage text-white font-light mb-2"><span>24</span><span className="text-lg text-emerald-500">/7</span></div>
                            <div className="text-xs font-mono uppercase tracking-widest text-white/60">Network Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE OPPORTUNITIES (Missions Pattern) */}
            <section id="projects" className="relative py-24 md:py-32 bg-neutral-950 text-white overflow-hidden selection:bg-emerald-500/30">
                {/* Ambient Blur Backgrounds */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[60vw] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-30 mix-blend-screen"></div>

                <div className="md:px-12 z-10 w-full max-w-7xl mr-auto ml-auto pr-6 pl-6 relative">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-3xl relative">
                            <div className="absolute -left-4 md:-left-8 top-1 bottom-1 w-1 bg-gradient-to-b from-emerald-500 to-transparent opacity-50"></div>
                            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                <Zap size={16} className="animate-pulse" />
                                <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400/80">Global Exchange</span>
                            </div>
                            <h2 className="text-5xl md:text-8xl font-bricolage font-medium tracking-tighter text-white leading-[0.9]">
                                Live <span className="text-white/20 font-light">Inventory.</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">

                        {/* Big Card (Ares Heavy style) */}
                        <div className="group relative md:col-span-8 md:row-span-2 rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl transition-all duration-700 hover:border-white/20">
                            <div className="absolute inset-0 z-0">
                                <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" alt="Aluminium Scrap" />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                            </div>

                            <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur border border-white/10 rounded-full text-xs uppercase tracking-widest font-mono text-white/80">Metalworks</span>
                                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs uppercase tracking-widest font-mono text-emerald-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        Available
                                    </span>
                                </div>
                                <div className="text-xs font-mono text-white/60 tabular-nums text-right hidden sm:block">Loc: Ratmalana</div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                                <div className="max-w-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="text-[8rem] md:text-[12rem] font-bricolage font-bold text-white/5 absolute -top-32 md:-top-40 -left-6 pointer-events-none select-none tracking-tighter">01</div>
                                    <h3 className="text-4xl md:text-6xl font-bricolage font-medium text-white mb-4 relative tracking-tight">Aluminium Scrap</h3>
                                    <p className="text-white/70 text-lg font-light leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-md">
                                        High-grade aluminium cut-offs ready for immediate smelting and recycling.
                                    </p>
                                    <div className="flex items-center gap-8 pt-6 border-t border-white/10 text-xs font-mono text-white/60 uppercase tracking-widest">
                                        <div><span className="block text-white mb-1">Volume</span>1,200 KG</div>
                                        <div><span className="block text-white mb-1">Price</span>Rs. 320/kg</div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                            <Link to="/products" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors bg-white/5 backdrop-blur-md">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stacked Cards */}
                        <div className="md:col-span-4 md:row-span-2 flex flex-col gap-6">
                            {/* Small Card 1 */}
                            <div className="group relative flex-1 rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-xl transition-all duration-700 hover:border-white/20">
                                <div className="absolute inset-0 z-0">
                                    <img src="https://images.unsplash.com/photo-1534349762913-96e0822eed12?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" alt="Textile Off-Cuts" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                                </div>
                                <div className="absolute top-6 right-6 z-20">
                                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                        <span className="font-bricolage text-sm font-medium">02</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgb(245,158,11)]"></span>
                                            <span className="text-xs uppercase text-amber-400 tracking-widest font-mono">Apparel</span>
                                        </div>
                                        <h3 className="text-3xl font-bricolage font-medium text-white mb-2 tracking-tight">Textile Off-Cuts</h3>
                                        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Clean cotton-blend scraps from major manufacturing lines.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Small Card 2 */}
                            <div className="group relative flex-1 rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-xl transition-all duration-700 hover:border-white/20">
                                <div className="absolute inset-0 z-0">
                                    <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" alt="Teak Sawdust" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                                </div>
                                <div className="absolute top-6 right-6 z-20">
                                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                        <span className="font-bricolage text-sm font-medium">03</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_10px_rgb(6,182,212)]"></span>
                                            <span className="text-xs uppercase text-cyan-400 tracking-widest font-mono">Woodworking</span>
                                        </div>
                                        <h3 className="text-3xl font-bricolage font-medium text-white mb-2 tracking-tight">Teak Sawdust</h3>
                                        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Pure organic sawdust optimal for biofuel compression.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 flex justify-center">
                        <Link to="/products" className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs font-mono text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest border border-transparent hover:border-white/10">
                            View Complete Database
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SEPARATOR LOG */}
            <div className="w-full bg-neutral-950 py-12 flex items-center justify-center relative z-20 overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10"></div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent w-3/4 mx-auto"></div>
                <div className="relative bg-neutral-950 p-3 border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse"></div>
                </div>
            </div>

            {/* BOTTOM CTA (Vanguard / Careers pattern) */}
            <section className="bg-neutral-950 border-white/5 border-t pt-24 pr-6 pb-24 pl-6 relative" id="join">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

                <div className="z-10 w-full max-w-7xl mr-auto ml-auto relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-[1px] bg-emerald-500"></span>
                                <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest">Network Access</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bricolage font-medium tracking-tighter text-white leading-[0.9]">
                                Initialize <span className="text-white/30">Setup.</span>
                            </h2>
                        </div>
                        <p className="text-neutral-400 text-lg max-w-md font-light leading-relaxed mb-2">
                            Integrate your systems in under 30 minutes. The shift to transparent material tracking starts here.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-8 flex flex-col gap-4">

                            {/* CTA Action 1 */}
                            <Link to="/products" className="group relative block p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-white/0 hover:from-white/20 hover:to-white/5 transition-all duration-500">
                                <div className="relative h-full bg-neutral-900/80 backdrop-blur-xl rounded-[23px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center border border-white/5 group-hover:border-transparent transition-colors overflow-hidden">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/30 transition-all duration-500 z-10">
                                        <Cpu size={28} />
                                    </div>
                                    <div className="flex-1 text-center md:text-left z-10">
                                        <h3 className="text-xl font-bricolage font-medium text-white mb-2 group-hover:text-white transition-colors">Start Free Trial</h3>
                                        <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Begin cataloging your production waste automatically.</p>
                                    </div>
                                    <div className="flex items-center gap-4 z-10">
                                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white -translate-x-4 group-hover:translate-x-0 group-hover:border-white/50 transition-all duration-300">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* CTA Action 2 */}
                            <Link to="/about" className="group relative block p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-white/0 hover:from-white/20 hover:to-white/5 transition-all duration-500">
                                <div className="relative h-full bg-neutral-900/80 backdrop-blur-xl rounded-[23px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center border border-white/5 group-hover:border-transparent transition-colors overflow-hidden">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/30 transition-all duration-500 z-10">
                                        <PlayCircle size={28} />
                                    </div>
                                    <div className="flex-1 text-center md:text-left z-10">
                                        <h3 className="text-xl font-bricolage font-medium text-white mb-2 group-hover:text-white transition-colors">View Demo Protocol</h3>
                                        <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">See how the AI negotiates exchanges in real-time.</p>
                                    </div>
                                    <div className="flex items-center gap-4 z-10">
                                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white -translate-x-4 group-hover:translate-x-0 group-hover:border-white/50 transition-all duration-300">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}