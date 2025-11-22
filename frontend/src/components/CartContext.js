import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: userLoading } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Clear cart when user logs out
  useEffect(() => {
    if (!userLoading && !user) {
      console.log("🛒 User logged out - clearing cart");
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [user, userLoading]);

  // Load/sync cart when user is authenticated
  useEffect(() => {
    if (userLoading) {
      console.log("⏳ Waiting for user to load...");
      return;
    }

    if (user?.id) {
      console.log("🛒 CartContext: User detected, syncing cart for:", user.id);
      loadCartFromDB();
    }
  }, [user?.id, userLoading]);

  const loadCartFromDB = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/cart/${user.id}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Failed to load cart: ${response.status}`);
      }

      const data = await response.json();
      const dbCart = data.items || [];
      setCart(dbCart);
      console.log("🛒 Cart synced from DB:", dbCart.length, "items");
    } catch (error) {
      console.error("❌ Error loading cart from DB:", error);
      setError(error.message);
      setCart([]); // Clear cart on error
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (cartItems) => {
    if (!user?.id || isSaving) return;
    
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/cart/save", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          items: cartItems
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save cart: ${response.status}`);
      }

      console.log("✅ Cart saved to DB for user:", user.id);
    } catch (error) {
      console.error("❌ Error saving cart to DB:", error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addToCart = (item) => {
    if (!user?.id) {
      console.warn("⚠️ Cannot add to cart: User not logged in");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      const updatedCart = existingItem
        ? prevCart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          )
        : [...prevCart, { ...item, quantity: item.quantity || 1 }];

      // Save to DB
      if (user?.id) {
        saveCart(updatedCart);
      }

      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    if (!user?.id) return;

    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      
      // Save to DB
      if (user?.id) {
        saveCart(updatedCart);
      }

      return updatedCart;
    });
  };

  const updateQuantity = (itemId, newQty) => {
    if (!user?.id) return;

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      );

      if (user?.id) {
        saveCart(updatedCart);
      }

      return updatedCart;
    });
  };

  const clearCart = async () => {
    if (!user?.id) return;

    setCart([]);
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/cart/clear/${user.id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Failed to clear cart: ${response.status}`);
      }
      console.log("✅ Cart cleared successfully for user:", user.id);
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      setError(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        saveCart,
        error,
        isUserLoggedIn: !!user?.id
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};