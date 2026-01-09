import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    currentUser,
    removeFromCart,
    updateCartQuantity,
    updateCartSize,
    clearCart,
  } = useAppContext();

  const navigate = useNavigate();
  const sizes = ["S", "M", "L", "XL"];


  useEffect(() => {
    if (!currentUser) {
      toast.info("Please login to view cart");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 mt-24 ">
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id + "-" + item.size}
            className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-lg shadow"
          >
            <img
              src={item.img}
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
                      onClick={async () =>
                        await updateCartSize(item.id, item.size, size)
                      }
                      className={`px-3 py-1 border rounded ${
                        item.size === size ? "bg-black text-white" : "bg-white"
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
                      item.id,
                      item.size,
                      item.quantity - 1
                    )
                  }
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={async () =>
                    await updateCartQuantity(
                      item.id,
                      item.size,
                      item.quantity + 1
                    )
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <p className="font-bold">₹{item.price * item.quantity}</p>

              <FaTrash
                onClick={async () => {
                  await removeFromCart(item.id, item.size);
                  toast.info("Item removed from cart");
                }}
                className="text-red-500 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>

        <button
          onClick={async () => {
            await clearCart();
            toast.info("Cart cleared");
          }}
          className="px-6 py-2 bg-gray-300 rounded"
        >
          Clear Cart
        </button>

        <button
          onClick={() => navigate("/payment")}
          className="px-6 py-2 bg-black text-white rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
