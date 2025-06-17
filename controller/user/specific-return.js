
const Order = require('../../models/user/order-schema'); // adjust the path as needed

const handleReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    if (!orderId || !productId || !reason) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Find the order containing the specific product
    const order = await Order.findOne({ _id: orderId, "orderedItems.product": productId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order or product not found' });
    }

    // Find the specific item and update it
    const item = order.orderedItems.find(item => item.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Product not found in order' });
    }

    // Prevent duplicate return request
    if (item.status === 'Return Requested' || item.isReturnRequested) {
      return res.status(400).json({ success: false, message: 'Return already requested for this item' });
    }

    // Update item details
    item.status = 'Return Requested';
    item.returnReason = reason;
    item.returnRequestedOn = new Date();
    item.isReturnRequested = true;

    await order.save();

    return res.json({ success: true, message: 'Return request submitted successfully' });

  } catch (error) {
    console.error('Return request error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
    handleReturnRequest
};


