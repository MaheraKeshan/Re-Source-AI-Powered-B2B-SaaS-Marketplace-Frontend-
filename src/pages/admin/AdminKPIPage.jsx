/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  Users,
  Box,
  DollarSign,
  Activity,
  Truck,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Globe,
  ActivitySquare,
  Zap,
  ShieldCheck,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../components/loading";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PolarAreaController,
  RadialLinearScale,
} from 'chart.js';
import { Bar, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PolarAreaController,
  RadialLinearScale
);

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

export default function AdminKPIPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "analytics/kpi", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error("KPI Load Failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950"></div>
      <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-neutral-400 font-sans font-medium text-sm animate-pulse">Loading Analytics Data...</p>
      </div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="relative z-10 bg-white/[0.03] backdrop-blur-xl border border-white/5 p-12 rounded-[2.5rem] shadow-2xl">
        <ShieldCheck size={48} className="text-neutral-800 mx-auto mb-6" />
        <h2 className="text-2xl font-sans font-bold text-white mb-2">No Data Available</h2>
        <p className="text-neutral-500 max-w-sm mx-auto">There is currently no analytics data to display. Complete some orders for analytics to populate.</p>
      </div>
    </div>
  );

  // --- CHART.JS CONFIGURATIONS ---


  // 2. Order System State (Polar Area Chart)
  const orderData = {
    labels: stats.orderStatus.map(s => s.name),
    datasets: [{
      data: stats.orderStatus.map(s => s.value),
      backgroundColor: [
        'rgba(234, 179, 8, 0.7)',   // Pending
        'rgba(59, 130, 246, 0.7)',  // Processing
        'rgba(168, 85, 247, 0.7)',  // Dispatched
        'rgba(16, 185, 129, 0.7)',  // Delivered
        'rgba(239, 68, 68, 0.7)',   // Canceled
      ],
      borderColor: 'rgba(10, 10, 10, 1)',
      borderWidth: 3,
      hoverOffset: 10
    }]
  };

  const orderOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#d4d4d4', font: { family: 'sans-serif', size: 12, weight: '600' }, padding: 20, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      r: {
        ticks: { display: false },
        grid: { color: 'rgba(255,255,255,0.05)' },
        angleLines: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 pb-24 relative overflow-hidden">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
        <div className="absolute inset-0 bg-neutral-950"></div>
        <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-40">

        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-sm font-semibold tracking-wide mb-8 font-sans">
              <Activity size={16} className="text-emerald-500" />
              Analytics Summary
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-[1]">
              Platform <span className="text-emerald-500">Analytics.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-6 text-lg text-neutral-400 max-w-2xl font-medium tracking-tight">
              View real-time sales performance, order distribution, and active user metrics across the platform.
            </motion.p>
          </div>
          <motion.div variants={fadeInUp} className="flex gap-4">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col gap-1 min-w-[140px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest font-sans relative z-10">Uptime</span>
              <span className="text-2xl font-bold text-emerald-400 font-sans relative z-10">99.98%</span>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col gap-1 min-w-[140px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest font-sans relative z-10">Server Status</span>
              <span className="text-2xl font-bold text-white font-sans relative z-10">Live</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 1. Statistics Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue.toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
            icon={<DollarSign size={24} />}
            color="emerald"
            delay={0}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<Box size={24} />}
            color="blue"
            delay={1}
          />
          <StatCard
            title="Clients CO2 Saved"
            value={`${stats.totalCO2Saved} kg`}
            sub="Green Impact"
            icon={<Zap size={24} />}
            color="orange"
            delay={2}
          />
          <StatCard
            title="Producers CO2 Saved"
            value={`${stats.totalCO2Saved} kg`}
            sub="Green Impact"
            icon={<Zap size={24} />}
            color="purple"
            delay={3}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Top Sellers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 bg-white/[0.03] backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(249,115,22,0.02))] pointer-events-none"></div>

            <h3 className="text-xl font-sans font-bold text-white mb-10 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
                <Package size={20} />
              </div>
              Top Sellers
            </h3>

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-neutral-950/20">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-neutral-400 font-sans font-semibold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-5 w-20">Rank</th>
                    <th className="p-5">Producer</th>
                    <th className="p-5 text-right">Volume Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.topSellers && stats.topSellers.length > 0 ? stats.topSellers.map((seller, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors group/row">
                      <td className="p-5">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold font-sans transition-all group-hover/row:scale-110 ${index === 0 ? "bg-orange-500 text-neutral-950 shadow-lg shadow-orange-500/20" : index === 1 ? "bg-white/10 text-white" : "bg-neutral-900 text-neutral-400"}`}>
                          0{index + 1}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-white text-sm tracking-tight">{seller.name}</span>
                          <span className="text-xs text-neutral-500 font-sans">Producer</span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <span className="font-bold text-orange-400 text-lg font-sans">{seller.value} <span className="text-xs text-orange-400/50">items</span></span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="p-20 text-center text-neutral-600 font-sans text-sm font-semibold">No Seller Data Found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Top Buyers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 bg-white/[0.03] backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(59,130,246,0.02))] pointer-events-none"></div>

            <h3 className="text-xl font-sans font-bold text-white mb-10 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                <Users size={20} />
              </div>
              Top Buyers
            </h3>

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-neutral-950/20">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-neutral-400 font-sans font-semibold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-5 w-20">Rank</th>
                    <th className="p-5">Client</th>
                    <th className="p-5 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.topBuyers && stats.topBuyers.length > 0 ? stats.topBuyers.map((buyer, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors group/row">
                      <td className="p-5">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold font-sans transition-all group-hover/row:scale-110 ${index === 0 ? "bg-blue-500 text-neutral-950 shadow-lg shadow-blue-500/20" : index === 1 ? "bg-white/10 text-white" : "bg-neutral-900 text-neutral-400"}`}>
                          0{index + 1}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-white text-sm tracking-tight">{buyer.name}</span>
                          <span className="text-xs text-neutral-500 font-sans">Client</span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <span className="font-bold text-blue-400 text-lg font-sans">
                          {buyer.value.toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="p-20 text-center text-neutral-600 font-sans text-sm font-semibold">No Buyer Data Found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Order System State Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-12 bg-white/[0.03] backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="text-xl font-sans font-bold text-white mb-2 tracking-tight">Order Status Breakdown</h3>
                <p className="text-neutral-500 text-xs font-sans font-semibold uppercase tracking-widest">Live distribution of current system orders</p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-2 px-3 rounded-2xl border border-white/5 font-sans text-xs font-semibold text-neutral-300">
                <Activity size={14} className="text-emerald-500" />
                Data Live Syncing
              </div>
            </div>

            <div className="h-[300px] w-full flex items-center justify-center">
              {stats.orderStatus && stats.orderStatus.length > 0 ? (
                <PolarArea data={orderData} options={orderOptions} />
              ) : (
                <div className="text-neutral-600 font-sans text-sm font-semibold">
                  No Active Orders Found
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// Reusable Components
function StatCard({ title, value, sub, icon, color, delay }) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/5",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/5"
  };

  const iconColorMap = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    orange: "text-orange-500",
    purple: "text-purple-500"
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${colorMap[color].replace('bg-', 'bg-').split(' ')[0]}`}></div>

      <div className="flex flex-col gap-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-400 font-sans mb-1 group-hover:text-neutral-300 transition-colors uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">{value}</h3>
          {sub && <p className="text-xs text-neutral-400 mt-2 font-sans font-semibold tracking-wider uppercase">{sub}</p>}
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/5 group-hover:border-emerald-500/30 transition-colors"></div>
    </motion.div>
  );
}

function getStatusStyles(status) {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'dispatched': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'delivered': return 'bg-emerald-500 text-neutral-950 border-emerald-500';
    case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
  }
}

function getStatusShadow(status) {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-500';
    case 'processing': return 'bg-blue-500';
    case 'dispatched': return 'bg-purple-500';
    case 'delivered': return 'bg-emerald-500';
    case 'canceled': return 'bg-red-500';
    default: return 'bg-neutral-500';
  }
}
