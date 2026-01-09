import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function Wishlist() {
  const { wishlist, currentUser, moveWishlistToCart, removeFromWishlist } =
    useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      toast.info("Please login to view wishlist");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleMoveToCart = async (e, item) => {
    e.stopPropagation();

    if (!currentUser) return;

    const success = await moveWishlistToCart(item);
    if (success) {
      toast.success("Moved to Cart");
    }
  };

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    await removeFromWishlist(id);
    toast.info("Removed from wishlist");
  };

  const goToDetails = (id) => {
    navigate(`/product/${id}`);
  };

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
            key={item.id}
            onClick={() => goToDetails(item.id)}
            className="
              cursor-pointer
              border
              rounded-xl
              p-4
              bg-white
              transition
              hover:shadow-lg
            "
          >
       
            <div className="w-full h-56 bg-gray-50 flex items-center justify-center rounded-lg">
              <img
                src={item.img}
                alt={item.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

    
            <div className="mt-4 space-y-1">
              <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
              <p className="text-sm font-semibold">₹{item.price}</p>
            </div>

         
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={(e) => handleMoveToCart(e, item)}
                className="
                  bg-black
                  text-white
                  px-3 py-1.5
                  text-xs
                  rounded
                  hover:bg-gray-800
                  transition
                "
              >
                Move to Cart
              </button>

              <FaTrash
                onClick={(e) => handleRemove(e, item.id)}
                className="
                  text-gray-400
                  hover:text-red-500
                  transition
                  cursor-pointer
                "
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
