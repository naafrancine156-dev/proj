// utils/createSampleAdmin.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createSampleAdmin = async () => {
  try {
    const adminEmail = "admin@example.com";
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // IMPORTANT: Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      password: hashedPassword, // ✅ Use hashed password
      role: "admin",
    });

    await admin.save();
    console.log("✅ Sample admin created: admin@example.com / admin123");
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  }
};

module.exports = createSampleAdmin;