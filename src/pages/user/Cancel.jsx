import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

function Cancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col items-center max-w-lg w-full">
        <div className="bg-red-50 p-6 rounded-full mb-8">
          <FaTimesCircle className="text-red-500 text-7xl" />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-4 text-center">Payment Cancelled</h2>
        <p className="text-gray-500 text-center text-lg mb-10 leading-relaxed">
          The payment process was cancelled. No money has been deducted from your account. 
          If you encountered an issue, feel free to try again.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Link 
            to="/cart" 
            className="w-full text-center py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20"
          >
            Back to Cart
          </Link>
          <Link 
            to="/" 
            className="w-full text-center py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cancel;
