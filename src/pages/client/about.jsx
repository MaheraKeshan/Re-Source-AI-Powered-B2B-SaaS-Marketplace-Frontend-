/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  Recycle,
  Globe,
  Users,
  ShieldCheck,
  Target,
  Award,
  BarChart3,
  ChevronRight,
  Leaf,
  Factory
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 overflow-hidden pt-20 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-violet-50 py-24 px-4 border-b border-slate-200 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-screen-xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-violet-700 uppercase bg-violet-100/80 backdrop-blur-sm rounded-full border border-violet-200">
              <Leaf size={12} />
              <span>Est. 2024</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.15]">
              Closing the Loop on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Industrial Waste</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
            >
              At <span className="font-bold text-slate-900">Re-Source</span>, we use AI to connect industrial byproducts with manufacturers who need them. We turn waste into revenue and raw materials, driving the global transition to a circular economy.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Story / Platform Overview Section */}
      <section className="py-24 px-4">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group"
            >
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop"
                alt="Re-Source Platform Analytics"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent">
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-500/20 backdrop-blur-md p-1.5 rounded-lg border border-emerald-500/30">
                      <BarChart3 size={20} className="text-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Real-time Impact</p>
                  </div>
                  <p className="font-bold text-2xl mb-1">2.4 Million Tons</p>
                  <p className="text-slate-300">Waste diverted from landfills this year</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Industrial waste is a design flaw. For decades, manufacturers have paid to dispose of materials that others could use. We saw a broken system where value was being buried in the ground.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                Re-Source was built to bridge this gap. Our <span className="text-violet-600 font-semibold">AI-driven marketplace</span> automatically matches waste streams—like textile scraps, metal shavings, and organic byproducts—with buyers who can use them as raw materials.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Factory className="text-violet-600 shrink-0 mt-1" size={24} />
                  <div>
                    <span className="block font-bold text-slate-900 text-lg">500+</span>
                    <p className="text-xs font-semibold text-slate-600">Partner Factories</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Globe className="text-violet-600 shrink-0 mt-1" size={24} />
                  <div>
                    <span className="block font-bold text-slate-900 text-lg">30+</span>
                    <p className="text-xs font-semibold text-slate-600">Countries Served</p>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-violet-700 font-bold hover:text-violet-900 transition-colors group text-lg"
                >
                  Explore the Marketplace
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-slate-900 text-white px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-violet-900/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-screen-xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Future of Industry</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We replace inefficient manual brokering with smart technology that scales.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 hover:border-violet-500 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-violet-900/30 text-violet-400 mb-8 group-hover:scale-110 transition-transform duration-300 border border-violet-500/20">
                <Recycle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Circular by Design</h3>
              <p className="text-slate-400 leading-relaxed">
                Our platform prioritizes matches that result in true upcycling. We track the lifecycle of every material to ensure it doesn't end up in a secondary landfill.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 hover:border-violet-500 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-900/30 text-indigo-400 mb-8 group-hover:scale-110 transition-transform duration-300 border border-indigo-500/20">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Matching</h3>
              <p className="text-slate-400 leading-relaxed">
                Don't waste time searching. Our algorithms analyze material composition, volume, and location to predict the best buyer for your specific waste stream instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 hover:border-violet-500 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-900/30 text-emerald-400 mb-8 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Full Compliance</h3>
              <p className="text-slate-400 leading-relaxed">
                Navigate regulations with ease. We generate all necessary environmental compliance documentation and certificates of recycling automatically.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Meet the Innovators</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              A diverse team of environmental scientists, AI engineers, and supply chain experts.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[
              {
                name: "Dr. Elena Vance",
                role: "Chief Executive Officer",
                bio: "PhD in Environmental Science with 15 years in circular economy strategy.",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1588&auto=format&fit=crop"
              },
              {
                name: "Marcus Thorne",
                role: "Chief Technology Officer",
                bio: "Ex-Google engineer specializing in predictive logistics and large-scale data matching.",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop"
              },
              {
                name: "Sarah Jenkins",
                role: "Head of Sustainability",
                bio: "Ensures every exchange on our platform meets rigorous environmental standards.",
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1661&auto=format&fit=crop"
              },
              {
                name: "David Chen",
                role: "VP of Partnerships",
                bio: "Connecting global manufacturers to build the world's largest waste exchange network.",
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1587&auto=format&fit=crop"
              }
            ].map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white group"
              >
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/5] shadow-lg">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{person.name}</h3>
                <p className="text-violet-600 font-bold text-sm mb-3 uppercase tracking-wider">{person.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=2670&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60"></div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md mb-8 border border-white/20">
              <Recycle size={40} className="text-violet-300" />
            </div>
            <h2 className="text-3xl md:text-6xl font-extrabold mb-8 tracking-tight">Stop Wasting Revenue</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of forward-thinking companies turning their byproducts into profit. It's time to close the loop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-violet-900/20 transform hover:-translate-y-1 transition-all duration-300 ease-in-out text-lg"
              >
                Get Started
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 ease-in-out text-lg"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}