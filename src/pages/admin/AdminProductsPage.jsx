/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Trash2,
    Search,
    RefreshCw,
    Activity,
    Boxes,
    SearchCode,
    Database,
    TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const productsRes = await axios.get(import.meta.env.VITE_BACKEND_URL + "products");
            setProducts(productsRes.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
            setIsLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const filteredProducts = sortedProducts.filter(product =>
        Object.values(product).some(
            value => value &&
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const deleteProduct = (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const token = localStorage.getItem("token");
        axios
            .delete(import.meta.env.VITE_BACKEND_URL + "products/" + productId, {
                headers: { Authorization: "Bearer " + token },
            })
            .then(() => {
                toast.success("Product deleted successfully");
                fetchProducts();
            })
            .catch((e) => {
                toast.error("Failed to delete product");
            });
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-24 relative overflow-hidden">

            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
                <div className="absolute inset-0 bg-neutral-950"></div>
                <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-40">

                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16"
                >
                    <div className="space-y-4">
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-sm font-semibold tracking-wide">
                            <Database size={16} className="text-emerald-500" />
                            Product Directory
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-[1]">
                            Product <span className="text-emerald-500">Catalog.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-neutral-400 max-w-2xl font-medium tracking-tight">
                            View all available products on the marketplace and manage removals.
                        </motion.p>
                    </div>

                    <motion.div variants={fadeInUp} className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search Products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium text-white outline-none focus:border-emerald-500 transition-all font-sans placeholder:text-neutral-500"
                            />
                        </div>
                        <button
                            onClick={fetchProducts}
                            className="p-4.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all active:scale-95 group shadow-xl"
                        >
                            <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''} transition-transform group-hover:rotate-180`} />
                        </button>
                    </motion.div>
                </motion.div>

                {/* Stats Grid - Adjusted to 3 columns */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
                >
                    <MetricCard
                        title="Total Products"
                        value={products.length}
                        icon={<Boxes size={24} />}
                        color="blue"
                    />
                    <MetricCard
                        title="Average Price"
                        value={`Rs. ${(products.reduce((sum, p) => sum + p.price, 0) / (products.length || 1)).toFixed(2)}`}
                        icon={<Activity size={24} />}
                        color="orange"
                    />
                    <MetricCard
                        title="Total Value"
                        value={`Rs. ${(products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0) / 1000).toFixed(1)}K`}
                        icon={<TrendingUp size={24} />}
                        color="emerald"
                    />
                </motion.div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-neutral-400 font-sans font-medium text-sm animate-pulse">Loading Products...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative"
                    >
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] pointer-events-none"></div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5 font-sans text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                    <tr>
                                        <th className="py-5 px-8 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => handleSort('productId')}>Product ID</th>
                                        <th className="py-5 px-8 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => handleSort('name')}>Name</th>
                                        <th className="py-5 px-8">Image</th>
                                        <th className="py-5 px-8 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => handleSort('price')}>Price</th>
                                        <th className="py-5 px-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    <AnimatePresence>
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((item) => (
                                                <motion.tr
                                                    key={item.productId}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="group hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="py-6 px-8 font-sans font-semibold text-sm text-neutral-400 group-hover:text-emerald-400 transition-colors">
                                                        #{item.productId.toString().padStart(4, '0')}
                                                    </td>
                                                    <td className="py-6 px-8">
                                                        <div className="font-semibold text-white tracking-tight text-lg">{item.name}</div>
                                                        <div className="text-xs text-neutral-500 font-sans mt-0.5">Standard Product</div>
                                                    </td>
                                                    <td className="py-6 px-8">
                                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 overflow-hidden border border-white/5 group-hover:border-emerald-500/50 transition-all p-2">
                                                            <img src={item.image[0]} alt={item.name} className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-8">
                                                        <div className="font-sans text-emerald-400 font-semibold text-lg">
                                                            LKR {item.price.toLocaleString()}
                                                        </div>
                                                        {item.labelledPrice && (
                                                            <div className="text-xs text-neutral-500 font-sans line-through mt-0.5 opacity-50">
                                                                MRP: {item.labelledPrice}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-6 px-8 text-right">
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => deleteProduct(item.productId)}
                                                                className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95 text-red-500"
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-24 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                                        <SearchCode size={48} className="text-neutral-500" />
                                                        <p className="font-sans font-semibold text-neutral-400">No Products Found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, color }) {
    const colorMap = {
        emerald: "text-emerald-500 shadow-emerald-500/10 border-emerald-500/20 bg-emerald-500/5",
        blue: "text-blue-500 shadow-blue-500/10 border-blue-500/20 bg-blue-500/5",
        red: "text-red-500 shadow-red-500/10 border-red-500/20 bg-red-500/5",
        orange: "text-orange-500 shadow-orange-500/10 border-orange-500/20 bg-orange-500/5"
    };

    return (
        <motion.div
            variants={fadeInUp}
            className={`bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity ${colorMap[color].split(' ')[4]}`}></div>
            <div className="relative z-10 flex flex-col gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${colorMap[color]}`}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-wide text-neutral-400 uppercase font-sans mb-1">{title}</p>
                    <p className="text-3xl font-sans font-bold text-white tracking-tight">{value}</p>
                </div>
            </div>
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-0 right-0 w-[1px] h-4 bg-white/20"></div>
                <div className="absolute top-0 right-0 h-[1px] w-4 bg-white/20"></div>
            </div>
        </motion.div>
    );
}