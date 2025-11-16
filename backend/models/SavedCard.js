// models/SavedCard.js
const mongoose = require("mongoose");

const savedCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cardholderName: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  display: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SavedCard", savedCardSchema);
