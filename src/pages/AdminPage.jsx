/* eslint-disable no-unused-vars */
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Users,
  ShoppingCart,
  MessageSquare,
  PlusSquare,
  LogOut,
  Home,
  Truck,
  Layout,
  TrendingUp,
  Shield,
  Activity,
  Zap,
  Globe,
  Bell,
  Cpu,
  ChevronRight,
  Sparkles,
  Command,
  Recycle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components 
import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/AdminProductsPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import AdminUserPage from "./admin/adminUserPage";
import AdminReviewsPage from "./admin/AdminReviewsPage";
import Loading from "../components/loading";
import AdminKPIPage from "./admin/AdminKPIPage";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      navigate("/login");
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.role !== "admin") {
            setStatus("unauthorized");
            toast.error("PROTOCOL ERROR: Head Office Authorization Required");
            navigate("/");
          } else {
            setStatus("authenticated");
            setUser(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
          setStatus("unauthenticated");
          toast.error("SESSION EXPIRED: Re-authentication Required");
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("SESSION TERMINATED: Secure logout complete");
    navigate("/login");
  };

  const menuItems = [
    { name: "Products", path: "/admin/products", icon: <Box size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Reviews", path: "/admin/reviews", icon: <MessageSquare size={20} /> },
    { name: "Analytics", path: "/admin/analytics", icon: <TrendingUp size={20} /> },
  ];

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950"></div>
        <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-sans font-semibold text-sm animate-pulse">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-white overflow-hidden">

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white/[0.02] backdrop-blur-2xl border-r border-white/5 flex flex-col flex-shrink-0 z-50 relative">

        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]"></div>
        </div>

        {/* Brand Header */}
        <div className="h-28 flex items-center px-8 relative z-10 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-xl shadow-emerald-500/20 group cursor-default">
              <Recycle size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-2xl tracking-tight leading-none">Re<span className="text-emerald-500">-Source</span></h1>
              <p className="text-xs text-neutral-500 font-sans font-semibold mt-1">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* User Info (Mini Profile) */}
        <div className="px-8 py-8 relative z-10">
          <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-[1rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-display font-black text-lg shadow-inner">
              {user?.firstName?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-widest leading-none mb-1">Admin</p>
              <p className="text-sm font-bold truncate tracking-tight">{user?.firstName} {user?.lastName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-sans text-emerald-500/70 font-semibold">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 relative z-10">
          <div className="px-4 mb-4">
            <p className="text-xs font-sans font-bold text-neutral-500 uppercase tracking-widest">Platform Management</p>
          </div>

          {menuItems.map((item) => {
            const isActive = path.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${isActive
                  ? "text-white"
                  : "text-neutral-500 hover:text-emerald-400"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl z-0"
                  />
                )}
                <span className={`relative z-10 transition-colors duration-500 ${isActive ? "text-emerald-400" : "group-hover:text-emerald-500"}`}>
                  {item.icon}
                </span>
                <span className="font-sans text-sm font-semibold relative z-10 transition-all group-hover:translate-x-1">
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto relative z-10">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  </div>
                )}
              </Link>
            );
          })}


        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] relative z-10 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 text-neutral-500 hover:text-emerald-400 px-4 py-2 transition-all duration-500 text-sm font-sans font-semibold group"
          >
            <Globe size={16} className="group-hover:rotate-12 transition-transform" />
            View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-black px-4 py-4 rounded-2xl transition-all duration-500 text-sm font-sans font-semibold border border-red-500/20 active:scale-95 shadow-lg group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-950 overflow-hidden relative">

        {/* Background Noise & Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10"></div>
        </div>

        {/* Top Header Bar */}
        <header className="h-20 bg-white/[0.01] backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-12 z-40 relative">
          <div className="flex items-center gap-6">
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
            <h2 className="text-sm font-sans font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-3">
              <Activity size={16} className="text-emerald-500" />
              {path.includes("products") && "Products"}
              {path.includes("users") && "Users"}
              {path.includes("orders") && "Orders"}
              {path.includes("reviews") && "Reviews"}
              {path.includes("add-product") && "Add Product"}
              {path.includes("edit-product") && "Edit Product"}
              {path === "/admin" && "Dashboard"}
              {path.includes("analytics") && "Analytics"}
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-4 px-6 py-2 bg-white/[0.03] border border-white/5 rounded-full text-xs font-sans font-bold text-neutral-500">
            <span className="text-emerald-500/50 uppercase">Time:</span>
            <span className="text-neutral-300 font-bold">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
            <div className="w-[1px] h-3 bg-white/10 mx-2"></div>
            <span className="text-neutral-300 font-bold">{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="p-12 min-h-full"
            >
              <Routes>
                <Route path="/products" element={<AdminProductsPage />} />
                <Route path="/users" element={<AdminUserPage />} />
                <Route path="/orders" element={<AdminOrdersPage />} />
                <Route path="/reviews" element={<AdminReviewsPage />} />
                <Route path="/add-product" element={<AddProductPage />} />
                <Route path="/edit-product" element={<EditProductPage />} />
                <Route path="/analytics" element={<AdminKPIPage />} />
                <Route path="*" element={<AdminProductsPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Decorative Grid Corners */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-white/10 pointer-events-none z-50 rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-white/10 pointer-events-none z-50 rounded-bl-3xl"></div>
      </main>
    </div>
  );
}