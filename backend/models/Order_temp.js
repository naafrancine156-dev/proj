// models/Order_temp.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  contactDetails: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String
  },
  billingAddress: {
    add: String,
    city: String,
    region: String,
    postalCode: String
  },
  deliveryOption: String,
  paymentMethod: String,
  shippingCost: Number,
  paymentFee: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "received",  // ← ADD THIS LINE
      "cancelled"
    ],
    default: "pending"
  },
  receivedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order_temp", orderSchema);