/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  UserPlus,
  Trash2,
  Search,
  Shield,
  Mail,
  User,
  ShieldCheck,
  Activity,
  Zap,
  Lock,
  Users,
  Database,
  SearchCode,
  CheckCircle2,
  ChevronRight,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../../components/loading';

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

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Form state for creating new users
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'customer' // Default role
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}users/get-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data) throw new Error('No data received');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error(err.response?.data?.message || 'Failed to load user directory');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}users`, newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('User successfully created and added to the directory.', {
        icon: <CheckCircle2 className="text-emerald-500" />
      });

      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'customer'
      });

      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user account');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('User successfully deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}users/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User verified successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleStatus = (role) => {
    switch (role) {
      case 'admin': return { label: 'Admin', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'logistics': return { label: 'Logistics Partner', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
      case 'rdc_staff': return { label: 'Staff Member', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'producer': return { label: 'Supplier', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      default: return { label: 'Customer', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
  };

  if (loading && users.length === 0) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950"></div>
      <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-neutral-400 font-sans font-medium text-sm animate-pulse">Loading User Directory...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-24 relative overflow-hidden">

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
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-sm font-semibold tracking-wide mb-6">
              <Shield size={16} className="text-emerald-500" />
              User Management
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-[1]">
              User <span className="text-emerald-500">Directory.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-neutral-400 max-w-2xl font-medium tracking-tight">
              Manage accounts, roles, and permissions across the platform.
            </motion.p>
          </div>
          <motion.div variants={fadeInUp} className="flex gap-4">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col gap-1 min-w-[140px] shadow-2xl relative overflow-hidden group">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest relative z-10">Total Users</span>
              <span className="text-2xl font-bold text-emerald-400 relative z-10">{users.length}</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Column: Create User Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/3 sticky top-32"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-t-emerald-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] pointer-events-none"></div>

              <h2 className="text-xl font-sans font-bold text-white mb-8 flex items-center gap-3">
                <UserPlus size={20} className="text-emerald-500" />
                Add New User
              </h2>

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-300 px-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-neutral-700 outline-none focus:border-emerald-500/50 transition-all text-sm"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-300 px-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-neutral-700 outline-none focus:border-emerald-500/50 transition-all text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-300 px-2">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-white placeholder:text-neutral-500 outline-none focus:border-emerald-500/50 transition-all text-sm font-sans"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-300 px-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      required
                      minLength="6"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-white placeholder:text-neutral-700 outline-none focus:border-emerald-500/50 transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-300 px-2">User Role</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <select
                      name="role"
                      value={newUser.role}
                      onChange={handleInputChange}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-10 py-3.5 text-white outline-none focus:border-emerald-500/50 transition-all text-sm font-sans appearance-none"
                    >
                      <option value="customer" className="bg-neutral-900">Customer</option>
                      <option value="producer" className="bg-neutral-900">Supplier</option>
                      <option value="admin" className="bg-neutral-900">Admin</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none group-hover:text-emerald-500 rotate-90 transition-all" size={18} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-black font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/10 tracking-wide text-sm mt-4"
                >
                  Create User
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column: User List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-2/3"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden">

              {/* Search Bar */}
              <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full max-w-md group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search Users..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium text-white outline-none focus:border-emerald-500 transition-all font-sans placeholder:text-neutral-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5 font-sans text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="py-5 px-8">User</th>
                      <th className="py-5 px-8">Email</th>
                      <th className="py-5 px-8">Role</th>
                      <th className="py-5 px-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    <AnimatePresence>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <motion.tr
                            key={user._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="py-6 px-8 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-display font-black text-sm mr-4 group-hover:scale-110 transition-transform">
                                  {user.firstName?.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white tracking-tight">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className={`text-xs font-sans mt-0.5 ${user.isApproved || user.role === 'admin' ? "text-emerald-500" : "text-amber-500"}`}>
                                    {user.isApproved || user.role === 'admin' ? "Verified User" : "Pending Approval"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-8 whitespace-nowrap font-sans text-sm text-neutral-300">
                              {user.email}
                            </td>
                            <td className="py-6 px-8 whitespace-nowrap">
                              {(() => {
                                const status = getRoleStatus(user.role);
                                return (
                                  <span className={`px-3 py-1.5 rounded-xl border text-xs font-sans font-medium tracking-wide ${status.color}`}>
                                    {status.label}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="py-6 px-8 whitespace-nowrap flex items-center justify-end gap-3 min-w-[200px]">
                              {user.documentData && (
                                <a
                                  href={user.documentData}
                                  download={`verification_document_${user._id}`}
                                  className="p-3 bg-white/5 border border-white/5 rounded-xl text-blue-400 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/30 transition-all"
                                  title="Download Verification Document"
                                >
                                  <FileText size={18} />
                                </a>
                              )}
                              
                              {(!user.isApproved && user.role !== 'admin') && (
                                <button
                                  onClick={() => handleApproveUser(user._id)}
                                  className="p-3 bg-white/5 border border-white/5 rounded-xl text-emerald-500 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all"
                                  title="Approve User"
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-3 bg-white/5 border border-white/5 rounded-xl text-neutral-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                                title="Delete User"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-40">
                              <SearchCode size={48} className="text-neutral-500" />
                              <p className="font-sans font-semibold text-neutral-400">No users found matching your search</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;