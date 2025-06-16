const code = require('../../helpers/user/statusCode');
const Product = require('../../models/admin/productSchema');
const Order = require('../../models/user/order-schema');
const Wallet = require('../../models/user/wallet')
const { nanoid } = require('nanoid');


const specificCancel = async (req, res) => {
    try {
        console.log('from specifReturn =====');

        const { orderId, productId } = req.body
        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Internal Server Error" })
        }
        
       
      if (order.paymentMethod == 'cod') {
        return await specifCancelCOD(req, res, order, productId)
      } else if (order.paymentMethod === 'razorpay') {
        return await specifCancelRazorpay(req, res, order, productId);
      }

        return
    } catch (error) {
        console.log('error during specifCancelCOD', error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server ", success: false });
    }
}


const specifCancelCOD = async (req, res, order, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const cancelItem = order.orderedItems.find((item) => item.product.toString() === productId);
    if (!cancelItem) {
      return res.status(404).json({ message: "Item not found in order", success: false });
    }

    if (cancelItem.status === 'Cancelled') {
      return res.status(400).json({ message: "Item already cancelled", success: false });
    }

    if (cancelItem.status === 'Delivered') {
      return res.status(400).json({ message: "Cannot cancel delivered item", success: false });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: "Order already cancelled", success: false });
    }

    const productQuantity = cancelItem.quantity;
    const itemPrice = cancelItem.price;
    const itemTotal = itemPrice * productQuantity;

    // Remove from totalPrice (basic amount only)
    order.totalPrice = Math.max(0, order.totalPrice - itemTotal);

    // Adjust quantity
    order.totalQuantity = Math.max(0, order.totalQuantity - productQuantity);

    // Restore product stock
    product.quantity += productQuantity;
    await product.save();

    // Cancel item
    cancelItem.status = 'Cancelled';
    cancelItem.cancelledAt = new Date();

    // Recalculate finalAmount
    const gstPercentage = 14;
    const gst = (order.totalPrice * gstPercentage) / 100;
    const shipping = order.totalPrice < 1000 && order.totalPrice > 0 ? 49 : 0;
    const finalAmount = order.totalPrice + gst + shipping - (order.couponAmount || 0);
     console.log('final Amount===============',finalAmount);
     
    
    order.shippingCharge = shipping;
    order.finalAmount = Math.max(0, finalAmount);

    // Cancel whole order if needed
    const allItemsCancelled = order.orderedItems.every(item => item.status === 'Cancelled');
    if (allItemsCancelled) {
      order.status = 'Cancelled';
      order.cancellationDate = new Date();
      order.cancellationReason = 'All items cancelled by user';
    }

    await order.save();

    return res.status(200).json({ message: "Item cancelled successfully", success: true });

  } catch (error) {
    console.log('error during specifCancelCOD', error);
    return res.status(500).json({ message: "Internal Server error. Please try again.", success: false });
  }
};







const specifCancelRazorpay = async (req, res, order, productId) => {
  try {
    const userId = req.session.user_id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const cancelItem = order.orderedItems.find((item) => item.product.toString() === productId);
    if (!cancelItem) {
      return res.status(404).json({ message: "Item not found in order", success: false });
    }

    if (cancelItem.status === 'Cancelled') {
      return res.status(400).json({ message: "Item already cancelled", success: false });
    }

    if (cancelItem.status === 'Delivered') {
      return res.status(400).json({ message: "Cannot cancel delivered item", success: false });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: "Order already cancelled", success: false });
    }

    const productQuantity = cancelItem.quantity;
    const itemPrice = cancelItem.price;
    const itemTotal = itemPrice * productQuantity;

    // Update order
    order.totalPrice = Math.max(0, order.totalPrice - itemTotal);
    order.totalQuantity = Math.max(0, order.totalQuantity - productQuantity);

    // Restore product stock
    product.quantity += productQuantity;
    await product.save();

    // Cancel item
    cancelItem.status = 'Cancelled';
    cancelItem.cancelledAt = new Date();

    // Recalculate final amount
    const gstPercentage = 14;
    const gst = (order.totalPrice * gstPercentage) / 100;
    const shipping = order.totalPrice < 1000 && order.totalPrice > 0 ? 49 : 0;
    const finalAmount = order.totalPrice + gst + shipping - (order.couponAmount || 0);
    order.shippingCharge = shipping;
    order.finalAmount = Math.max(0, finalAmount);

    // Cancel whole order if needed
    const allItemsCancelled = order.orderedItems.every(item => item.status === 'Cancelled');
    if (allItemsCancelled) {
      order.status = 'Cancelled';
      order.cancellationDate = new Date();
      order.cancellationReason = 'All items cancelled by user';
    }

    await order.save();

    // Refund to wallet
    const refundAmount = itemTotal;
    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      wallet = new Wallet({
        user: userId,
        balance: refundAmount,
        transactions: [{
          transactionId: nanoid(10),
          type: "credit",
          amount: refundAmount,
          description: `Refund for cancelled product in order ${order.orderId}`,
          orderId: order.orderId,
          status: "completed"
        }]
      });
    } else {
      wallet.balance += refundAmount;
      wallet.transactions.push({
        transactionId: nanoid(10),
        type: "credit",
        amount: refundAmount,
        description: `Refund for cancelled product in order ${order.orderId}`,
        orderId: order.orderId,
        status: "completed"
      });
    }

    await wallet.save();

    return res.status(200).json({ message: "Item cancelled and refunded to wallet successfully", success: true });

  } catch (error) {
    console.log('error during specifCancelRazorpay', error);
    return res.status(500).json({ message: "Internal Server error. Please try again.", success: false });
  }
};

module.exports = {
    specificCancel
}