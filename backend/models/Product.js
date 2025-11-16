const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: String,
  category: [String],
  subCategory: [String],
  potSizes: [String],
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  description: String,
  plantCare: String,
  imageURLs: [String],
  
  // Track sold quantity
  sold: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // NEW FIELDS for tracking purchases
  purchaseCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Index for faster queries on featured products
ProductSchema.index({ purchaseCount: -1 });
ProductSchema.index({ category: 1 });

module.exports = mongoose.model("Product", ProductSchema);