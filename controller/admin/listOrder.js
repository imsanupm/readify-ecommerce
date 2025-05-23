const Order = require("../../models/user/order-schema");


const getOrderListPage = async (req,res) => {
    try {
        console.log('============your are getitnt the right call  form andmin order page')
        const orderData = await Order.find({});
        if(!orderData){
            return res.json({message:"cannot find the orderData"});
        }
        console.log('order Dat ===============',orderData);
         res.render('list-order');
         return
    } catch (error) {
        console.log('error during getOrderListPage',error)
    }
}

module.exports = {
    getOrderListPage
}