/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import ProductCard from "../../components/productCard";
import toast from "react-hot-toast";
import {
    Search,
    X,
    Sparkles,
    PackageSearch,
    SlidersHorizontal,
    ArrowRight,
    Leaf
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../../components/header";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

// Quick suggestion chips
const SUGGESTIONS = [
    "Aluminium scrap",
    "Textile off-cuts",
    "Teak sawdust",
    "Plastic waste",
    "Copper wire",
    "Paper offcuts",
];

export default function SearchProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleAiSearch = async (searchQuery) => {
        const q = (searchQuery || query).trim();
        if (!q) return;

        setIsLoading(true);
        setHasSearched(true);
        try {
            const allProductsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`);
            const allProducts = allProductsRes.data;

            const matchRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}matchmake/find-matches`, {
                query: q,
                products: allProducts
            });

            const matchedIds = matchRes.data.matchedIds || [];
            const finalMatches = allProducts.filter(p =>
                matchedIds.includes(p._id) || matchedIds.includes(p.productId)
            );

            setProducts(finalMatches);

            if (finalMatches.length === 0) {
                toast("No products matched your search.", { icon: "🔍" });
            } else {
                toast.success(`Found ${finalMatches.length} matching product${finalMatches.length > 1 ? "s" : ""}`);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Search failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleAiSearch();
    };

    const clearSearch = () => {
        setQuery("");
        setProducts([]);
        setHasSearched(false);
    };

    const handleSuggestion = (s) => {
        setQuery(s);
        handleAiSearch(s);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans relative overflow-x-hidden">
            <div className="bg-grain"></div>

            {/* Ambient background glows */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <Header />

            <main className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-28">

                {/* ── Page Header ── */}
                <motion.div
                    initial="hidden" animate="visible" variants={stagger}
                    className="mb-12"
                >
                    <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Sparkles size={14} className="text-emerald-400" />
                        </div>
                        <span className="text-sm text-emerald-400 font-medium">AI-Powered Search</span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        Find what you need
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-neutral-400 text-lg max-w-xl leading-relaxed">
                        Search for recycled materials, industrial byproducts, and sustainable resources using natural language.
                    </motion.p>
                </motion.div>

                {/* ── Search Bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-6"
                >
                    <form onSubmit={handleFormSubmit} className="relative">
                        <div className={`flex items-center bg-neutral-900 border rounded-2xl transition-all duration-300 shadow-xl ${isLoading ? "border-emerald-500/40" : "border-white/10 focus-within:border-emerald-500/40 focus-within:shadow-emerald-500/10"}`}>
                            <div className="pl-5 text-neutral-500 flex-shrink-0">
                                {isLoading
                                    ? <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                    : <Search size={20} />
                                }
                            </div>
                            <input
                                type="text"
                                placeholder="e.g. aluminium scrap, textile waste, copper wire..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-base md:text-lg py-5 px-4 text-white placeholder:text-neutral-600 outline-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="p-2 mr-1 text-neutral-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <X size={18} />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading || !query.trim()}
                                className="mr-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl transition-all flex items-center gap-2 flex-shrink-0"
                            >
                                Search
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </form>

                    {/* Suggestion chips */}
                    {!hasSearched && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-2 mt-4"
                        >
                            <span className="text-xs text-neutral-600 flex items-center mr-1">Try:</span>
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleSuggestion(s)}
                                    className="px-3 py-1.5 text-xs bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/30 text-neutral-400 hover:text-white rounded-full transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* ── Results area ── */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        /* Loading skeleton */
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8">
                            <div className="flex items-center gap-3 mb-8 text-sm text-neutral-400">
                                <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                Searching for <strong className="text-white">"{query}"</strong>...
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden animate-pulse">
                                        <div className="h-44 bg-white/[0.04]"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-white/[0.04] rounded-md w-3/4"></div>
                                            <div className="h-3 bg-white/[0.04] rounded-md w-1/2"></div>
                                            <div className="h-3 bg-white/[0.04] rounded-md w-2/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    ) : hasSearched && products.length > 0 ? (
                        /* Results */
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Results header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-neutral-400">
                                        <span className="text-white font-semibold">{products.length}</span> result{products.length > 1 ? "s" : ""} for
                                        <span className="text-emerald-400 ml-1">"{query}"</span>
                                    </span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                                        <Sparkles size={9} /> AI Matched
                                    </span>
                                </div>
                                <button
                                    onClick={clearSearch}
                                    className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <X size={12} /> Clear
                                </button>
                            </div>

                            <motion.div
                                variants={stagger} initial="hidden" animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id || product.productId}
                                        variants={fadeUp}
                                        className="relative"
                                    >
                                        {/* AI badge */}
                                        <div className="absolute -top-2 -right-2 z-30 px-2 py-0.5 bg-emerald-500 text-black rounded-full text-[9px] font-bold flex items-center gap-1 shadow-lg">
                                            <Sparkles size={8} /> Match
                                        </div>
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                    ) : hasSearched && products.length === 0 ? (
                        /* No results */
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-center py-24"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-neutral-600">
                                <PackageSearch size={36} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                            <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6">
                                We couldn't find any products matching <span className="text-neutral-300">"{query}"</span>. Try different keywords or browse suggestions below.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleSuggestion(s)}
                                        className="px-3 py-1.5 text-xs bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-neutral-400 hover:text-emerald-400 rounded-full transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                    ) : (
                        /* Empty / initial state */
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="py-20"
                        >
                            {/* Feature highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                                {[
                                    { icon: Sparkles, title: "AI-powered matching", desc: "Describe what you need in plain language and let AI find the best matches." },
                                    { icon: Leaf, title: "Eco-friendly materials", desc: "Every product is a recycled or upcycled industrial byproduct." },
                                    { icon: PackageSearch, title: "Verified listings", desc: "All materials are quality-verified by producers before listing." },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                        <div className="w-10 h-10 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <Icon size={20} />
                                        </div>
                                        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
                                        <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}