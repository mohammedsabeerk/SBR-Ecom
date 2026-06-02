import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUtils";

function Orders() {
  const {
    orders,
    cancelOrder,
    products: allProducts,
    fetchOrders,
  } = useAppContext();

  // 🔄 REFRESH ORDERS ON MOUNT - Ensures user sees latest orders when page loads
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (!orders || orders.length === 0)
    return (
      <div className="text-center py-40 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
        You haven't placed any orders yet.
      </div>
    );

  const handleCancelOrder = async (orderId) => {
    await cancelOrder(orderId);
    toast.success("Order status updated");
  };
const BACKEND_URL = "http://localhost:8001";


const getProductDisplayInfo = (item) => {
  // populated product
  if (
    item.product &&
    typeof item.product === "object"
  ) {
    return item.product;
  }

  const productId =
    item.product?._id ||
    item.productId ||
    item._id ||
    item.product;

  if (!productId) return item;

  const foundProduct = allProducts.find(
    (p) =>
      String(p._id) === String(productId) ||
      String(p.id) === String(productId)
  );

  return foundProduct || item;
};
   
  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6 md:px-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
          My Orders
        </h1>

        <div className="space-y-8">
          {orders.map((order) => {
            const isCancelled = order.orderStatus === "Cancelled";

            return (
              <div
                key={order._id}
                className={`border border-gray-100 p-8 transition-all hover:border-black/10 ${isCancelled ? "bg-gray-50/50 opacity-70" : "bg-white"}`}
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-50 gap-4">
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      Order ID: {order._id}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-tight">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === "paid" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
                    >
                      {order.paymentStatus}
                    </span>
                    <span
                      className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${isCancelled ? "bg-red-50 text-red-600" : "bg-black text-white"}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Order Tracking Line */}
                <div className="w-full pt-4 pb-12">
                  <div className="flex items-center justify-between relative px-2 sm:px-6">
                    {isCancelled ? (
                      <>
                        <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                          <div className="w-3 h-3 rounded-full bg-black ring-4 ring-white"></div>
                          <span className="text-[9px] font-black uppercase tracking-widest absolute top-6 whitespace-nowrap text-black">
                            Ordered
                          </span>
                        </div>
                        <div className="flex-1 h-[2px] bg-gray-100"></div>
                        <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-white shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                          <span className="text-[9px] font-black uppercase tracking-widest absolute top-6 whitespace-nowrap text-red-500">
                            Cancelled
                          </span>
                        </div>
                      </>
                    ) : (
                      ["Ordered", "Packed", "Shipped", "Delivered"].map(
                        (step, idx, arr) => {
                          const currentStatus = [
                            "Pending",
                            "Processing",
                            "confirmed",
                          ].includes(order.orderStatus)
                            ? "Ordered"
                            : order.orderStatus;
                          const currentStepIndex = arr.indexOf(currentStatus);
                          const isActive = idx <= currentStepIndex;
                          const isNextActive = idx + 1 <= currentStepIndex;

                          return (
                            <React.Fragment key={step}>
                              <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                                <div
                                  className={`w-3 h-3 rounded-full ring-4 ring-white transition-all duration-500 ${
                                    isActive ? "bg-black" : "bg-gray-100"
                                  }`}
                                ></div>
                                <span
                                  className={`text-[9px] font-black uppercase tracking-widest absolute top-6 whitespace-nowrap ${
                                    isActive ? "text-black" : "text-gray-300"
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                              {idx < arr.length - 1 && (
                                <div
                                  className={`flex-1 h-[2px] transition-all duration-500 ${isNextActive ? "bg-black" : "bg-gray-100"}`}
                                ></div>
                              )}
                            </React.Fragment>
                          );
                        },
                      )
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-8">
                  {order.products.map((item, idx) => {
                    const productInfo = getProductDisplayInfo(item);
                    const rawImage =
                      item.image ||
                      item.img ||
                      productInfo?.img ||
                      productInfo?.image ||
                      productInfo?.images?.[0];

 const imageUrl = getImageUrl(rawImage);
                    // let imageUrl = item.image || productInfo.img || productInfo.image;
                    // if (imageUrl && !imageUrl.startsWith("http")) {
                    //   imageUrl = `http://127.0.0.1:8001/${imageUrl.replace(/^\//, "")}`;
                    // }

                    return (
                      // <div key={idx} className="flex gap-8 items-center">
                      <div
  key={idx}
  className="flex gap-4 sm:gap-8 items-center"
>
                        {/* <div className="w-20 h-28 bg-gray-50 flex-shrink-0 overflow-hidden shadow-sm"> */}
                        <div className="w-16 h-20 sm:w-20 sm:h-28 bg-gray-50 flex-shrink-0 overflow-hidden shadow-sm rounded">
                          <img
                            src={imageUrl} alt={item.title || item.name}
                          
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/200x280?text=SBR";
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black uppercase tracking-tighter truncate">
                            {item.name ||
                              item.title ||
                              productInfo?.name ||
                              "Product"}  
                          </h3>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                Size
                              </p>
                              <p className="text-[10px] font-black uppercase">
                                {item.size ? item.size : "-"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                Quantity
                              </p>
                              <p className="text-[10px] font-black uppercase">
                                {item.quantity}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                Price
                              </p>
                              <p className="text-[10px] font-black uppercase">
                                ₹{item.price}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Subtotal
                          </p>
                          <p className="text-sm font-black tracking-tighter">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer */}
                <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-end gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Delivery Address
                      </p>
                      <p className="text-[10px] font-black uppercase text-gray-600 leading-relaxed">
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Grand Total
                    </p>
                    <p className="text-3xl font-black tracking-tighter text-gray-900">
                      ₹{order.totalPrice}
                    </p>
                    

                    {!isCancelled &&
                      [
                        "Pending",
                        "Processing",
                        "confirmed",
                        "Ordered",
                        "Packed",
                      ].includes(order.orderStatus) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="mt-6 text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline decoration-2 underline-offset-4"
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Orders;
