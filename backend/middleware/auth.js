const jwt = require("jsonwebtoken");
const config = require("../config");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  console.log("🔐 Auth middleware - Token received:", token ? "Yes" : "No");
  
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    console.log("🔑 Using JWT_SECRET:", config.JWT_SECRET);
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    console.log("   JWT_SECRET in middleware:", config.JWT_SECRET);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;