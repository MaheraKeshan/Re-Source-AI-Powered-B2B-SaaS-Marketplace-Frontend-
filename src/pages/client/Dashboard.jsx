import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';
import { Heart, FileText, ArrowDown, ArrowRight, ShieldCheck, Leaf, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const COLORS = ['#10b981', '#059669', '#047857', '#34d399', '#6ee7b7'];

export default function Dashboard({ onClose }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("client");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                const role = storedUser?.role || "client";
                setUserRole(role);

                if (role === "producer") {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}analytics/producer`, {
                        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                    });
                    setStats(res.data);
                } else {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}analytics/client`, {
                        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                    });
                    setStats(res.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Dashboard error:", err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="bg-slate-50 min-h-full p-8 flex items-center justify-center text-slate-500 font-bold animate-pulse">Initializing Data Aggregation...</div>;
    }

    // Safely use fallback arrays if data is empty
    const lineData = stats?.topBuyingProducts?.length > 0 ? stats.topBuyingProducts : [{ name: 'No Data', value1: 0 }];
    const pieData = stats?.co2Distribution?.length > 0 ? stats.co2Distribution : [{ name: 'Empty', value: 1, color: '#d1d5db' }];
    const barData = stats?.topBuyingProducts || [];
    return (
        <div className="bg-slate-50 min-h-full p-8 overflow-y-auto w-full relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 z-10"
            >
                <ArrowRight size={20} className="text-slate-600" />
            </button>

            {/* --- Consumer Impact Scorecard --- */}
            <div className="bg-emerald-500/10 p-6 rounded-xl mb-8 border border-emerald-500/20">
                <h2 className="text-xl font-bold text-emerald-900 mb-5 ml-1 leading-snug">
                    {userRole === "producer" ? "Producer Network Impact" : "Consumer Impact Scorecard"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1 */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-emerald-500/20 flex flex-col justify-between h-40">
                        <TrendingUp size={16} className="text-emerald-500 mb-2" />
                        <div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Total Units Sold</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-900">{stats?.totalSold || 0}</span>
                                <span className="text-xs font-medium text-emerald-600 flex items-center">
                                    Units <ArrowRight size={12} className="ml-0.5" />
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                            <FileText size={12} /> <span>Across active supply chain</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-emerald-500/20 flex flex-col justify-between h-40">
                        <Leaf size={16} className="text-emerald-500 mb-2" />
                        <div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Cumulative CO₂ Impact</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-emerald-600">{stats?.co2Saved || 0}</span>
                                <span className="text-xs font-medium text-emerald-600 flex items-center">
                                    kg saved <ArrowRight size={12} className="ml-0.5" />
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                            <FileText size={12} /> <span>Derived from recycled sales</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-emerald-500/20 flex flex-col justify-between h-40">
                        <ShieldCheck size={16} className="text-emerald-500 mb-2" />
                        <div>
                            <p className="text-sm font-semibold text-slate-600 mb-2">Brand Trust Score</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-900">{stats?.trustScore || 100}</span>
                                <span className="text-xs font-medium text-slate-600 flex items-center">
                                    / 100
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2">
                            <Heart size={12} /> <span>Excellent Standing</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sustainability Performance</h2>
            </div>

            {/* --- Middle Charts Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Top Buying Products (Line Chart) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Product Sales Volume</h3>
                        <span className="text-xs text-emerald-600 flex items-center cursor-pointer font-bold">Units Sold <ArrowDown size={12} className="ml-1" /></span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <LineChart data={lineData}>
                                <CartesianGrid vertical={true} horizontal={true} strokeDasharray="3 3" stroke="#e5e7eb" verticalFill={['#fff', '#f9fafb']} fillOpacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value1" stroke="#10b981" strokeWidth={3} dot={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 flex items-center mt-4 uppercase tracking-wider">Analyze Portfolio <ArrowRight size={12} className="ml-1" /></button>
                </div>

                {/* Top Customers (Progress bars) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">
                        {userRole === "producer" ? "Top Buyers/Clients" : "Favorite Sellers"}
                    </h3>
                    <div className="space-y-6">
                        {stats?.topCustomers?.length > 0 ? stats.topCustomers.map((customer, idx) => {
                            const maxQty = Math.max(...stats.topCustomers.map(c => c.quantity));
                            const percentage = maxQty > 0 ? (customer.quantity / maxQty) * 100 : 0;
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between items-center text-xs mb-1.5">
                                        <span className="font-medium text-sm text-slate-700 truncate max-w-[150px]" title={customer.name}>{customer.name}</span>
                                        <span className="text-sm text-emerald-600 font-bold">{customer.quantity} Units</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-sm text-slate-500 italic py-4 text-center">No active buyers yet.</p>
                        )}
                    </div>
                    <button className="text-xs font-bold text-emerald-600 flex items-center mt-8 uppercase tracking-wider">View Client List <ArrowRight size={12} className="ml-1" /></button>
                </div>
            </div>

            {/* --- Bottom Charts Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* CO2 Saved (Donut Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="mb-4 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-lg text-slate-800">CO<sub>2</sub> Impact by Product</h3>
                    </div>

                    <div className="flex items-center justify-center gap-8 h-full">
                        <div className="relative w-40 h-40">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={70}
                                        fill="#8884d8"
                                        paddingAngle={0}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Saved</span>
                                <span className="text-3xl font-bold text-emerald-600">{stats?.co2Saved || 0}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {pieData.map((entry, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: entry.color }}></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 truncate max-w-[100px]" title={entry.name}>{entry.name}</p>
                                        <p className="text-xs text-emerald-600 font-medium">{entry.value} kg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="text-xs font-bold text-emerald-600 flex items-center mt-4 uppercase tracking-wider">Detailed Report <ArrowRight size={12} className="ml-1" /></button>
                </div>

                {/* Sales Volume (Bar Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="mb-4 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-lg text-slate-800">Volume Distribution</h3>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={barData} barSize={40}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                                <Bar dataKey="value1" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 flex items-center mt-4 uppercase tracking-wider">View Catalog <ArrowRight size={12} className="ml-1" /></button>
                </div>
            </div>

        </div>
    );
}
