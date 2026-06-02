import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUtils";

function ProductsSection() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();

  const {
    products,
    loadingProducts,
    productError,
    wishlist,
    removeFromWishlist,
    addToWishlist,
  } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState("All");

  // const categories = ["All", ...new Set(products.map((item) => item.category))];
  const safeProducts = Array.isArray(products) ? products : [];
  const categories = [
    "All",
    ...new Set(safeProducts.map((item) => item.category)),
  ];
  //   const categories = [
  //   "All",
  //   ...new Set((products || []).map((item) => item.category))
  // ];

  // const filteredProducts =
  //   selectedCategory === "All"
  // ? products
  //     : products.filter((item) => item.category === selectedCategory);

  // const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts =
    selectedCategory === "All"
      ? safeProducts
      : safeProducts.filter((item) => item.category === selectedCategory);

  const handleToggleWishlist = async (e, item) => {
    e.stopPropagation();

    const isWishlisted = wishlist.some((w) => w._id === item._id);

    if (isWishlisted) {
      await removeFromWishlist(item._id);
      return;
    }

    // addToWishlist from context already handles auth check, toast, and redirect
    await addToWishlist(item);
  };

  const goToDetails = (_id) => {
    navigate(`/product/${_id}`);
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

  return (
    <div className="px-6 md:px-10 pt-28 pb-16 ">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 justify-items-center mb-8 max-w-5xl mx-auto pl-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-4 py-1.5 rounded-full text-xs font-semibold uppercase
              transition-all duration-300 whitespace-nowrap
              ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-black hover:text-white"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {(filteredProducts || []).map((item) => (
          <div
            key={item._id}
            onClick={() => goToDetails(item._id)}
            className="cursor-pointer group"
          >
            <div className="relative overflow-hidden">
              <button
                onClick={(e) => handleToggleWishlist(e, item)}
                className="absolute top-4 right-10 z-10 bg-white/20 p-2 rounded-full shadow transition hover:scale-110"
              >
                <FaHeart
                  className={`w-4 h-4 ${
                    wishlist.some((w) => w._id === item._id)
                      ? "text-red-700"
                      : "text-gray-400"
                  }`}
                />
              </button>

              <img
  src={getImageUrl(item.img)}
  alt={item.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/500x700?text=No+Image";
  }}
                className="
                  w-[82%] mx-auto
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

export default ProductsSection;
