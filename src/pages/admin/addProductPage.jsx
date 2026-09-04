/* eslint-disable no-unused-vars */
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import mediaUpload from '../../utils/mediaUpload'
import axios from 'axios'
import {
    Upload,
    X,
    ArrowLeft,
    DollarSign,
    Package,
    Tag,
    Plus,
    Check,
    ShieldCheck,
    Database,
    Zap,
    Activity,
    Boxes,
    FileText,
    Image as ImageIcon,
    Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        altNames: '',
        description: '',
        images: [],
        previewImages: [],
        labelledPrice: '',
        price: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }))

        const newPreviewUrls = files.map(file => URL.createObjectURL(file))
        setFormData(prev => ({
            ...prev,
            previewImages: [...prev.previewImages, ...newPreviewUrls]
        }))
    }

    const removeImage = (index) => {
        const newPreviews = [...formData.previewImages]
        newPreviews.splice(index, 1)
        setFormData(prev => ({
            ...prev,
            previewImages: newPreviews,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    async function handleAddProduct() {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Failed: Authentication Missing")
            return
        }
        if (!formData.images || formData.images.length <= 0) {
            toast.error("Failed: Please upload an image")
            return
        }

        setIsSubmitting(true)

        try {
            const uploadPromises = formData.images.map(file => mediaUpload(file))
            const imageURLs = await Promise.all(uploadPromises)

            const product = {
                productId: formData.productId,
                name: formData.name,
                altNames: formData.altNames.split(",").map(s => s.trim()).filter(s => s),
                description: formData.description,
                image: imageURLs,
                labelledPrice: Number(formData.labelledPrice),
                price: Number(formData.price),
            }

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}products`, product, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })

            toast.success("Product successfully added", {
                duration: 4000,
                icon: <Check className="text-emerald-500" />
            })
            navigate("/admin/products")
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || "Failed to add product")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-24 relative overflow-hidden">

            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
                <div className="absolute inset-0 bg-neutral-950"></div>
                <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 lg:pt-40">

                {/* Header Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="group flex items-center gap-2 text-neutral-400 hover:text-emerald-400 transition-colors font-sans text-sm font-semibold tracking-wide"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Products
                    </button>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                            <Plus size={24} className="text-emerald-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">
                            Add <span className="text-emerald-500">Product.</span>
                        </h1>
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative"
                >
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] pointer-events-none"></div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Section 1: Core Identity */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <Database size={18} className="text-emerald-500" />
                                <h2 className="text-sm font-sans font-semibold text-neutral-300 uppercase tracking-wide">Product Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-neutral-300 px-2">Product ID *</label>
                                    <div className="relative group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            name="productId"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder:text-neutral-500 outline-none focus:border-emerald-500/50 transition-all font-sans text-sm"
                                            value={formData.productId}
                                            onChange={handleChange}
                                            placeholder="IS-0001"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-neutral-300 px-2">Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-neutral-500 outline-none focus:border-emerald-500/50 transition-all font-sans font-semibold text-lg"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter Product Name..."
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-neutral-300 px-2">Alternative Names (Comma Separated)</label>
                                    <input
                                        type="text"
                                        name="altNames"
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-neutral-300 placeholder:text-neutral-500 outline-none focus:border-emerald-500/50 transition-all font-sans text-sm"
                                        value={formData.altNames}
                                        onChange={handleChange}
                                        placeholder="Variant A, Mk II, Edition Prime..."
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-neutral-300 px-2">Product Description *</label>
                                    <textarea
                                        rows={4}
                                        name="description"
                                        required
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-[2rem] px-6 py-6 text-neutral-300 placeholder:text-neutral-500 outline-none focus:border-emerald-500/50 transition-all font-sans leading-relaxed resize-none text-sm"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter detailed product description..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Visual Telemetry */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <ImageIcon size={18} className="text-emerald-500" />
                                <h2 className="text-sm font-sans font-semibold text-neutral-300 uppercase tracking-wide">Product Images</h2>
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence>
                                    {formData.previewImages.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                                        >
                                            {formData.previewImages.map((img, index) => (
                                                <motion.div
                                                    key={index}
                                                    layout
                                                    className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                                                >
                                                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 active:scale-90 transition-all shadow-lg"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <label className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02] hover:bg-emerald-500/[0.03] hover:border-emerald-500/30 transition-all cursor-pointer group group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="p-5 bg-white/5 border border-white/10 rounded-full mb-4 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 transition-all relative z-10">
                                        <Upload className="w-8 h-8 text-neutral-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                                    </div>
                                    <p className="text-neutral-400 text-sm font-sans font-bold tracking-wide mb-1 relative z-10">
                                        Upload Image
                                    </p>
                                    <p className="text-neutral-500 text-xs font-sans tracking-wide relative z-10">SVG, PNG, JPG (MAX. 5MB)</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        multiple
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Section 3: Value Assessment */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <DollarSign size={18} className="text-emerald-500" />
                                <h2 className="text-sm font-sans font-semibold text-neutral-300 uppercase tracking-wide">Pricing Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-neutral-300 px-2">Regular Price (LKR)</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 font-sans font-medium text-neutral-500">LKR</div>
                                        <input
                                            type="number"
                                            name="labelledPrice"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-sans font-semibold text-xl"
                                            value={formData.labelledPrice}
                                            onChange={handleChange}
                                            placeholder="5000.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-neutral-300 px-2">Sale Price (LKR)</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 font-sans font-medium text-emerald-500/50">LKR</div>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-white/[0.05] border border-emerald-500/20 rounded-2xl pl-16 pr-6 py-4 text-emerald-400 outline-none focus:border-emerald-500 transition-all font-sans font-semibold text-xl"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="4500.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-12 border-t border-white/5 mt-12">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-neutral-400 font-semibold hover:bg-white/10 hover:text-white transition-all active:scale-95 text-sm font-sans"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddProduct}
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-sans shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Activity size={18} className="animate-spin" />
                                        Saving Product...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Save Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}