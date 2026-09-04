/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Filter,
    Package,
    AlertCircle,
    Loader2,
    RefreshCw,
    ShoppingCart,
    ArrowRight,
    SlidersHorizontal,
    MapPin,
    Tag,
    Check,
    X,
    ChevronDown,
    Sparkles,
    Activity,
    Factory,
    Boxes,
    Globe,
    ArrowLeft
} from 'lucide-react'
import ProductCard from '../../components/productCard'
import Header from "../../components/header"

// --- MOCK DATA FOR FILTERS (Replace with API data if available) ---
const CATEGORIES = ["All", "Textile", "Wood", "Metal", "Plastic", "Rubber", "Chemical", "Paper", "Electronics"];
const LOCATIONS = ["All", "Colombo", "Gampaha", "Kandy", "Galle", "Kurunegala", "Biyagama", "Ratmalana"];


// --- FILTER SIDEBAR COMPONENT ---
const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-[22rem] bg-neutral-950/90 backdrop-blur-3xl border-r border-white/5 transform transition-transform duration-700 cubic-bezier(0.22, 1, 0.36, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-80 lg:block lg:h-auto lg:border-none lg:bg-transparent lg:z-0 shadow-2xl lg:shadow-none`}>
            <div className="p-10 lg:p-0 h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-12 lg:hidden">
                    <h2 className="text-2xl font-sans font-bold text-white tracking-tight">Filters</h2>
                    <button onClick={onClose} className="p-3 text-neutral-400 hover:text-white rounded-2xl bg-white/5 transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Category Filter */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Factory size={16} />
                        </div>
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Categories</h3>
                    </div>
                    <div className="space-y-4">
                        {CATEGORIES.map(category => (
                            <label key={category} className="flex items-center gap-5 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500 border-2 ${filters.category === category ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'border-white/10 bg-white/5 group-hover:border-emerald-500/50'}`}>
                                    {filters.category === category && <Check size={14} className="text-neutral-950" strokeWidth={4} />}
                                </div>
                                <input
                                    type="radio"
                                    name="category"
                                    className="hidden"
                                    checked={filters.category === category}
                                    onChange={() => setFilters({ ...filters, category })}
                                />
                                <span className={`text-sm tracking-wide transition-all duration-500 ${filters.category === category ? 'text-emerald-400 font-bold translate-x-2' : 'text-neutral-400 group-hover:text-white'}`}>
                                    {category.toUpperCase()}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Location Filter */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <MapPin size={16} />
                        </div>
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Locations</h3>
                    </div>
                    <div className="space-y-4">
                        {LOCATIONS.map(location => (
                            <label key={location} className="flex items-center gap-5 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${filters.location === location ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/10 bg-white/5 group-hover:border-emerald-500/50'}`}>
                                    {filters.location === location && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
                                </div>
                                <input
                                    type="radio"
                                    name="location"
                                    className="hidden"
                                    checked={filters.location === location}
                                    onChange={() => setFilters({ ...filters, location })}
                                />
                                <span className={`text-sm tracking-wide transition-all duration-500 ${filters.location === location ? 'text-emerald-400 font-bold translate-x-2' : 'text-neutral-400 group-hover:text-white'}`}>
                                    {location.toUpperCase()}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Reset Filters */}
                <button
                    onClick={() => setFilters({ category: "All", location: "All", priceRange: [0, 10000] })}
                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 text-xs font-black tracking-widest uppercase hover:bg-emerald-500 hover:text-neutral-950 hover:border-emerald-500 transition-all duration-500 flex items-center justify-center gap-3 group shadow-2xl"
                >
                    <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> RESET FILTERS
                </button>
            </div>
        </aside >
    )
}

// --- MAIN PAGE COMPONENT ---
export default function ProductPage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [filters, setFilters] = useState({
        category: "All",
        location: "All",
        priceRange: [0, 10000]
    })

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "products")
                setProducts(response.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.productId && product.productId.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = filters.category === "All" ||
                (product.category && product.category.toLowerCase().includes(filters.category.toLowerCase()));

            // Mock location match - expecting real data to have location field
            const matchesLocation = filters.location === "All" ||
                (product.location && product.location.toLowerCase().includes(filters.location.toLowerCase()));

            return matchesSearch && matchesCategory && matchesLocation;
        });
    }, [products, searchQuery, filters]);

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
                <Header />
                {/* Background Elements */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
                    <div className="absolute inset-0 bg-neutral-950"></div>
                    <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 bg-white/[0.03] border border-rose-500/20 p-12 rounded-[3.5rem] shadow-2xl shadow-rose-500/10 max-w-md text-center backdrop-blur-3xl">
                    <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-rose-500 animate-pulse border border-rose-500/20">
                        <AlertCircle size={48} />
                    </div>
                    <h3 className="text-4xl font-display font-bold text-white mb-4 tracking-tighter uppercase">SYSTEM LINK FAILURE</h3>
                    <p className="text-neutral-400 mb-10 text-lg leading-relaxed font-medium">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-4 bg-white text-neutral-950 px-10 py-6 rounded-2xl hover:bg-emerald-500 transition-all duration-500 font-bold text-lg shadow-2xl active:scale-95">
                        <RefreshCw size={24} /> INITIALIZE REBOOT
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-400 flex flex-col overflow-x-hidden relative">
            <Header />

            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
                <div className="absolute inset-0 bg-neutral-950"></div>
                <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* --- HERO HEADER --- */}
            <section className="relative pt-48 pb-24 lg:pt-64 lg:pb-32 overflow-hidden z-10">
                <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-[1500px]">
                    <div className="max-w-4xl">
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/5 shadow-2xl text-emerald-500 text-xs font-bold uppercase tracking-[0.3em] mb-12 hover:border-emerald-500/30 transition-all cursor-default font-mono">
                                <Activity size={14} className="text-emerald-500 animate-pulse" />
                                LIVE MARKETPLACE
                            </div>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-sans font-bold text-white tracking-tight mb-8 leading-[1.1]">
                                Sustainable<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600">Marketplace.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed max-w-2xl font-light">
                                Discover high-quality recycled materials and industrial byproducts from verified producers.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="flex-1 container mx-auto px-6 sm:px-10 lg:px-16 pb-40 relative z-20 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row gap-20">

                    {/* --- SIDEBAR FILTERS --- */}
                    <div className="hidden lg:block w-80 shrink-0">
                        <div className="sticky top-40">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                isOpen={isSidebarOpen}
                                onClose={() => setIsSidebarOpen(false)}
                            />
                        </div>
                    </div>

                    {/* Mobile Sidebar Toggle Button (Sticky) */}
                    <div className="lg:hidden sticky top-32 z-40 mb-12">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="w-full flex items-center justify-center gap-4 bg-emerald-500 text-neutral-950 px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] active:scale-95 transition-all"
                        >
                            <SlidersHorizontal size={18} /> OPEN FILTERS
                        </button>
                    </div>

                    {/* --- MAIN CONTENT AREA --- */}
                    <div className="flex-1 min-w-0">

                        {/* Toolbar: Search */}
                        <div className="flex flex-col gap-8 mb-20 relative">
                            <div className="relative group/search">
                                <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none transition-transform duration-500 group-focus-within/search:scale-110">
                                    <Search className="text-neutral-400 group-focus-within/search:text-emerald-500" size={24} />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-20 pr-8 py-7 bg-white/[0.03] border border-white/5 rounded-[2.5rem] text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-8 focus:ring-emerald-500/5 shadow-2xl backdrop-blur-xl transition-all duration-500 text-lg font-bold tracking-tight"
                                    placeholder="Search for materials, categories, or products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none opacity-20 group-focus-within/search:opacity-100 transition-opacity">
                                    <span className="text-xs font-sans text-emerald-500 font-bold tracking-widest uppercase">Ready</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(filters.category !== "All" || filters.location !== "All") && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap items-center gap-4 mb-12"
                            >
                                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mr-2">ACTIVE FILTERS:</div>
                                {filters.category !== "All" && (
                                    <span className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-2xl backdrop-blur-xl font-mono">
                                        {filters.category}
                                        <button onClick={() => setFilters({ ...filters, category: "All" })} className="hover:bg-emerald-500 hover:text-neutral-950 rounded-lg p-0.5 transition-all">
                                            <X size={14} strokeWidth={4} />
                                        </button>
                                    </span>
                                )}
                                {filters.location !== "All" && (
                                    <span className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 text-neutral-400 text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-2xl backdrop-blur-xl font-mono">
                                        {filters.location}
                                        <button onClick={() => setFilters({ ...filters, location: "All" })} className="hover:bg-white/20 rounded-lg p-0.5 transition-all text-white">
                                            <X size={14} strokeWidth={4} />
                                        </button>
                                    </span>
                                )}
                                <button
                                    className="text-xs text-neutral-400 hover:text-emerald-400 font-black uppercase tracking-[0.2em] ml-6 transition-all underline underline-offset-8 decoration-neutral-800 hover:decoration-emerald-500 font-mono"
                                    onClick={() => setFilters({ category: "All", location: "All", priceRange: [0, 10000] })}
                                >
                                    CLEAR ALL
                                </button>
                            </motion.div>
                        )}

                        {/* Loader */}
                        {isLoading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white/[0.03] h-[480px] rounded-[3rem] animate-pulse border border-white/5 flex flex-col items-center justify-center">
                                        <Activity size={32} className="text-neutral-900 animate-spin" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Product Grid */}
                        <AnimatePresence mode="wait">
                            {!isLoading && filteredProducts.length > 0 ? (
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-10"
                                >
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product._id || product.productId} product={product} />
                                    ))}
                                </motion.div>
                            ) : !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="text-center py-40 bg-white/[0.02] rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-3xl relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                    <div className="bg-neutral-950 w-32 h-32 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white/5 relative z-10 transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110">
                                        <Package className="text-neutral-700 group-hover:text-emerald-500 transition-colors duration-700" size={56} strokeWidth={1} />
                                    </div>
                                    <h3 className="text-4xl font-sans font-bold text-white mb-4 tracking-tight">No Products Found</h3>
                                    <p className="text-neutral-400 mb-10 text-lg max-w-lg mx-auto font-light leading-relaxed relative z-10 px-8">
                                        We couldn't find any products matching your current filters. Try adjusting your search parameters.
                                    </p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setFilters({ category: "All", location: "All", priceRange: [0, 10000] }); }}
                                        className="relative z-10 inline-flex items-center gap-4 bg-emerald-500 text-neutral-950 font-black px-10 py-5 rounded-[2rem] hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all text-xs font-mono uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20"
                                    >
                                        <RefreshCw size={18} /> RESET FILTERS
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Sidebar Slide-over backdrop for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

