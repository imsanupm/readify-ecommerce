const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');
const code = require('../../helpers/user/statusCode');
const message = require('../../helpers/user/jsonRespose');
const getUser = require('../../helpers/user/getUser');
const Product = require('../../models/admin/productSchema');



const getCart = async (req,res) => {
    try {
      const userId = req.session.user_id
        const cartData = await User.findById(userId).populate('cart');
         
     console.log('user cart for rendering ', cartData.cart);
        res.render('cart',{cart:cartData.cart})
    } catch (error) {
        console.log('error during getting the cartpage',error)
      
    }
}



const addToCart = async (req, res) => {
    console.log('hello from  car')
    try {
      const productId = req.body.productId;
      const userId = req.session.user_id;
  
    
      const user = await User.findById(userId).populate('cart');
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(code.HttpStatus.NOT_FOUND).json({
          message: "Product Not Found",
          success: false
        });
      }
  
      if (product.quantity === 0) {
        return res.status(code.HttpStatus.NOT_FOUND).json({
          message: "Empty Stock. Stock Will Arrive Soon",
          success: false
        });
      }
  
      if (!user.cart) {
 
        const newCart = await Cart.create({
          userId: userId,
          items: [{
            productId: productId,
            quantity: 1
          }]
        });
  
        user.cart = newCart._id;
        await user.save();
  
        return res.status(code.HttpStatus.CREATED).json({
          message: "Product added to cart",
          success: true
        });
      }
  
      const existingItem = user.cart.items.find(item =>
        item.productId.toString() === productId
      );
  
      if (existingItem) {
        if (existingItem.quantity >= 5) {
          return res.status(code.HttpStatus.CONFLICT).json({
            message: "You can only add up to 5 units of this product to your cart.",
            success: false
          });
        }
  
        existingItem.quantity += 1;
      } else {
        user.cart.items.push({
          productId: productId,
          quantity: 1
        });
      }
  
      await user.cart.save();
  
      return res.status(code.HttpStatus.OK).json({
        message: "Cart updated successfully",
        success: true
      });
  
    } catch (error) {
      console.log('Error during adding to the cart:', error);
      return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        success: false
      });
    }
  };
  


module.exports = {
  getCart,
  addToCart
}