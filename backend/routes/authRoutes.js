const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const config = require("../config");
const BillingAddress = require("../models/BillingAddress"); // Add this import at the top

const JWT_SECRET = config.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET not loaded in authRoutes!");
}
// ===== SIGNUP ROUTE =====
// ===== SIGNUP ROUTE =====
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email already registered" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    console.log("✅ User created:", newUser.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RETURN USER DATA WITH TOKEN
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
});

// ===== LOGIN ROUTE =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log("🔍 Login attempt for:", normalizedEmail);

    // Check for hardcoded admin
    if (normalizedEmail === "admin@example.com" && password === "admin123") {
      console.log("✅ Admin login");
      const token = jwt.sign(
        { id: "admin", role: "admin", email: normalizedEmail },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        success: true,
        token,
        user: {
          _id: "admin",
          id: "admin",
          email: normalizedEmail,
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        },
      });
    }

    // Find user by email in database
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    console.log("✅ User found:", user.email);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", user.email);

    // ✅ RETURN USER DATA WITH TOKEN
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// ===== GET CURRENT USER (PROTECTED ROUTE) ===== 
router.get("/me", auth, async (req, res) => {
  try {
    console.log("📝 GET /me request - User ID from token:", req.user.id);
    
    // Handle admin user (won't exist in DB)
    if (req.user.id === "admin") {
      console.log("✅ Admin user");
      return res.json({
        _id: "admin",
        firstName: "Admin",
        lastName: "User",
        email: req.user.email || "admin@example.com",
        role: "admin"
      });
    }

    // Find regular user in database
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Fetch default billing address
    const billing = await BillingAddress.findOne({ 
      userId: req.user.id, 
      isDefault: true 
    });

    console.log("✅ User found:", user.email);
    console.log("✅ User ID (_id):", user._id);

    // ✅ Return user object directly - _id comes automatically from MongoDB
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: billing?.phone || "",
      region: billing?.region || "",
      city: billing?.city || "",
      postalCode: billing?.postalCode || "",
      add: billing?.add || ""
    });
  } catch (err) {
    console.error("❌ Error in GET /me:", err);
    res.status(500).json({ 
      message: "Server error" 
    });
  }
});

// ===== SAVE BILLING ADDRESS =====
router.post("/save-billing-address", auth, async (req, res) => {
  try {
    const { name, phone, region, city, postalCode, isDefault } = req.body;
    const userId = req.user.id;

    console.log("📝 Saving billing address for user:", userId);
    console.log("📦 Request body:", req.body);

    // Validate required fields
    if (!name || !phone || !region || !city || !postalCode) {
      console.log("❌ Missing fields:", { name, phone, region, city, postalCode });
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // If setting as default, remove default from other addresses
    if (isDefault) {
      await BillingAddress.updateMany(
        { userId },
        { isDefault: false }
      );
    }

    // Create new billing address
    const billingAddress = new BillingAddress({
      userId,
      name,
      phone,
      region,
      city,
      postalCode,
      isDefault
    });

    await billingAddress.save();
    console.log("✅ Billing address saved successfully:", billingAddress);

    res.json({
      success: true,
      message: "Billing address saved successfully",
      billingAddress
    });
  } catch (err) {
    console.error("❌ Error saving billing address:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

// ===== GET SAVED CARDS =====
router.get("/saved-cards/:userId", async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.params.userId });
    res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== SAVE CARD =====
router.post("/save-card", async (req, res) => {
  try {
    const { userId, number, name, expiry, display } = req.body;
    
    const newCard = new Card({
      userId,
      cardNumber: number,
      cardholderName: name,
      expiryDate: expiry,
      display
    });
    
    await newCard.save();
    res.json({ 
      success: true, 
      id: newCard._id, 
      display: newCard.display 
    });
  } catch (error) {
    console.error("Error saving card:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== UPDATE PROFILE (PARTIAL UPDATE) =====
router.put("/update-profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, billingAddress } = req.body;

    console.log("📝 Update profile request for user:", userId);
    console.log("📦 Request body:", req.body);

    // Update User model fields
    const userUpdateData = {};
    if (firstName) userUpdateData.firstName = firstName;
    if (lastName) userUpdateData.lastName = lastName;
    if (email) userUpdateData.email = email;

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdateData, { new: true });
      console.log("✅ User fields updated");
    }

    // Update or create billing address (only if billing fields provided)
    if (billingAddress && Object.keys(billingAddress).length > 0) {
      const existingBilling = await BillingAddress.findOne({
        userId,
        isDefault: true
      });

      if (existingBilling) {
        // Update existing billing address with only provided fields
        const updateFields = {};
        if (billingAddress.phone) updateFields.phone = billingAddress.phone;
        if (billingAddress.add) updateFields.add = billingAddress.add;
        if (billingAddress.city) updateFields.city = billingAddress.city;
        if (billingAddress.postalCode) updateFields.postalCode = billingAddress.postalCode;
        if (billingAddress.region) updateFields.region = billingAddress.region;

        await BillingAddress.findByIdAndUpdate(
          existingBilling._id,
          updateFields,
          { new: true }
        );
        console.log("✅ Billing address updated");
      } else {
        // Create new billing address if it doesn't exist
        // For partial update, we need at least one field
        const newBilling = new BillingAddress({
          userId,
          phone: billingAddress.phone || "",
          add: billingAddress.add || "",
          city: billingAddress.city || "",
          postalCode: billingAddress.postalCode || "",
          region: billingAddress.region || "",
          isDefault: true
        });
        await newBilling.save();
        console.log("✅ New billing address created");
      }
    }

    res.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

// ===== LOGOUT ROUTE =====
router.post("/logout", (req, res) => {
  console.log("👋 User logged out");
  res.json({ 
    success: true,
    message: "Logged out successfully" 
  });
});

// ADD ONLY THESE TWO ROUTES TO YOUR authRoutes.js FILE

// ===== CHANGE PASSWORD =====
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Current and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "New password must be at least 6 characters" 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Password changed successfully" 
    });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to change password" 
    });
  }
});

// ===== DELETE ACCOUNT =====
router.delete("/delete-account", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: "Password is required to delete account" 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Incorrect password" 
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ 
      success: true,
      message: "Account deleted successfully" 
    });

  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete account" 
    });
  }
});
module.exports = router;