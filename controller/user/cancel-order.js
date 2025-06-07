
const Order = require('../../models/user/order-schema');
const code = require('../../helpers/user/statusCode');
const Product = require('../../models/admin/productSchema');
const { returnRequest } = require('./return-request');
const transaction = require('../../controller/user/referral');

const cancelRequest = async (req,res) => {
    try {
         const  orderId = req.body.orderId;
          const orderData = await Order.findOne({orderId:orderId});
       

      if(!orderData){
        return res.status(code.HttpStatus.BAD_REQUEST).json({message:"nothing happened",success:true});
      }
        if(orderData.paymentMethod=="cod"){
            
             return await codCanceling(req,res,orderData,orderId)
        }else if (orderData.paymentMethod=="razorpay"){
            return await razorpay(req,res,orderData,orderId);
        }
        
    } catch (error) {
        console.log('error during cancelRequest',error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error",success:false})
    }
}

const codCanceling = async (req,res,orderData,orderId) => {
    try {

        orderData.status = "Cancelled"
        for (const item of orderData.orderedItems) {
            const productId = item.product;
            const qtyToAdd = item.quantity;

            await Product.findByIdAndUpdate(
                productId,
                { $inc: { quantity: qtyToAdd } }, 
                { new: true }
            );
        }
        await orderData.save();
        return res.status(code.HttpStatus.OK).json({success:true,message:"Order Cancelled Thank You"});
    } catch (error) {
        console.log('rerror during codCanceling=============',error)
        return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal Server error we are working on it please try again",success:false})
    }
}

const razorpay = async (req,res,orderData,orderId) => {
    try {
        const userId = req.session.user_id;
        orderData.status = "Cancelled"
        for (const item of orderData.orderedItems) {
            const productId = item.product;
            const qtyToAdd = item.quantity;

            await Product.findByIdAndUpdate(
                productId,
                { $inc: { quantity: qtyToAdd } }, 
                { new: true }
            );
        }
        const amount = orderData.finalAmount;
        const description = "Order cancellation amount refunded";

     await transaction.refundToUser(userId,amount,description,orderId)
     await orderData.save()

     return res.status(code.HttpStatus.OK).json({message:"Your order Cancelled Your amount Credited to your wallet thank You",success:true});


    } catch (error) {
        console.log('error during cancel in razorpay method=======',error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error we are worki on it please try again",success:false})
    }
}


module.exports = {
    cancelRequest
}