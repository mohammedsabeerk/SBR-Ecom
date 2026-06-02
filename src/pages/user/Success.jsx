import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { FaCheckCircle } from "react-icons/fa";
import api from "../../api/axios";
import { toast } from "react-toastify";

function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const { clearCart, fetchOrders } = useAppContext();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Use a ref to prevent double verification in StrictMode
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    const verify = async () => {
      if (verifiedRef.current) return;
      verifiedRef.current = true;

      try {
        const response = await api.post("/payment/verify-payment", { sessionId });
        if (response.data.success) {
          setStatus("success");
          setOrderDetails(response.data.order);
          // Clear cart if the payment was verified successfully
          await clearCart();
          //  REFRESH ORDERS - Fetch latest orders after successful payment
          await fetchOrders();
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
        toast.error("Payment verification failed. Please contact support.");
      }
    };

    verify();
  }, [sessionId, navigate, clearCart, fetchOrders]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Verifying your payment...</h2>
        <p className="text-gray-500 mt-2">Please do not refresh the page.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-red-500 text-7xl mb-6">❌</div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 text-center">Something went wrong</h2>
        <p className="text-gray-600 text-center max-w-md mb-8">
          We couldn't verify your payment. If money was deducted from your account, please contact our support team with your session ID: <span className="font-mono text-xs block mt-2 bg-gray-200 p-2 rounded">{sessionId}</span>
        </p>
        <Link to="/" className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4 pt-20">
      <div className="flex flex-col items-center max-w-sm w-full">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
        </div>
        
        <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          Order Confirmed
        </h2>
        <p className="text-gray-400 text-center text-[11px] mb-6 leading-relaxed px-4">
          Your payment was successful and your order is now being prepared.
        </p>

        {orderDetails && (
          <div className="w-full bg-gray-50 p-5 mb-8 border border-gray-100 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Reference</span>
              <span className="text-[10px] font-black text-gray-900">{orderDetails._id.slice(-12).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Amount</span>
              <span className="text-sm font-black text-gray-900">₹{orderDetails.totalPrice}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Link 
            to="/orders" 
            className="w-full text-center py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg"
          >
            Track Order
          </Link>
          <Link 
            to="/" 
            className="w-full text-center py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Continue
          </Link>
        </div>

        <p className="mt-10 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-200">
          Sovereign Bold Rare
        </p>
      </div>
    </div>
  );
}

export default Success;
