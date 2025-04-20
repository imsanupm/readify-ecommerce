const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');


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
        console.log(`product id ${productId}`);
        let cart = await Cart.findOne({userId:userId});
         if(!cart){
        
         }
    } catch (error) {
        console.log('error durning adding to the  cart',error)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports = {
  getCart,
  addToCart
}