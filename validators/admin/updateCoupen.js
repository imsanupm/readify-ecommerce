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

module.exports = {validateCouponUpdate};
