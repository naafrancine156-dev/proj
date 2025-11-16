const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  contactDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String
  },
  billingAddress: {
    name: String,
    phone: String,
    region: String,
    city: String,
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
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending"
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

module.exports = mongoose.model("Order", orderSchema);