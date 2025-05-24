const Order = require("../../models/user/order-schema");


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


const getOrderList = async (req,res) => {
    try {
        
        const orderId = req.params.IdOrder;
        const orderData = await Order.findById(orderId);
        console.log('order id=================',orderId);
        console.log('order data===================',orderData);
        res.render('order-detail-admin');
        return
    } catch (error) {
        console.log('error during getOrderListPage',error)
    }
    
}

module.exports = {
    getOrderListPage,
    getOrderList
}