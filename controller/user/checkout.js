const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');
const code = require('../../helpers/user/statusCode');
const message = require('../../helpers/user/jsonRespose');
const helpers = require('../../helpers/user/getUser');
const Product = require('../../models/admin/productSchema');
const Wishlist = require('../../models/admin/wishList')


// const getCheckout = async (req, res) => {
//     try {
//        const userId = req.session.user_id
            
//               const addresss  = await User.findById(userId).populate('addresses');
            
          
             
//               const cartData =  await Cart.findOne({userId}).populate('items.productId');
//               let subTotal = 0;
//               let totalAmount = null;
//               let gstAmount = null;
//               const deliveryCharge = 49;
//               const gstpercentage = 14;
//               const cutOfMoneyForDeleveryCharge = 1000;
               
//               if (!cartData || !cartData.items || cartData.items.length === 0) {
//                 return res.render('cart', {
//                   cartData: null,
//                   subTotal: 0,
//                   totalAmount: 0,
//                   deliveryCharge: 0
//                 });
//               }
              
      
//               cartData.items.forEach(item=>{
//                 const price = item.productId.regularPrice;
//                 const quantity = item.quantity;
//                 subTotal += price*quantity;
//               })
             
//               gstAmount = subTotal * gstpercentage / 100;
//               totalAmount += gstAmount;
      
//               // totalAmount+=gstAmount;
//               if(subTotal<cutOfMoneyForDeleveryCharge){
//                 totalAmount += deliveryCharge;
//               }
               
//               totalAmount+=subTotal

              
//               res.render('checkout', {
//                 address:addresss.addresses,
//                 subTotal,
//                 totalAmount,
//                 deliveryCharge,
//                 gstAmount,
//               });
           
//     } catch (error) {
//       console.log('error during getCheckout', error);
//     }
//   };





const getCheckout = async (req, res) => {
  try {
     const userId = req.session.user_id;
          
     const addresss = await User.findById(userId).populate('addresses');
          
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
         return res.render('cart', {
             cartData: null,
             subTotal: 0,
             totalAmount: 0,
             deliveryCharge: 0
         });
     }
     
     cartData.items.forEach(item => {
         const price = item.productId.regularPrice;
         const quantity = item.quantity;
         let itemTotal = price * quantity;
         let offerApplied = null;

         // Check for product offer
         if (item.productId.productOffer && item.productId.productOffer > 0) {
             itemTotal = itemTotal * (1 - item.productId.productOffer / 100);
             offerApplied = `Product Offer: ${item.productId.productOffer}% on ${item.productId.productTitle}`;
         }

         // Check for category offer (assuming category has an offer field)
         if (item.productId.category && item.productId.category.offer && item.productId.category.offer > 0) {
             // Apply category offer only if no product offer or if category offer is higher
             if (!offerApplied || item.productId.category.offer > item.productId.productOffer) {
                 itemTotal = price * quantity * (1 - item.productId.category.offer / 100);
                 offerApplied = `Category Offer: ${item.productId.category.offer}% on ${item.productId.productTitle}`;
             }
         }

         // Add to subtotal and track applied offers
         subTotal += itemTotal;
         if (offerApplied) {
             appliedOffers.push(offerApplied);
         }
     });
     
     gstAmount = subTotal * gstPercentage / 100;
     totalAmount = subTotal + gstAmount;
     
     // Add delivery charge if subtotal is below threshold
     if (subTotal < cutOfMoneyForDeliveryCharge) {
         totalAmount += deliveryCharge;
     }
     
     res.render('checkout', {
         address: addresss.addresses,
         subTotal,
         totalAmount,
         deliveryCharge,
         gstAmount,
         appliedOffers // Pass applied offers to the view
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

  