const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');
const code = require('../../helpers/user/statusCode');
const message = require('../../helpers/user/jsonRespose');

const getCart = async (req,res) => {
    try {
        res.render('cart')
    } catch (error) {
        console.log('error during getting the cartpage',error)
      
    }
}

const addToCart = async (req,res) => {
    try {
        const productId = req.body.productId
        const userId = req.session.user_id;
        
       let user  = await User.findById(userId);
        if(!user){
            return res.status(code.HttpStatus.NOT_FOUND).json({message:message.USER_NOT_FOUND})
        }
        const existingProductIndex = user.cart.findIndex(item=>item.productId.toString()===productId)
        if(existingProductIndex !== -1){
            user.cart[existingProductIndex].quantity +=1;
            await user.save();
          return  res.status(200).json({success:true})
        }else{
            user.cart.push({productId,quantity:1});
            await user.save();
           return  res.status(200).json({success:true});
        }
    
       
      console.log(productId);
    } catch (error) {
        console.log('error durning adding to the  cart',error)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports = {
  getCart,
  addToCart
}