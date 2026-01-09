



import React from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

function FeaturedProduct() {
  const navigate = useNavigate();

  const {
    products,
    loadingProducts,
    productError,
    wishlist,
    removeFromWishlist,
    addToWishlist,
  } = useAppContext();

  const handleToggleWishlist = async (e, item) => {
    e.stopPropagation();

    const isWishlisted = wishlist.some((w) => w.id === item.id);

    if (isWishlisted) {
      await removeFromWishlist(item.id);
      toast.info("Removed from wishlist");
      return;
    }

    const success = await addToWishlist(item);

    if (!success) {
      toast.info("Please login or register first");
      navigate("/login");
      return;
    }

    toast.success("Added to wishlist!");
  };

  const goToDetails = (id) => {
    navigate(`/product/${id}`);
  };

  if (loadingProducts) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading products...
      </div>
    );
  }

  if (productError) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        {productError}
      </div>
    );
  }

  const featuredProducts = products.filter(
    (item) => item.id >= 1 && item.id <= 9
  );

  return (
    <div className="px-6 md:px-10 py-20 ">
      <h2 className="text-4xl md:text-5xl font-extrabold text-black text-center mb-12 tracking-wide">
        Featured Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
        {featuredProducts.map((item) => (
          <div
            key={item.id}
            onClick={() => goToDetails(item.id)}
            className="cursor-pointer group"
          >
            <div className="relative overflow-hidden">
              <button
                onClick={(e) => handleToggleWishlist(e, item)}
                className="absolute top-4 right-20 z-10 bg-white/10 p-2 rounded-full shadow transition hover:scale-110"
              >
                <FaHeart
                  className={`w-4 h-4 transition ${
                    wishlist.some((w) => w.id === item.id)
                      ? "text-red-700"
                      : "text-gray-400"
                  }`}
                />
              </button>

              <img
                src={item.img}
                alt={item.name}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/500x700?text=No+Image")
                }
                className="
                  w-[70%] mx-auto
                  h-[360px] md:h-[420px]
                  object-cover
                  transition-transform duration-500
                  group-hover:scale-105
                "
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xs font-semibold uppercase tracking-wide">
                {item.name}
              </h3>
              <p className="text-xs font-bold mt-0.5 text-gray-700">
                ₹{item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProduct;
