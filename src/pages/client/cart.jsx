/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { addToCart, getCart, getTotal, removeFromCart } from "../../utils/cart";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Shield,
  Truck,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());
  const [orderTotal, setOrderTotal] = useState(getTotal());
  const navigate = useNavigate();

  useEffect(() => {
    setOrderTotal(getTotal());
  }, [cart]);

  const updateQuantity = (item, change) => {
    addToCart(item, change);
    setCart(getCart());
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
    setCart(getCart());
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans relative overflow-hidden flex flex-col">
        <Header />

        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
          <div className="absolute inset-0 bg-neutral-950"></div>
          <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
        </div>

        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/[0.03] backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl mb-10 border border-white/5 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
            <ShoppingCart className="text-emerald-500 text-6xl relative z-10" size={64} />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Your cart is empty
          </h2>

          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-md leading-relaxed font-light">
            You haven’t added any items yet. Explore our products and add what you need to continue.
          </p>

          <Link
            to="/products"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-10 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all duration-300 flex items-center gap-3 transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans relative overflow-hidden flex flex-col pb-20">
      <Header />

      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
        <div className="absolute inset-0 bg-neutral-950"></div>
        <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-32 pb-20 max-w-7xl">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-emerald-400 transition-all text-sm font-semibold tracking-wide group mb-2"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Your <span className="text-emerald-500">Cart</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 flex items-center gap-3 font-light">
              Review your selected items before checkout
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30"></span>
              {cart.length} item(s)
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <div className="hidden md:grid grid-cols-12 bg-white/[0.02] p-6 border-b border-white/5 text-sm font-semibold text-neutral-400">
                <div className="col-span-6 pl-4">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right pr-4">Total</div>
              </div>

              <div className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="grid grid-cols-1 md:grid-cols-12 p-8 md:p-6 gap-6 md:gap-0 items-center group hover:bg-white/[0.02] transition-all duration-500"
                    >
                      <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                        <div className="w-24 h-24 bg-neutral-900 rounded-3xl flex-shrink-0 p-2 border border-white/5 overflow-hidden group-hover:border-emerald-500/20 transition-all duration-500 relative shadow-xl">
                          <img
                            src={item.image || "/placeholder-product.jpg"}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <h3 className="font-bold text-white text-xl truncate pr-4 group-hover:text-emerald-400 transition-colors">
                            {item.name}
                          </h3>

                          <p className="text-sm text-neutral-400">
                            Product ID: {item.productId.substring(0, 12)}
                          </p>

                          <div className="md:hidden flex items-center justify-between mt-4">
                            <span className="font-semibold text-emerald-500 text-lg">
                              Rs. {item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:flex col-span-2 flex-col items-center justify-center space-y-1">
                        <span className="text-white font-semibold text-lg">
                          Rs. {item.price.toFixed(2)}
                        </span>
                        {item.labelledPrice > item.price && (
                          <span className="text-sm text-neutral-500 line-through font-light">
                            Rs. {item.labelledPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center mt-2 md:mt-0 bg-white/[0.02] md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border md:border-none border-white/5">
                        <span className="md:hidden text-sm font-semibold text-neutral-400">
                          Quantity:
                        </span>

                        <div className="flex items-center bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl h-10">
                          <button
                            onClick={() => updateQuantity(item, -1)}
                            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-all disabled:opacity-20"
                            disabled={item.qty <= 1}
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-12 h-10 flex items-center justify-center text-white font-semibold text-sm bg-white/5 border-x border-white/5">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => updateQuantity(item, 1)}
                            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="md:hidden text-neutral-600 hover:text-red-500 p-2 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="hidden md:flex col-span-2 items-center justify-end gap-6">
                        <div className="text-right">
                          <span className="font-semibold text-white text-xl">
                            Rs. {(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-neutral-700 hover:text-white hover:bg-red-500/20 p-3 rounded-2xl transition-all border border-transparent hover:border-red-500/30"
                          title="Remove Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative lg:sticky lg:top-32 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <h2 className="text-3xl font-bold text-white mb-10 tracking-tight flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <ShoppingBag size={24} />
                </div>
                Order Summary
              </h2>

              <div className="space-y-6 mb-10 relative z-10">
                <div className="flex justify-between items-center group">
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    Subtotal
                  </span>
                  <span className="font-semibold text-white text-lg group-hover:text-emerald-400 transition-colors">
                    Rs. {orderTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center group">
                  <span className="text-sm text-neutral-400">Delivery Fee</span>
                  <span className="text-emerald-500 font-semibold text-sm bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    Free
                  </span>
                </div>

                <div className="flex justify-between items-center group">
                  <span className="text-sm text-neutral-400">Tax</span>
                  <span className="text-neutral-400 text-sm font-light">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-white/5 pt-8 mt-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-neutral-400 font-medium">Total</span>
                    <div className="flex items-baseline gap-1 text-emerald-500">
                      <span className="text-2xl font-bold">Rs.</span>
                      <span className="font-bold text-5xl tracking-tight">
                        {orderTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout", { state: { cart } })}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-6 px-10 rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 transition-all duration-500 transform active:scale-95 flex justify-center items-center gap-4 group"
              >
                <span className="text-sm font-bold">Proceed to Checkout</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
              </button>

              <div className="mt-10 space-y-5 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 border border-white/5">
                    <Shield size={18} />
                  </div>
                  <span>Secure checkout</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500 border border-white/5">
                    <Truck size={18} />
                  </div>
                  <span>Fast and reliable delivery</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}