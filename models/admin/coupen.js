const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
//   discountType: {
//     type: String,
//     enum: ['percentage', 'fixed'],
//     required: true
 // }
  discount: {
    type: Number,
    required: true,
    min: 0
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxUsagePerUser: {
    type: Number,
    default: 10, 
    min: 1
  },
  usage: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product' 
      },
      usageCount: {
        type: Number,
        default: 1, 
        min: 0
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);