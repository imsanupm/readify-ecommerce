const Order = require('../../models/user/order-schema');
const  code = require('../../helpers/user/statusCode');
const Wallet = require('../../models/user/wallet');
const {nanoid} = require('nanoid');
const approveReturn = async (req,res) => {
    try {
        const orderId = req.params.id;
    
        const orderData = await Order.findOne({_id:orderId});
        if(!orderData){
            return res.status(code.HttpStatus.BAD_REQUEST).json({message:"Canonot Find The Data",success:false})
        }

        // let totalAmount = 0;
       
        // orderData.orderedItems.forEach(item => {
        //     if ( item.status === 'Return Requested') {
        //       item.status = 'Returned';
        //       item.returnedOn = new Date();
        //       item.isReturnRequested = false;
      
        //       totalAmount += item.price * item.quantity;
        //     }
        //   });
        //   console.log("before delivery charge==========",totalAmount)
             orderData.status = "Returned"
      
        // if(totalAmount<1000){
        //     totalAmount =totalAmount+49;
        // }
    //     console.log('before gst================',totalAmount)
        
    //     const gst = 14;
    //     const gstAmount = (totalAmount * gst) / 100;
    //    totalAmount = totalAmount+ gstAmount;

    //     console.log("total Amount= after gst=================",totalAmount);
       
      

        const userId = orderData.userId
       
        let wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            wallet = new Wallet({
                user: userId,
                balance: 0,
                transactions: [],
            });
        }

        wallet.balance += orderData.finalAmount;

        wallet.transactions.push({
            transactionId: nanoid(), // Generate secure, short ID
            type: "credit",
            amount: orderData.finalAmount,
            description: `Refund for returned order #${orderData._id}`,
            orderId: orderData._id.toString(),
            status: "completed",
        });
        await orderData.save()
        await wallet.save();

        return res.status(code.HttpStatus.OK).json({
            message: ` been credited to user's acount`,
            success: true,
        });
       

    } catch (error) {
        console.log("error during approveReturn Controller",error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal Server Error Please Try again",success:false})
        
    }
}

module.exports = {
    approveReturn
}