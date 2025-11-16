require("dotenv").config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET || "verysecretkey",
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Log to verify it's loaded
console.log("⚙️ Config loaded:");
console.log("  JWT_SECRET:", config.JWT_SECRET ? "✅ Loaded" : "❌ MISSING");
console.log("  MONGO_URI:", config.MONGO_URI ? "✅ Loaded" : "❌ MISSING");
console.log("  PORT:", config.PORT);

// Validate required configs
if (!config.JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET is not defined!");
  process.exit(1);
}

if (!config.MONGO_URI) {
  console.error("❌ FATAL: MONGO_URI is not defined!");
  process.exit(1);
}

module.exports = config;