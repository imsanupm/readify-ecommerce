const status = require('../../helpers/user/statusCode');
const Cart = require('../../models/admin/cart');
const Wishlist = require('../../models/admin/wishList');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;





const deleteProduct = async (req, res) => {
    try {
      const { userId } = req.session.user_id; // assuming you're using session-based auth
      const { productId } = req.params;
      console.log('product id',productId);

  const result =   await Wishlist.findOneAndUpdate(
        { userId: new ObjectId(userId) },
        { $pull: { products: { productId: new ObjectId(productId) } } },
        { new: true }
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Wishlist not found or product not in wishlist' });
      }
  
      res.status(200).json({ message: 'Product removed from wishlist', wishlist: result });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports ={
    deleteProduct
}