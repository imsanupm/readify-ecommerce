const code =  require('../../helpers/user/statusCode');
const Order = require('../../models/user/order-schema');
const { findById, findByIdAndUpdate } = require('../../models/user/order-schema');


const returnRequest = async (req,res) => {
    try {
        const {orderId} = req.params;
        const {reason} = req.body;
        const orderData = await Order.findOne({orderId:orderId});
        // console.log("Your call From ===============",orderData);
        
        if(!orderData){
            return res.status(code.HttpStatus.BAD_REQUEST).json({message:"Cannot find the data",success:false});
        }
    
        
     orderData.orderedItems.forEach(item => {
    item.isReturnRequested = true;
    item.returnReason = reason;
    item.returnRequestedOn = new Date();
});
       console.log('order Dat=========',orderData.isReturnRequested,orderData.returnReason);
       console.log("order data =-================",orderData);

     await orderData.save();
    return res.status(code.HttpStatus.OK).json({message:"Request sended Accepted We will inform you the output",sucess:true})
    
    } catch (error) {
        console.log("error during return Request",error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal Server errro",success:false});
        
    }
}


const cancelRequest = async (req,res) => {
    try {
       
       
 
        return res.status(code.HttpStatus.OK).json({message:"Request sended Accepted We will inform you the output",success:true})
        
    } catch (error) {
        console.log('error during cancelRequest',error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error",success:false})
    }
}


module.exports = {
    returnRequest,
    cancelRequest
}