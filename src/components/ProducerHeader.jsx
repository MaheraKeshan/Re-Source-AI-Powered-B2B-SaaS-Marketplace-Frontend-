/* eslint-disable no-unused-vars */
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, List, X, User, LogOut, ChevronRight, Recycle } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/").replace(/\/$/, "");
const socket = io(baseUrl);

export default function ProducerHeader() {
    const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser || storedUser === "undefined") return;

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Error parsing producer user data:", error);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!user?._id) return;

        const fetchUnreadNotifications = async () => {
            try {
                const res = await fetch(`${baseUrl}/notifications/unread/${user._id}`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    setNotifications(data);
                } else {
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Failed to fetch producer notifications:", error);
            }
        };

        fetchUnreadNotifications();

        socket.emit("join_notification_room", user._id);

        const handleNotification = (data) => {
            toast.success(`New message from ${data.title || data.from || "User"}`);
            fetchUnreadNotifications();
        };

        socket.on("receive_notification", handleNotification);

        return () => {
            socket.off("receive_notification", handleNotification);
        };
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        toast.success("Logged out successfully");
        window.location.href = "/login";
    };

    const handleNotificationClick = async (notif) => {
        try {
            if (notif?._id) {
                await fetch(`${baseUrl}/notifications/${notif._id}/read`, {
                    method: "PUT"
                });
            }

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
            setShowNotifications(false);
            navigate(notif.link || "/communication");
        } catch (error) {
            console.error("Failed to mark producer notification as read:", error);
            setShowNotifications(false);
            navigate(notif.link || "/communication");
        }
    };

    const handleClearAll = async () => {
        try {
            await Promise.all(
                notifications.map((notif) => {
                    if (!notif?._id) return Promise.resolve();
                    return fetch(`${baseUrl}/notifications/${notif._id}/read`, {
                        method: "PUT"
                    });
                })
            );

            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear producer notifications:", error);
            toast.error("Failed to clear notifications");
        }
    };

    const formatNotificationTime = (notif) => {
        if (notif?.time) return notif.time;

        if (notif?.createdAt) {
            return new Date(notif.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        }

        return "";
    };

    const navLinks = [
        { name: "Home", path: "/producer" },
        { name: "Listings", path: "/producer/listings" },
        { name: "Orders", path: "/producer/orders" },
        { name: "Reviews", path: "/producer/reviews" },
    ];

    return (
        <>
            <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        width: scrolled ? "90%" : "100%",
                        maxWidth: scrolled ? "1280px" : "100%",
                        borderRadius: scrolled ? "24px" : "0px",
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className={`pointer-events-auto transition-all duration-500 flex items-center justify-between px-6 lg:px-8 ${
                        scrolled
                            ? "bg-neutral-950/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-16 mt-2"
                            : "bg-transparent border-transparent h-24 mt-0"
                    }`}
                >
                    <Link to="/producer" className="flex items-center gap-3 group">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 text-emerald-500 shadow-lg shadow-emerald-500/10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                            <Recycle size={22} strokeWidth={2.5} className="relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl font-sans font-bold text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
                                Re<span className="text-emerald-500">-Source</span>
                            </span>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                                Producer Portal
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5 shadow-sm mx-auto">
                        {navLinks.map((link) => {
                            const isActive =
                                location.pathname === link.path ||
                                (link.path !== "/producer" && location.pathname.startsWith(link.path));

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative px-4 py-2 text-[13px] font-semibold transition-all duration-300 rounded-full ${
                                        isActive ? "text-emerald-400" : "text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill-producer"
                                            className="absolute inset-0 border border-emerald-500/20 rounded-full -z-10 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1 relative z-50">
                            {token && (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2.5 text-neutral-400 hover:text-emerald-400 hover:bg-white/5 rounded-full transition-colors relative"
                                        aria-label="Notifications"
                                    >
                                        <Bell size={18} />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-2 right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-black ring-2 ring-neutral-900 animate-pulse">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-2 w-80 bg-neutral-900/95 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden"
                                            >
                                                <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                                                    <h3 className="font-sans font-bold text-white tracking-tight">
                                                        Notifications
                                                    </h3>
                                                    {notifications.length > 0 && (
                                                        <button
                                                            onClick={handleClearAll}
                                                            className="text-[10px] text-emerald-500 hover:text-emerald-400 uppercase tracking-widest font-bold"
                                                        >
                                                            Clear All
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-6 text-center text-neutral-500 text-xs font-medium">
                                                            No new notifications
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif, idx) => (
                                                            <div
                                                                key={notif._id || idx}
                                                                className="p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer mb-1 border border-transparent hover:border-white/5"
                                                                onClick={() => handleNotificationClick(notif)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                                                                        {(notif.title || notif.from || "U")[0].toUpperCase()}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex justify-between items-center mb-0.5 gap-2">
                                                                            <span className="text-sm font-bold text-white truncate">
                                                                                {notif.title || notif.from || "Unknown User"}
                                                                            </span>
                                                                            <span className="text-[9px] text-neutral-500 tracking-wider font-mono shrink-0">
                                                                                {formatNotificationTime(notif)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-neutral-400 truncate tracking-wide">
                                                                            {notif.message}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                <div className="p-3 bg-neutral-950/50 border-t border-white/10 text-center">
                                                    <Link
                                                        to="/communication"
                                                        onClick={() => setShowNotifications(false)}
                                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <Bell size={10} /> Open Communication
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>

                        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10 ml-2">
                            <Link to="/producer/profile" className="flex items-center gap-3 mr-2 group/profile">
                                <div className="text-right hidden xl:block">
                                    <p className="text-sm font-semibold text-white tracking-tight leading-none group-hover/profile:text-emerald-400 transition-colors">
                                        {user?.firstName || "Producer"}
                                    </p>
                                    <p className="text-[11px] text-neutral-500 font-medium mt-1">Producer</p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm group-hover/profile:shadow-emerald-500/20 shadow-transparent transition-all"
                                >
                                    {user?.firstName ? user.firstName.charAt(0) : <User size={18} />}
                                </motion.button>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="text-sm font-bold text-neutral-500 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/5 transition-colors"
                            >
                                <LogOut size={16} />
                            </motion.button>
                        </div>

                        <button
                            onClick={() => setSideDrawerOpened(true)}
                            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-full transition-colors"
                            aria-label="Menu"
                        >
                            <List size={28} />
                        </button>
                    </div>
                </motion.header>
            </div>

            <AnimatePresence>
                {sideDrawerOpened && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSideDrawerOpened(false)}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-[300px] bg-neutral-950/95 backdrop-blur-2xl z-[60] shadow-2xl flex flex-col lg:hidden border-l border-white/5"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <span className="text-lg font-sans font-bold text-white">Producer Portal</span>
                                <button
                                    onClick={() => setSideDrawerOpened(false)}
                                    className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-4">
                                <div className="flex flex-col space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setSideDrawerOpened(false)}
                                            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all text-sm font-semibold tracking-wide ${
                                                location.pathname === link.path
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                                    : "text-neutral-500 hover:bg-white/5 hover:text-white"
                                            }`}
                                        >
                                            {link.name}
                                            {location.pathname === link.path && <ChevronRight size={16} />}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-4 mb-6 px-2">
                                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-emerald-500 font-sans font-bold text-xl shadow-lg">
                                        {user?.firstName ? user.firstName.charAt(0) : "P"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{user?.firstName || "Producer"}</p>
                                        <p className="text-[11px] text-neutral-500 font-medium">Producer Account</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-2xl hover:bg-red-500/20 transition-all shadow-sm text-sm"
                                >
                                    <LogOut size={16} /> Log Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}