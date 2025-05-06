const status = require('../../helpers/user/statusCode');
const Cart = require('../../models/admin/cart');
const Wishlist = require('../../models/admin/wishList');


const addToWishlist = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const { productId } = req.body;
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
  
     
      const cart = await Cart.findOne({ userId });
  
      if (cart && cart.products) {
        let isInCart = false;
  
      
        cart.products.forEach((item) => {
          if (item.productId.toString() === productId) {
            isInCart = true; 
          }
        });
  
        if (isInCart) {
          return res.status(409).json({ message: "Product already exists in cart" });
        }
      }
  
    
      let wishlist = await Wishlist.findOne({ userId });
  
      if (!wishlist) {
        wishlist = new Wishlist({
          userId,
          products: [{ productId }]
        });
      } else {
        const productExists = wishlist.products.some(
          (item) => item.productId.toString() === productId
        );
  
        if (productExists) {
          return res.status(409).json({ message: "Product already in wishlist" });
        }
  
        wishlist.products.push({ productId });
      }
  
      await wishlist.save();
      return res.status(200).json({ 
        message: "Product added to wishlist",
        success:true
     });
  
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return res.status(500).json({ message: "Internal  Server error Please Try Again" });
    }
  };
  

module.exports = {
    addToWishlist
}