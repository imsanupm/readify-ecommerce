const Cart = require('../../models/admin/cart');
const status = require('../../helpers/user/statusCode');
const Product = require('../../models/admin/productSchema');
const code = require('../../helpers/user/statusCode');
const updateQuantity = async (req,res) => {
    try {
        const userId = req.session.user_id;
        const {productId,action} = req.body;
          console.log('productId ',productId);
        if(!userId||!productId||!action){
            return res.status(status.HttpStatus.BAD_REQUEST).json({
                message:"Missing Data",
                success:false
            })
        }
        const product = await Product.findById(productId);
        if(product.quantity<1){
            return res.status(code.HttpStatus.BAD_REQUEST).json({message:"Product is out of stock. stock will arrive soon thank you for understanding",success:false})
        }
        const cart = await Cart.findOne({userId})
        if(!cart){
            return res.status(status.HttpStatus.NOT_FOUND).json({
                message:"Cart Not Found Please Try Again",
                success:false
            })
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
          return res.status(404).json({ success: false, message: 'Product not in cart' });
        }
        if(action == 'increase'){
            if(cart.items[itemIndex].quantity>=5){
                return res.status(status.HttpStatus.BAD_REQUEST).json({
                    message:'Maximum quantity per product is 5' ,
                    success:false
                })
            }
            cart.items[itemIndex].quantity+=1
        }else if(action == 'decrease'){
          
            if (cart.items[itemIndex].quantity <= 1) {
             
                return res.status(status.HttpStatus.OK).json({ 
                    success: false, 
                    message: 'To remove this item, please use the remove button', 
                    minimumReached: true,
                    currentQuantity: cart.items[itemIndex].quantity
                });
            }
            
            cart.items[itemIndex].quantity -= 1;

        }else{
            return res.status(status.HttpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid action' });
        }
        await cart.save()
        res.status(status.HttpStatus.OK).json({ 
            success: true, 
            message: 'Quantity updated',
            currentQuantity: cart.items[itemIndex].quantity
          });
    } catch (error) {
        console.log('erro during updateQuantity',error)
        res.status(status.HttpStatus.INTERNAL_SERVER_ERROR).json({
             success: false, 
             message: 'Internal Server Error' });
    }
}

const removeFromCart = async (req,res) => {
    try {
        const productId = req.params.productId;
        const userId = req.session.user_id;

      if(!productId||!userId){
        return res.status(status.HttpStatus.NOT_FOUND).json({
            success:false,
            message:"Needed A Proper Data eg productId , userId"
        })
      }

       const cart =   await Cart.findOne({userId});
       if(!cart){
        return res.status(status.HttpStatus.NOT_FOUND).json({
            success:false,
            message:"Cart Not Found Please Try Again"
        })
       }
       const result = await Cart.updateOne(
        { userId },
        { $pull: { items: { productId: productId } } }
    );

    if (result.nModified === 0) {
        return res.status(404).json({
            success: false,
            message: 'Product not found in cart. Unable to remove.'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Product removed from cart successfully.'
    });
    } catch (error) {
        cosnole.log('error during removeFromCArt Fucntion',error)
        return res.status(status.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Internal Server erro Please Try again"
        })
    }
}

module.exports  = {
    updateQuantity,
    removeFromCart
}