import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import {
    Search,
    Phone,
    Video,
    Send,
    Paperclip,
    ArrowLeft,
    Check,
    CheckCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import ProducerHeader from '../components/ProducerHeader';

// Helper to ensure no double slashes in URL
const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/").replace(/\/$/, "");
const socket = io(baseUrl);

export default function CommunicationPage() {
    const location = useLocation();

    const targetProducerId = location.state?.producerId;
    const targetProducerName = location.state?.producerName;

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const messagesEndRef = useRef(null);

    // Get current logged-in user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user:", error);
            }
        }
    }, []);

    // Join personal notification room
    useEffect(() => {
        if (!currentUser?._id) return;

        socket.emit("join_notification_room", currentUser._id);
        console.log("Joined notification room:", currentUser._id);
    }, [currentUser]);

    // Fetch real users to populate the sidebar
    useEffect(() => {
        const fetchRealContacts = async () => {
            if (!currentUser) return;

            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(`${baseUrl}/users/get-users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Raw Users Data from Backend:", res.data);

                let usersList = [];

                if (Array.isArray(res.data)) {
                    usersList = res.data;
                } else if (res.data && Array.isArray(res.data.users)) {
                    usersList = res.data.users;
                } else {
                    console.error("Backend did not return an array. It returned:", res.data);
                    return;
                }

                // Sync missing _id if old localStorage user lacks it
                let activeUser = currentUser;

                if (currentUser && !currentUser._id) {
                    const matchedSelf = usersList.find(
                        (u) => String(u.email).toLowerCase().trim() === String(currentUser.email).toLowerCase().trim()
                    );

                    if (matchedSelf) {
                        const preciseName =
                            matchedSelf.name ||
                            `${matchedSelf.firstName || ''} ${matchedSelf.lastName || ''}`.trim() ||
                            currentUser.firstName ||
                            "User";

                        const updatedUser = {
                            ...currentUser,
                            _id: matchedSelf._id,
                            name: preciseName
                        };

                        activeUser = updatedUser;
                        setCurrentUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                    }
                }

                const validUsers = usersList.filter((u) => {
                    if (String(u._id) === String(activeUser?._id)) return false;

                    if (activeUser?.role === "customer") {
                        return u.role === "producer";
                    }

                    if (activeUser?.role === "producer") {
                        return u.role !== "admin";
                    }

                    return true;
                });

                const formattedContacts = validUsers.map((u) => ({
                    id: u._id,
                    email: u.email,
                    name:
                        u.name ||
                        `${u.firstName || ''} ${u.lastName || ''}`.trim() ||
                        "Unknown User",
                    avatar:
                        u.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User'
                        )}&background=10b981&color=fff`,
                    status: "online",
                    type: u.role || "User",
                    lastMessage: "Start a conversation...",
                    time: ""
                }));

                setContacts(formattedContacts);

                // Auto-select producer from product page
                if (targetProducerId) {
                    console.log("Target Producer ID:", targetProducerId);
                    console.log(
                        "Available contacts:",
                        formattedContacts.map((c) => ({
                            name: c.name,
                            id: c.id,
                            email: c.email
                        }))
                    );

                    const target = formattedContacts.find(
                        (c) =>
                            String(c.id) === String(targetProducerId) ||
                            String(c.email).toLowerCase().trim() === String(targetProducerId).toLowerCase().trim()
                    );

                    if (target) {
                        setSelectedContact(target);
                        setSidebarOpen(false);
                    } else {
                        const tempContact = {
                            id: targetProducerId,
                            email: targetProducerId,
                            name: targetProducerName || "Producer",
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                targetProducerName || 'Producer'
                            )}&background=10b981&color=fff`,
                            status: "online",
                            type: "Producer",
                            lastMessage: "New negotiation...",
                            time: ""
                        };

                        setContacts((prev) => [tempContact, ...prev]);
                        setSelectedContact(tempContact);
                        setSidebarOpen(false);
                    }
                } else if (formattedContacts.length > 0 && !selectedContact) {
                    setSelectedContact(formattedContacts[0]);
                }
            } catch (error) {
                console.error("Failed to load contacts:", error);
            }
        };

        fetchRealContacts();
    }, [currentUser, targetProducerId, targetProducerName, selectedContact]);

    // Join private room and fetch chat history
    useEffect(() => {
        if (!selectedContact || !currentUser?._id) return;

        const privateRoomId = [currentUser._id, selectedContact.id].sort().join('_');

        socket.emit("join_room", privateRoomId);

        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(`${baseUrl}/chat/${privateRoomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const formattedMessages = res.data.map((m) => ({
                    id: m._id,
                    senderId: String(m.authorId) === String(currentUser._id) ? 0 : selectedContact.id,
                    text: m.message,
                    time: m.time,
                    status: "read"
                }));

                const uniqueMessages = [];
                const seen = new Set();

                formattedMessages.forEach((msg) => {
                    const key = `${msg.text}_${msg.time}_${msg.senderId}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueMessages.push(msg);
                    }
                });

                setMessages(uniqueMessages);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        };

        fetchHistory();
    }, [selectedContact, currentUser]);

    // Listen for incoming real-time messages
    useEffect(() => {
        if (!currentUser || !selectedContact) return;

        const handleReceiveMsg = (data) => {
            setMessages((prev) => {
                const alreadyExists = prev.some(
                    (m) =>
                        m.text === data.message &&
                        m.time === data.time &&
                        m.senderId === (String(data.authorId) === String(currentUser._id) ? 0 : selectedContact.id)
                );

                if (alreadyExists) return prev;

                return [
                    ...prev,
                    {
                        id: Date.now(),
                        senderId: String(data.authorId) === String(currentUser._id) ? 0 : selectedContact.id,
                        text: data.message,
                        time: data.time,
                        status: "read"
                    }
                ];
            });
        };

        socket.on("receive_message", handleReceiveMsg);

        return () => {
            socket.off("receive_message", handleReceiveMsg);
        };
    }, [currentUser, selectedContact]);

    // Optional: listen for live notifications
    useEffect(() => {
        const handleReceiveNotification = (data) => {
            console.log("New notification received:", data);
        };

        socket.on("receive_notification", handleReceiveNotification);

        return () => {
            socket.off("receive_notification", handleReceiveNotification);
        };
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !currentUser?._id || !selectedContact?.id) return;

        const timeString = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        const privateRoomId = [currentUser._id, selectedContact.id].sort().join('_');

        const msgData = {
            room: privateRoomId,
            author:
                currentUser.name ||
                `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() ||
                "User",
            authorId: currentUser._id,
            receiverId: selectedContact.id,
            message: newMessage.trim(),
            time: timeString
        };

        socket.emit("send_message", msgData);

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                senderId: 0,
                text: newMessage.trim(),
                time: timeString,
                status: "sent"
            }
        ]);

        setNewMessage("");
    };

    const isProducerUser = currentUser?.role === "producer";

    if (!currentUser || !selectedContact) {
        return (
            <div className="flex flex-col h-screen bg-neutral-950 font-sans">
                {isProducerUser ? <ProducerHeader /> : <Header />}
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-neutral-500">Loading messages...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-neutral-50 font-sans relative selection:bg-emerald-500/30 overflow-hidden">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ perspective: '1200px' }}>
                <motion.div
                    animate={{ rotateY: [0, 360], rotateX: [0, 15, -15, 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute -top-24 -right-24 w-80 h-80 opacity-50"
                >
                    <div className="w-full h-full rounded-3xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-500/30 to-teal-500/10 shadow-[inset_0_0_80px_rgba(16,185,129,0.3),0_0_80px_rgba(16,185,129,0.2)]" />
                </motion.div>

                <motion.div
                    animate={{ rotateZ: [0, 360], y: [0, -40, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute top-[25%] -left-20 w-64 h-64 opacity-40"
                >
                    <div className="w-full h-full rounded-full border border-purple-400/50 bg-gradient-to-br from-purple-500/35 via-violet-500/20 to-transparent shadow-[0_0_100px_rgba(168,85,247,0.35)]" />
                </motion.div>

                <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[12%] left-[6%] w-40 h-40 opacity-50"
                >
                    <div className="w-full h-full rotate-45 border-2 border-cyan-400/60 bg-gradient-to-br from-cyan-400/30 to-blue-500/15 shadow-[0_0_60px_rgba(34,211,238,0.45)]" />
                </motion.div>

                <motion.div
                    animate={{ rotateX: [30, -30, 30], rotateY: [0, 180, 360] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute -bottom-8 right-[10%] w-56 h-56 opacity-45"
                >
                    <div className="w-full h-full rounded-full border-2 border-amber-400/50 bg-gradient-to-t from-amber-500/25 to-orange-400/10 shadow-[0_0_80px_rgba(251,191,36,0.35)]" />
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-40 left-1/2 -translate-x-1/2 w-[480px] h-[480px]"
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-indigo-500/40 to-transparent blur-[80px]" />
                </motion.div>

                <motion.div
                    animate={{ y: [0, 25, 0], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    className="absolute top-[40%] right-[3%] w-44 h-44"
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-500/35 to-pink-600/15 blur-2xl" />
                </motion.div>
            </div>

            {isProducerUser ? <ProducerHeader /> : <Header />}

            <div className="flex-1 flex overflow-hidden relative z-10 pt-20 gap-0">
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 absolute md:relative z-20 w-72 h-full flex flex-col transition-transform duration-300 ease-in-out`}>
                    <div className="px-6 pt-8 pb-5">
                        <h2 className="text-base font-bold text-white tracking-tight mb-4">Messages</h2>
                        <div className="relative group">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-400 transition-colors"
                                size={15}
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] rounded-full text-sm text-white focus:bg-white/[0.06] focus:outline-none transition-all placeholder:text-neutral-700 font-medium"
                            />
                        </div>
                    </div>

                    <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-2" />

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-0.5">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => {
                                    setSelectedContact(contact);
                                    setSidebarOpen(false);
                                }}
                                className={`group flex items-center gap-3 px-3 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 relative ${
                                    selectedContact?.id === contact.id
                                        ? 'bg-emerald-500/10'
                                        : 'hover:bg-white/[0.03]'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={contact.avatar}
                                        alt={contact.name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-emerald-500/20 transition-all"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-950 bg-emerald-500" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${selectedContact?.id === contact.id ? 'text-emerald-400' : 'text-neutral-200'}`}>
                                        {contact.name}
                                    </p>
                                    <p className="text-xs text-neutral-600 truncate capitalize">{contact.type}</p>
                                </div>

                                {selectedContact?.id === contact.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/8 to-transparent self-stretch my-4 shrink-0" />

                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between px-8 py-5 shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                className="md:hidden p-2 text-neutral-500 hover:text-white rounded-full hover:bg-white/5 transition-all"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <div className="relative">
                                <img
                                    src={selectedContact.avatar}
                                    alt={selectedContact.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                                />
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-950 bg-emerald-500" />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-white tracking-tight leading-none mb-1">
                                    {selectedContact.name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-medium text-neutral-500">Online</span>
                                    <span className="text-neutral-700">·</span>
                                    <span className="text-xs text-neutral-600 capitalize">{selectedContact.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 text-neutral-600 hover:text-emerald-400 hover:bg-emerald-500/8 rounded-full transition-all"
                            >
                                <Phone size={17} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 text-neutral-600 hover:text-emerald-400 hover:bg-emerald-500/8 rounded-full transition-all"
                            >
                                <Video size={17} />
                            </motion.button>
                        </div>
                    </div>

                    <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent shrink-0" />

                    <div className="flex-1 overflow-y-auto px-6 md:px-12 py-6 space-y-3 custom-scrollbar">
                        <div className="flex justify-center mb-2">
                            <span className="text-xs font-medium text-neutral-700 bg-white/[0.03] px-4 py-1 rounded-full">
                                Beginning of conversation
                            </span>
                        </div>

                        {messages.map((msg) => {
                            const isMe = msg.senderId === 0;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {!isMe && (
                                        <img
                                            src={selectedContact.avatar}
                                            alt={selectedContact.name}
                                            className="w-11 h-11 rounded-full object-cover shrink-0 opacity-90 mb-1"
                                        />
                                    )}

                                    <div className={`max-w-[80%] flex flex-col gap-2 ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`px-6 py-5 text-lg leading-relaxed ${
                                                isMe
                                                    ? 'bg-emerald-500 text-neutral-950 font-semibold rounded-[1.75rem] rounded-br-md shadow-lg shadow-emerald-500/20'
                                                    : 'bg-white/[0.07] backdrop-blur-sm text-white rounded-[1.75rem] rounded-bl-md'
                                            }`}
                                        >
                                            {msg.text}
                                        </div>

                                        <div className={`flex items-center gap-2 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-sm text-neutral-500">{msg.time}</span>
                                            {isMe && (
                                                <span className="text-neutral-500">
                                                    {msg.status === 'read' ? <CheckCheck size={15} /> : <Check size={15} />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="px-6 md:px-10 pb-8 pt-4 shrink-0">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-4 bg-white/[0.05] backdrop-blur-xl rounded-full px-6 py-4 focus-within:bg-white/[0.07] transition-all group"
                        >
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                className="text-neutral-600 hover:text-emerald-400 transition-colors shrink-0"
                            >
                                <Paperclip size={18} />
                            </motion.button>

                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Write a message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-base text-white placeholder:text-neutral-600 font-medium leading-relaxed resize-none h-7 py-0 outline-none"
                                rows="1"
                            />

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="w-11 h-11 bg-emerald-500 text-neutral-950 rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-20 disabled:shadow-none transition-all flex items-center justify-center shrink-0"
                            >
                                <Send size={18} />
                            </motion.button>
                        </form>

                        <p className="text-center text-[10px] font-medium text-neutral-800 mt-3">
                            End-to-end encrypted · Private conversation
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}