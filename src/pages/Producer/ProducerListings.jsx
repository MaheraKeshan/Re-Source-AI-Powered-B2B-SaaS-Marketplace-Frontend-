import React, { useState, useEffect, useRef } from 'react';
import ProducerHeader from '../../components/ProducerHeader';
import { Minus, Plus, ChevronDown, Search, Filter, PlusCircle, Trash2, Mail, Recycle, X, Zap, Upload, ArrowRight, Activity, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { supabase } from '../../lib/supabaseClient';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } }
};

export default function ProducerListings() {
    const [filter, setFilter] = useState("Last 7 Days");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        altNames: "",
        category: "Polymers",
        valuation: "",
        labelledPrice: "",
        quantity: "",
        description: "",
        image: []
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsFetching(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Assuming the API returns an array or an object with a products array
            setProducts(Array.isArray(response.data) ? response.data : (response.data.products || []));
        } catch (error) {
            console.error("API ERROR:", error);
            toast.error("Unable to load product inventory.");
        } finally {
            setIsFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size exceeds 10MB limit.");
                return;
            }

            setIsUploadingImage(true);
            toast.loading("Uploading image...", { id: "image-upload" });

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { data, error } = await supabase.storage
                .from('images') // Supabase bucket name
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            const { data: publicData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                image: [...(prev.image || []), publicData.publicUrl]
            }));

            toast.success("Image uploaded successfully!", { id: "image-upload" });
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(error.message || "Failed to upload image.", { id: "image-upload" });
        } finally {
            setIsUploadingImage(false);
            if (event.target) event.target.value = null;
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            image: prev.image.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("PROTOCOL ERROR: Session Expired");
                return;
            }

            let payload = {
                name: formData.name,
                altNames: formData.altNames ? formData.altNames.split(",").map(n => n.trim()).filter(n => n) : [],
                description: formData.description,
                image: formData.image || [],
                price: Number(formData.valuation),
                labelledPrice: Number(formData.labelledPrice) || Number(formData.valuation),
                stock: Number(formData.quantity) || 0,
                category: formData.category,
                quantity: formData.quantity
            };

            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}products/${editingProductId}`, payload, {
                    headers: { Authorization: "Bearer " + token }
                });
                toast.success("Product Updated Successfully");
            } else {
                // The backend automatically generates a globally unique sequential ID if we do not provide one.
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}products`, payload, {
                    headers: { Authorization: "Bearer " + token }
                });
                toast.success("Product Added Successfully");
            }

            setIsModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("SUBMISSION ERROR:", error);
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || "",
            altNames: (product.altNames || []).join(", "),
            category: product.category || "Polymers",
            valuation: product.price || "",
            labelledPrice: product.labelledPrice || "",
            quantity: product.stock || product.quantity || "",
            description: product.description || "",
            image: product.image || []
        });
        setIsEditMode(true);
        setEditingProductId(product.productId);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", altNames: "", category: "Polymers", valuation: "", labelledPrice: "", quantity: "", description: "", image: [] });
        setIsEditMode(false);
        setEditingProductId(null);
    };

    const handleDelete = async (productId) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-neutral-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] pointer-events-auto flex flex-col overflow-hidden group`}
            >
                <div className="p-8">
                    <div className="flex items-start gap-5">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
                            <Trash2 size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-lg font-bold text-white tracking-tight">Confirm Deletion</p>
                            <p className="mt-2 text-sm text-neutral-400 font-medium leading-relaxed">
                                Are you sure you want to delete this product? This action will permanently remove it from your inventory registry.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-t border-white/5 bg-white/[0.02]">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border-r border-white/5 px-6 py-5 text-xs font-mono font-black text-neutral-500 uppercase tracking-[0.2em] hover:bg-white/5 transition-colors"
                    >
                        Abort
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await processDelete(productId);
                        }}
                        className="w-full px-6 py-5 text-xs font-mono font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-500/10 transition-colors"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const processDelete = async (productId) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}products/${productId}`, {
                headers: { Authorization: "Bearer " + token }
            });

            toast.success("Product Deleted Successfully", {
                style: {
                    background: '#09090b',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.2)'
                }
            });
            fetchProducts();
        } catch (error) {
            console.error("DELETE ERROR:", error);
            toast.error("PROTOCOL FAILURE: Unable to purge resource.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 font-sans text-white overflow-hidden relative">
            <ProducerHeader />

            {/* --- Background Effects --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px]" style={{ animationDelay: '2s' }}></div>
            </div>

            <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white mb-2 tracking-tight">Product <span className="text-emerald-500">Inventory</span></h1>
                        <p className="text-neutral-500 font-normal text-[15px]">Manage and track your products and stock levels.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group text-neutral-400">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-medium hover:text-white hover:border-white/10 transition-all">
                                {filter} <ChevronDown size={16} />
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <PlusCircle size={18} /> Add Product
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden mb-12 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.02] border-b border-white/5 text-sm font-semibold text-neutral-400">
                                <tr>
                                    <th className="px-4 py-6">Product ID</th>
                                    <th className="px-4 py-6">Image</th>
                                    <th className="px-4 py-6">Product Name</th>
                                    <th className="px-4 py-6">Price</th>
                                    <th className="px-4 py-6">Description</th>
                                    <th className="px-4 py-6">Date Added</th>
                                    <th className="px-4 py-6 text-center">Quantity</th>
                                    <th className="px-4 py-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isFetching ? (
                                    <tr>
                                        <td colSpan="8" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-neutral-500">
                                                <Activity size={32} className="animate-spin text-emerald-500" />
                                                <span className="font-medium text-xs tracking-wide">Loading Inventory...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-neutral-500">
                                                <Boxes size={32} className="opacity-20" />
                                                <span className="font-medium text-sm text-neutral-400">No products found in your inventory.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product, index) => (
                                        <tr key={product._id || index} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-4 py-6 font-semibold text-sm text-emerald-500/70">{product.productId || "---"}</td>
                                            <td className="px-4 py-6">
                                                <div className="w-12 h-12 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center text-neutral-600 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                                                    {product.image && product.image.length > 0 ? (
                                                        <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Recycle size={20} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 font-semibold text-white text-base tracking-tight">{product.name}</td>
                                            <td className="px-4 py-6 font-semibold text-emerald-400 text-base">LKR {product.price?.toLocaleString() || "0"}</td>
                                            <td className="px-4 py-6 text-neutral-500 italic max-w-xs truncate font-medium">{product.description}</td>
                                            <td className="px-4 py-6 text-neutral-400 text-xs font-medium">
                                                {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-GB') : "N/A"}
                                            </td>
                                            <td className="px-4 py-6">
                                                <div className="flex items-center justify-center gap-4 bg-white/5 rounded-2xl p-2 w-32 mx-auto border border-white/5 group-hover:border-white/10 transition-all">
                                                    <button className="p-2 text-neutral-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-6 text-center font-bold text-white">{product.stock ?? product.quantity ?? "0"}</span>
                                                    <button className="p-2 text-neutral-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 text-center border-l border-white/5">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black rounded-2xl transition-all border border-emerald-500/20 hover:border-emerald-500 shadow-lg active:scale-95"
                                                        title="Edit Product"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.productId)}
                                                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20 hover:border-red-500 shadow-lg active:scale-95"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-20 pt-20 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-20">
                        <div className="relative p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
                            <h2 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">Stay Updated</h2>
                            <p className="text-neutral-500 mb-8 font-medium leading-relaxed">Subscribe to receive the latest updates on industrial optimizations and network news.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-light"
                                />
                                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
                            <div>
                                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono mb-6 opacity-60">NETWORK</h3>
                                <ul className="space-y-4 text-neutral-400 font-bold">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Mainframe</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Edge Points</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Relay Chain</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Logs</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono mb-6 opacity-60">RESOURCES</h3>
                                <ul className="space-y-4 text-neutral-400 font-bold">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Documentation</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">API Keys</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Tech Specs</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Whitepaper</li>
                                </ul>
                            </div>
                            <div className="hidden sm:block">
                                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono mb-6 opacity-60">LEGAL</h3>
                                <ul className="space-y-4 text-neutral-400 font-bold">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Privacy</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Security</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Compliance</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer tracking-widest">Uptime</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* --- ADD PRODUCT MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 overflow-y-auto pt-[5vh] pb-[5vh] no-scrollbar">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden my-auto no-scrollbar"
                        >
                            <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none"></div>
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

                            <div className="relative z-10 p-10 md:p-14">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4 text-emerald-500">
                                            <Zap size={20} className="animate-pulse" />
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em]">{isEditMode ? "Modify Product Details" : "New Product Details"}</span>
                                        </div>
                                        <h2 className="text-3xl font-sans font-bold text-white tracking-tight mb-4 leading-none">{isEditMode ? "Update" : "Add New"} <span className="text-emerald-500">Product</span></h2>
                                        <p className="text-neutral-500 font-normal max-w-md text-[15px]">{isEditMode ? "Update the details of your existing product." : "Fill in the details below to list your product."}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-neutral-400 hover:text-white transition-all border border-white/5 shadow-xl"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-neutral-400 pl-2 mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Textile Scrap B01"
                                                className="w-full bg-black/50 border border-white/5 rounded-2xl py-5 px-6 text-white text-base focus:outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-neutral-700 shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-neutral-400 pl-2 mb-1">Alternative Names</label>
                                            <input
                                                type="text"
                                                name="altNames"
                                                value={formData.altNames}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Waste Cotton, Fabric Scraps"
                                                className="w-full bg-black/50 border border-white/5 rounded-2xl py-5 px-6 text-white text-base focus:outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-neutral-700 shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-neutral-400 pl-2 mb-1">Product Category</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-black/50 border border-white/5 rounded-2xl py-5 px-6 text-white text-base focus:outline-none focus:border-emerald-500/50 transition-all font-light shadow-inner appearance-none relative pr-12"
                                            >
                                                <option value="Polymers">Polymers</option>
                                                <option value="Metals">Metals</option>
                                                <option value="BioFuels">BioFuels</option>
                                                <option value="Textiles">Textiles</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-neutral-400 pl-2 mb-1">Price (LKR / Unit)</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 text-sm leading-none font-bold">LKR</span>
                                                <input
                                                    type="number"
                                                    name="valuation"
                                                    value={formData.valuation}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="0.00"
                                                    className="w-full bg-black/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white text-base focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-neutral-400 pl-2 mb-1">Labelled Price (Original LKR)</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 text-sm leading-none font-bold">LKR</span>
                                                <input
                                                    type="number"
                                                    name="labelledPrice"
                                                    value={formData.labelledPrice}
                                                    onChange={handleInputChange}
                                                    placeholder="0.00"
                                                    className="w-full bg-black/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white text-base focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-neutral-400 pl-2 mb-1">Quantity</label>
                                            <input
                                                type="text"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., 500 KG or 20 Tons"
                                                className="w-full bg-black/50 border border-white/5 rounded-2xl py-5 px-6 text-white text-base focus:outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-neutral-700 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest pl-2">Product Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Describe the product's condition, composition, etc..."
                                            rows={4}
                                            className="w-full bg-black/50 border border-white/5 rounded-2xl py-5 px-6 text-white text-base focus:outline-none focus:border-emerald-500/50 transition-all font-light placeholder:text-neutral-700 shadow-inner resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="space-y-4">
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`bg-white/[0.02] border border-dashed border-white/10 p-10 rounded-3xl text-center group transition-all cursor-pointer shadow-inner ${isUploadingImage ? 'opacity-50 pointer-events-none' : 'hover:border-emerald-500/50'}`}
                                        >
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleImageUpload} 
                                                accept="image/*" 
                                                hidden 
                                            />
                                            {isUploadingImage ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                                                    <p className="text-sm text-neutral-400 font-medium">Uploading to secure storage...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto text-neutral-600 group-hover:text-emerald-500 transition-colors mb-4" size={32} />
                                                    <p className="text-sm text-neutral-500 group-hover:text-white transition-colors font-medium">Upload Product Image (Max 10MB)</p>
                                                </>
                                            )}
                                        </div>

                                        {/* Image Previews */}
                                        {formData.image && formData.image.length > 0 && (
                                            <div className="flex flex-wrap gap-4 mt-4">
                                                {formData.image.map((imgUrl, idx) => (
                                                    <div key={idx} className="relative group/img">
                                                        <img src={imgUrl} alt="Product Preview" className="w-24 h-24 object-cover rounded-2xl border border-white/10 shadow-lg" />
                                                        <button 
                                                            type="button" 
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg scale-90 hover:scale-100"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-5 px-10 rounded-2xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest border border-white/10"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-[2] bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-neutral-950 font-bold py-5 px-10 rounded-2xl transition-all duration-500 shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm relative overflow-hidden"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                    {isEditMode ? "Updating Product..." : "Adding Product..."}
                                                </div>
                                            ) : (
                                                <>
                                                    {isEditMode ? "Update Product" : "Add Product"}
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
