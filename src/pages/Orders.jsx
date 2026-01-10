import React from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

function Orders() {
  const { orders, cancelOrder, deleteCancelledOrder } = useAppContext();

  if (orders.length === 0)
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        You have no orders yet
      </div>
    );

  const trackingSteps = ["Ordered", "Packed", "Shipped", "Delivered"];

  const handleCancelOrder = (orderId) => {
    cancelOrder(orderId);
    toast.success("Order cancelled successfully!");
  };

  const handleDeleteOrder = (orderId) => {
    deleteCancelledOrder(orderId);
    toast.info("Cancelled order removed");
  };

  return (
    <div className="px-6 md:px-10 py-10 mt-24">
      <h2 className="text-2xl font-bold mb-8 text-center">Your Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => {
          const isCancelled = order.status === "Cancelled";
          const currentStepIndex = trackingSteps.indexOf(order.status);

          return (
            <div
              key={order.id}
              className={`rounded-lg shadow p-4 flex flex-col gap-4 ${
                isCancelled ? "bg-red-50 border border-red-300" : "bg-white"
              }`}
            >
    
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  Order ID: {order.id}
                </h3>

                {!isCancelled ? (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-200 rounded">
                    CANCELLED
                  </span>
                )}
              </div>

           
              <div className="flex flex-col gap-3 border-t border-b border-gray-200 py-3">
                {order.items.map((item) => (
                  <div
                    key={item.id + item.size}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

          
              <div className="flex items-center justify-between mt-3">
                {trackingSteps.map((step, idx) => {
                  const isActive = isCancelled || idx <= currentStepIndex;

                  return (
                    <div
                      key={step}
                      className="flex-1 flex flex-col items-center relative"
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          isActive
                            ? isCancelled
                              ? "bg-red-500"
                              : "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      />
                      {idx < trackingSteps.length - 1 && (
                        <div
                          className={`h-1 flex-1 mt-1 ${
                            isActive
                              ? isCancelled
                                ? "bg-red-500"
                                : "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        />
                      )}
                      <span className="text-xs mt-1 text-gray-600">
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

          
              <div className="flex justify-between items-center mt-3">
                <p className="font-bold text-lg">
                  Total: ₹
                  {order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )}
                </p>

                {isCancelled && (
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
