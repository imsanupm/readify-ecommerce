const status = require('../../helpers/user/statusCode');
const Cart = require('../../models/admin/cart');
const Wishlist = require('../../models/admin/wishList');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;







const deleteProduct = async (req, res) => {
  try {

 
    const { productId } = req.params;
    const userId = req.session.user_id;
    
    
        const updatedWishlist = await Wishlist.findOneAndUpdate(
          { userId },
          { $pull: { products: { _id:  productId } } },
          { new: true }
        );
        
        
   
    if (!updatedWishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found for this user'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: updatedWishlist
    });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist',
      error: error.message
    });
  }
};



module.exports ={
   deleteProduct
}

