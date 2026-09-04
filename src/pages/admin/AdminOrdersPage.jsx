/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    Eye,
    Printer,
    RefreshCw,
    ChevronDown,
    X,
    Truck,
    User,
    Phone,
    CreditCard,
    Check,
    AlertCircle,
    Package,
    Activity,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Calendar,
    Zap,
    FileText,
    Boxes
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

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

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Session missing. Please login.");
            setIsLoading(false);
            return;
        }

        axios.get(import.meta.env.VITE_BACKEND_URL + "orders", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => {
                setOrders(res.data);
                setIsLoading(false);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Internal Protocol Error");
                setIsLoading(false);
            });
    };

    const handlePaymentAction = async (orderId, status) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}orders/${orderId}/payment_review`,
                { status },
                { headers: { Authorization: "Bearer " + token } }
            );

            toast.success(`Payment marked as ${status}`);
            const updatedOrder = res.data.order;
            setOrders(orders.map(o => o.orderId === orderId ? updatedOrder : o));
            setActiveOrder(updatedOrder);

        } catch (error) {
            toast.error("Failed to update payment status");
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}orders/${orderId}/${newStatus}`,
                {},
                { headers: { Authorization: "Bearer " + token } }
            );

            setOrders(orders.map(order =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            ));

            if (activeOrder?.orderId === orderId) {
                setActiveOrder({ ...activeOrder, status: newStatus });
            }

            toast.success(`Order status updated to ${newStatus}`);
        } catch (e) {
            toast.error("Failed to update order status");
            console.error(e);
        }
    };

    const filteredOrders = orders.filter(order =>
        filterStatus === "all" || order.status === filterStatus
    );

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
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-sm font-semibold tracking-wide font-sans">
                            <Activity size={16} className="text-emerald-500" />
                            Order Management
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-[1]">
                            Customer <span className="text-emerald-500">Orders.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-neutral-400 max-w-2xl font-medium tracking-tight">
                            Manage and track customer orders, payment statuses, and fulfillment details.
                        </motion.p>
                    </div>

                    <motion.div variants={fadeInUp} className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 group">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full appearance-none bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 text-sm font-semibold text-white outline-none focus:border-emerald-500/50 transition-all cursor-pointer font-sans"
                            >
                                <option value="all" className="bg-neutral-900">All Orders</option>
                                <option value="pending" className="bg-neutral-900">Pending</option>
                                <option value="processing" className="bg-neutral-900">Processing</option>
                                <option value="dispatched" className="bg-neutral-900">Dispatched</option>
                                <option value="in transit" className="bg-neutral-900">In Transit</option>
                                <option value="delivered" className="bg-neutral-900">Delivered</option>
                                <option value="canceled" className="bg-neutral-900">Canceled</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-emerald-500">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="p-4.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all active:scale-95 group shadow-xl"
                        >
                            <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''} transition-transform group-hover:rotate-180`} />
                        </button>
                    </motion.div>
                </motion.div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-neutral-400 font-sans font-medium text-sm animate-pulse">Loading Orders...</p>
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
                                <thead className="bg-white/5 border-b border-white/5 font-sans text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                    <tr>
                                        <th className="py-5 px-8">Order ID</th>
                                        <th className="py-5 px-8">Customer</th>
                                        <th className="py-5 px-8">Total</th>
                                        <th className="py-5 px-8">Status</th>
                                        <th className="py-5 px-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <motion.tr
                                                key={order.orderId}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="py-6 px-8 font-sans font-semibold text-sm text-emerald-400/80 group-hover:text-emerald-400 transition-colors">
                                                    #{order.orderId}
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/5 font-sans font-bold">
                                                            {order.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white tracking-tight">{order.name}</div>
                                                            <div className="text-xs text-neutral-400 font-sans">{order.email.split('@')[0]}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 font-sans font-semibold text-sm text-white">
                                                    {order.total.toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border font-sans capitalize ${getStatusStyles(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                        <span className={`text-xs font-semibold uppercase tracking-wider transition-opacity ${order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                            {order.paymentStatus || "PENDING"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 text-right">
                                                    <button
                                                        onClick={() => { setActiveOrder(order); setIsModalOpen(true); }}
                                                        className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all active:scale-95 text-neutral-400"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <Boxes size={48} className="text-neutral-500" />
                                                    <p className="font-sans font-semibold text-neutral-400">No Orders Found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* MODAL VIEW */}
                {createPortal(
                    <AnimatePresence>
                        {isModalOpen && activeOrder && (
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">

                                {/* Background Overlay - Moved outside the modal box to ensure clicking it works */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xl cursor-pointer"
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative bg-neutral-900 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                                >
                                    {/* Modal Header */}
                                    <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start shrink-0 bg-white/[0.01]">
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold tracking-wide">
                                                Order Verification
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">
                                                Order <span className="text-emerald-500">#{activeOrder.orderId}</span>
                                            </h2>
                                            <div className="flex items-center gap-4 text-neutral-400 text-sm font-sans font-medium">
                                                <Calendar size={16} className="text-emerald-500/80" />
                                                {activeOrder.date ? new Date(activeOrder.date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                                                <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                <Activity size={16} className="text-emerald-500/80" />
                                                {activeOrder.date ? new Date(activeOrder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-emerald-500 transition-all active:scale-95 z-10"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                                        <div className="grid lg:grid-cols-2 gap-12 mb-12">

                                            {/* Status Control */}
                                            <div className="space-y-6">
                                                <h3 className="text-sm font-semibold text-neutral-300 font-sans flex items-center gap-2">
                                                    <Activity size={18} className="text-emerald-500" /> Order Status
                                                </h3>
                                                <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 space-y-8 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>

                                                    <div className="flex items-center justify-between relative z-10">
                                                        <span className="text-sm font-sans font-semibold text-neutral-400">Current Status</span>
                                                        <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border font-sans ${getStatusStyles(activeOrder.status || "pending")}`}>
                                                            {activeOrder.status || "Pending"}
                                                        </span>
                                                    </div>

                                                    <div className="relative z-10 space-y-2">
                                                        <label className="text-sm font-medium text-neutral-400 ml-1">Update Status</label>
                                                        <div className="relative group/select">
                                                            <select
                                                                value={activeOrder.status || "pending"}
                                                                onChange={(e) => updateOrderStatus(activeOrder.orderId, e.target.value)}
                                                                className="w-full appearance-none bg-neutral-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none focus:border-emerald-500 transition-all cursor-pointer font-sans"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="processing">Processing</option>
                                                                <option value="dispatched">Dispatched</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="canceled">Canceled</option>
                                                            </select>
                                                            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-emerald-500 transition-transform group-hover/select:translate-y-0.5">
                                                                <ChevronDown size={18} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Verification */}
                                            <div className="space-y-6">
                                                <h3 className="text-sm font-semibold text-neutral-300 font-sans flex items-center gap-2">
                                                    <CreditCard size={18} className="text-emerald-500" /> Payment Details
                                                </h3>
                                                <div className={`p-8 rounded-[2rem] border transition-all duration-700 relative overflow-hidden group ${activeOrder.paymentStatus === 'Paid' ? 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : 'bg-white/[0.03] border-white/5'}`}>
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl group-hover:bg-white/10 transition-all"></div>

                                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest font-sans">Method</span>
                                                            <span className="font-sans font-bold text-white tracking-tight text-xl">{activeOrder.paymentMethod === 'bank' ? "Bank Transfer" : (activeOrder.paymentMethod || "N/A")}</span>
                                                        </div>
                                                        <span className={`text-xs font-bold px-4 py-2 rounded-xl tracking-wider font-sans shadow-inner border transition-all duration-500 uppercase ${activeOrder.paymentStatus === 'Paid' ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                            {activeOrder.paymentStatus || "Pending"}
                                                        </span>
                                                    </div>

                                                    {activeOrder.paymentMethod === 'bank' && activeOrder.bankReceipt && (
                                                        <div className="mb-8 relative z-10 group/receipt">
                                                            <p className="text-sm text-neutral-300 font-semibold mb-3">Payment Receipt:</p>
                                                            <a href={activeOrder.bankReceipt} target="_blank" rel="noreferrer" className="block relative aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover/receipt:border-emerald-500/50 transition-all shadow-2xl">
                                                                <img src={activeOrder.bankReceipt} alt="Receipt" className="w-full h-full object-cover grayscale opacity-50 group-hover/receipt:grayscale-0 group-hover/receipt:opacity-100 transition-all duration-700" />
                                                                <div className="absolute inset-0 bg-emerald-500/0 group-hover/receipt:bg-emerald-500/10 transition-colors flex items-center justify-center">
                                                                    <Eye size={32} className="text-white opacity-0 group-hover/receipt:opacity-100 scale-50 group-hover/receipt:scale-100 transition-all duration-500" />
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )}

                                                    {activeOrder.paymentMethod === 'bank' && activeOrder.paymentStatus !== 'Paid' && (
                                                        <div className="flex gap-4 relative z-10">
                                                            <button
                                                                onClick={() => handlePaymentAction(activeOrder.orderId, "Paid")}
                                                                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-2"
                                                            >
                                                                <Check size={18} strokeWidth={3} /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handlePaymentAction(activeOrder.orderId, "Rejected")}
                                                                className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-neutral-400 hover:text-red-500 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                                                            >
                                                                <X size={18} /> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products Grid */}
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-semibold text-neutral-300 font-sans flex items-center gap-2">
                                                <Package size={18} className="text-emerald-500" /> Order Items
                                            </h3>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-white/5 text-xs font-sans font-semibold uppercase tracking-wider text-neutral-400 border-b border-white/5">
                                                        <tr>
                                                            <th className="p-6">Product</th>
                                                            <th className="p-6 text-center">Quantity</th>
                                                            <th className="p-6 text-right">Price</th>
                                                            <th className="p-6 text-right">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/[0.03]">
                                                        {activeOrder.products?.map((item, idx) => (
                                                            <tr key={idx} className="group/item hover:bg-white/[0.01] transition-colors">
                                                                <td className="p-6">
                                                                    <div className="flex items-center gap-5">
                                                                        <div className="w-14 h-14 rounded-2xl bg-neutral-950 p-2 border border-white/5 group-hover/item:border-emerald-500/30 transition-all overflow-hidden relative">
                                                                            <img src={item?.productInfo?.image?.[0] || "https://placehold.co/100x100/151515/333333?text=Image"} alt="Product" className="w-full h-full object-contain grayscale opacity-60 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-white text-base tracking-tight">{item?.productInfo?.name || "Unknown Product"}</p>
                                                                            <p className="text-sm text-neutral-500 font-sans">Item {idx + 1}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-6 text-center">
                                                                    <span className="font-bold text-white text-lg font-sans">{item?.quantity || 1}</span>
                                                                </td>
                                                                <td className="p-6 text-right text-neutral-400 font-sans text-sm">
                                                                    {(item?.productInfo?.price || 0).toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                                                                </td>
                                                                <td className="p-6 text-right">
                                                                    <span className="font-bold text-emerald-400 text-lg font-sans">
                                                                        {((item?.productInfo?.price || 0) * (item?.quantity || 1)).toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot className="bg-white/5 border-t border-white/10 font-sans">
                                                        <tr>
                                                            <td colSpan="3" className="p-8 text-right font-bold text-neutral-400 text-sm uppercase tracking-wide">Order Total</td>
                                                            <td className="p-8 text-right">
                                                                <span className="text-2xl font-sans font-bold text-emerald-500 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                                                    {(activeOrder.total || 0).toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-8 md:p-10 border-t border-white/5 shrink-0 bg-white/[0.01] flex flex-col sm:flex-row justify-end gap-4 cursor-pointer">
                                        <button
                                            onClick={() => window.print()}
                                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-semibold hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 font-sans group"
                                        >
                                            <Printer size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" /> Print Order
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-emerald-500/10 text-sm"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </div>
    );
}

// Helpers
function getStatusStyles(status) {
    switch (status.toLowerCase()) {
        case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'dispatched': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        case 'in transit': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        case 'delivered': return 'bg-emerald-500 text-neutral-950 border-emerald-500';
        case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'returned': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
}
