/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, X, Star, Send, ArrowLeft, Edit, Package, MessageSquare, Filter, ShieldCheck, Recycle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../../components/loading";
import Header from "../../components/header";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
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

export default function ReviewsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  // Product search handler
  const handleSearch = useCallback(async (searchQuery) => {
    if (searchQuery.length === 0) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}products/search/${encodeURIComponent(searchQuery)}`
      );

      // Fetch reviews for each product in parallel
      const productsWithReviews = await Promise.all(
        response.data.map(async (product) => {
          try {
            const reviewsResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}reviews/product/${product._id}`
            );
            const reviews = reviewsResponse.data || [];

            // Calculate average rating and count
            const averageRating = reviews.length > 0
              ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
              : 0;

            return {
              ...product,
              reviews,
              averageRating: parseFloat(averageRating),
              reviewCount: reviews.length
            };
          } catch (error) {
            console.error(`Error fetching reviews for product ${product._id}:`, error);
            return {
              ...product,
              reviews: [],
              averageRating: 0,
              reviewCount: 0
            };
          }
        })
      );

      setProducts(productsWithReviews);
      setHasSearched(true);
    } catch (error) {
      toast.error("Error fetching inventory data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        handleSearch(value);
      }, 500)
    );
  };

  const clearSearch = () => {
    setQuery("");
    setProducts([]);
    setHasSearched(false);
    if (typingTimeout) clearTimeout(typingTimeout);
  };

  // Load user reviews and product reviews for selected product
  useEffect(() => {
    if (selectedProduct) {
      loadUserReviews();
      loadProductReviews();
    }
  }, [selectedProduct]);

  const loadUserReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}reviews/user/${selectedProduct._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserReviews(response.data || []);
    } catch (error) {
      console.error("Error loading partner reviews:", error);
    }
  };

  const loadProductReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}reviews/product/${selectedProduct._id}`
      );

      setProductReviews(response.data || []);
    } catch (error) {
      console.error("Error loading product reviews:", error);
      toast.error("Failed to load feedback history");
      setProductReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Submit review handler
  const submitReview = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Please select an item first");
      return;
    }

    if (review.comment.trim().length < 10) {
      toast.error("Please provide detailed feedback (min 10 characters)");
      return;
    }

    try {
      setIsLoading(true);

      const reviewData = {
        productId: selectedProduct._id,
        rating: review.rating,
        comment: review.comment,
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Feedback submitted!");
      setReview({ rating: 5, comment: "" });
      loadUserReviews();
      loadProductReviews();
    } catch (error) {
      console.error("Submission error:", error);

      if (error.response?.status === 401) {
        toast.error("Please log in to submit feedback");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit feedback");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate average rating for product
  const calculateAverageRating = () => {
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  // Star rating component
  const StarRating = ({ rating, setRating, disabled = false, size = "md" }) => {
    const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-6 w-6";
    const gapSize = size === "sm" ? "space-x-1" : "space-x-1.5";

    return (
      <div className={`flex items-center ${gapSize}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && setRating(star)}
            className={`focus:outline-none transition-transform ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            disabled={disabled}
          >
            <Star
              className={`${starSize} transition-colors duration-200 ${star <= rating ? "text-emerald-400 fill-emerald-400" : "text-neutral-700"
                }`}
            />
          </button>
        ))}
        {size !== "sm" && (
          <span className="ml-3 text-neutral-400 font-mono text-xs font-bold uppercase tracking-wider">
            {Number(rating).toFixed(1)} / 5.0
          </span>
        )}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-white selection:bg-emerald-500/30 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-neutral-950/80"></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] mix-blend-overlay animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] px-5 py-2 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8">
              <MessageSquare size={14} /> Product Reviews
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-8">
              {selectedProduct ? (
                <>Submit <span className="text-emerald-500">Review</span></>
              ) : (
                <>Product <span className="text-emerald-500">Reviews.</span></>
              )}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-4 font-medium">
              {selectedProduct
                ? `Submit your review for: ${selectedProduct.name}`
                : "Search for a product to read or submit a review."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto -mt-8 relative z-10 pb-24">

        {/* Product Search Section */}
        {!selectedProduct && (
          <div className="w-full max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group z-20"
            >
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
              <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-2xl flex items-center p-2 border border-white/10 group-focus-within:border-emerald-500/50 transition-all">
                <div className="pl-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Search for a product..."
                  className="w-full px-5 py-5 bg-transparent text-white font-medium placeholder-neutral-400 focus:outline-none text-lg"
                  value={query}
                  onChange={handleInputChange}
                  autoFocus
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="p-3 mr-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Search Results */}
            <AnimatePresence>
              {query.length === 0 && !hasSearched ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="bg-white/5 p-6 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/5 rotate-3 hover:rotate-0 transition-transform duration-500 text-emerald-500 shadow-lg shadow-emerald-500/10">
                    <Package className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Search Products
                  </h3>
                  <p className="text-neutral-400 max-w-sm mx-auto font-medium">
                    Enter a product name to see its reviews and ratings.
                  </p>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-48"
                >
                  <Loading />
                </motion.div>
              ) : products.length === 0 && hasSearched ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="bg-white/5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <Search className="h-8 w-8 text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Item Not Found
                  </h3>
                  <p className="text-neutral-400">
                    We couldn't locate any inventory items matching "<span className="font-semibold text-emerald-500">{query}</span>"
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 cursor-pointer transition-all duration-500 group relative overflow-hidden backdrop-blur-sm shadow-xl"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex items-start gap-6">
                        <div className="shrink-0 bg-neutral-900 rounded-2xl p-3 border border-white/5 h-24 w-24 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                          <img
                            src={product.image || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain mix-blend-lighten"
                            onError={(e) => {
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 py-2">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors pr-2">
                              {product.name}
                            </h3>
                            <ArrowLeft className="rotate-180 text-neutral-600 group-hover:text-emerald-500 transition-colors shrink-0" size={18} />
                          </div>
                          <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold opacity-60">
                            PRODUCT ID: {product._id.substring(0, 8)}
                          </p>

                          <div className="flex flex-wrap gap-3 items-center">
                            {product.category && (
                              <span className="inline-flex items-center bg-white/5 text-neutral-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg border border-white/5">
                                {product.category}
                              </span>
                            )}
                            {product.averageRating > 0 && (
                              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-inner">
                                <Star className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                                <span className="text-[11px] font-bold text-emerald-400">
                                  {product.averageRating.toFixed(1)}
                                </span>
                                <span className="text-xs text-emerald-400/50">
                                  [{product.reviewCount}]
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Selected Product & Review Form */}
        {selectedProduct && (
          <div className="space-y-8">

            {/* Header / Navigation Back */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/10"
            >
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setUserReviews([]);
                    setProductReviews([]);
                    setReview({ rating: 5, comment: "" });
                  }}
                  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-neutral-400 hover:text-emerald-400 transition-all group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1 opacity-70">PRODUCT ID: {selectedProduct._id.substring(0, 8)}</p>
                </div>
              </div>
              {selectedProduct.category && (
                <span className="hidden sm:inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  {selectedProduct.category}
                </span>
              )}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">

              {/* Left Column: Review Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/5 sticky top-32">
                  <h3 className="font-bold text-white mb-10 flex items-center gap-4 text-xl border-b border-white/5 pb-6">
                    <Edit className="text-emerald-500" size={24} />
                    Write a Review
                  </h3>

                  <form onSubmit={submitReview} className="space-y-8">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
                        Rating
                      </label>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex justify-center hover:border-emerald-500/20 transition-all shadow-inner">
                        <StarRating
                          rating={review.rating}
                          setRating={(rating) => setReview({ ...review, rating })}
                          size="lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="comment"
                        className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3"
                      >
                        Review Comment
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={7}
                        className="block w-full text-sm border border-white/10 rounded-2xl p-5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 bg-white/5 text-white placeholder-neutral-600 focus:bg-white/[0.08] transition-all resize-none shadow-xl"
                        placeholder="Share your experience with this product..."
                        value={review.comment}
                        onChange={(e) =>
                          setReview({ ...review, comment: e.target.value })
                        }
                        required
                        minLength={10}
                        maxLength={500}
                      />
                      <div className="flex justify-between mt-3 px-1">
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">MIN 10 CHARACTERS</p>
                        <p className={`text-xs font-bold tracking-wider ${review.comment.length >= 500 ? 'text-red-500' : 'text-neutral-400'}`}>
                          {review.comment.length}/500
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || review.comment.trim().length < 10}
                      className="w-full inline-flex items-center justify-center px-8 py-5 border border-transparent text-sm font-bold rounded-2xl shadow-xl shadow-emerald-500/10 text-neutral-950 bg-emerald-500 hover:bg-emerald-400 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none transition-all uppercase tracking-wider"
                    >
                      {isLoading ? (
                        <>
                          <Loading className="w-5 h-5 mr-3" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-3 h-5 w-5" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* Right Column: Reviews List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* User's Past Reviews */}
                {userReviews.length > 0 && (
                  <div className="bg-emerald-500/[0.03] p-8 rounded-[2.5rem] border border-emerald-500/10 shadow-2xl">
                    <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-8 flex items-center gap-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> YOUR REVIEWS
                    </h3>
                    <div className="space-y-6">
                      {userReviews.map((userReview) => (
                        <div key={userReview._id} className="bg-white/5 p-6 rounded-2xl shadow-inner border border-white/5 hover:border-emerald-500/20 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <span className="bg-emerald-500 text-neutral-950 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">VERIFIED</span>
                              <span className="text-[11px] text-neutral-400 font-bold">{formatDate(userReview.date)}</span>
                            </div>
                            <StarRating rating={userReview.rating} disabled={true} size="sm" />
                          </div>
                          <p className="text-neutral-400 text-sm leading-relaxed font-medium">"{userReview.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Reviews */}
                <div className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/5 min-h-[500px]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-8 border-b border-white/5 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">CUSTOMER REVIEWS</h4>
                      <h3 className="text-2xl font-bold text-white">Overall Rating</h3>
                      <p className="text-sm text-neutral-400 mt-2 font-medium">Based on reviews from verified customers</p>
                    </div>
                    {productReviews.length > 0 && (
                      <div className="flex items-center gap-6 bg-white/5 px-6 py-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-emerald-400 leading-none">{calculateAverageRating()}</div>
                          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-2">{productReviews.length} REVIEWS</p>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div className="flex justify-end">
                          <StarRating rating={parseFloat(calculateAverageRating())} disabled={true} size="sm" />
                        </div>
                      </div>
                    )}
                  </div>

                  {reviewsLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loading />
                    </div>
                  ) : productReviews.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-[2rem] border border-white/5 border-dashed">
                      <div className="mx-auto h-20 w-20 text-neutral-700 mb-6 bg-neutral-900 rounded-2xl flex items-center justify-center shadow-xl border border-white/5">
                        <MessageSquare className="h-10 w-10 opacity-40" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-500 mb-2">NO REVIEWS YET</h4>
                      <p className="text-sm text-neutral-600 font-medium">
                        Be the first to review this product.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {productReviews.map((productReview) => (
                        <div key={productReview._id} className="group border-b border-white/5 pb-10 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-5">
                              <div className="h-12 w-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-lg font-bold text-emerald-500 border border-white/10 shadow-xl group-hover:border-emerald-500/30 transition-colors">
                                {productReview.userName ? productReview.userName.charAt(0) : 'R'}
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                                  {productReview.userName || 'Customer'}
                                </h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">{formatDate(productReview.date)}</p>
                                  {productReview.verifiedPurchase && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                      <ShieldCheck className="mr-1.5 h-3 w-3" /> VERIFIED PURCHASE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="ml-16">
                            <div className="mb-4">
                              <StarRating rating={productReview.rating} disabled={true} size="sm" />
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative group-hover:bg-white/[0.08] transition-all group-hover:border-emerald-500/20">
                              <span className="absolute -top-4 -left-2 text-6xl text-emerald-500/10 font-serif leading-none select-none italic">"</span>
                              <p className="relative z-10 text-neutral-400 text-sm leading-relaxed font-medium">{productReview.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}