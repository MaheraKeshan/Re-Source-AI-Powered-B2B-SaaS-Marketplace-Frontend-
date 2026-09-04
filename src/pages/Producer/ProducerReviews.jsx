import React, { useState, useEffect } from 'react';
import ProducerHeader from '../../components/ProducerHeader';
import { ChevronDown, Star } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProducerReviews() {
    const [filter, setFilter] = useState("All Time");
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}reviews/producer`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Backend returns { reviews: [...] }
                setReviews(response.data.reviews || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError(err.response?.data?.message || "Failed to load reviews");
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        const now = new Date();
        const filtered = reviews.filter(review => {
            if (filter === "All Time") return true;

            const reviewDate = new Date(review.createdAt || Date.now());
            const diffInDays = (now - reviewDate) / (1000 * 60 * 60 * 24);

            if (filter === "Last 7 Days") return diffInDays <= 7;
            if (filter === "Last 30 Days") return diffInDays <= 30;
            return true;
        });
        setFilteredReviews(filtered);
    }, [filter, reviews]);

    const filterOptions = ["Last 7 Days", "Last 30 Days", "All Time"];

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < rating ? "fill-emerald-500 text-emerald-500" : "text-neutral-700"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 font-sans text-white overflow-hidden relative">
            <ProducerHeader />

            {/* --- Background Effects --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute bottom-[30%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white mb-2 tracking-tight">Customer <span className="text-emerald-500">Feedback</span></h1>
                        <p className="text-neutral-500 font-normal text-[15px]">Review customer sentiment and product quality feedback.</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-medium text-neutral-400 hover:text-white hover:border-white/10 transition-all min-w-[180px] justify-between"
                        >
                            {filter} <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-48 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
                                >
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilter(option);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-4 text-sm font-medium transition-all ${filter === option ? 'text-emerald-500 bg-emerald-500/5' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden mb-20 shadow-2xl">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-20 text-center text-neutral-500 font-medium animate-pulse">Updating feedback logs...</div>
                        ) : error ? (
                            <div className="p-20 text-center text-red-500 font-medium">{error}</div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="p-20 text-center text-neutral-500 font-medium text-lg italic">No customer feedback matches the selected period.</div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-sm font-semibold text-neutral-400">
                                    <tr>
                                        <th className="px-8 py-6">Review ID</th>
                                        <th className="px-8 py-6">Product</th>
                                        <th className="px-8 py-6">Rating</th>
                                        <th className="px-8 py-6">Comment</th>
                                        <th className="px-8 py-6">Customer</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredReviews.map((review, index) => (
                                        <tr key={review._id || index} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-8 py-6 text-emerald-500/70 font-semibold text-xs tracking-tighter">
                                                {(review._id || "ID-MISSING").slice(-8).toUpperCase()}
                                            </td>
                                            <td className="px-8 py-6 font-bold text-white text-base">
                                                {review.productName || "Unknown Product"}
                                                <span className="block text-[10px] text-neutral-600 font-mono mt-1 uppercase">{review.productId}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {renderStars(review.rating)}
                                            </td>
                                            <td className="px-8 py-6 text-neutral-400 italic font-medium leading-relaxed max-w-md">
                                                "{review.comment}"
                                            </td>
                                            <td className="px-8 py-6 font-semibold text-neutral-400 text-sm">
                                                {review.userName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Newsletter Section (Matching Design Layout) */}
                <div className="mt-20 pt-20 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-20">
                        <div className="relative p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
                            <h2 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">Product <span className="text-emerald-500">Updates</span></h2>
                            <p className="text-neutral-500 mb-8 font-medium">Stay updated with our latest industrial features and alerts.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-light"
                                />
                                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6 opacity-60">Company</h3>
                                <ul className="space-y-4 text-neutral-400 font-medium">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">About Us</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Careers</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Blog</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Contact</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6 opacity-60">Resources</h3>
                                <ul className="space-y-4 text-neutral-400 font-medium">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Documentation</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">API Keys</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Tech Specs</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Support</li>
                                </ul>
                            </div>
                            <div className="hidden sm:block">
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6 opacity-60">Legal</h3>
                                <ul className="space-y-4 text-neutral-400 font-medium">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Privacy</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Security</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Compliance</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer text-xs uppercase tracking-widest">Terms</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
