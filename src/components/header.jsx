/* eslint-disable no-unused-vars */
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BsCart3, BsSearch, BsList, BsX } from "react-icons/bs";
import { FiUser, FiLogOut, FiChevronRight, FiBell } from "react-icons/fi";
import { TbRecycle } from "react-icons/tb";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/").replace(/\/$/, "");
const socket = io(baseUrl);

export default function Header() {
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const cartData = JSON.parse(localStorage.getItem("cart") || "[]");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") return;

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data in header", error);
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
        console.error("Failed to fetch notifications:", error);
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
      console.error("Failed to mark notification as read:", error);
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
      console.error("Failed to clear notifications:", error);
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
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/products" },
    { name: "Track Exchange", path: "/track-order" },
    { name: "Reviews", path: "/review" },
    { name: "Contact", path: "/contact" },
    { name: "My Orders", path: "/customer-order" }
  ];

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            width: scrolled ? "92%" : "100%",
            maxWidth: scrolled ? "1400px" : "100%",
            borderRadius: scrolled ? "32px" : "0px",
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`pointer-events-auto transition-all duration-700 flex items-center justify-between px-8 lg:px-12 ${scrolled
            ? "bg-neutral-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_64px_rgba(0,0,0,0.4)] h-20 mt-4"
            : "bg-transparent border-transparent h-28 mt-0"
            }`}
        >
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <TbRecycle size={28} strokeWidth={2} className="relative z-10" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -inset-1 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>

            <div className="flex flex-col">
              <span className="text-3xl font-bricolage font-bold text-white tracking-tighter leading-none group-hover:text-emerald-400 transition-colors">
                RE<span className="text-emerald-500 font-light tracking-widest ml-1">-SOURCE</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 bg-neutral-950/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/5 shadow-2xl mx-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-6 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 rounded-full ${isActive ? "text-emerald-400" : "text-neutral-400 hover:text-white"
                    }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 border border-white/10 rounded-full bg-white/5 shadow-inner"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/search")}
                className="p-3 text-neutral-400 hover:text-emerald-400 rounded-2xl transition-all border border-transparent hover:border-white/10"
                aria-label="Search"
              >
                <BsSearch size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/cart")}
                className="relative p-3 text-neutral-400 hover:text-emerald-400 rounded-2xl transition-all border border-transparent hover:border-white/10"
                aria-label="Cart"
              >
                <BsCart3 size={22} />
                {cartData.length > 0 && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-black ring-2 ring-neutral-900 animate-pulse">
                    {cartData.length}
                  </span>
                )}
              </motion.button>

              {token && (
                <div className="relative z-50">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 text-neutral-400 hover:text-emerald-400 rounded-2xl transition-all border border-transparent hover:border-white/10"
                    aria-label="Notifications"
                  >
                    <FiBell size={22} />
                    {notifications.length > 0 && (
                      <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black ring-2 ring-neutral-900 animate-pulse">
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
                        className="absolute right-0 mt-4 w-80 bg-neutral-900/95 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                          <h3 className="font-display font-bold text-white tracking-tight">
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

                                      <span className="text-[9px] text-neutral-500 font-mono tracking-wider shrink-0">
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
                            <FiBell size={10} /> Open Communication
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/10 ml-2">
              {token ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate("/profile")}
                    className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-800 text-neutral-200 border border-white/10 shadow-lg hover:bg-neutral-700 transition-all"
                    title="User Profile"
                  >
                    <FiUser size={22} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, color: "#f43f5e" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="text-xs font-bold tracking-widest uppercase text-neutral-300 hover:text-rose-500 px-4 py-2 transition-colors"
                  >
                    Exit
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest uppercase text-black bg-emerald-500 hover:bg-emerald-400 rounded-full shadow-2xl transition-all"
                >
                  <span>Sign In</span>
                  <FiChevronRight size={18} />
                </motion.button>
              )}
            </div>

            <button
              onClick={() => setSideDrawerOpened(true)}
              className="lg:hidden p-3 text-neutral-300 hover:text-emerald-400 hover:bg-white/5 rounded-2xl transition-all"
              aria-label="Menu"
            >
              <BsList size={32} />
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
              className="fixed inset-y-0 right-0 w-[280px] bg-white z-[60] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <span className="text-lg font-display font-bold text-slate-900">Navigation</span>
                <button
                  onClick={() => setSideDrawerOpened(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <BsX size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setSideDrawerOpened(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-base font-medium ${location.pathname === link.path
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      {link.name}
                      {location.pathname === link.path && <FiChevronRight size={16} />}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                {token ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 text-rose-600 font-semibold rounded-xl hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm text-sm"
                  >
                    <FiLogOut size={16} /> Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setSideDrawerOpened(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-md text-sm"
                  >
                    <FiUser size={16} /> Tenant Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}