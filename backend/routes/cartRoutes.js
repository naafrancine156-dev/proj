const express = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth"); // Your auth middleware
const router = express.Router();

// GET - Load cart for a user
router.get("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log("📦 Loading cart for userId:", userId);
    console.log("📦 Authenticated user:", req.user);
    
    // Verify user is loading their own cart
    if (req.user.id !== userId) {
      console.log("❌ User mismatch - token user:", req.user.id, "requested:", userId);
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    let cart = await Cart.findOne({ userId });
    
    console.log("📦 Cart found:", cart ? "Yes" : "No");
    
    if (!cart) {
      console.log("📦 No cart found, returning empty cart");
      return res.json({ items: [] });
    }
    
    res.json({ items: cart.items });
  } catch (error) {
    console.error("❌ Error loading cart:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ 
      message: "Error loading cart", 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// POST - Save cart
router.post("/save", auth, async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    console.log("💾 Saving cart - userId:", userId, "items count:", items?.length);
    console.log("💾 Authenticated user:", req.user.id);
    
    if (!userId) {
      console.log("❌ User ID is missing from request body");
      return res.status(400).json({ message: "User ID is required" });
    }

    // Verify user is saving their own cart
    if (req.user.id !== userId) {
      console.log("❌ User mismatch - token user:", req.user.id, "requested:", userId);
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      console.log("💾 Creating new cart for user:", userId);
      cart = new Cart({ userId, items });
    } else {
      console.log("💾 Updating existing cart");
      cart.items = items;
      cart.updatedAt = new Date();
    }
    
    await cart.save();
    console.log("✅ Cart saved successfully");
    res.json({ message: "Cart saved successfully", cart });
  } catch (error) {
    console.error("❌ Error saving cart:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ 
      message: "Error saving cart", 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// DELETE - Clear cart
router.delete("/clear/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log("🗑️  Clearing cart for userId:", userId);
    console.log("🗑️  Authenticated user:", req.user.id);
    
    // Verify user is clearing their own cart
    if (req.user.id !== userId) {
      console.log("❌ User mismatch - token user:", req.user.id, "requested:", userId);
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const result = await Cart.findOneAndUpdate(
      { userId },
      { items: [], updatedAt: new Date() },
      { new: true }
    );
    
    console.log("✅ Cart cleared successfully");
    res.json({ message: "Cart cleared successfully", cart: result });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ 
      message: "Error clearing cart", 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

module.exports = router;