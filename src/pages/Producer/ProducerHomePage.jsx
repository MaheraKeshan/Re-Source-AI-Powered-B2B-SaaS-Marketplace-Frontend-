/* eslint-disable no-unused-vars */
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    Recycle,
    Factory
} from "lucide-react";

// Assuming these components exist in your project structure
import ProducerHeader from "../../components/ProducerHeader";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export default function ProducerHomePage() {
    const navigate = useNavigate();
    return (
        <>
            <style>{`
                html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
                html, body { scrollbar-width: none; overflow-x: hidden !important; }
            `}</style>

            <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-50 font-sans w-full overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
                <div className="bg-grain"></div>
                <div className="liquid-glass-container">
                    <div className="liquid-blob blob-1"></div>
                    <div className="liquid-blob blob-2"></div>
                </div>

                <ProducerHeader />

                <main className="flex-1 w-full relative z-10">
                    <HomeLanding />
                </main>
            </div>
        </>
    );
}

function HomeLanding() {
    return (
        <div className="w-full overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative pt-48 pb-20 lg:pt-60 lg:pb-32 w-full overflow-hidden">
                <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center"
                    >
                        <motion.div variants={fadeInUp} className="mb-10">
                            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 shadow-2xl px-5 py-2 rounded-full text-sm font-semibold text-emerald-400 tracking-wide">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Platform Active
                            </div>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tight text-white mb-10 leading-[0.9]">
                            Scale Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Industrial Value.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-14 leading-relaxed font-normal">
                            The marketplace for industrial resource optimization. List your byproducts, connect with verified buyers, and contribute to a circular economy.
                        </motion.p>

                        {/* Buttons removed for cleaner UI */}

                        {/* Dashboard Mockup - Dark Glass */}
                        <motion.div
                            variants={fadeInUp}
                            className="relative mx-auto max-w-6xl w-full perspective-2000"
                        >
                            <motion.div
                                initial={{ rotateX: 15, opacity: 0, y: 100 }}
                                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-[3rem] shadow-[0_50px_100px_-15px_rgba(0,0,0,0.5)] border border-white/5 bg-neutral-900/40 backdrop-blur-3xl p-4 md:p-6"
                            >
                                <div className="rounded-[2rem] overflow-hidden bg-neutral-950 border border-white/5 aspect-[16/9] relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                                        alt="Re-Source Analytics Dashboard"
                                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none"></div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-16 border-y border-white/5 bg-neutral-950/50 w-full overflow-hidden relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24"
                >
                    <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">Trusted Partners</p>
                    <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                        {["MAS Holdings", "Brandix Global", "Teejay Textiles", "Hayleys PLC"].map((partner) => (
                            <div key={partner} className="flex items-center gap-3 font-sans font-bold text-lg text-white tracking-wide">{partner}</div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Value Proposition Grid */}
            <section className="py-32 relative z-10 w-full overflow-hidden">
                <div className="max-w-screen-xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-left max-w-4xl mb-24"
                    >
                        <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-sans font-bold text-white mb-8 tracking-tight leading-none">
                            Resources <br /><span className="text-emerald-500">Optimized.</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-400 leading-relaxed font-normal max-w-2xl">
                            Eliminate the blind spots in your supply chain. 30% of industrial byproducts are lost to inefficiency — we help you reclaim that value.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-10"
                    >
                        <FeatureHighlight
                            icon={<Search className="text-emerald-500" size={28} />}
                            title="Smart Matching"
                            description="Connect with buyers looking for exactly what you produce. Real-time matching based on material type and location."
                        />
                        <FeatureHighlight
                            icon={<TrendingUp className="text-emerald-500" size={28} />}
                            title="Fair Pricing"
                            description="AI-powered market analysis ensures you get the best price for every kilogram of material."
                        />
                        <FeatureHighlight
                            icon={<ShieldCheck className="text-emerald-500" size={28} />}
                            title="Compliance Ready"
                            description="Automated tracking for environmental standards and sustainability audits."
                        />
                    </motion.div>
                </div>
            </section>

            {/* Feature Strip 1 */}
            <section className="py-32 overflow-hidden w-full relative z-10">
                <div className="max-w-screen-xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32"
                    >
                        <motion.div variants={fadeInUp} className="lg:w-1/2">
                            <div className="text-emerald-500 font-semibold tracking-wider text-xs uppercase mb-8 flex items-center gap-4">
                                01 — Operational Efficiency
                                <div className="h-px flex-1 bg-emerald-500/20"></div>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-sans font-bold text-white leading-[0.9] mb-10 tracking-tight">Seamless <br />Logistics.</h2>
                            <p className="text-lg text-neutral-400 font-normal leading-relaxed mb-12">Integrate resource recovery into your daily production workflow. No friction, just flow.</p>

                            <ul className="space-y-6">
                                {[
                                    "Predictive Listing Suggestions",
                                    "Smart Scale Integration",
                                    "Automated Dispatch Requests"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-5 text-white/80 group">
                                        <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                            <ShieldCheck size={16} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/about" className="mt-16 inline-flex items-center gap-4 text-emerald-400 text-sm font-semibold tracking-wide hover:text-white transition-all group">
                                Learn More <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInScale} className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full"></div>
                            <div className="relative rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl group">
                                <img
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
                                    alt="Team Collaboration"
                                    className="w-full h-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Strip 2 - Dark */}
            <section className="py-32 bg-neutral-900/50 backdrop-blur-3xl w-full relative z-10 border-y border-white/5">
                <div className="max-w-screen-xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="flex flex-col lg:flex-row-reverse items-center gap-24 lg:gap-32"
                    >
                        <motion.div variants={fadeInUp} className="lg:w-1/2">
                            <div className="text-emerald-500 font-semibold tracking-wider text-xs uppercase mb-8 flex items-center gap-4">
                                02 — Full Visibility
                                <div className="h-px flex-1 bg-emerald-500/20"></div>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-sans font-bold text-white leading-[0.9] mb-10 tracking-tight">Your Complete <br />Portfolio.</h2>
                            <p className="text-lg text-neutral-400 font-normal leading-relaxed mb-12">Full oversight of your material ecosystem. Track data, visualize trends, and plan your strategy with confidence.</p>

                            <div className="space-y-6">
                                {[
                                    "Resource Map Visualizer",
                                    "Environmental Impact Tracking",
                                    "Dynamic ROI Forecast"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 group">
                                        <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                            <Recycle size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div variants={fadeInScale} className="lg:w-1/2">
                            <div className="relative rounded-[3.5rem] overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)] bg-neutral-950 group">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                                    alt="Dashboard Preview"
                                    className="w-full h-auto opacity-30 grayscale group-hover:opacity-70 group-hover:grayscale-0 transition-all duration-1000"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Opportunities Section */}
            <section className="py-32 relative z-10 w-full overflow-hidden">
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <div className="inline-flex items-center gap-3 bg-emerald-500/10 px-4 py-1.5 rounded-full text-sm font-semibold text-emerald-500 tracking-wide mb-4 border border-emerald-500/20">
                                Live Marketplace
                            </div>
                            <h2 className="text-4xl font-sans font-bold text-white tracking-tight">Featured Listings</h2>
                        </div>
                        <Link to="/products" className="group text-sm font-semibold text-neutral-500 hover:text-emerald-400 transition-all tracking-wide flex items-center gap-3">
                            View All Listings <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        <ProductCard
                            name="TEXTILE SCRAP B01"
                            category="APPAREL"
                            price="LKR 450/KG"
                            tag="RECYCLABLE"
                            location="BIYAGAMA HUB"
                            image="https://images.unsplash.com/photo-1534349762913-96e0822eed12?q=80&w=1470&auto=format&fit=crop"
                        />
                        <ProductCard
                            name="SAWDUST TEAK G12"
                            category="FORESTRY"
                            price="LKR 150/KG"
                            tag="BIO FUEL"
                            location="MORATUWA NODE"
                            image="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1470&auto=format&fit=crop"
                        />
                        <ProductCard
                            name="ALU SCRAP IND 77"
                            category="METALS"
                            price="LKR 3,200/KG"
                            tag="HIGH VAL"
                            location="RATMALANA STR"
                            image="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1470&auto=format&fit=crop"
                        />
                        <ProductCard
                            name="PET POLY NEO 9"
                            category="POLYMERS"
                            price="LKR 600/KG"
                            tag="COMMODITY"
                            location="COLOMBO PORT"
                            image="https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=1336&auto=format&fit=crop"
                            delay={0.3}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-48 relative overflow-hidden w-full z-10 border-t border-white/5">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <h2 className="text-5xl md:text-7xl font-sans font-bold text-white mb-10 tracking-tight leading-[0.9]">
                        Ready to <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Get Started?</span>
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 mb-16 max-w-2xl mx-auto leading-relaxed font-normal">
                        Getting started is quick and easy. List your materials and connect with the global resource marketplace in minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/products" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-5 px-10 rounded-2xl transition-all duration-500 shadow-2xl shadow-emerald-500/20 text-base">
                            Start Listing
                        </Link>
                        <Link to="/contact" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-semibold py-5 px-10 rounded-2xl transition-all duration-500 text-base">
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

function ProductCard({ name, category, price, tag, location, image, delay = 0 }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ y: -10 }}
            className="group relative bg-neutral-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 backdrop-blur-3xl hover:border-emerald-500/30 transition-all duration-500 cursor-pointer h-full flex flex-col"
        >
            <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent opacity-60"></div>
                <div className="absolute top-6 right-6 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xl">
                    {tag}
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow relative">
                <div className="absolute -top-8 right-8 w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                    <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500 text-emerald-500 group-hover:text-black" />
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-semibold text-neutral-500 tracking-wide">{category}</span>
                </div>
                <h3 className="font-sans font-bold text-2xl text-white mb-6 leading-none tracking-tight group-hover:text-emerald-400 transition-colors">{name}</h3>

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                    <div>
                        <p className="text-sm text-neutral-400 font-semibold mb-2">Price</p>
                        <span className="text-emerald-400 font-bold text-xl tracking-tighter">{price}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-neutral-400 font-medium mb-1">Location</div>
                        <div className="text-xs text-white font-bold tracking-tight">
                            {location}
                        </div>
                    </div>
                </div>
            </div>

            <Link to="/products" className="absolute inset-0 z-10" aria-label={`View ${name}`}></Link>
        </motion.div>
    );
}

function FeatureHighlight({ icon, title, description }) {
    return (
        <div className="bg-neutral-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl hover:border-emerald-500/20 transition-all duration-500 h-full flex flex-col items-start group">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-neutral-950 mb-8 shrink-0 border border-white/5 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 text-emerald-500 shadow-2xl">
                {icon}
            </div>
            <h3 className="text-lg font-sans font-bold text-white mb-4 tracking-wide">{title}</h3>
            <p className="text-neutral-400 leading-relaxed text-[15px]">{description}</p>
        </div>
    );
}
