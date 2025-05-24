const Order = require("../../models/user/order-schema");
const User = require('../../models/user/userSchema')

const getOrderListPage = async (req,res) => {
    try {
      
        const orderData = await Order.find({});
        if(!orderData){
            return res.json({message:"cannot find the orderData"});

        }
       
         res.render('list-order',{
            orderData:orderData
         });
         return
    } catch (error) {
        console.log('error during getOrderListPage',error)
    }
}


const orderDetailPage = async (req,res) => {
    try {
        const userId = req.session.user_id;
        const orderId = req.params.IdOrder;
        const gstPercentage = 14;
        const cutOfDeliveryAmount = 1000;
        const deliveryChargeAmount = 49;
        const orderData = await Order.findOne({_id:orderId}); 
        console.log('orderData =================',orderData);


        let subTotal = 0;
        orderData.orderedItems.forEach((items)=>{
            subTotal += items.price * items.quantity;
        })
         let totalAmount = subTotal;
         if(subTotal<cutOfDeliveryAmount){
            totalAmount+=deliveryChargeAmount;
         }
         const gst = (subTotal*gstPercentage)/100;
         totalAmount+=gst;

        console.log('data=====================',subTotal,totalAmount,gst);
        
        res.render('order-detail-admin',{
            order:orderData,
            subTotal: subTotal.toFixed(2),
            gstAmount: gst.toFixed(2),
            deliveryCharge: deliveryChargeAmount.toFixed(2),
            totalPrice: totalAmount.toFixed(2)
        });

        return
    } catch (error) {
        console.log('error during getOrderListPage',error)
    }
    
}

module.exports = {
    getOrderListPage,
    orderDetailPage
}