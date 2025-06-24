const code = require('../../helpers/user/statusCode')
const Order  = require('../../models/user/order-schema');
const mongoose = require('mongoose');
const Cart = require('../../models/admin/cart')
const findUser = require('../../helpers/user/getUser');


const getOrderListPage = async (req, res) => {
  try {
    const userId = req.session.user_id;
     const userData = await findUser.getUserById(req.session.user_id);
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Number of orders per page
    const skip = (page - 1) * limit;

    // Count total orders for user
    const totalOrders = await Order.countDocuments({ userId });

    // Fetch paginated orders
    const userOrder = await Order.find({ userId })
      .sort({ createdOn: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalOrders / limit);

    return res.render('order-list', {
      orders: userOrder,
      currentPage: page,
      totalPages,
      user_name:userData.name
    });
  } catch (error) {
    console.log('Error during getOrderListPage', error);
    return res.sendStatus(500);
  }
};


const getOrderDetailPage = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const orderId = req.params.id;
       const userData = await findUser.getUserById(req.session.user_id);
    let filter = { userId };

    if (mongoose.Types.ObjectId.isValid(orderId)) {
      filter._id = orderId;
    } else {
      filter.orderId = orderId;
    }

    const order = await Order.findOne(filter);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const gstPercentage = 14;
    const deliveryThreshold = 1000;
    const deliveryChargeAmount = 49;

    let subTotal = 0;

 
    order.orderedItems.forEach(item => {
      if (item.status !== 'Cancelled') {
        subTotal += item.price * item.quantity;
      }
    });
    
    


    const gst = subTotal * (gstPercentage / (100 + gstPercentage));

    const deliveryCharge = subTotal < deliveryThreshold ? deliveryChargeAmount : 0;
    const totalPrice = subTotal + deliveryCharge - (order.discount || 0);

    return res.render('order-detail', {
      orderData: order,
      subTotal:order.totalPrice<0?0: subTotal.toFixed(2),
      gstAmount: order.totalPrice<0?0:gst.toFixed(2),
      deliveryCharge: order.totalPrice<0?0:deliveryCharge.toFixed(2),
      // totalPrice: totalPrice.toFixed(2)
      totalPrice:order.finalAmount<0?0:order.finalAmount,
      user_name:userData.name
    });

  } catch (error) {
    console.log('error during orderDetail Page', error);
    return res.status(500).send('Internal Server Error');
  }
};





module.exports = {
    getOrderListPage,
    getOrderDetailPage
}