const code = require('../../helpers/user/statusCode')
const Order  = require('../../models/user/order-schema');
const mongoose = require('mongoose');



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

const getOrderDetailPage = async (req,res) => {
    try {
     
        const userId = req.session.user_id;
        const orderId  = req.params.id;
        console.log('orderId=======================',orderId);
        
        let filter = { userId };

        if (mongoose.Types.ObjectId.isValid(orderId)) {
            filter._id = orderId;
        } else {
            filter.orderId = orderId;
        }

        const order = await Order.findOne(filter)
           

        console.log('orderData=================',order)

     
     return res.render('order-detail',{
        orderData:order
     })
    } catch (error) {
        console.log('error during orderDetail Page',error)
        return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR)
    }
}


module.exports = {
    getOrderListPage,
    getOrderDetailPage
}