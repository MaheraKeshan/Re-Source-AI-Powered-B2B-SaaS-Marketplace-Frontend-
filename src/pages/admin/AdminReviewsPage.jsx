/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  RefreshCw,
  ChevronDown,
  X,
  Star,
  MessageSquare,
  Filter,
  ShieldCheck,
  Database,
  Activity,
  SearchCode,
  Sparkles,
  Trash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import toast from "react-hot-toast";

Modal.setAppElement('#root');

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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState(null);
  const [filterProduct, setFilterProduct] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication missing");
      setIsLoading(false);
      return;
    }

    axios.get(import.meta.env.VITE_BACKEND_URL + "reviews", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        setReviews(res.data.reviews);
        setIsLoading(false);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Failed to load reviews");
        setIsLoading(false);
      });
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "products", {
        headers: { Authorization: "Bearer " + token }
      });
      setProducts(response.data);
    } catch (e) {
      toast.error("Failed to load products");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}reviews/${reviewId}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      setReviews(reviews.filter(review => review._id !== reviewId));
      toast.success("Review deleted successfully");
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter(review =>
    filterProduct === "all" || review.productId === filterProduct
  );

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : "Unknown Product";
  };

  const openReviewDetails = (review) => {
    setActiveReview(review);
    setIsModalOpen(true);
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
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-600 text-sm font-medium">
              <MessageSquare size={16} className="text-emerald-500" />
              Customer Reviews
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white">
              Manage <span className="text-emerald-500">Reviews.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-base text-neutral-400 max-w-2xl">
              Monitor and manage customer feedback and reviews across all your products.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-all appearance-none"
              >
                <option value="all" className="bg-neutral-900">All Products</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id} className="bg-neutral-900">
                    {product.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
            </div>
            <button
              onClick={fetchReviews}
              className="p-4.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all active:scale-95 group shadow-xl"
            >
              <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''} transition-transform group-hover:rotate-180`} />
            </button>
          </motion.div>
        </motion.div>

        {/* Reviews Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-neutral-400 text-sm animate-pulse">Loading reviews...</p>
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
                <thead className="bg-white/5 border-b border-white/5 text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">PRODUCT</th>
                    <th className="py-4 px-6">CUSTOMER</th>
                    <th className="py-4 px-6">RATING</th>
                    <th className="py-4 px-6">REVIEW</th>
                    <th className="py-4 px-6">DATE</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  <AnimatePresence>
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <motion.tr
                          key={review._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-white">{getProductName(review.productId)}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-white">{review.userName}</div>
                            <div className="text-sm text-neutral-500">{review.userEmail}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-emerald-400 font-medium text-sm">
                              <Star size={14} fill="currentColor" />
                              {review.rating}/5
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="max-w-xs truncate text-neutral-400 text-sm group-hover:text-neutral-200 transition-colors" title={review.comment}>
                              {review.comment || "No comment"}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-neutral-400 text-sm">
                              {new Date(review.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => openReviewDetails(review)}
                                className="p-2 bg-white/5 border border-white/5 rounded-lg hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all active:scale-95 text-emerald-400"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => deleteReview(review._id)}
                                className="p-2 bg-white/5 border border-white/5 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95 text-red-500"
                                title="Delete Review"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-50">
                            <MessageSquare size={48} className="text-neutral-400" />
                            <p className="text-neutral-400 text-sm">No reviews found</p>
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

        {/* Review Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="bg-transparent outline-none flex items-center justify-center h-full pointer-events-none"
          overlayClassName="fixed inset-0 bg-neutral-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        >
          {activeReview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-neutral-900 rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden pointer-events-auto relative"
            >
              {/* Background Noise */}
              <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

              {/* Modal Header */}
              <div className="relative z-10 bg-white/5 px-8 py-6 border-b border-white/5 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm text-emerald-500 font-medium">Review Details</div>
                  <h2 className="text-2xl font-bold text-white">
                    Customer Review
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 border border-white/5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="relative z-10 p-10 space-y-8">
                {/* User & Product Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner">
                  <div>
                    <p className="text-sm font-semibold text-neutral-400 mb-2">PRODUCT</p>
                    <p className="font-medium text-white text-lg">
                      {getProductName(activeReview.productId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-400 mb-2">CUSTOMER</p>
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-lg">{activeReview.userName}</span>
                      <span className="text-sm text-neutral-400 mt-1">{activeReview.userEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Date */}
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className={`${i < activeReview.rating ? 'text-emerald-400 fill-emerald-400' : 'text-white/5'}`} />
                    ))}
                    <span className="ml-2 font-bold text-emerald-400 text-xl">{activeReview.rating}/5</span>
                  </div>
                  <div className="text-sm text-neutral-400">
                    Posted on {new Date(activeReview.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Comment Box */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-neutral-400 px-2">REVIEW</p>
                  <div className="bg-neutral-950 p-6 rounded-xl border border-white/5 text-neutral-300 leading-relaxed text-base relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                    "{activeReview.comment || "No comment provided."}"
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="relative z-10 bg-white/5 px-8 py-6 border-t border-white/5 flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-neutral-400 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all active:scale-95 text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => deleteReview(activeReview._id)}
                  className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-medium rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center gap-2 text-sm shadow-lg shadow-red-500/10"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </Modal>
      </div>
    </div>
  );
}
