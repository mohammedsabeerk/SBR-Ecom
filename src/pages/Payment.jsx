

import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Payment() {
  const { cart, placeOrder, currentUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is a Buy Now order
  const buyNowItem = location.state?.buyNowItem;
  const orderItems = buyNowItem ? [{ ...buyNowItem, buyNow: true }] : cart;

  const [method, setMethod] = useState("");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    pincode: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      toast.error("Please login to place an order");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!method) {
      toast.error("Please select a payment method!");
      return;
    }

    if (method === "COD") {
      const { name, phone, city, pincode } = address;
      if (!name || !phone || !city || !pincode) {
        toast.error("Please fill all required address fields!");
        return;
      }
    }

    try {
      // ✅ Pass isBuyNow: true if this is a Buy Now order
      const success = await placeOrder({
        items: orderItems,
        method,
        details: method === "COD" ? address : "",
        isBuyNow: !!buyNowItem,
      });

      if (success !== false) {
        toast.success("Order placed successfully!");
        navigate("/orders");
      } else {
        toast.error("Failed to place order!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="px-6 md:px-10 py-10 mt-24">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Checkout
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h3>

          {orderItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex justify-between items-center mb-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} × {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Payment Method
          </h3>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div
              onClick={() => setMethod("UPI")}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                method === "UPI"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <FaMobileAlt className="text-blue-600" />
              <span>UPI</span>
            </div>

            <div
              onClick={() => setMethod("Card")}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                method === "Card"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <FaCreditCard className="text-blue-600" />
              <span>Card</span>
            </div>

            <div
              onClick={() => setMethod("COD")}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                method === "COD"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <FaMoneyBillWave className="text-green-600" />
              <span>Cash on Delivery</span>
            </div>
          </div>

          {method === "COD" && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input
                placeholder="Full Name"
                className="border p-3 rounded"
                value={address.name}
                onChange={(e) =>
                  setAddress({ ...address, name: e.target.value })
                }
              />

              <input
                placeholder="Mobile Number"
                className="border p-3 rounded"
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
              />

              <input
                placeholder="Town / City"
                className="border p-3 rounded"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />

              <input
                placeholder="Pincode"
                className="border p-3 rounded"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-green-600 to-green-500
                       text-white py-3 rounded-lg font-semibold
                       hover:from-green-700 hover:to-green-600 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;

