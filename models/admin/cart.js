const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    //   volume: { type: String, required: true }, // Store size instead of variantId
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);


