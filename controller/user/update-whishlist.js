const status = require('../../helpers/user/statusCode');
const Cart = require('../../models/admin/cart');
const Wishlist = require('../../models/admin/wishList');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;







const deleteProduct = async (req, res) => {
  try {

    console.log('------------here is the params', req.params)
    const { productId } = req.params;
    const userId = req.session.user_id;
    
    
    // if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
      //   return res.status(400).json({ 
        //     success: false, 
        //     message: 'Invalid product ID format' 
        //   });
        // }
        
        
        const updatedWishlist = await Wishlist.findOneAndUpdate(
          { userId },
          { $pull: { products: { _id:  productId } } },
          { new: true }
        );
        
        console.log('updated =>', updatedWishlist)
   
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

//       const { productId } = req.params;
//       console.log('product id',productId);

//   const result =   await Wishlist.findOneAndUpdate(
//         { userId: new ObjectId(userId) },
//         { $pull: { products: { productId: new ObjectId(productId) } } },
//         { new: true }
//       );
  
//       if (!result) {
//         return res.status(404).json({ message: 'Wishlist not found or product not in wishlist' });
//       }
  
//       res.status(200).json({ message: 'Product removed from wishlist', wishlist: result });