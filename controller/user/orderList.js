const code = require('../../helpers/user/statusCode')
const Order  = require('../../models/user/order-schema');
const mongoose = require('mongoose');
const Cart = require('../../models/admin/cart')


const getOrderListPage = async (req,res) => {
   try {
    const userId = req.session.user_id;
    const userOrder = await Order.find({userId}).sort({ createdAt: -1 });
    console.log(userOrder);
    return res.render('order-list',{
        orders : userOrder
    });
   } catch (error) {
    console.log('error during getOrlderListPage',error)
    return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR);
   } 
}




// const getOrderDetailPage = async (req,res) => {
//     try {
     
//         const userId = req.session.user_id;
//         const orderId  = req.params.id;
//         // let subTotal = 0;
//         // let totalAmount = null;
//         // let gstAmount = null;
//         // const deliveryCharge = 49;
//         // const gstpercentage = 14;
//         // const cutOfMoneyForDeleveryCharge = 1000;
       
        
//         let filter = { userId };

//         if (mongoose.Types.ObjectId.isValid(orderId)) {
//             filter._id = orderId;
//         } else {
//             filter.orderId = orderId;
//         }

//         const order = await Order.findOne(filter)
           

//         console.log("=========================order",order);
          
//         const gstPercentage = 14;
//         const deliveryThreshold = 1000;
//         const deliveryChargeAmount = 49;
        
       
//         let subTotal = 0;
//         order.orderedItems.forEach(item => {
//           subTotal += item.price * item.quantity;
//         });
        
       
//         const gst = (subTotal * gstPercentage) / 100;
        
       
//         const deliveryCharge = subTotal < deliveryThreshold ? deliveryChargeAmount : 0;
        
       
//         const totalPrice = subTotal + gst + deliveryCharge;

//         console.log("=========================amount Calculation",gst,deliveryCharge,totalPrice,subTotal);
        
     
//      return res.render('order-detail',{
//         orderData:order,
//         subTotal: subTotal.toFixed(2),
//         gstAmount: gst.toFixed(2),
//         deliveryCharge: deliveryCharge.toFixed(2),
//         totalPrice: totalPrice.toFixed(2)
//      })
//     } catch (error) {
//         console.log('error during orderDetail Page',error)
//         return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR)
//     }
// }

const getOrderDetailPage = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const orderId = req.params.id;
  
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
        subTotal += item.price * item.quantity;
      });
  
      const gst = (subTotal * gstPercentage) / 100;
      const deliveryCharge = subTotal < deliveryThreshold ? deliveryChargeAmount : 0;
      const totalPrice = subTotal + gst + deliveryCharge - (order.discount || 0); // minus discount if any
  
      return res.render('order-detail', {
        orderData: order,
        subTotal: subTotal.toFixed(2),
        gstAmount: gst.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
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