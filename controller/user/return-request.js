const code =  require('../../helpers/user/statusCode');
const Order = require('../../models/user/order-schema');
const Wallet = require('../../models/user/wallet');


    const returnRequest = async (req,res) => {
        try {
            const {orderId} = req.params;
            const {reason} = req.body;
            const orderData = await Order.findOne({orderId:orderId});
           
            
            if(!orderData){
                return res.status(code.HttpStatus.BAD_REQUEST).json({message:"Cannot find the data",success:false});
            }
        
        orderData.status = "Return Requested";    
        orderData.orderedItems.forEach(item => {
        item.status = "Return Requested";
        item.returnReason = reason;
        item.returnRequestedOn = new Date();
    });
        

        await orderData.save();
        return res.status(code.HttpStatus.OK).json({message:"Request sended Accepted We will inform you the output",sucess:true})
        
        } catch (error) {
            console.log("error during return Request",error);
            res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal Server errro",success:false});
            
        }
    }





module.exports = {
    returnRequest,
  
}