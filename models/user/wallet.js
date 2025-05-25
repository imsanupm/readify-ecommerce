const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema({
  transactionId:{
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  transactions: [walletTransactionSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

walletSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

walletTransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

//module.exports = mongoose.model("Wallet", walletSchema);
const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
