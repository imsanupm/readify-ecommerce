const Order = require('../../models/user/order-schema');
const  code = require('../../helpers/user/statusCode');
const Wallet = require('../../models/user/wallet');
const {nanoid} = require('nanoid');
const Product = require('../../models/admin/productSchema');



const approveReturn = async (req,res) => {
    try {
        const orderId = req.params.id;
    
        const orderData = await Order.findOne({_id:orderId});
        if(!orderData){
            return res.status(code.HttpStatus.BAD_REQUEST).json({message:"Canonot Find The Data",success:false})
        }

      
             orderData.status = "Returned"

             
             for (const item of orderData.orderedItems) {
                const productId = item.product;
                const qtyToAdd = item.quantity;
    
                await Product.findByIdAndUpdate(
                    productId,
                    { $inc: { quantity: qtyToAdd } }, // increment the quantity
                    { new: true }
                );
            }
      
 
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