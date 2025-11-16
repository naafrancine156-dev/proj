const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const BillingAddress = require('../models/BillingAddress.js');
const SavedCard = require('../models/SavedCard.js');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

// ⚠️ IMPORTANT: PUT SPECIFIC ROUTES BEFORE GENERIC ONES!

// ✅ GET - Fetch current logged-in user profile (MUST BE BEFORE /:userId)
router.get('/profile/me', auth, async (req, res) => {
  try {
    console.log("📋 Fetching current user profile");
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("✅ Profile retrieved:", user._id);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// ✅ GET - Fetch all users (MUST BE BEFORE /:userId)
router.get('/all', auth, async (req, res) => {
  try {
    console.log("📋 Fetching all users - User info:", { userId: req.user.id, role: req.user.role });
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log("❌ Access denied - User role:", req.user.role);
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find().select('-password'); // Exclude passwords for security
    
    console.log("✅ Found", users.length, "users");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// ✅ POST - Save Billing Address
router.post("/save-billing-address", auth, async (req, res) => {
  try {
    const { name, phone, region, city, postalCode, add, isDefault } = req.body;
    const userId = req.user.id;

    console.log("💾 Saving billing address:", { userId, name, region, city, add });

    if (!name || !phone || !region || !city || !postalCode || !add) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isDefault) {
      await BillingAddress.updateMany(
        { userId },
        { isDefault: false }
      );
    }

    const billingAddress = new BillingAddress({
      userId,
      name,
      phone,
      region,
      city,
      postalCode,
      add,
      isDefault
    });

    await billingAddress.save();
    console.log("✅ Billing address saved:", billingAddress._id);
    res.status(201).json({
      success: true,
      message: "Billing address saved successfully",
      billingAddress
    });
  } catch (error) {
    console.error("❌ Error saving billing address:", error);
    res.status(500).json({ message: "Error saving billing address", error: error.message });
  }
});

// ✅ GET - Fetch all billing addresses for a user
router.get("/billing-addresses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("📋 Fetching billing addresses for user:", userId);

    const billingAddresses = await BillingAddress.find({ userId });

    if (!billingAddresses.length) {
      console.log("⚠️ No billing addresses found");
      return res.status(200).json([]);
    }

    console.log("✅ Found", billingAddresses.length, "addresses");
    res.status(200).json(billingAddresses);
  } catch (error) {
    console.error("❌ Error fetching billing addresses:", error);
    res.status(500).json({ message: "Error fetching billing addresses", error: error.message });
  }
});

// ✅ DELETE - Delete a billing address
router.delete("/billing-address/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;

    const deletedAddress = await BillingAddress.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Billing address not found" });
    }

    console.log("✅ Billing address deleted");
    res.status(200).json({ message: "Billing address deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting billing address:", error);
    res.status(500).json({ message: "Error deleting billing address", error: error.message });
  }
});

// ✅ POST - Save Credit/Debit Card
router.post("/save-card", async (req, res) => {
  try {
    const { userId, number, name, expiry, display } = req.body;

    console.log("💳 Saving card for user:", userId);

    if (!userId || !number || !name || !expiry) {
      return res.status(400).json({ message: "All card fields are required" });
    }

    const savedCard = new SavedCard({
      userId,
      cardNumber: number,
      cardholderName: name,
      expiryDate: expiry,
      display
    });

    await savedCard.save();
    console.log("✅ Card saved:", savedCard._id);
    res.status(201).json({
      message: "Card saved successfully",
      id: savedCard._id,
      card: savedCard
    });
  } catch (error) {
    console.error("❌ Error saving card:", error);
    res.status(500).json({ message: "Error saving card", error: error.message });
  }
});

// ✅ GET - Fetch all saved cards for a user
router.get("/saved-cards/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("🔍 Fetching saved cards for user:", userId);

    const cards = await SavedCard.find({ userId });

    if (!cards.length) {
      console.log("⚠️ No cards found");
      return res.status(200).json([]);
    }

    const safeCards = cards.map(card => ({
      id: card._id,
      display: card.display,
      expiryDate: card.expiryDate,
      cardholderName: card.cardholderName
    }));

    console.log("✅ Found", safeCards.length, "cards");
    res.status(200).json(safeCards);
  } catch (error) {
    console.error("❌ Error fetching saved cards:", error);
    res.status(500).json({ message: "Error fetching saved cards", error: error.message });
  }
});

// ✅ DELETE - Delete a saved card
router.delete("/saved-card/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;

    const deletedCard = await SavedCard.findByIdAndDelete(cardId);

    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    console.log("✅ Card deleted");
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting card:", error);
    res.status(500).json({ message: "Error deleting card", error: error.message });
  }
});

// ✅ GET - Fetch user by ID (MUST BE AFTER /all and /profile/me)
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log("🔍 Fetching user by ID:", userId);
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("✅ User found:", user._id);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// ✅ UPDATE - Update user details
router.put('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email } = req.body;
    
    console.log("✏️ Updating user:", userId);
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "firstName, lastName, and email are required" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("✅ User updated:", user._id);
    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// ✅ DELETE - Delete user
router.delete('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log("🗑️ Deleting user:", userId);
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("✅ User deleted:", userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;