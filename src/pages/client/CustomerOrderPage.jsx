/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  Clock,
  XCircle,
  CheckCircle,
  Truck,
  MapPin,
  Info,
  ChevronDown,
  ChevronUp,
  Box,
  Search,
  Activity,
  Calendar,
  CreditCard,
  User,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../components/loading";
import Header from "../../components/header";

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

export default function CustomerOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error(error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error("Failed to load your order history");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}orders/${orderId}/canceled`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order cancelled successfully");

      setOrders(orders.map(order =>
        order.orderId === orderId ? { ...order, status: "canceled" } : order
      ));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getProgressStep = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return 1;
      case "processing": return 2;
      case "dispatched":
      case "in transit": return 3;
      case "delivered": return 4;
      case "canceled": return 0;
      default: return 1;
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-24">
      <Header />

      {/* Hero / Header Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-neutral-950/80"></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] mix-blend-overlay animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] px-5 py-2 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8">
                <Activity size={12} className="text-emerald-500" />
                Order History
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6">
                My <span className="text-emerald-500 text-glow-emerald">Orders.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-neutral-400 max-w-2xl leading-relaxed font-medium">
                View and manage your recent orders. Track delivery progress and view your complete order history.
              </motion.p>
            </div>
            <motion.div variants={fadeInUp} className="flex gap-4">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex flex-col gap-1 min-w-[120px]">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">ACTIVE ORDERS</span>
                <span className="text-2xl font-bold text-emerald-400">{orders.filter(o => o.status !== 'delivered' && o.status !== 'canceled').length}</span>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex flex-col gap-1 min-w-[120px]">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">DELIVERED</span>
                <span className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'delivered').length}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 font-bold uppercase tracking-wider text-xs animate-pulse">Loading Orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white/[0.02] backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-2xl"
          >
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <Package className="text-emerald-500 text-5xl" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No Orders Found</h3>
            <p className="text-neutral-400 mb-12 max-w-md font-medium leading-relaxed">
              You haven't placed any orders yet. Start exploring our marketplace today.
            </p>
            <a href="/products" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20 active:scale-95 uppercase tracking-wider text-sm">
              Start Shopping
            </a>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {orders.map((order, index) => (
              <OrderCard
                key={order.orderId}
                order={order}
                isExpanded={expandedId === order.orderId}
                onToggle={() => toggleExpand(order.orderId)}
                onCancel={(e) => handleCancelOrder(order.orderId, e)}
                cancellingId={cancellingId}
                progressStep={getProgressStep(order.status)}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

function OrderCard({ order, isExpanded, onToggle, onCancel, cancellingId, progressStep, index }) {
  const isCancelled = order.status.toLowerCase() === 'canceled';

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
      case "processing": return "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
      case "dispatched":
      case "in transit": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      case "delivered": return "bg-emerald-500 text-neutral-950 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
      case "canceled": return "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
      default: return "bg-white/5 text-neutral-400 border-white/10";
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border transition-all duration-700 overflow-hidden group shadow-2xl ${isExpanded ? 'border-emerald-500/30 ring-1 ring-emerald-500/10' : 'border-white/5 hover:border-white/10'}`}
    >
      {/* Background Glow on Expand */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* --- Card Header --- */}
      <div
        onClick={onToggle}
        className="p-8 md:p-10 cursor-pointer relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-10 lg:items-center">

          {/* Left: ID & Core Meta */}
          <div className="flex items-center gap-6 min-w-[300px]">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110 ${isCancelled ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
              <Package size={28} />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">#{order.orderId}</h3>
                <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-500 ${getStatusStyles(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                <Calendar size={12} className="text-emerald-500/50" />
                {new Date(order.date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                <span className="w-1 h-1 rounded-full bg-white/10"></span>
                <Clock size={12} className="text-emerald-500/50" />
                {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Middle: Live Progress Telemetry */}
          {!isCancelled && (
            <div className="flex-1 hidden md:block px-8 relative">
              <div className="flex justify-between mb-4">
                {['Pending', 'Processing', 'Dispatch', 'Arrival'].map((step, i) => (
                  <span key={step} className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${progressStep >= i + 1 ? "text-emerald-400" : "text-neutral-500"}`}>
                    {step}
                  </span>
                ))}
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.max(0, progressStep) / 4) * 100}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                />
                {/* Micro Animated Pulse on current step */}
                {!isCancelled && progressStep < 4 && (
                  <motion.div
                    animate={{ x: [`${(progressStep / 4) * 100}%`, `${(progressStep / 4) * 100 + 5}%`, `${(progressStep / 4) * 100}%`] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                )}
              </div>
            </div>
          )}

          {/* Right: Valuation & Toggle */}
          <div className="flex items-center justify-between lg:justify-end gap-10 min-w-[200px]">
            <div className="text-right">
              <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">TOTAL AMOUNT</span>
              <span className="text-3xl font-bold text-white">
                <span className="text-sm text-emerald-500/50 mr-1.5 uppercase font-bold tracking-wider">RS</span>
                {order.total.toLocaleString()}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-[1.25rem] border flex items-center justify-center transition-all duration-700 ${isExpanded ? 'bg-emerald-500 text-neutral-950 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/5 text-neutral-500'}`}>
              <ChevronDown className={`transition-transform duration-700 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* --- Expanded Details --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/5 bg-white/[0.01]"
          >
            <div className="p-8 md:p-12 lg:p-16 grid lg:grid-cols-3 gap-16">

              {/* Order Items List */}
              <div className="lg:col-span-2 space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-3">
                    <Box size={16} className="text-emerald-500" /> ORDERED ITEMS
                  </h4>
                  <span className="text-xs font-bold text-emerald-500/50 uppercase tracking-wider">{order.products.length} Item{order.products.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="space-y-6">
                  {order.products.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-6 bg-white/[0.02] p-5 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all duration-500 group/item"
                    >
                      <div className="w-20 h-20 bg-neutral-900 rounded-2xl shrink-0 overflow-hidden border border-white/5 group-hover/item:border-emerald-500/30 transition-all">
                        <img
                          src={item.productInfo.image[0] || "/placeholder-product.jpg"}
                          alt={item.productInfo.name}
                          className="w-full h-full object-contain grayscale opacity-80 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700 p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-lg tracking-tight mb-1">{item.productInfo.name}</p>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">PRICE: RS. {item.productInfo.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right px-6 border-x border-white/5">
                        <span className="block text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">QUANTITY</span>
                        <span className="block font-bold text-white text-2xl">{item.quantity}</span>
                      </div>
                      <div className="text-right pl-6 min-w-[120px]">
                        <span className="block text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1">SUBTOTAL</span>
                        <span className="block font-bold text-emerald-400 text-lg">RS. {(item.quantity * item.productInfo.price).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar Config / Shipping */}
              <div className="space-y-10">
                <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] pointer-events-none"></div>

                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-8 border-b border-white/5 pb-4">DELIVERY ADDRESS</h4>

                  <div className="space-y-8">
                    <div className="group">
                      <p className="text-xs text-emerald-500/50 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MapPin size={12} /> SHIPPING ADDRESS
                      </p>
                      <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 text-sm font-medium text-neutral-300 leading-relaxed group-hover:border-emerald-500/20 transition-all duration-500">
                        {order.address}
                      </div>
                    </div>

                    {order.driver?.name && order.driver.name !== "Pending" ? (
                      <div>
                        <p className="text-xs text-emerald-500/50 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Truck size={12} /> DELIVERY DRIVER
                        </p>
                        <div className="flex items-center gap-5 bg-emerald-500/[0.03] p-5 rounded-2xl border border-emerald-500/10">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/20">
                            {order.driver.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-bold tracking-tight">{order.driver.name}</p>
                            <p className="text-xs text-emerald-500/70 font-bold uppercase tracking-wider">{order.driver.vehicleNo}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      !isCancelled && (
                        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-4 group/pending">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">AWAITING ASSIGNMENT</p>
                            <p className="text-xs text-amber-400/50 font-medium">Pending driver assignment...</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Logistics Support & Terminal Actions */}
                <div className="space-y-4">
                  <a href="/track-order" className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold tracking-wider uppercase hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-500 flex items-center justify-center gap-3 group shadow-xl">
                    <Activity size={16} className="group-hover:animate-spin-slow" /> TRACK ORDER
                  </a>

                  {order.status.toLowerCase() === 'pending' && (
                    <button
                      onClick={onCancel}
                      disabled={cancellingId === order.orderId}
                      className="w-full py-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold tracking-wider uppercase hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group"
                    >
                      {cancellingId === order.orderId ? (
                        <span className="animate-pulse">CANCELLING...</span>
                      ) : (
                        <>
                          <XCircle size={16} className="group-hover:rotate-90 transition-transform duration-500" /> CANCEL ORDER
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
