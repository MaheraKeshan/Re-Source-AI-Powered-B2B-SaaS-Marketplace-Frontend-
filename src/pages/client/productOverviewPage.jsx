import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    CreditCard,
    ArrowLeft,
    Package,
    Shield,
    Truck,
    Share2,
    Heart,
    ArrowRight,
    Factory,
    Activity,
    Check,
    MapPin,
    Plus,
    Minus,
    MessageSquare
} from "lucide-react";
import Header from "../../components/header";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToCart } from "../../utils/cart";

// --- ANIMATION VARIANTS ---
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

export default function ProductOverviewPage() {
    const params = useParams();
    const productId = params.id;
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    // Fetch Related Products
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "products")
            .then((response) => {
                const otherProducts = response.data.filter(p =>
                    (p._id !== productId && p.productId !== productId)
                ).slice(0, 4);
                setRelatedProducts(otherProducts);
            })
            .catch((error) => {
                console.error("Error fetching related products", error);
            });
    }, [productId]);

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "products/" + productId)
            .then((response) => {
                const fetchedProduct = response.data;
                setProduct(fetchedProduct);
                // Ensure quantity starts at 1 even if stock is 0 for UI testing
                setQuantity(1);
                setStatus("success");
            })
            .catch((error) => {
                console.log(error);
                setStatus("error");
                toast.error("Error fetching product details");
            });
    }, [productId]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`Added ${quantity} unit${quantity > 1 ? 's' : ''} to cart`);
    };

    const handleBuyNow = () => {
        const cartItem = {
            productId: product._id || product.productId,
            name: product.name,
            image: product.image?.length > 0 ? product.image[0] : product.image,
            price: product.price,
            labelledPrice: product.labelledPrice,
            qty: quantity
        };

        navigate("/checkout", {
            state: {
                cart: [cartItem]
            }
        });
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-neutral-400 font-medium text-sm animate-pulse">Loading Product Details...</p>
                </div>
            </div>
        );
    }

    if (status === "error" || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="relative z-10">
                    <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 mb-8 shadow-2xl backdrop-blur-xl">
                        <Package className="w-16 h-16 text-neutral-700 mx-auto mb-6" strokeWidth={1.5} />
                        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Product Not Found</h2>
                        <p className="text-neutral-400 mb-8 max-w-sm mx-auto leading-relaxed">The product you are looking for does not exist or has been removed.</p>
                        <Link to="/products" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 text-base">
                            <ArrowLeft size={18} /> Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-24">
            <Header />

            {/* Background Grain Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-20 contrast-125 z-0">
                <div className="absolute inset-0 bg-neutral-950"></div>
                <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
            </div>

            {/* Breadcrumb / Back Navigation */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-6">
                <Link to="/products" className="inline-flex items-center text-neutral-400 hover:text-emerald-400 transition-all text-sm font-medium gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-all border border-white/5">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    Back to Product List
                </Link>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">

                    {/* --- LEFT COLUMN: IMAGES --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-12 lg:mb-0"
                    >
                        <div className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-4 border border-white/5 lg:sticky lg:top-32 shadow-2xl relative group">
                            {/* Decorative Corner */}
                            <div className="absolute -top-1 -left-1 w-10 h-10 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-[3rem] pointer-events-none"></div>

                            <div className="flex justify-center bg-neutral-900 rounded-[2.5rem] overflow-hidden aspect-[4/3] relative border border-white/5">
                                {product.image && (product.image.length > 0 || typeof product.image === 'string') ? (
                                    <div className="w-full h-full [&>div]:w-full [&>div]:h-full [&_img]:h-full [&_img]:object-contain group-hover:scale-105 transition-transform duration-1000 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100">
                                        <ImageSlider images={Array.isArray(product.image) ? product.image : [product.image]} />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full bg-neutral-900 text-neutral-800">
                                        <Package size={84} strokeWidth={1} />
                                    </div>
                                )}

                                {/* Image Overlay Badges */}
                                <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                                    {product.category && (
                                        <span className="bg-emerald-500 text-neutral-950 text-sm font-semibold px-4 py-2 rounded-xl shadow-2xl border border-emerald-400/20">
                                            {product.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT COLUMN: PRODUCT DETAILS --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="flex flex-col"
                    >
                        {/* Header Info */}
                        <div className="mb-10 border-b border-white/5 pb-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-sm font-medium">
                                        <Activity size={14} /> Available
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-neutral-400 text-sm font-medium">

                                        {/* UPDATED: Passing producerId safely */}
                                        <Link
                                            to="/communication"
                                            state={{
                                                producerId: product.producerId || product.userId || product.ownerId,
                                                producerName: product.producerName
                                            }}
                                            className="text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 group/producer"
                                            title="Message Producer"
                                        >
                                            Producer: <span className="underline underline-offset-4 decoration-emerald-500/20 group-hover/producer:decoration-emerald-400/50">{product.producerName}</span>
                                            <MessageSquare size={14} className="opacity-0 group-hover/producer:opacity-100 transition-opacity" />
                                        </Link>

                                        {product.altNames && product.altNames.length > 0 && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
                                                <span className="text-neutral-500 italic font-sans normal-case tracking-tight">{product.altNames.join(", ")}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center shadow-xl">
                                    <Heart size={20} />
                                </button>
                            </div>

                            <div className="flex items-end gap-5 mt-8">
                                <span className="text-5xl font-bold text-white tracking-tight">
                                    <span className="text-xl text-emerald-500 mr-2">Rs.</span>
                                    {product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                                {product.labelledPrice > product.price && (
                                    <div className="flex flex-col mb-1">
                                        <span className="text-base text-neutral-500 line-through decoration-emerald-500/30">
                                            Rs. {product.labelledPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-lg mt-1 border border-emerald-500/20">
                                            {Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}% Off
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                Description
                            </h3>
                            <p className="text-neutral-300 leading-relaxed text-base">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>

                        {/* Features / Trust Badges */}
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all group">
                                <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform"><Shield size={20} /></div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Verified Product</p>
                                    <p className="text-xs text-neutral-400 mt-1">Authentic Source</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all group">
                                <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Truck size={20} /></div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Fast Delivery</p>
                                    <p className="text-xs text-neutral-400 mt-1">Island-wide Shipping</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-10">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                Select Quantity
                            </h3>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-2 h-14 w-40 shadow-inner relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 relative z-10"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="flex-1 text-center font-bold text-lg text-white select-none relative z-10">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(prev => Math.min(product.stock || 99, prev + 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 relative z-10"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-semibold text-base ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                    </span>
                                    {product.stock > 0 && (
                                        <span className="text-sm text-neutral-400 mt-1">
                                            {product.stock} units available
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col ml-auto text-right">
                                    <span className="text-sm text-neutral-400 mb-1">Total Amount</span>
                                    <span className="font-bold text-emerald-500 text-xl">
                                        Rs. {(product.price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-5 mt-auto">
                            {/* UPDATED: Added Negotiate Button alongside Cart and Purchase */}
                            <button
                                onClick={() => navigate('/communication', {
                                    state: {
                                        producerId: product.producerId || product.userId || product.ownerId,
                                        producerName: product.producerName
                                    }
                                })}
                                className="flex-1 bg-white/[0.03] border border-white/10 text-white font-semibold py-4 px-6 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center justify-center gap-2 text-base group"
                            >
                                <MessageSquare size={18} className="group-hover:scale-110 transition-transform" /> Message
                            </button>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-white/[0.03] border border-white/10 text-white font-semibold py-4 px-6 rounded-xl hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 text-base group"
                            >
                                <ShoppingCart size={18} className="group-hover:translate-y-[-2px] transition-transform" /> Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-emerald-500 text-neutral-950 font-semibold py-4 px-6 rounded-xl hover:bg-emerald-400 shadow-xl shadow-emerald-500/10 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-base"
                            >
                                <CreditCard size={18} /> Buy Now
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                            <button className="text-neutral-400 text-sm font-medium flex items-center gap-2 hover:text-emerald-400 transition-all group">
                                <Share2 size={18} className="group-hover:rotate-12 transition-transform" /> Share Product
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* --- RELATED PRODUCTS SECTION --- */}
                <div className="mt-32 border-t border-white/5 pt-20">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Similar <span className="text-emerald-500">Products</span>
                        </h2>
                        <Link to="/products" className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-2 group">
                            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((item, index) => (
                            <RelatedProductCard
                                key={item._id || item.productId}
                                id={item._id || item.productId}
                                name={item.name}
                                category={item.category}
                                price={`RS. ${item.price?.toLocaleString()}`}
                                tag={item.tag || "Available"}
                                location={item.location || "SRI LANKA"}
                                image={Array.isArray(item.image) ? item.image[0] : item.image}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Reusable Related Product Card
function RelatedProductCard({ id, name, category, price, tag, location, image, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white/[0.03] rounded-[2rem] overflow-hidden transition-all duration-700 border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5 cursor-pointer h-full flex flex-col backdrop-blur-xl"
        >
            <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden shrink-0 border-b border-white/5">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>

                <div className="absolute top-4 right-4 bg-emerald-500 text-neutral-950 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xl border border-emerald-400/20">
                    {tag}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow relative z-10">
                <div className="absolute -top-6 right-6 w-12 h-12 bg-neutral-950 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
                    <ArrowRight size={18} className="text-neutral-700 group-hover:text-emerald-500 transition-colors" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <Factory size={14} className="text-emerald-500/50" />
                    <span className="text-sm font-medium text-neutral-400">{category}</span>
                </div>

                <h3 className="font-semibold text-lg text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {name}
                </h3>

                <div className="mt-auto pt-5 border-t border-white/5 flex justify-between items-center">
                    <span className="text-white font-bold text-base">{price}</span>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-400 font-medium">
                        <MapPin size={14} className="text-emerald-500/50" /> {location}
                    </div>
                </div>
            </div>

            <Link
                to={`/product/${id}`}
                className="absolute inset-0 z-20"
                aria-label={`View ${name}`}
                onClick={() => window.scrollTo(0, 0)}
            />
        </motion.div>
    );
}