import React from "react";
import { useAppContext } from "../../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

function Cart() {
  const {
    cart,
    products,
    authLoading,
    updateCartSize,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useAppContext();

  const navigate = useNavigate();

  // const sizes = ["XS", "S", "M", "L", "XL"];

  const selectedSizes = cart.reduce((acc, item) => {
    const pid = item.productId || item._id;
    const key = `${pid}-${item.size || ""}`;
    acc[key] = item.size;
    return acc;
  }, {});

  // useEffect(() => {
  //   if (authLoading) return;
  //   if (!currentUser) {
  //     toast.info("Please login to view cart");
  //     navigate("/login");
  //   }
  // }, [currentUser, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">Loading...</div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Your cart is empty
      </div>
    );
  }

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  

  return (
    <div className="px-6 md:px-10 py-10 mt-24">
      <div className="space-y-6">
        {cart.map((item) => {
          const pid = item.productId?._id || item.productId || item._id;

          const itemKey = `${pid}-${item.size || ""}`;

          const fullProduct = products.find(
            (p) =>
              String(p._id) === String(pid) || String(p.id) === String(pid),
          );

          const sizes = fullProduct?.sizes || [];

          return (
            <div
              key={itemKey}
              className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-lg shadow"
            >
              <img
                src={getImageUrl(item.img)}
                alt={item.name}
                className="w-32 h-32 object-cover rounded"
              
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-600">₹{item.price}</p>

                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Select Size</p>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={async () => {
                          if (item.size === size) return;
                          await updateCartSize(pid, item.size, size);
                        }}
                        className={`px-3 py-1 border rounded transition ${
                          selectedSizes[itemKey] === size
                            ? "bg-black text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={async () =>
                      await updateCartQuantity(
                        pid,
                        item.size,
                        item.quantity - 1,
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={async () => {
                      const fullProduct = products.find(
                        (p) =>
                          String(p._id) === String(pid) ||
                          String(p.id) === String(pid),
                      );
                      const maxStock = fullProduct?.stock || 0;

                      if (item.quantity < maxStock) {
                        await updateCartQuantity(
                          pid,
                          item.size,
                          item.quantity + 1,
                        );
                      } else {
                        toast.warning(
                          `Only ${maxStock} items available in stock`,
                        );
                      }
                    }}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-bold text-lg">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await removeFromCart(pid, item.size);
                    toast.info("Item removed from cart");
                  }}
                  className="text-red-500 hover:text-red-700 transition p-2"
                  title="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Total: ₹{totalPrice}</h2>

        <div className="flex gap-4">
          <button
            onClick={async () => {
              if (window.confirm("Are you sure you want to clear your cart?")) {
                await clearCart();
                toast.info("Cart cleared");
              }
            }}
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Clear Cart
          </button>

          <button
            onClick={() => {
              const missingSize = cart.find((item) => !item.size);
              if (missingSize) {
                toast.error(
                  `Please select a size for "${missingSize.name}" before checkout`,
                );
                return;
              }
              navigate("/checkout");
            }}
            className="px-8 py-2 bg-black text-white rounded hover:bg-gray-800 transition shadow-lg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
