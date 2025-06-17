
const Order = require('../../models/user/order-schema');
const code = require('../../helpers/user/statusCode');
const Product = require('../../models/admin/productSchema');
const { returnRequest } = require('./return-request');
const transaction = require('../../controller/user/referral');
const cancelRequest = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const orderData = await Order.findOne({ orderId: orderId });

        if (!orderData) {
            return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Nothing happened", success: true });
        }

        if (orderData.paymentMethod === "cod") {
            return await codCanceling(req, res, orderData, orderId);
        } else if (orderData.paymentMethod === "razorpay") {
            return await refundAndCancel(req, res, orderData, orderId, "Order cancellation amount refunded via Razorpay");
        } else if (orderData.paymentMethod === "wallet") {
            return await refundAndCancel(req, res, orderData, orderId, "Order cancellation amount refunded via Wallet");
        }

    } catch (error) {
        console.log('error during cancelRequest', error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", success: false });
    }
};

const codCanceling = async (req, res, orderData, orderId) => {
    try {
        orderData.status = "Cancelled";
        for (const item of orderData.orderedItems) {
            const productId = item.product;
            const qtyToAdd = item.quantity;
            item.status = 'Cancelled';
            await Product.findByIdAndUpdate(
                productId,
                { $inc: { quantity: qtyToAdd } },
                { new: true }
            );
        }
        await orderData.save();
        return res.status(code.HttpStatus.OK).json({ success: true, message: "Order Cancelled. Thank You!" });
    } catch (error) {
        console.log('error during codCanceling=============', error);
        return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error. We are working on it, please try again.", success: false });
    }
};

// ✅ Reusable refund logic for Razorpay or Wallet
const refundAndCancel = async (req, res, orderData, orderId, description) => {
    try {
        const userId = req.session.user_id;
        orderData.status = "Cancelled";

        for (const item of orderData.orderedItems) {
            item.status = 'Cancelled';
            const productId = item.product;
            const qtyToAdd = item.quantity;

            await Product.findByIdAndUpdate(
                productId,
                { $inc: { quantity: qtyToAdd } },
                { new: true }
            );
        }

        const amount = orderData.finalAmount;

        await transaction.refundToUser(userId, amount, description, orderId);
        await orderData.save();

        return res.status(code.HttpStatus.OK).json({
            message: "Your order was cancelled and the amount has been credited to your wallet. Thank you!",
            success: true
        });

    } catch (error) {
        console.log('error during refundAndCancel=======', error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error. We are working on it, please try again.", success: false });
    }
};


module.exports = {
    cancelRequest
}