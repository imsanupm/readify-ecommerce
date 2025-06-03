const Order = require('../../models/user/order-schema');

const returnOrder = async (req,res) => {
    try {
        const orderId = req.params.orderId;
        const {reason}=  req.body;
        
    } catch (error) {
        console.log('error during return order',error);
    }
}

module.exports = {
    returnOrder
}