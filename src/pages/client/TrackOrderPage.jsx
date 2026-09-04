/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios"; // Import Axios for real API call
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
  AlertCircle,
  User,
  Navigation,
  Activity,
  Box
} from "lucide-react";

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

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");

  // ✅ Real API Call
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setTrackingData(null);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}orders/track/${orderId}`);
      setTrackingData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Order ID not found or network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-white">

      {/* Hero / Search Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-neutral-950/80"></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] mix-blend-overlay animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] px-5 py-2 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Order Tracking Active
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-8">
              Track <span className="text-emerald-500 text-glow-emerald">Order.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-neutral-400 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
              Enter your Order ID below to check live delivery status and updates.
            </motion.p>

            {/* Search Bar */}
            <motion.form variants={fadeInUp} onSubmit={handleTrack} className="relative max-w-xl mx-auto group">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
              <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-2xl flex items-center p-2 border border-white/10 group-focus-within:border-emerald-500/50 transition-all">
                <div className="pl-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Order ID (e.g., CBC00001)"
                  className="w-full px-5 py-4 bg-transparent text-white font-medium placeholder-neutral-400 focus:outline-none text-lg"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center min-w-[120px] shadow-lg shadow-emerald-500/20 active:scale-95 uppercase tracking-wider text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Track"
                  )}
                </button>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <div className="max-w-screen-xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-center justify-center gap-4 max-w-md mx-auto mb-10 shadow-2xl backdrop-blur-md"
            >
              <AlertCircle size={20} className="shrink-0" />
              <span className="font-bold text-xs uppercase tracking-wider">{error}</span>
            </motion.div>
          )}

          {/* Success / Tracking Data State */}
          {trackingData && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Status & Timeline */}
              <div className="lg:col-span-1 space-y-6">

                {/* Status Card */}
                <motion.div variants={fadeInUp} className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/5 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">ORDER STATUS</span>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)] border ${trackingData.status.toLowerCase() === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      trackingData.status.toLowerCase() === 'in transit' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-white/5 text-neutral-400 border-white/10'
                      }`}>
                      {trackingData.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">EST ARRIVAL</span>
                    <h2 className="text-4xl font-bold text-white">{trackingData.eta}</h2>
                  </div>
                </motion.div>

                {/* Timeline Card */}
                <motion.div variants={fadeInUp} className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/5">
                  <h3 className="font-bold text-white text-xl mb-10 border-b border-white/5 pb-6 flex items-center gap-3">
                    <Activity size={20} className="text-emerald-500" />
                    Tracking Timeline
                  </h3>
                  <div className="relative pl-4 border-l-2 border-white/5 space-y-10 ml-2">
                    {trackingData.timeline.map((step, index) => (
                      <div key={index} className="relative pl-8">
                        <div className={`absolute -left-[35px] top-1.5 w-7 h-7 rounded-2xl border-4 border-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center shrink-0 transition-all duration-500 ${step.completed
                          ? "bg-emerald-500"
                          : step.current
                            ? "bg-emerald-400 ring-4 ring-emerald-500/20"
                            : "bg-neutral-800"
                          }`}>
                          {step.completed && <CheckCircle size={12} className="text-neutral-950" strokeWidth={3} />}
                        </div>
                        <div>
                          <p className={`font-bold text-sm mb-1 uppercase tracking-wider ${step.current ? "text-emerald-400" : step.completed ? "text-white" : "text-neutral-500"}`}>
                            {step.status}
                          </p>
                          <p className="text-xs text-neutral-400 font-bold tracking-wider">{step.date || "PENDING"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Driver Details (Dynamic) */}
                <motion.div variants={fadeInUp} className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/5">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6">DELIVERY DRIVER</h3>

                  {trackingData.driver && trackingData.driver.name !== "Pending Assignment" ? (
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500 border border-white/5 shadow-inner">
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{trackingData.driver.name}</p>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{trackingData.driver.vehicle}</p>
                      </div>
                      <button className="ml-auto bg-emerald-500/10 text-emerald-400 p-3.5 rounded-2xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                        <Phone size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-5 opacity-40">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-neutral-600 border border-white/5">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-neutral-400">Pending Assignment</p>
                        <p className="text-xs text-neutral-500 font-bold">Awaiting delivery driver...</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column: Map Visualization */}
              <motion.div variants={fadeInUp} className="lg:col-span-2 h-full">
                <div className="bg-white/[0.03] p-3 rounded-[2.5rem] shadow-2xl border border-white/5 h-full min-h-[550px] flex flex-col relative overflow-hidden group">
                  {/* Map Header */}
                  <div className="absolute top-8 left-8 z-10 bg-neutral-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 flex items-center gap-4">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider text-white">LIVE TRACKING</span>
                  </div>

                  {/* Actual Map Placeholder */}
                  <div className="flex-1 bg-neutral-900 relative rounded-[2rem] overflow-hidden">
                    <iframe
                      title="Tracking Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585973686!2d79.82118596645312!3d6.921838637728476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1701234567890!5m2!1sen!2slk" // Placeholder
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      className="grayscale invert opacity-20 contrast-125 group-hover:opacity-40 transition-all duration-1000"
                    ></iframe>

                    {/* Simulated "Truck" Marker Overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative group/marker cursor-pointer">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full animate-ping absolute inset-0 -m-5"></div>
                        <div className="relative bg-emerald-500 text-neutral-950 p-4.5 rounded-[1.5rem] shadow-[0_0_40px_rgba(16,185,129,0.4)] border-[6px] border-neutral-950 transform transition-all duration-500 group-hover/marker:scale-110 group-hover/marker:rotate-6">
                          <Truck size={28} />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-5 bg-white text-neutral-950 text-xs uppercase font-bold tracking-wider py-2 px-4 rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all translate-y-3 group-hover/marker:translate-y-0">
                          DELIVERY LOCATION
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Empty State / Prompt */}
          {!trackingData && !loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="bg-white/5 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl shadow-emerald-500/5 group">
                <Package className="text-neutral-700 text-4xl group-hover:text-emerald-500 transition-colors duration-500" />
              </div>
              <p className="text-neutral-400 font-bold uppercase tracking-wider text-xs">
                Enter an Order ID to begin tracking...
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}