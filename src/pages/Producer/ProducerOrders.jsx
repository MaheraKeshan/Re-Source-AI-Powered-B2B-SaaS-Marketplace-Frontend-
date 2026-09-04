import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ProducerHeader from '../../components/ProducerHeader';
import { Eye, ChevronDown, Package, Activity, Boxes, Calendar, Clock, CreditCard, X, MapPin, Printer, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProducerOrders() {
    const [filter, setFilter] = useState("Last 7 Days");
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeOrder, setActiveOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("FETCH ERROR:", error);
            toast.error("Unable to update order history.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}orders/${orderId}/${newStatus}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setOrders(prev => prev.map(order =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            ));

            if (activeOrder?.orderId === orderId) {
                setActiveOrder(prev => ({ ...prev, status: newStatus }));
            }

            toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
        } catch (error) {
            console.error("STATUS UPDATE ERROR:", error);
            toast.error("System Error: Unable to update order status.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 font-sans text-white overflow-hidden relative">
            <ProducerHeader />

            {/* --- Background Effects --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white mb-2 tracking-tight">Order <span className="text-emerald-500">History</span></h1>
                        <p className="text-neutral-500 font-normal text-[15px]">Review and track your recent sales and transactions.</p>
                    </div>

                    <div className="relative">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-medium text-neutral-400 hover:text-white hover:border-white/10 transition-all">
                            {filter} <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden mb-12 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.02] border-b border-white/5 text-sm font-semibold text-neutral-400">
                                <tr>
                                    <th className="px-8 py-6">Order ID</th>
                                    <th className="px-8 py-6">Customer</th>
                                    <th className="px-8 py-6">Payment</th>
                                    <th className="px-8 py-6">Amount</th>
                                    <th className="px-8 py-6">Delivery Address</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="8" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-neutral-500">
                                                <Activity size={32} className="animate-spin text-emerald-500" />
                                                <span className="font-medium text-xs tracking-wide">Loading orders...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-neutral-500">
                                                <Boxes size={32} className="opacity-20" />
                                                <span className="font-medium text-sm text-neutral-400">No orders found in your history.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order, index) => (
                                        <tr key={order.orderId || index} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-8 py-6 text-emerald-500/70 font-semibold text-sm">#{order.orderId}</td>
                                            <td className="px-8 py-6 font-semibold text-white tracking-tight">{order.name}</td>
                                            <td className="px-8 py-6">
                                                <span className={`text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {order.paymentStatus || "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-semibold text-emerald-400 text-base">
                                                LKR {order.total?.toLocaleString() || "0"}
                                            </td>
                                            <td className="px-8 py-6 text-neutral-500 italic truncate max-w-[200px] font-medium">{order.address}</td>
                                            <td className="px-8 py-6 text-neutral-400 text-xs font-medium">
                                                {new Date(order.date).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[11px] font-semibold capitalize border ${getStatusStyles(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => {
                                                        setActiveOrder(order);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-3 bg-white/5 border border-white/5 rounded-2xl text-neutral-400 hover:text-white hover:border-white/10 transition-all active:scale-95"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Newsletter Section (Matching Design Layout) */}
                <div className="mt-20 pt-20 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-20">
                        <div className="relative p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
                            <h2 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">Product Updates</h2>
                            <p className="text-neutral-500 mb-8 font-medium">Stay up-to-date with our latest features and announcements.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-light"
                                />
                                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6 opacity-60">COMPANY</h3>
                                <ul className="space-y-4 text-neutral-400 font-medium">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">About Us</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Careers</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Blog</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Contact</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6 opacity-60">RESOURCES</h3>
                                <ul className="space-y-4 text-neutral-400 font-medium">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Documentation</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">API Keys</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Tech Specs</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Whitepaper</li>
                                </ul>
                            </div>
                            <div className="hidden sm:block">
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6 opacity-60">LEGAL</h3>
                                <ul className="space-y-4 text-neutral-400 font-medium">
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Security</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Compliance</li>
                                    <li className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* ORDER DETAIL MODAL */}
<AnimatePresence>
    {isModalOpen && activeOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-neutral-950/90 backdrop-blur-2xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative bg-neutral-900 rounded-[2rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col z-10"
            >
                {/* Modal Header */}
                <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start shrink-0 bg-white/[0.01]">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-sm font-medium">
                            Order Information
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            Order <span className="text-emerald-500">#{activeOrder.orderId}</span>
                        </h2>

                        <div className="flex flex-wrap items-center gap-3 text-neutral-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-emerald-500/70" />
                                <span>
                                    {new Date(activeOrder.date).toLocaleDateString([], {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>

                            <span className="w-1 h-1 rounded-full bg-white/10"></span>

                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-emerald-500/70" />
                                <span>
                                    {new Date(activeOrder.date).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-emerald-500 transition-all active:scale-95"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid lg:grid-cols-2 gap-8 mb-10">
                        {/* Order Status & Info */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Zap size={18} className="text-emerald-500" />
                                Order Details
                            </h3>

                            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/5 space-y-5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-neutral-400">Current Status</span>
                                    <span className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border ${getStatusStyles(activeOrder.status)}`}>
                                        {activeOrder.status}
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <div className="relative">
                                        <p className="text-sm text-neutral-400 mb-2">Update Status</p>
                                        <select
                                            value={activeOrder.status}
                                            onChange={(e) => updateOrderStatus(activeOrder.orderId, e.target.value)}
                                            className="w-full appearance-none bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-base text-white outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="dispatched">Dispatched</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="canceled">Cancelled</option>
                                        </select>
                                        <div className="absolute bottom-4 right-4 flex items-center pointer-events-none text-emerald-500">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-neutral-400 mb-1">Customer Name</p>
                                        <p className="text-lg font-semibold text-white">{activeOrder.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-neutral-400 mb-2">Address</p>
                                        <div className="flex items-start gap-3 bg-neutral-950/50 p-4 rounded-xl border border-white/5">
                                            <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-base text-neutral-300 leading-relaxed">
                                                {activeOrder.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <CreditCard size={18} className="text-emerald-500" />
                                Payment Summary
                            </h3>

                            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/5 space-y-5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-neutral-400">Payment Status</span>
                                    <span
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                                            activeOrder.paymentStatus === 'Paid'
                                                ? 'bg-emerald-500 text-black border-emerald-500'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}
                                    >
                                        {activeOrder.paymentStatus || "Pending"}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-neutral-400">Order Amount</p>
                                    <p className="text-2xl md:text-3xl font-bold text-emerald-500">
                                        LKR {activeOrder.total?.toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="text-sm text-neutral-400">Method</span>
                                        <span className="text-sm font-semibold text-white">
                                            {activeOrder.paymentMethod || "Direct Transfer"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Package size={18} className="text-emerald-500" />
                            Ordered Items
                        </h3>

                        <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/5 text-sm font-semibold text-neutral-400 border-b border-white/5">
                                    <tr>
                                        <th className="p-5">Product Details</th>
                                        <th className="p-5 text-center">Qty</th>
                                        <th className="p-5 text-right">Unit Price</th>
                                        <th className="p-5 text-right">Sub Total</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/[0.03]">
                                    {activeOrder.products?.map((item, idx) => (
                                        <tr key={idx} className="group/item hover:bg-white/[0.01] transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-neutral-950 p-2 border border-white/5 group-hover/item:border-emerald-500/30 transition-all overflow-hidden relative shadow-inner">
                                                        <img
                                                            src={item.productInfo?.image?.[0] || "/placeholder.png"}
                                                            alt={item.productInfo?.name}
                                                            className="w-full h-full object-contain grayscale opacity-70 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay"></div>
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-white text-base">
                                                            {item.productInfo?.name}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 mt-1">
                                                            ID: {item.productInfo?.productId || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-5 text-center text-base font-semibold text-white">
                                                {item.quantity}
                                            </td>

                                            <td className="p-5 text-right text-sm text-neutral-400">
                                                LKR {item.productInfo?.price?.toLocaleString()}
                                            </td>

                                            <td className="p-5 text-right text-base font-semibold text-emerald-400">
                                                LKR {(item.productInfo?.price * item.quantity).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 md:p-8 border-t border-white/5 shrink-0 bg-white/[0.01] flex flex-col sm:flex-row justify-end gap-4">
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <Printer size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                        Print Order
                    </button>

                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
                    >
                        Close Details
                    </button>
                </div>
            </motion.div>
        </div>
    )}
</AnimatePresence>
        </div>
    );
}

// Helpers
function getStatusStyles(status) {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'dispatched':
        case 'in transit': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'delivered': return 'bg-emerald-500 text-black border-emerald-500';
        case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
}
