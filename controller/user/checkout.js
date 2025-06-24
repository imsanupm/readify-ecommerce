const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');
const Coupen = require('../../models/admin/coupen');
const code = require('../../helpers/user/statusCode');
const message = require('../../helpers/user/jsonRespose');
const helpers = require('../../helpers/user/getUser');
const Product = require('../../models/admin/productSchema');
const Wishlist = require('../../models/admin/wishList')
const findUser = require('../../helpers/user/getUser');






const getCheckout = async (req, res) => {
    try {
  
       const userId = req.session.user_id;
       const userData = await findUser.getUserById(req.session.user_id);
       const addresss = await User.findById(userId).populate('addresses');
     
      const coupen = await Coupen.find({
        isActive: true,
        'usage.userId': { $ne: userId }  // userId must NOT be in the usage list
      }).sort({ createdAt: -1 }); 
       const cartData = await Cart.findOne({ userId }).populate({
           path: 'items.productId',
           populate: { path: 'category', select: 'offer' } // Populate category to access offer
       });
       
       let subTotal = 0;
       let totalAmount = 0; // Initialize to 0 to avoid null issues
       let gstAmount = null;
       const deliveryCharge = 49;
       const gstPercentage = 14;
       const cutOfMoneyForDeliveryCharge = 1000;
       const appliedOffers = []; // Array to store applied offer details
       
       if (!cartData || !cartData.items || cartData.items.length === 0) {
           return res.status(404).json({message:"Something Went Wrong Datas Cant find Please try again",success:false})
       }
       let orgTotal = 0;
       cartData.items.forEach(item => {
        const quantity = item.quantity;
        orgTotal += (item.productId.regularPrice * quantity); // Fixed: added productId and multiplied by quantity
        
           const price = item.productId.offerType && item.productId.offerType !== 'null' && item.productId.finalAmount > 0 
             ? item.productId.finalAmount 
             : item.productId.regularPrice;
           
           const itemTotal = price * quantity;
           subTotal += itemTotal;
           
           // Track applied offers for display
           if (item.productId.offerType && item.productId.offerType !== 'null' && item.productId.finalAmount > 0) {
               appliedOffers.push(`${item.productId.offerType}: Applied on ${item.productId.productTitle}`);
           }
           
          
       });
       
       gstAmount = subTotal * gstPercentage / 100;
       totalAmount = subTotal + gstAmount;
       
      
       if (subTotal < cutOfMoneyForDeliveryCharge) {
           totalAmount += deliveryCharge;
       }
        console.log('subTotal second ',subTotal);
        
       
  
       res.render('checkout', {
           address: addresss.addresses,
           subTotal,
           totalAmount,
           deliveryCharge,
           gstAmount,
           appliedOffers ,
           coupenData:coupen,
           orgTotal ,
           cartData,
           user_name:userData.name
       });
       
    } catch (error) {
       console.log('error during getCheckout', error);
    }
  };

  const getOrderConfirmation = async (req,res) => {
    try {
       return res.render('order-confirmation')
    } catch (error) {
      conosle.log('error during getCheckout page',error)
    }
  }



  module.exports = {
    getCheckout,
    getOrderConfirmation,
  };

  