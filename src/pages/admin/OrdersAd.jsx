import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";

const statusOptions = [
  "Ordered",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function OrdersAd() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Order fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      // Update UI instantly without full refetch
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
      );
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const statusCount = useMemo(() => {
    return {
      Ordered: orders.filter((o) => o.orderStatus === "Ordered").length,
      Packed: orders.filter((o) => o.orderStatus === "Packed").length,
      Shipped: orders.filter((o) => o.orderStatus === "Shipped").length,
      Delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
      Cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
    };
  }, [orders]);

  const statusColors = {
    Ordered: "bg-yellow-200",
    Packed: "bg-orange-300",
    Shipped: "bg-blue-300",
    Delivered: "bg-green-300",
    Cancelled: "bg-red-300",
  };

  return (
    <div className="min-h-screen bg-[#cfd4d6] text-[#2f2926] px-3 py-4 md:p-20">
      
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5">
          {Object.keys(statusCount).map((status) => (
            <div
              key={status}
              className="rounded-xl md:rounded-2xl overflow-hidden bg-[#e1e3e2] border border-white shadow-md"
            >
              <div
                className={`${statusColors[status]} h-7 md:h-8 flex items-center justify-center bg-opacity-20`}
              >
                <p className="text-xs md:text-sm font-semibold">{status}</p>
              </div>

              <div className="py-3 md:p-5 flex justify-center items-center">
                <p className="text-xl md:text-2xl font-bold">
                  {statusCount[status]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="overflow-x-auto bg-[#e1e3e2] backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl shadow-lg">
        <table className="min-w-full text-xs md:text-sm">
          <thead>
            <tr className="border-b border-white">
              <th className="px-3 py-3 hidden sm:table-cell">Order ID</th>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Items</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3 hidden md:table-cell">Date</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              return (
                <tr
                  key={order._id}
                  className="border-b border-white/10 hover:bg-[#cfd4d6]"
                >
                  <td className="px-3 py-3 hidden sm:table-cell text-[10px] font-mono text-gray-500">
                    #{String(order._id).slice(-8).toUpperCase()}
                  </td>

                  <td className="px-3 py-3 font-medium">
                    {order.user?.username || "Guest"}
                  </td>

                  <td className="px-3 py-3 max-w-[160px] break-words">
                    {order.products?.map((item, i) => {
                      const itemImageUrl = item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `http://127.0.0.1:8001/${item.image.replace(/^\//, "")}`
                        : null;

                      return (
                        <div key={i} className="flex items-center gap-2 mb-1">
                          {itemImageUrl && (
                            <img src={itemImageUrl} alt={item.title} className="w-6 h-8 object-cover rounded flex-shrink-0" />
                          )}
                          <span>{item.title || "Item"} × {item.quantity} {item.size && `(${item.size})`}</span>
                        </div>
                      );
                    })}
                  </td>

                  <td className="px-3 py-3 font-semibold">₹{order.totalPrice}</td>

                  <td className="px-3 py-3 hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-3">
                    <div
                      className={`
                        px-2 py-1 rounded-lg text-[10px] md:text-xs font-semibold
                        border backdrop-blur
                        ${order.orderStatus === "Ordered" && "bg-yellow-500/15 text-yellow-600 border-yellow-500/30"}
                        ${order.orderStatus === "Packed" && "bg-orange-500/15 text-orange-600 border-orange-500/30"}
                        ${order.orderStatus === "Shipped" && "bg-blue-500/15 text-blue-600 border-blue-500/30"}
                        ${order.orderStatus === "Delivered" && "bg-green-500/15 text-green-600 border-green-500/30"}
                        ${order.orderStatus === "Cancelled" && "bg-red-500/15 text-red-600 border-red-500/30"}
                      `}
                    >
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="bg-transparent focus:outline-none cursor-pointer"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status} className="bg-[#8dabbc]">
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="p-4 text-center text-gray-400">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
}

export default OrdersAd;
