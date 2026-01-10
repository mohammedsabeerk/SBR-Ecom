import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const statusOptions = [
  "Ordered",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function OrdersAd() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");

      const allOrders = [];

      res.data.forEach((user) => {
        user.orders?.forEach((order) => {
          allOrders.push({
            ...order,
            userId: user.id,
            userName: user.name,
          });
        });
      });

      allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setUsers(res.data);
      setOrders(allOrders);
    } catch (err) {
      console.error("Order fetch error:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, userId, newStatus) => {
    try {
      const user = users.find((u) => u.id === userId);

      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
await axios.put(`http://localhost:5000/users/${userId}`, {
  ...user,
  orders: updatedOrders,
});


      fetchOrders();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const statusCount = useMemo(() => {
    return {
      Ordered: orders.filter((o) => o.status === "Ordered").length,
      Packed: orders.filter((o) => o.status === "Packed").length,
      Shipped: orders.filter((o) => o.status === "Shipped").length,
      Delivered: orders.filter((o) => o.status === "Delivered").length,
      Cancelled: orders.filter((o) => o.status === "Cancelled").length,
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
    <div className="min-h-screen bg-[#cfd4d6] text-[#2f2926] p-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          {Object.keys(statusCount).map((status) => (
            <div
              key={status}
              className="rounded-2xl overflow-hidden w-full backdrop-blur-xl bg-[#e1e3e2] border border-[#f8f8f8] shadow-lg hover:shadow-2xl transition"
            >
              <div
                className={`${statusColors[status]} h-8 flex items-center justify-center bg-opacity-20`}
              >
                <p className="text-[#2f2926] font-semibold">{status}</p>
              </div>

              <div className="p-5 flex flex-col justify-center items-center">
                <p className="text-[#2f2926] text-2xl font-bold">
                  {statusCount[status]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-[#e1e3e2] backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-[#2f2926] border-b border-white">
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-[#cfd4d6] transition"
                >
                  <td className="px-6 py-4 text-[#2f2926]">#{order.id}</td>

                  <td className="px-6 py-4 font-medium">{order.userName}</td>

                  <td className="px-6 py-4 text-[#2f2926]">
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.title} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="px-6 py-4 font-semibold">₹{total}</td>

                  <td className="px-6 py-4 text-[#2f2926]">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div
                      className={`
                        w-fit px-4 py-1 rounded-xl text-xs font-semibold
                        border backdrop-blur-md transition-all
                        ${
                          order.status === "Ordered" &&
                          "bg-yellow-500/15 text-yellow-500 border-yellow-500/30"
                        }
                        ${
                          order.status === "Packed" &&
                          "bg-orange-500/15 text-orange-500 border-orange-500/30"
                        }
                        ${
                          order.status === "Shipped" &&
                          "bg-blue-500/15 text-blue-500 border-blue-500/30"
                        }
                        ${
                          order.status === "Delivered" &&
                          "bg-green-500/15 text-green-500 border-green-500/30"
                        }
                        ${
                          order.status === "Cancelled" &&
                          "bg-red-500/15 text-red-500 border-red-500/30"
                        }
                      `}
                    >
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, order.userId, e.target.value)
                        }
                        className="bg-transparent focus:outline-none cursor-pointer"
                      >
                        {statusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#8dabbc] text-[#2f2926]"
                          >
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
          <p className="p-6 text-center text-gray-400">No orders found</p>
        )}
      </div>
    </div>
  );
}

export default OrdersAd;
