import { Link } from "react-router-dom";
import { TbRecycle } from "react-icons/tb";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMapPin, FiPhone, FiMail, FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 pt-32 pb-12 border-t border-white/5 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">

          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-10">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="relative w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 transition-all duration-500 group-hover:rotate-6">
                <TbRecycle size={32} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold font-bricolage text-white leading-none tracking-tighter">
                  RE<span className="text-emerald-500 font-light tracking-widest ml-1">-SOURCE</span>
                </span>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/50 mt-1.5 px-0.5">Industrial Ecosystem</span>
              </div>
            </Link>

            <p className="text-lg leading-relaxed text-neutral-400 max-w-sm font-light">
              Engineering the shift to circular industrial economies. A specialized network for automated material exchange and waste redirection.
            </p>

            <div className="flex gap-4">
              <SocialLink href="#" icon={<FiFacebook size={20} />} label="Facebook" />
              <SocialLink href="#" icon={<FiTwitter size={20} />} label="Twitter" />
              <SocialLink href="#" icon={<FiInstagram size={20} />} label="Instagram" />
              <SocialLink href="#" icon={<FiLinkedin size={20} />} label="LinkedIn" />
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:pl-12">
            <div>
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em] font-mono opacity-70">Platform</h4>
              <ul className="space-y-4">
                <li><FooterLink to="/products">Live Database</FooterLink></li>
                <li><FooterLink to="/track-order">Fleet Tracking</FooterLink></li>
                <li><FooterLink to="/pricing">Network Access</FooterLink></li>
                <li><FooterLink to="/success-stories">Case Studies</FooterLink></li>
                <li><FooterLink to="/api">Connectivity</FooterLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em] font-mono opacity-70">Company</h4>
              <ul className="space-y-4">
                <li><FooterLink to="/about">Our Vision</FooterLink></li>
                <li><FooterLink to="/careers">
                  Careers
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold ml-2 border border-emerald-500/20">Active</span>
                </FooterLink></li>
                <li><FooterLink to="/sustainability">Circular Report</FooterLink></li>
                <li><FooterLink to="/partners">Global Network</FooterLink></li>
                <li><FooterLink to="/contact">Station Command</FooterLink></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em] font-mono opacity-70">Station_HQ</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-emerald-500 shrink-0 border border-white/5 transition-colors group-hover:bg-neutral-800">
                    <FiMapPin size={16} />
                  </div>
                  <span className="text-sm font-light text-neutral-400 leading-snug">
                    123 Innovation Drive,<br />
                    Tech City, Colombo 03
                  </span>
                </li>
                <li className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-emerald-500 shrink-0 border border-white/5 transition-colors group-hover:bg-neutral-800">
                    <FiMail size={16} />
                  </div>
                  <a href="mailto:hq@re-source.io" className="text-sm font-light text-neutral-400 hover:text-white transition-colors">hq@re-source.io</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              © {currentYear} RE-SOURCE ARCHITECTURE. ENCRYPTED_SYSTEM_V2.0
            </p>
          </div>

          <div className="flex gap-10 text-xs font-mono uppercase tracking-[0.2em]">
            <FooterLink to="/privacy" className="opacity-60 hover:opacity-100">Privacy_Protocol</FooterLink>
            <FooterLink to="/terms" className="opacity-60 hover:opacity-100">Term_Log</FooterLink>
            <FooterLink to="/cookies" className="opacity-60 hover:opacity-100">Auth_Cache</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function FooterLink({ to, children, className }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-1 text-sm font-light text-neutral-400 hover:text-emerald-400 transition-all duration-300 ${className}`}
    >
      {children}
      <FiArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500" />
    </Link>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <motion.a
      whileHover={{ y: -4, backgroundColor: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", color: "#10b981" }}
      href={href}
      aria-label={label}
      className="w-11 h-11 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-neutral-500 transition-all duration-300 shadow-xl"
    >
      {icon}
    </motion.a>
  );
}
