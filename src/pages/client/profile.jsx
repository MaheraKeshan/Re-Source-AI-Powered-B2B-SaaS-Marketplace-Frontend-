/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Shield,
    LogOut,
    Edit2,
    ArrowLeft,
    BarChart2,
    ChevronRight,
    Camera,
    Bell,
    Lock,
    Globe,
    Check,
    Award,
    Download,
    Leaf
} from "lucide-react";
import { TbRecycle } from "react-icons/tb";
import toast from "react-hot-toast";
import Dashboard from "./Dashboard";
import axios from "axios";

// --- BADGE LOGIC ---
const getBadge = (co2) => {
    if (co2 >= 100) return {
        label: "Gold Champion",
        tier: "gold",
        emoji: "🥇",
        color: "from-yellow-400 to-amber-500",
        borderColor: "border-yellow-500/40",
        glowColor: "shadow-yellow-500/30",
        textColor: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        ringColor: "ring-yellow-500/30",
        desc: "Extraordinary eco-leader. 100+ kg CO₂ saved!"
    };
    if (co2 >= 50) return {
        label: "Silver Guardian",
        tier: "silver",
        emoji: "🥈",
        color: "from-slate-300 to-slate-400",
        borderColor: "border-slate-400/40",
        glowColor: "shadow-slate-400/30",
        textColor: "text-slate-300",
        bgColor: "bg-slate-400/10",
        ringColor: "ring-slate-400/30",
        desc: "Outstanding commitment. 50+ kg CO₂ saved!"
    };
    if (co2 >= 10) return {
        label: "Bronze Pioneer",
        tier: "bronze",
        emoji: "🥉",
        color: "from-orange-400 to-amber-600",
        borderColor: "border-orange-500/40",
        glowColor: "shadow-orange-500/30",
        textColor: "text-orange-400",
        bgColor: "bg-orange-500/10",
        ringColor: "ring-orange-500/30",
        desc: "Great start! 10+ kg CO₂ saved."
    };
    return {
        label: "Eco Trainee",
        tier: "none",
        emoji: "🌱",
        color: "from-neutral-500 to-neutral-600",
        borderColor: "border-neutral-500/20",
        glowColor: "shadow-neutral-500/10",
        textColor: "text-neutral-400",
        bgColor: "bg-neutral-500/10",
        ringColor: "ring-neutral-500/20",
        desc: "Keep going! Reach 10 kg CO₂ to earn Bronze."
    };
};

// --- ANIMATION VARIANTS ---
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [co2Saved, setCo2Saved] = useState(0);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [editFormData, setEditFormData] = useState({
        firstName: "", lastName: "", email: "", password: ""
    });


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setEditFormData({
                    firstName: parsedUser.firstName || "",
                    lastName: parsedUser.lastName || "",
                    email: parsedUser.email || "",
                    password: ""
                });
                // Fetch CO2 stats
                axios.get(`${import.meta.env.VITE_BACKEND_URL}analytics/client`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                }).then(res => {
                    setCo2Saved(res.data?.co2Saved || 0);
                }).catch(() => {
                    setCo2Saved(0);
                });
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.clear();
                toast.error("Session corrupted. Please login again.");
                navigate("/login");
            }
        } else {
            localStorage.clear();
            navigate("/login");
        }
    }, [navigate]);

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const handleDownloadCertificate = async () => {
        setIsGeneratingPdf(true);
        toast.loading("Generating your certificate...", { id: "pdf-gen" });
        try {
            const { default: jsPDF } = await import("jspdf");

            const W = 297;
            const H = 210;
            const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

            // === WHITE BACKGROUND ===
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, W, H, "F");

            // === OUTER BORDER (double line formal look) ===
            pdf.setDrawColor(16, 185, 129);
            pdf.setLineWidth(1.5);
            pdf.rect(8, 8, W - 16, H - 16);
            pdf.setLineWidth(0.4);
            pdf.setDrawColor(180, 230, 210);
            pdf.rect(11, 11, W - 22, H - 22);

            // === EMERALD TOP HEADER BAR ===
            pdf.setFillColor(16, 185, 129);
            pdf.rect(8, 8, W - 16, 32, "F");

            // Header brand name
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(20);
            pdf.setTextColor(255, 255, 255);
            pdf.text("Re-Source", W / 2, 22, { align: "center" });

            // Header tagline
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(210, 255, 235);
            pdf.text("Circular Economy Network", W / 2, 30, { align: "center" });

            // Issued date - top right
            pdf.setFontSize(7);
            pdf.setTextColor(210, 255, 235);
            pdf.text(today, W - 14, 26, { align: "right" });

            // === CERTIFICATE TITLE ===
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);
            pdf.setTextColor(40, 40, 40);
            pdf.text("CERTIFICATE OF ENVIRONMENTAL ACHIEVEMENT", W / 2, 54, { align: "center" });

            // Title underline
            pdf.setDrawColor(16, 185, 129);
            pdf.setLineWidth(0.8);
            pdf.line(W / 2 - 65, 57, W / 2 + 65, 57);

            // === PRESENTED TO ===
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(120, 120, 120);
            pdf.text("Presented to", W / 2, 68, { align: "center" });

            // === USER NAME (big and bold) ===
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(36);
            pdf.setTextColor(20, 20, 20);
            pdf.text(`${user?.firstName || ""} ${user?.lastName || ""}`, W / 2, 85, { align: "center" });

            // === EMAIL ===
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(160, 160, 160);
            pdf.text(user?.email || "", W / 2, 92, { align: "center" });

            // === DESCRIPTION ===
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9.5);
            pdf.setTextColor(70, 70, 70);
            pdf.text("in recognition of outstanding contribution to environmental sustainability by saving", W / 2, 103, { align: "center" });

            // === CO2 SAVED BOX ===
            const bW = 72, bH = 22, bX = W / 2 - bW / 2, bY = 107;
            pdf.setFillColor(235, 252, 245);
            pdf.setDrawColor(16, 185, 129);
            pdf.setLineWidth(0.8);
            pdf.roundedRect(bX, bY, bW, bH, 4, 4, "FD");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(22);
            pdf.setTextColor(10, 130, 80);
            pdf.text(`${co2Saved} kg of CO2`, W / 2, bY + 15, { align: "center" });

            // Sub-label below box
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8.5);
            pdf.setTextColor(100, 100, 100);
            pdf.text("from the atmosphere through circular economy participation", W / 2, 137, { align: "center" });

            // === BADGE TIER CHIP ===
            const badgeLabel = badge.tier === "gold" ? "GOLD CHAMPION" : badge.tier === "silver" ? "SILVER GUARDIAN" : badge.tier === "bronze" ? "BRONZE PIONEER" : "ECO TRAINEE";
            const badgeDisplay = badge.tier === "gold" ? "Gold" : badge.tier === "silver" ? "Silver" : badge.tier === "bronze" ? "Bronze" : "Trainee";
            const [cr, cg, cb] = badge.tier === "gold" ? [180,130,0] : badge.tier === "silver" ? [80,100,120] : badge.tier === "bronze" ? [160,80,20] : [100,100,100];
            pdf.setFillColor(cr, cg, cb);
            pdf.roundedRect(W / 2 - 25, 141, 50, 11, 3, 3, "F");
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(8);
            pdf.setTextColor(255, 255, 255);
            pdf.text(badgeLabel, W / 2, 148.2, { align: "center" });

            // === FOOTER BAND ===
            pdf.setFillColor(245, 248, 247);
            pdf.rect(8, H - 39, W - 16, 28, "F");
            pdf.setDrawColor(200, 220, 210);
            pdf.setLineWidth(0.4);
            pdf.line(8, H - 39, W - 8, H - 39);

            // Footer 4 columns
            const footerItems = [
                { label: "CO2 Saved", value: `${co2Saved} kg` },
                { label: "Eco Rank",  value: badgeDisplay },
                { label: "Date Issued", value: today },
                { label: "Platform",  value: "Re-Source" },
            ];
            const colW2 = (W - 16) / 4;
            footerItems.forEach((item, i) => {
                const x = 8 + i * colW2 + colW2 / 2;
                if (i > 0) {
                    pdf.setDrawColor(210, 215, 212);
                    pdf.setLineWidth(0.3);
                    pdf.line(8 + i * colW2, H - 36, 8 + i * colW2, H - 13);
                }
                // Column label
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(7);
                pdf.setTextColor(140, 150, 145);
                pdf.text(item.label.toUpperCase(), x, H - 30, { align: "center" });
                // Column value
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(11);
                pdf.setTextColor(30, 30, 30);
                pdf.text(item.value, x, H - 18, { align: "center" });
            });

            // === BOTTOM FINE PRINT ===
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(6);
            pdf.setTextColor(180, 180, 180);
            pdf.text("This certificate is digitally issued by Re-Source Platform. Connecting the Circular Economy.", W / 2, H - 10, { align: "center" });

            pdf.save(`ReSource_Certificate_${user?.firstName || "User"}.pdf`);
            toast.success("Certificate downloaded!", { id: "pdf-gen" });
        } catch (err) {
            console.error("PDF Error:", err);
            toast.error("Failed to generate certificate.", { id: "pdf-gen" });
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!user) return null;

    const badge = getBadge(co2Saved);
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const nextMilestone = co2Saved < 10 ? 10 : co2Saved < 50 ? 50 : co2Saved < 100 ? 100 : null;
    const progressPct = nextMilestone ? Math.min((co2Saved / nextMilestone) * 100, 100) : 100;

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-white font-sans relative overflow-hidden flex flex-col pb-20">

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>


            {/* ---- MAIN PAGE CONTENT ---- */}

            <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/" className="inline-flex items-center gap-3 text-neutral-400 hover:text-emerald-400 transition-all text-xs font-bold uppercase tracking-wider group">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-all border border-white/5">
                                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            </div>
                            Back to Home
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5 shadow-2xl"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <TbRecycle size={24} />
                        </div>
                        <span className="font-bold text-xl">Re<span className="text-emerald-500">Source</span></span>
                    </motion.div>
                </div>

                <div className="max-w-5xl mx-auto w-full flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* LEFT COLUMN */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-12 xl:col-span-4 space-y-6"
                        >
                            {/* Profile Card */}
                            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                                <div className="h-36 bg-gradient-to-br from-emerald-900/40 via-neutral-900 to-emerald-950 relative overflow-hidden">
                                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                                </div>
                                <div className="px-8 pb-10 relative">
                                    <div className="relative -mt-20 mb-8 flex flex-col items-center text-center">
                                        <div className="relative group/avatar">
                                            <div className={`w-36 h-36 rounded-[2.5rem] bg-neutral-950 p-1 shadow-2xl text-white flex items-center justify-center text-5xl font-bold relative overflow-hidden border-2 ${badge.borderColor} transition-all duration-700`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                                                {user.firstName ? user.firstName[0].toUpperCase() : <User size={48} />}
                                            </div>
                                            <button className="absolute bottom-2 right-2 w-9 h-9 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-xl border-4 border-neutral-950 hover:scale-110 transition-transform">
                                                <Camera size={16} />
                                            </button>
                                        </div>
                                        <div className="mt-5 space-y-2">
                                            <h1 className="text-3xl font-bold text-white">{user.firstName} {user.lastName}</h1>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                <Shield size={10} />
                                                {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)).replace('_', ' ') : 'Customer'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setShowDashboard(true)}
                                            className="col-span-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
                                        >
                                            <BarChart2 size={16} /> Sustainability Dashboard
                                        </button>
                                        <button
                                            onClick={handleDownloadCertificate}
                                            disabled={isGeneratingPdf}
                                            className="col-span-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-white flex items-center justify-center gap-2 group/cert disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Download size={16} className="group-hover/cert:text-emerald-400 transition-colors" />
                                            {isGeneratingPdf ? "Generating..." : "Download Certificate"}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="py-3.5 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-neutral-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <Edit2 size={16} className="group-hover/btn:text-emerald-400" /> Edit
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="py-3.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-red-500/70 hover:text-red-500 flex items-center justify-center gap-2"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* --- CO2 BADGE CARD --- */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className={`relative bg-white/[0.03] backdrop-blur-3xl border ${badge.borderColor} rounded-[2rem] p-6 shadow-2xl ${badge.glowColor} shadow-lg overflow-hidden`}
                            >
                                {/* Badge glow */}
                                <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${badge.color} opacity-10 rounded-full blur-3xl`}></div>

                                <div className="flex items-center gap-4 mb-5 relative">
                                    <div className={`w-14 h-14 rounded-2xl ${badge.bgColor} border ${badge.borderColor} flex items-center justify-center text-3xl shadow-lg ${badge.glowColor}`}>
                                        {badge.emoji}
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Sustainability Rank</p>
                                        <p className={`text-lg font-bold ${badge.textColor}`}>{badge.label}</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-xs text-neutral-500 font-medium">CO₂ Saved</span>
                                        {nextMilestone && (
                                            <span className="text-xs text-neutral-600 font-medium">{co2Saved} / {nextMilestone} kg</span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className={`text-4xl font-bold ${badge.textColor}`}>{co2Saved}</span>
                                        <span className="text-sm text-neutral-400 font-medium">kg CO₂</span>
                                    </div>

                                    {/* Progress bar */}
                                    {nextMilestone && (
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPct}%` }}
                                                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                                className={`h-full bg-gradient-to-r ${badge.color} rounded-full`}
                                            />
                                        </div>
                                    )}

                                    <p className="text-xs text-neutral-500 mt-3 leading-relaxed">{badge.desc}</p>

                                    {/* Tier indicators */}
                                    <div className="flex gap-2 mt-4">
                                        {[
                                            { t: "bronze", e: "🥉", label: "Bronze", min: 10 },
                                            { t: "silver", e: "🥈", label: "Silver", min: 50 },
                                            { t: "gold", e: "🥇", label: "Gold", min: 100 },
                                        ].map(t => (
                                            <div key={t.t} className={`flex-1 p-2 rounded-xl text-center transition-all ${badge.tier === t.t ? `${badge.bgColor} border ${badge.borderColor}` : co2Saved >= t.min ? "bg-white/5 border border-white/10" : "bg-white/[0.02] border border-white/5 opacity-40"}`}>
                                                <div className="text-sm mb-0.5">{t.e}</div>
                                                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{t.label}</div>
                                                <div className="text-[9px] text-neutral-600">{t.min}kg</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                            <AnimatePresence mode="wait">
                                {!isEditing ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-8"
                                    >
                                        {/* Account Information Card */}
                                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                                            <div className="flex items-center justify-between mb-10">
                                                <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                                        <User size={24} />
                                                    </div>
                                                    Account Information
                                                </h3>
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400">
                                                    <Lock size={18} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2 group">
                                                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider ml-1">Full Name</label>
                                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-emerald-500/20 transition-all font-medium text-white flex items-center justify-between">
                                                        {user.firstName} {user.lastName}
                                                        <Check size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 group">
                                                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider ml-1">Email Address</label>
                                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-emerald-500/20 transition-all font-medium text-white flex items-center justify-between">
                                                        {user.email}
                                                        <Mail size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col items-center text-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 text-emerald-500 flex items-center justify-center mb-2">
                                                        <Globe size={20} />
                                                    </div>
                                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Account Status</span>
                                                    <span className="text-sm font-bold text-emerald-400">Active</span>
                                                </div>
                                                <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col items-center text-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/5 text-blue-400 flex items-center justify-center mb-2">
                                                        <Bell size={20} />
                                                    </div>
                                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Notifications</span>
                                                    <span className="text-sm font-bold text-white">Enabled</span>
                                                </div>
                                                <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col items-center text-center gap-3">
                                                    <div className={`w-12 h-12 rounded-2xl ${badge.bgColor} ${badge.textColor} flex items-center justify-center mb-2 text-xl`}>
                                                        {badge.emoji}
                                                    </div>
                                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Eco Rank</span>
                                                    <span className={`text-sm font-bold ${badge.textColor}`}>{badge.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                        className="h-full"
                                    >
                                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                                            <div className="flex items-center justify-between mb-10">
                                                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                                                <button onClick={() => setIsEditing(false)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-neutral-500 hover:text-white transition-all flex items-center justify-center">
                                                    <ArrowLeft size={20} />
                                                </button>
                                            </div>
                                            <form onSubmit={handleSaveProfile} className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">First Name</label>
                                                        <input name="firstName" value={editFormData.firstName} onChange={handleEditChange}
                                                            className="w-full px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Last Name</label>
                                                        <input name="lastName" value={editFormData.lastName} onChange={handleEditChange}
                                                            className="w-full px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Email (Read Only)</label>
                                                    <div className="w-full px-6 py-4 rounded-2xl bg-white/[0.01] border border-white/5 text-neutral-400 font-medium text-sm">{editFormData.email}</div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">New Password</label>
                                                    <input name="password" type="password" value={editFormData.password} onChange={handleEditChange}
                                                        placeholder="Leave blank to keep current password"
                                                        className="w-full px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-neutral-700" />
                                                </div>
                                                <div className="pt-10 flex flex-col sm:flex-row gap-5">
                                                    <button type="button" onClick={() => setIsEditing(false)}
                                                        className="flex-1 py-5 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl text-white font-bold uppercase tracking-wider text-xs transition-all">
                                                        Cancel
                                                    </button>
                                                    <button type="submit"
                                                        className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/10 transition-all uppercase tracking-wider text-xs active:scale-95">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Slide-over */}
            <AnimatePresence>
                {showDashboard && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDashboard(false)}
                            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[60]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 150 }}
                            className="fixed inset-y-0 right-0 w-full max-w-5xl z-[70] shadow-2xl overflow-hidden border-l border-white/5"
                        >
                            <div className="h-full bg-neutral-950 relative">
                                <button onClick={() => setShowDashboard(false)}
                                    className="absolute top-8 right-8 z-[80] w-12 h-12 rounded-2xl bg-white/5 text-neutral-400 hover:text-white transition-all flex items-center justify-center border border-white/10">
                                    <ArrowLeft size={24} />
                                </button>
                                <Dashboard onClose={() => setShowDashboard(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
