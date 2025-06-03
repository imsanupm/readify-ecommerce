const Coupen = require('../../models/admin/coupen');

const validateCouponUpdate = async (req, res, next) => {
  try {
    const coupenId = req.params.coupenId.toUpperCase();
    const {
      discount,
      minPurchase,
      maxDiscount,
      startDate,
      expiryDate,
      maxUsagePerUser,
      isActive
    } = req.body;

    // Basic form validations
    if (!discount || discount < 0) {
      return res.status(400).json({ success: false, message: "Invalid discount value" });
    }
    if (!startDate || !expiryDate || new Date(startDate) > new Date(expiryDate)) {
      return res.status(400).json({ success: false, message: "Start date must be before expiry date" });
    }
    if (maxUsagePerUser < 1) {
      return res.status(400).json({ success: false, message: "Max usage per user must be at least 1" });
    }

    // Fetch current coupon
    const currentCoupon = await Coupen.findOne({ code: coupenId });
    if (!currentCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    // Compare current data with new data
    const hasChanged =
      Number(currentCoupon.discount) !== Number(discount) ||
      Number(currentCoupon.minPurchase) !== Number(minPurchase) ||
      Number(currentCoupon.maxDiscount) !== Number(maxDiscount) ||
      new Date(currentCoupon.startDate).toISOString().slice(0, 10) !== startDate ||
      new Date(currentCoupon.expiryDate).toISOString().slice(0, 10) !== expiryDate ||
      Number(currentCoupon.maxUsagePerUser) !== Number(maxUsagePerUser) ||
      currentCoupon.isActive !== (isActive === 'true' || isActive === true);

    if (!hasChanged) {
      return res.status(200).json({ success: false, message: "No changes detected" });
    }

    req.existingCoupon = currentCoupon; // attach for next handler
    next();
  } catch (error) {
    console.error("Error in validateCouponUpdate middleware:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};





// const validateAddCoupon = (req, res, next) => {
//     const {
//       code,
//       discount,
//       maxDiscount,
//       minPurchase,
//       startDate,
//       expiryDate,
//       isActive,
//       maxUsagePerUser,
//     } = req.body;
  
//     const errors = [];
  
//     if (!code || typeof code !== 'string' || code.trim() === '') {
//       errors.push('Coupon code is required and must be a string.');
//     }
  
//     if (isNaN(discount) || discount < 0) {
//       errors.push('Discount must be a valid non-negative number.');
//     }
  
//     if (maxDiscount !== undefined && (isNaN(maxDiscount) || maxDiscount < 0)) {
//       errors.push('Max discount must be a valid non-negative number.');
//     }
  
//     if (minPurchase !== undefined && (isNaN(minPurchase) || minPurchase < 0)) {
//       errors.push('Min purchase must be a valid non-negative number.');
//     }
  
//     if (!startDate || isNaN(new Date(startDate).getTime())) {
//       errors.push('Start date must be a valid date.');
//     }
  
//     if (!expiryDate || isNaN(new Date(expiryDate).getTime())) {
//       errors.push('Expiry date must be a valid date.');
//     }
  
//     if (new Date(startDate) >= new Date(expiryDate)) {
//       errors.push('Expiry date must be after start date.');
//     }
  
//     if (typeof isActive !== 'boolean' && isActive !== 'true' && isActive !== 'false') {
//       errors.push('isActive must be a boolean value.');
//     }
  
//     if (isNaN(maxUsagePerUser) || maxUsagePerUser < 1) {
//       errors.push('Max usage per user must be a positive number.');
//     }
  
//     if (errors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors,
//       });
//     }
  
//     next();
//   };
  

module.exports = {
    validateCouponUpdate,
   // validateAddCoupon
};
