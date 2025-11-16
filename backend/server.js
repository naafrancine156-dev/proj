require("dotenv").config();
const config = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ===== DEFINE VARIABLES FIRST =====
const MONGO_URI = config.MONGO_URI;
const PORT = config.PORT;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ADD DEBUG HERE (after PORT is defined)
console.log("🔍 Config loaded:", { MONGO_URI: !!MONGO_URI, JWT_SECRET: !!config.JWT_SECRET, PORT });
console.log("🔍 NODE_ENV:", process.env.NODE_ENV);

// ===== SERVE STATIC FILES =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== MONGODB CONNECTION =====
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB Connected to Atlas");     
  console.log("Database:", mongoose.connection.name);
  const createSampleAdmin = require("./utils/createSampleAdmin");
  createSampleAdmin();
})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

// ===== LOAD ROUTES =====
try {
  const authRoutes = require("./routes/authRoutes");
  console.log("✅ authRoutes loaded");
  
  const productRoutes = require("./routes/productRoutes");
  console.log("✅ productRoutes loaded");
  
  const userRoutes = require("./routes/userRoutes");
  console.log("✅ userRoutes loaded");
  
  const cartRoutes = require("./routes/cartRoutes");
  console.log("✅ cartRoutes loaded");
  
  const orderRoutes = require("./routes/orderRoutes");
  console.log("✅ orderRoutes loaded");

  // Register routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);

  console.log("✅ All routes registered");
} catch (err) {
  console.error("❌ Error loading routes:", err.message);
  console.error("❌ Full error:", err);
}

// ===== TEST ENDPOINTS =====
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.get("/api/user/test", (req, res) => {
  res.json({ message: "User routes are working!" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    database: mongoose.connection.name
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  console.log("❌ 404 - Route not found:", req.method, req.path);
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, "uploads")}`);  
  console.log(`\n✅ Ready to accept requests!\n`);
});