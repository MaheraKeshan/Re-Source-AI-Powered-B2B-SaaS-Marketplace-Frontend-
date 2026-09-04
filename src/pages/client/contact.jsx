/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiHelpCircle,
  FiArrowRight,
  FiChevronDown
} from "react-icons/fi";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import Header from "../../components/header";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }

  return (
    <div className="w-full min-h-screen bg-neutral-950 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-hidden">
      <div className="bg-grain"></div>
      <div className="liquid-glass-container">
        <div className="liquid-blob blob-1"></div>
        <div className="liquid-blob blob-2"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 shadow-2xl px-5 py-2 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-wider mb-10">
              <FiHelpCircle className="text-emerald-500" />
              <span>CUSTOMER SUPPORT 24/7</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[0.9]">
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 animate-gradient-x">Conversation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-tight font-light">
              We're here to help. Contact our support team for any questions, feedback, or assistance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* --- Contact Form --- */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex-[1.5]"
            >
              <div className="bg-neutral-900/40 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-emerald-500/10"></div>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-20 flex flex-col items-center justify-center h-full"
                  >
                    <div className="bg-emerald-500/10 w-28 h-28 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                      <FiCheckCircle className="text-6xl text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">MESSAGE SENT</h2>
                    <p className="text-xl text-neutral-400 mb-12 max-w-md font-light leading-relaxed">
                      Your message was sent successfully. Our support team will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-3 bg-white text-black hover:bg-emerald-500 hover:text-black px-10 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-2xl uppercase text-sm tracking-wider"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-4 uppercase">
                      Contact Us
                      <div className="h-px flex-1 bg-white/5 ml-4"></div>
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label htmlFor="name" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                            FULL NAME
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/5 px-6 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all bg-white/5 text-white font-light text-lg placeholder-neutral-600"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-3">
                          <label htmlFor="email" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                            EMAIL ADDRESS
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/5 px-6 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all bg-white/5 text-white font-light text-lg placeholder-neutral-600"
                            placeholder="user@domain.ext"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="subject" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                          SUBJECT
                        </label>
                        <div className="relative">
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/5 px-6 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 bg-white/5 text-white font-light text-lg appearance-none cursor-pointer"
                          >
                            <option className="bg-neutral-900">General Inquiry</option>
                            <option className="bg-neutral-900">Order Status & Tracking</option>
                            <option className="bg-neutral-900">Report Damaged Goods</option>
                            <option className="bg-neutral-900">Partnership Request</option>
                            <option className="bg-neutral-900">Billing Issue</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                            <FiChevronDown size={20} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="message" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                          MESSAGE
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-white/5 px-6 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 resize-none transition-all bg-white/5 text-white font-light text-lg placeholder-neutral-600"
                          placeholder="How can we help you today?"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-6 rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 transition-all duration-500 flex items-center justify-center gap-4 group uppercase text-sm tracking-wider"
                      >
                        <span>SEND MESSAGE</span>
                        <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            {/* --- Info Side Panel --- */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="flex-1 space-y-10"
            >
              {/* Info Card */}
              <div className="bg-white/2 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-sm">
                <h3 className="text-2xl font-bold text-white mb-10 uppercase">CONTACT INFO</h3>

                <div className="space-y-12">
                  <div className="flex items-start gap-6 group">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 border border-emerald-500/20 shadow-2xl">
                      <FiMapPin size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-400 text-xs uppercase tracking-wider mb-2">HEADQUARTERS</h4>
                      <p className="text-neutral-400 leading-tight text-lg font-light">
                        IslandLink HQ, Logistics Park<br />
                        Central Province, Sri Lanka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 border border-emerald-500/20 shadow-2xl">
                      <FiPhone size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-400 text-xs uppercase tracking-wider mb-2">PHONE</h4>
                      <p className="text-emerald-400 text-xl font-bold">+94 11 234 5678</p>
                      <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wider font-bold">Mon - Fri, 8AM - 6PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 border border-emerald-500/20 shadow-2xl">
                      <FiMail size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-400 text-xs uppercase tracking-wider mb-2">EMAIL</h4>
                      <a href="mailto:support@islandlink.lk" className="text-white font-light hover:text-emerald-400 transition-colors block text-xl underline decoration-white/10 hover:decoration-emerald-500">
                        support@islandlink.lk
                      </a>
                      <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wider font-bold">Reply within 24hrs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Card */}
              <div className="bg-emerald-500 p-12 rounded-[3.5rem] shadow-2xl text-black relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <FiSend size={150} />
                </div>
                <h3 className="font-bold text-3xl mb-3 uppercase relative z-10">SOCIAL MEDIA</h3>
                <p className="text-black/60 text-lg mb-10 relative z-10 font-medium leading-tight">Follow us on social media for the latest updates.</p>

                <div className="flex gap-4 relative z-10">
                  <a href="#" className="bg-black/10 hover:bg-black text-white p-5 rounded-2xl transition-all duration-500 hover:scale-110 shadow-lg">
                    <FaLinkedin size={24} />
                  </a>
                  <a href="#" className="bg-black/10 hover:bg-black text-white p-5 rounded-2xl transition-all duration-500 hover:scale-110 shadow-lg">
                    <FaFacebook size={24} />
                  </a>
                  <a href="#" className="bg-black/10 hover:bg-black text-white p-5 rounded-2xl transition-all duration-500 hover:scale-110 shadow-lg">
                    <FaTwitter size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto h-[500px] bg-neutral-900 rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/5 relative group">
          <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-transparent transition-colors duration-1000 pointer-events-none z-10" />
          <iframe
            title="IslandLink Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.56436561575!2d79.81368499256976!3d6.922001981881775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1709462845341!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(0.8) brightness(0.9)" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="group-hover:filter-none transition-all duration-1000 scale-105 group-hover:scale-100"
          ></iframe>
          <div className="absolute bottom-10 left-10 z-20">
            <div className="bg-neutral-900/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-white text-xs font-bold tracking-wider uppercase">LOCATION</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
