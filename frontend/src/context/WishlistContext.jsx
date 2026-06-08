import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";
import axios from "axios";

export const wishlistDataContext = createContext();

const WishlistContext = ({ children }) => {
  // Set of wishlisted product IDs for O(1) lookup
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);

  // Fetch wishlist from backend when user logs in
  const fetchWishlist = useCallback(async () => {
    if (!userData) {
      setWishlistIds(new Set());
      return;
    }

    try {
      setWishlistLoading(true);
      const result = await axios.get(serverUrl + "/api/wishlist", {
        withCredentials: true,
      });
      setWishlistIds(new Set(result.data.productIds));
    } catch (error) {
      console.error("fetchWishlist error:", error);
      setWishlistIds(new Set());
    } finally {
      setWishlistLoading(false);
    }
  }, [userData, serverUrl]);

  // Toggle wishlist status for a product
  const toggleWishlist = async (productId) => {
    if (!userData) return false;

    try {
      const result = await axios.post(
        serverUrl + "/api/wishlist/toggle",
        { productId },
        { withCredentials: true }
      );

      // Update local state immediately for responsive UI
      setWishlistIds((prev) => {
        const updated = new Set(prev);
        if (result.data.wishlisted) {
          updated.add(productId);
        } else {
          updated.delete(productId);
        }
        return updated;
      });

      return result.data.wishlisted;
    } catch (error) {
      console.error("toggleWishlist error:", error);
      return false;
    }
  };

  // Check if a product is wishlisted
  const isWishlisted = (productId) => {
    return wishlistIds.has(productId);
  };

  // Load wishlist when userData changes (login/logout)
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const value = {
    wishlistIds,
    wishlistLoading,
    toggleWishlist,
    isWishlisted,
    fetchWishlist,
  };

  return (
    <wishlistDataContext.Provider value={value}>
      {children}
    </wishlistDataContext.Provider>
  );
};

export default WishlistContext;
