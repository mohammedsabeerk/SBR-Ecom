

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "../api/wishlistApi";

const WishlistContext = createContext();

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);

  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const { currentUser, authLoading } = useAuth();

  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  // FETCH WISHLIST
  const fetchWishlist = useCallback(async () => {
    // Only fetch wishlist for regular users, not admins
    if (!currentUser || currentUser.role !== "user") {
      setWishlist([]);
      return;
    }

    try {
      const data = await getWishlist();
      setWishlist(data || []);
    } catch (error) {
      console.log(error);
      setWishlist([]);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ADD TO WISHLIST
  const addToWishlist = useCallback(
    async (item) => {
      if (authLoading) return false;
      if (!currentUser) {
        toast.info("Please login first");
        navigate("/login");
        return false;
      }

      try {
        const data = await apiAddToWishlist(item);

        setWishlist(data);

        toast.success("Added to wishlist");

        return true;
      } catch (error) {
        console.log(error);
        toast.error("Failed to add wishlist");
        return false;
      }
    },
    [currentUser, navigate]
  );

  // REMOVE
  const removeFromWishlist = useCallback(async (id) => {
    try {
      const data = await apiRemoveFromWishlist(id);

      setWishlist(data);

      toast.info("Removed from wishlist");
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;