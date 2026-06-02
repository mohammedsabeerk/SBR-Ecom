
    

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUtils";

function Wishlist() {
  const {
    wishlist,
    currentUser,
    authLoading,
    moveWishlistToCart,
    removeFromWishlist,
  } = useAppContext();

  const navigate = useNavigate();
  // const location = useLocation();

  //  Redirect guest who lands directly on /wishlist
  // useEffect(() => {
  //   if (authLoading) return;
  //   if (!currentUser) {
  //     toast.info("Please login to view your wishlist");
  //     navigate("/login", { state: { from: location.pathname }, replace: true });
  //   }
  // }, [currentUser, authLoading, navigate, location.pathname]);

  if (authLoading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">Loading...</div>
    );
  }

  //  Don't render wishlist content for guests while redirect is happening
  if (!currentUser) return null;

  const handleMoveToCart = async (e, item) => {
    e.stopPropagation();
    //  Guest guard (belt-and-suspenders, redirect handled by useEffect above)
    if (!currentUser) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }
    const success = await moveWishlistToCart(item);
    if (success) {
      toast.success("Moved to Cart");
    } else {
      toast.error("Failed to move to cart");
    }
  };

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    await removeFromWishlist(id);
    toast.info("Removed from wishlist");
  };

  const goToDetails = (id) => navigate(`/product/${id}`);

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Your wishlist is empty
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 mt-24">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {wishlist.map((item) => (
          <div
            key={item._id || item.id}
            onClick={() => goToDetails(item._id || item.id)}
            className="flex flex-col h-full cursor-pointer border rounded-xl p-4 bg-white transition hover:shadow-lg"
          >
            <div className="w-full h-56 bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden">
              <img
                src={getImageUrl(item.img)}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x560?text=No+Image";
                }}
              />
            </div>

            <div className="mt-4 space-y-1">
              <h3 className="text-sm font-black uppercase tracking-tighter line-clamp-2 h-10">
                {item.name}
              </h3>
              <p className="text-xs font-bold text-gray-500">₹{item.price}</p>
            </div>

            <div className="flex justify-between items-end mt-auto pt-4">
              <button
                onClick={(e) => handleMoveToCart(e, item)}
                className="bg-black text-white px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition"
              >
                Move to Cart
              </button>

              <FaTrash
                onClick={(e) => handleRemove(e, item._id || item.id)}
                className="text-gray-300 hover:text-red-500 mb-2 transition cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
    