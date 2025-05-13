const status = require('../../helpers/user/statusCode');
const Cart = require('../../models/admin/cart');
const Whishlist = require('../../models/admin/wishList');
const User =require('../../models/admin/wishList')





const getWishList = async (req, res) => {
    try {
      const userId = req.session.user_id;
      
     
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8; // Items per page
      const skip = (page - 1) * limit;
  
     
      const wishList = await Whishlist.findOne({ userId });
      
      if (!wishList) {
        return res.render('wishList', { 
          wishlistItems: [], 
          pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            limit: limit
          }
        });
      }
      
      const totalItems = wishList.products.length;
      const totalPages = Math.ceil(totalItems / limit);

      const paginatedWishlist = await Whishlist.findOne({ userId })
        .populate('products.productId')
        .lean(); 
      const util = require('util');
      // console.log('wishList', util.inspect(paginatedWishlist, { depth: 3, colors: true }));
  
      let validItems = [];
      
      if (paginatedWishlist && paginatedWishlist.products) {
       
        validItems = paginatedWishlist.products
          .filter(item => item && item.productId)
        
          .slice(skip, skip + limit);
      }
      
      res.render('wishList', { 
        wishlistItems: validItems,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit
        }
      });
    } catch (error) {
      console.log('Error during getWishlist:', error);
      res.status(500).send('Internal Server Error');
    }
  };

const addToWishlist = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const { productId } = req.body;
        

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      const userCart = await Cart.findOne({
        userId: userId,
        "items.productId": productId,
      });
      
      if (userCart) {
        return res.status(400).json({ message: "Product Already Exists In Cart" });
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
  
    
      let wishlist = await Whishlist.findOne({ userId });
  
      if (!wishlist) {
        wishlist = new Whishlist({
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
    addToWishlist,
    getWishList
}