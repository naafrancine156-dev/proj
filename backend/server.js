require("dotenv").config();
const config = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

// Security middlewares
const helmet = require("helmet");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

// ===== DEFINE VARIABLES =====
const MONGO_URI = config.MONGO_URI;
const PORT = config.PORT;

console.log("🔍 Config loaded:", { MONGO_URI: !!MONGO_URI, JWT_SECRET: !!config.JWT_SECRET, PORT });

// ===== MIDDLEWARE - ORDER MATTERS =====
// 1. Security headers FIRST (but allow cross-origin for images)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CORS and body parsing
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Data sanitization
app.use(xssClean());
app.use(mongoSanitize());

// 4. Static files - AFTER sanitization
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== JWT PROTECTION MIDDLEWARE =====
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

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
  app.use("/api/auth", authRoutes);                  // Public
  app.use("/api/products", productRoutes);           // Public
  app.use("/api/user", protect, userRoutes);         // Protected
  app.use("/api/cart", protect, cartRoutes);         // Protected
  app.use("/api/orders", protect, orderRoutes);      // Protected

  console.log("✅ All routes registered");
} catch (err) {
  console.error("❌ Error loading routes:", err.message);
  console.error("❌ Full error:", err);
}

// ===== TEST ENDPOINTS =====
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
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
})