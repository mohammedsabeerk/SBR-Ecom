import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUtils";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, currentUser } = useAppContext();

  
  const buyNowItem = location.state?.buyNowItem;
  const itemsToBuy = buyNowItem ? [buyNowItem] : cart;

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);

  const subtotal = itemsToBuy.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Basic validation
    if (
      !address.fullName ||
      !address.address ||
      !address.phone ||
      !address.pincode
    ) {
      toast.error("Please fill in all required shipping details");
      return;
    }

    if (itemsToBuy.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/payment/create-checkout-session", {
        products: itemsToBuy,
        shippingAddress: address,
      });

      if (res.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Payment failed to initialize",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Side: Shipping Form */}
          <div className="space-y-12">
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-4">
                <span className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-900">
                  1
                </span>
                Shipping Information
              </h2>

              <div className="grid gap-6">
                <div className="border-b border-gray-100 focus-within:border-black transition-all pb-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-tight p-0"
                    placeholder="ENTER YOUR NAME"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-b border-gray-100 focus-within:border-black transition-all pb-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-tight p-0"
                      placeholder="+91"
                    />
                  </div>
                  <div className="border-b border-gray-100 focus-within:border-black transition-all pb-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-tight p-0"
                      placeholder="000000"
                    />
                  </div>
                </div>

                <div className="border-b border-gray-100 focus-within:border-black transition-all pb-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={address.address}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-tight p-0"
                    placeholder="HOUSE NO, BUILDING, STREET"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-b border-gray-100 focus-within:border-black transition-all pb-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-tight p-0"
                      placeholder="CITY NAME"
                    />
                  </div>
                  <div className="border-b border-gray-100 focus-within:border-black transition-all pb-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-tight p-0"
                      placeholder="STATE NAME"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-4">
                <span className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-900">
                  2
                </span>
                Secure Payment
              </h2>
              <div className="p-8 border border-black/5 bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase">
                    Stripe Secure Payment
                  </p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">
                    Visa, Mastercard, AMEX
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:sticky lg:top-32 bg-gray-50 p-10 border border-gray-100">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">
              Your Selection
            </h2>

            <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
              {itemsToBuy.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-12 h-16 bg-white overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(item.img)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-tight truncate">
                      {item.name}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      {item.size} • Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-black">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm font-black uppercase tracking-tight">
                  Total Amount
                </span>
                <span className="text-2xl font-black">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-10 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-2xl disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Complete Purchase"}
            </button>

            <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest mt-6">
              Complimentary shipping and returns on all orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
