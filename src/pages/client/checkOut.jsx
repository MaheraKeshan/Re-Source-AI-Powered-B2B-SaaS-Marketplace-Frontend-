/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle,
  Upload,
  CreditCard,
  Mail,
  Truck,
  DollarSign,
  FileText,
  Shield,
  Calendar,
  ShoppingBag,
  CheckCircle2,
  Wallet,
  Activity
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state?.cart || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    outletName: "",
    phoneNumber: "",
    address: "",
    paymentMethod: "card",
    deliveryDate: "",
  });

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });

  const [bankReceipt, setBankReceipt] = useState(null);

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankReceipt(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailInvoice = async () => {
    if (!validateCommonFields()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}orders/quote`,
        {
          products: cart,
          total: getTotal(),
          address: formData.address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Invoice sent to your email!");
    } catch (error) {
      toast.error("Failed to send invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeOrder = async () => {
    if (!validateCommonFields()) return;

    if (formData.paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.cvc || !cardDetails.expiry) {
        toast.error("Please enter valid card details");
        return;
      }
    }

    if (formData.paymentMethod === "bank") {
      if (!bankReceipt) {
        toast.error("Please upload your bank transfer receipt");
        return;
      }
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const orderItems = cart.map(item => ({
        productId: item.productId || item._id,
        qty: item.qty
      }));

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}orders`,
        {
          products: orderItems,
          name: formData.outletName,
          phone: formData.phoneNumber,
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          bankReceipt: bankReceipt,
          requestedDeliveryDate: formData.deliveryDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        <div>
          <span className="font-bold">Order placed successfully!</span>
          <br />
          Your invoice has been sent to your email.
        </div>,
        { duration: 5000 }
      );

      localStorage.removeItem("cart");
      navigate("/order-confirmation", { state: { order: res.data } });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCommonFields = () => {
    if (!formData.phoneNumber || !formData.address || !formData.outletName) {
      toast.error("Please fill in all delivery details");
      return false;
    }
    return true;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
        <Header />

        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
          <div className="absolute inset-0 bg-neutral-950"></div>
          <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
            <ShoppingBag size={48} className="text-emerald-500" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Your cart is empty
          </h2>

          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-md leading-relaxed font-light">
            Looks like you haven’t added anything yet. Browse our products and come back when you're ready to place your order.
          </p>

          <Link
            to="/products"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-10 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all flex items-center gap-3 uppercase tracking-wider text-sm"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 relative overflow-hidden flex flex-col pb-20">
      <Header />

      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
        <div className="absolute inset-0 bg-neutral-950"></div>
        <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-32 pb-24 max-w-7xl">
        <div className="mb-16">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-neutral-400 hover:text-emerald-400 transition-all text-sm font-semibold tracking-wide mb-8"
          >
            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Complete Your <span className="text-emerald-500">Checkout</span>
          </h1>

          <p className="text-lg md:text-2xl text-neutral-400 max-w-3xl leading-relaxed font-light">
            Enter your delivery details, choose your payment method, and review your order before placing it.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-black text-2xl shadow-2xl shadow-emerald-500/20">
                  01
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Delivery Details</h2>
                  <p className="text-sm text-neutral-400 font-medium mt-1">
                    Tell us where and when to deliver your order
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-3">
                    <label className="block text-sm font-semibold text-neutral-300 ml-1">
                      Outlet Name
                    </label>
                    <input
                      type="text"
                      name="outletName"
                      placeholder="Enter your outlet or business name"
                      className="w-full px-6 py-4 bg-neutral-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-white text-base placeholder:text-neutral-500"
                      value={formData.outletName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-neutral-300 ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+94 7X XXX XXXX"
                      className="w-full px-6 py-4 bg-neutral-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-white text-base placeholder:text-neutral-500"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-neutral-300 ml-1">
                      Preferred Delivery Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="deliveryDate"
                        className="w-full px-6 py-4 bg-neutral-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-white text-base appearance-none"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                      />
                      <Calendar
                        size={18}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="block text-sm font-semibold text-neutral-300 ml-1">
                      Delivery Address
                    </label>
                    <textarea
                      name="address"
                      rows={4}
                      placeholder="Enter your full delivery address"
                      className="w-full px-6 py-4 bg-neutral-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-white text-base placeholder:text-neutral-500 resize-none leading-relaxed"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-6 mb-8 pt-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-black text-2xl shadow-2xl shadow-emerald-500/20">
                  02
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Payment Method</h2>
                  <p className="text-sm text-neutral-400 font-medium mt-1">
                    Choose how you want to pay
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {[
                    { id: "card", icon: CreditCard, title: "Card Payment", subtitle: "Visa / Mastercard" },
                    { id: "bank", icon: DollarSign, title: "Bank Transfer", subtitle: "Upload payment receipt" },
                    { id: "cod", icon: Truck, title: "Cash on Delivery", subtitle: "Pay when your order arrives" },
                    { id: "invoice", icon: FileText, title: "Email Invoice", subtitle: "Receive a quotation by email" }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-6 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden group ${formData.paymentMethod === method.id
                          ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10"
                        }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div
                          className={`p-4 rounded-xl transition-all duration-500 ${formData.paymentMethod === method.id
                              ? "bg-emerald-500 text-black scale-110"
                              : "bg-neutral-950 text-neutral-500 group-hover:text-white"
                            }`}
                        >
                          <method.icon size={24} />
                        </div>
                        <div className="space-y-1">
                          <span
                            className={`block text-sm font-semibold ${formData.paymentMethod === method.id ? "text-emerald-400" : "text-neutral-300"
                              }`}
                          >
                            {method.title}
                          </span>
                          <span className="text-base text-white block font-light">
                            {method.subtitle}
                          </span>
                        </div>
                      </div>

                      {formData.paymentMethod === method.id && (
                        <div className="absolute top-4 right-4 text-emerald-500">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {formData.paymentMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-neutral-950 p-8 rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
                    >
                      <div className="flex items-center gap-3 mb-8 text-emerald-400 font-semibold text-sm tracking-wide">
                        <Shield size={16} />
                        <span>Secure card payment</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-semibold text-neutral-300 ml-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="number"
                            placeholder="XXXX XXXX XXXX XXXX"
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none text-white text-base placeholder:text-neutral-500"
                            onChange={handleCardChange}
                            maxLength={19}
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-semibold text-neutral-300 ml-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Enter cardholder name"
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none text-white text-base placeholder:text-neutral-500"
                            onChange={handleCardChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-300 ml-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none text-white text-base placeholder:text-neutral-500"
                            onChange={handleCardChange}
                            maxLength={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-300 ml-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            name="cvc"
                            placeholder="CVC"
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none text-white text-base placeholder:text-neutral-500"
                            onChange={handleCardChange}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formData.paymentMethod === "bank" && (
                    <motion.div
                      key="bank"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-neutral-950 p-8 rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
                    >
                      <div className="mb-8 border-b border-white/5 pb-8">
                        <div className="flex items-center gap-3 mb-6 text-emerald-400 font-semibold text-sm tracking-wide">
                          <Wallet size={16} />
                          <span>Bank transfer details</span>
                        </div>

                        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                          <div className="flex justify-between items-center group">
                            <span className="text-sm text-neutral-400">Bank Name</span>
                            <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                              Commercial Bank (PLC)
                            </span>
                          </div>
                          <div className="flex justify-between items-center group">
                            <span className="text-sm text-neutral-400">Account Number</span>
                            <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                              123-456-7890
                            </span>
                          </div>
                          <div className="flex justify-between items-center group">
                            <span className="text-sm text-neutral-400">Branch</span>
                            <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                              Colombo 003
                            </span>
                          </div>
                        </div>
                      </div>

                      <label className="block text-sm font-semibold text-neutral-300 mb-4 ml-1">
                        Upload Bank Transfer Receipt
                      </label>

                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center bg-white/[0.02] cursor-pointer hover:bg-emerald-500/[0.02] hover:border-emerald-500/30 transition-all relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${bankReceipt
                                ? "bg-emerald-500 text-black scale-110 shadow-lg shadow-emerald-500/20"
                                : "bg-white/5 text-neutral-600 group-hover:text-emerald-500 group-hover:bg-emerald-500/10"
                              }`}
                          >
                            {bankReceipt ? <CheckCircle size={32} /> : <Upload size={32} />}
                          </div>

                          <div className="space-y-1">
                            <p className="text-base font-semibold text-white tracking-tight">
                              {bankReceipt ? "Receipt uploaded successfully" : "Click to upload your receipt"}
                            </p>
                            {!bankReceipt && (
                              <p className="text-sm text-neutral-400">
                                Supported formats: JPG, PNG
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative lg:sticky lg:top-32 overflow-hidden"
            >
              <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <h2 className="text-3xl font-bold text-white mb-10 tracking-tight flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Activity size={24} />
                </div>
                Order Summary
              </h2>

              <div className="space-y-6 mb-12 relative z-10">
                <div className="flex justify-between items-center group">
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    Items
                  </span>
                  <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {cart.length} item(s)
                  </span>
                </div>

                <div className="flex justify-between items-center group">
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    Subtotal
                  </span>
                  <span className="font-semibold text-white">Rs. {getTotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center group">
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    Delivery Fee
                  </span>
                  <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-sm">
                    Free
                  </span>
                </div>

                <div className="border-t border-white/5 pt-8 mt-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-neutral-400 font-medium">Total</span>
                    <div className="flex items-baseline gap-1.5 text-emerald-500">
                      <span className="text-2xl font-bold">Rs.</span>
                      <span className="text-5xl font-bold tracking-tight">{getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {formData.paymentMethod === "invoice" ? (
                <button
                  onClick={handleEmailInvoice}
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 border border-white/10 hover:border-emerald-500/50 hover:bg-neutral-800 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transition-all flex justify-center items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm font-semibold">Sending...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10 text-sm font-bold">Send Invoice by Email</span>
                      <Mail
                        size={18}
                        className="relative z-10 text-emerald-500 group-hover:scale-110 transition-transform"
                      />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-6 px-8 rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 transition-all duration-500 flex justify-center items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      <span className="text-sm font-semibold">Processing...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-bold">Place Order</span>
                      <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              )}

              <div className="mt-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5 text-sm text-neutral-400 leading-relaxed text-center">
                {formData.paymentMethod === "invoice"
                  ? "We’ll send your invoice to your email. Your order will not be confirmed until payment is completed."
                  : "By placing your order, you agree to our terms and conditions and confirm that your delivery details are correct."}
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  className="h-4"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  className="h-6"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}