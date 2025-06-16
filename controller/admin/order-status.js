const code = require('../../helpers/user/statusCode');
const Order = require('../../models/user/order-schema')

const updateStatus = async (req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;  
       

        const orderData  = await Order.findById(orderId);
        if (!orderData) {
            return res.status(404).json({ message: 'Order not found' });
          }
        if (orderData.status === 'Delivered') {
            return res.status(400).json({
              message: 'Status cannot be changed. Order is already delivered.',
            });
          }else if(orderData.status=="Cancelled"){
            return status(code.HttpStatus.BAD_REQUEST).json({message:"Status cannot be changed. Order is already Canceled"})
          
          }else if (orderData.status=="Return Requested"){
            return res.status(code.HttpStatus.BAD_REQUEST).json({message:"Status cannnot be changed. User requested for return do approve or deny to change the status"})
          }
        
          orderData.status = status;
        orderData.orderedItems.forEach((item)=>{
            item.status = status;
        })
          const updatedOrder = await orderData.save();
      
          res.status(code.HttpStatus.OK).json({ updatedStatus: updatedOrder.status });
        
    } catch (error) {
        console.log('error during updateStatus',error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Somethign went Wrong "})
    }
}


module.exports = {
    updateStatus
}