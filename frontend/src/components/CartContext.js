import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: userLoading } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
        console.log("🛒 Cart loaded from localStorage:", JSON.parse(savedCart).length, "items");
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
      }
    }
  }, []);

  // Load/sync cart when user is authenticated
  useEffect(() => {
    if (userLoading) {
      console.log("⏳ Waiting for user to load...");
      return;
    }

    if (user?.id) {
      console.log("🛒 CartContext: User detected, syncing cart for:", user.id);
      loadCartFromDB();
    } else {
      console.log("🛒 CartContext: No user logged in");
      setLoading(false);
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
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(dbCart));
      console.log("🛒 Cart synced from DB:", dbCart.length, "items");
    } catch (error) {
      console.error("❌ Error loading cart from DB:", error);
      setError(error.message);
      // Keep the localStorage cart if DB fails
      console.log("🛒 Keeping cart from localStorage");
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (cartItems) => {
    if (!user?.id || isSaving) return;
    
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      
      // Always save to localStorage first (instant)
      localStorage.setItem("cart", JSON.stringify(cartItems));
      
      // Then save to DB (async)
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

      console.log("✅ Cart saved to DB and localStorage");
    } catch (error) {
      console.error("❌ Error saving cart to DB:", error);
      setError(error.message);
      // Cart is still in localStorage, so it won't be lost
    } finally {
      setIsSaving(false);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      const updatedCart = existingItem
        ? prevCart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          )
        : [...prevCart, { ...item, quantity: item.quantity || 1 }];

      // Save to localStorage immediately
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Auto-save to DB
      if (user?.id) {
        saveCart(updatedCart);
      }

      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      
      // Save to localStorage immediately
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      // Auto-save to DB
      if (user?.id) {
        saveCart(updatedCart);
      }

      return updatedCart;
    });
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0);

      // Save to localStorage immediately
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Auto-save to DB
      if (user?.id) {
        saveCart(updatedCart);
      }

      return updatedCart;
    });
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");
    
    if (user?.id) {
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
        console.log("✅ Cart cleared successfully");
      } catch (error) {
        console.error("❌ Error clearing cart:", error);
        setError(error.message);
      }
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
        error
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