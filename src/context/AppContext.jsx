
 
import { useAuth } from "./AuthContext";
import { useProduct } from "./ProductContext";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useOrder } from "./OrderContext";


export const useAppContext = () => {
  const auth = useAuth();
  const product = useProduct();
  const cart = useCart();
  const wishlist = useWishlist();
  const order = useOrder();


  const moveWishlistToCart = async (item) => {
    try {
      // Add to cart
      const cartSuccess = await cart.addToCart(item);
      if (cartSuccess) {
        // Remove from wishlist
        await wishlist.removeFromWishlist(item._id || item.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error moving wishlist item to cart:", error);
      return false;
    }
  };

  return {
    
    ...auth,
   
    ...product,
   
    ...cart,
    
    ...wishlist,
   
    ...order,
   
    moveWishlistToCart,
  };
};

export default useAppContext;
