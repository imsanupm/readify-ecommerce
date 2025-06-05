const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');
const Coupen = require('../../models/admin/coupen');
const code = require('../../helpers/user/statusCode');
const message = require('../../helpers/user/jsonRespose');
const helpers = require('../../helpers/user/getUser');
const Product = require('../../models/admin/productSchema');
const Wishlist = require('../../models/admin/wishList')





// const getCheckout = async (req, res) => {
//   try {

//      const userId = req.session.user_id;
          
//      const addresss = await User.findById(userId).populate('addresses');
//     const   coupen = await Coupen.find({}).sort({ createdAt: -1 });   
//      const cartData = await Cart.findOne({ userId }).populate({
//          path: 'items.productId',
//          populate: { path: 'category', select: 'offer' } // Populate category to access offer
//      });
     
//      let subTotal = 0;
//      let totalAmount = 0; // Initialize to 0 to avoid null issues
//      let gstAmount = null;
//      const deliveryCharge = 49;
//      const gstPercentage = 14;
//      const cutOfMoneyForDeliveryCharge = 1000;
//      const appliedOffers = []; // Array to store applied offer details
     
//      if (!cartData || !cartData.items || cartData.items.length === 0) {
//          return res.render('cart', {
//              cartData: null,
//              subTotal: 0,
//              totalAmount: 0,
//              deliveryCharge: 0
//          });
//      }
     
//      cartData.items.forEach(item => {
//          const price = item.productId.regularPrice;
//          const quantity = item.quantity;
//          let itemTotal = price * quantity;
//          let offerApplied = null;

//          if (item.productId.productOffer && item.productId.productOffer > 0) {
//              itemTotal = itemTotal * (1 - item.productId.productOffer / 100);
//              offerApplied = `Product Offer: ${item.productId.productOffer}% on ${item.productId.productTitle}`;
//          }

   
//          if (item.productId.category && item.productId.category.offer && item.productId.category.offer > 0) {
//              // Apply category offer only if no product offer or if category offer is higher
//              if (!offerApplied || item.productId.category.offer > item.productId.productOffer) {
//                  itemTotal = price * quantity * (1 - item.productId.category.offer / 100);
//                  offerApplied = `Category Offer: ${item.productId.category.offer}% on ${item.productId.productTitle}`;
//              }
//          }

//         console.log('first subTotal===========',itemTotal);
        
//          subTotal += itemTotal;
//          if (offerApplied) {
//              appliedOffers.push(offerApplied);
//          }
//      });
     
//      gstAmount = subTotal * gstPercentage / 100;
//      totalAmount = subTotal + gstAmount;
     
    
//      if (subTotal < cutOfMoneyForDeliveryCharge) {
//          totalAmount += deliveryCharge;
//      }
//       console.log('subTotal second ',subTotal);
      
     

//      res.render('checkout', {
//          address: addresss.addresses,
//          subTotal,
//          totalAmount,
//          deliveryCharge,
//          gstAmount,
//          appliedOffers ,
//          coupenData:coupen
//      });
     
//   } catch (error) {
//      console.log('error during getCheckout', error);
//   }
// };





// const getCheckout = async (req, res) => {
//     try {
  
//        const userId = req.session.user_id;
            
//        const addresss = await User.findById(userId).populate('addresses');
//       const   coupen = await Coupen.find({}).sort({ createdAt: -1 });   
//        const cartData = await Cart.findOne({ userId }).populate({
//            path: 'items.productId',
//            populate: { path: 'category', select: 'offer' } // Populate category to access offer
//        });
       
//        let subTotal = 0;
//        let totalAmount = 0; // Initialize to 0 to avoid null issues
//        let gstAmount = null;
//        const deliveryCharge = 49;
//        const gstPercentage = 14;
//        const cutOfMoneyForDeliveryCharge = 1000;
//        const appliedOffers = []; // Array to store applied offer details
       
//        if (!cartData || !cartData.items || cartData.items.length === 0) {
//            return res.status(404).json({message:"Something Went Wrong Datas Cant find Please try again",success:false})
//        }
//        let orgTotal = 0;
//        cartData.items.forEach(item => {
//         orgTotal += item.productId.regularPrice
//            const price = item.productId.offerType && item.productId.offerType !== 'null' && item.productId.finalAmount > 0 
//              ? item.productId.finalAmount 
//              : item.productId.regularPrice;
           
//            const quantity = item.quantity;
//            const itemTotal = price * quantity;
//            subTotal += itemTotal;
           
//            // Track applied offers for display
//            if (item.productId.offerType && item.productId.offerType !== 'null' && item.productId.finalAmount > 0) {
//                appliedOffers.push(`${item.productId.offerType}: Applied on ${item.productId.productTitle}`);
//            }
           
//            console.log('first subTotal===========', itemTotal);
//            console.log('org total=============',orgTotal);
//        });
       
//        gstAmount = subTotal * gstPercentage / 100;
//        totalAmount = subTotal + gstAmount;
       
      
//        if (subTotal < cutOfMoneyForDeliveryCharge) {
//            totalAmount += deliveryCharge;
//        }
//         console.log('subTotal second ',subTotal);
        
       
  
//        res.render('checkout', {
//            address: addresss.addresses,
//            subTotal,
//            totalAmount,
//            deliveryCharge,
//            gstAmount,
//            appliedOffers ,
//            coupenData:coupen
//        });
       
//     } catch (error) {
//        console.log('error during getCheckout', error);
//     }
//   };
  


const getCheckout = async (req, res) => {
    try {
  
       const userId = req.session.user_id;
            
       const addresss = await User.findById(userId).populate('addresses');
      const   coupen = await Coupen.find({}).sort({ createdAt: -1 });   
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
           orgTotal // Added orgTotal to render data
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


//   const findCoupen = async (userId) => {
//     try {
//       // 1. Fetch cart with populated product & category
//       const cartData = await Cart.findOne({ userId })
//         .populate({
//           path: 'items.productId',
//           populate: {
//             path: 'category',
//             select: 'offer'
//           }
//         });
  
//       let total = 0;
  
//       if (cartData && cartData.items.length > 0) {
//         cartData.items.forEach((item) => {
//           const product = item.productId;
//           const quantity = item.quantity;
  
//           if (!product || !product.regularPrice) return;
  
//           const basePrice = product.regularPrice;
//           const productOffer = product.productOffer || 0;
//           const categoryOffer = product.category?.offer || 0;
  
//           const appliedOffer = productOffer > 0 ? productOffer : categoryOffer;
//           const discount = (basePrice * appliedOffer) / 100;
//           const finalPrice = basePrice - discount;
  
//           const tax = finalPrice < 1000 ? 49 : 0;
//           const gst = (finalPrice * 14) / 100;
  
//           const totalPerItem = (finalPrice + gst + tax) * quantity;
  
//           total += totalPerItem;
//         });
//       }
  
//       total = parseFloat(total.toFixed(2)); // Round off total
  
//       // 2. Now find matching coupons
//       const currentDate = new Date();
  
//       const validCoupons = await Coupen.find({
//         isActive: true,
//         startDate: { $lte: currentDate },
//         expiryDate: { $gte: currentDate },
//         minPurchase: { $lte: total }
//       }).sort({ createdAt: -1 });

//       console.log("totalItems=============",validCoupons);
      
  
//       return {
//         coupenData: validCoupons
//         // cartData,
//         // totalAmount: total
//       };
//     } catch (error) {
//       console.error('Error in findCoupen:', error);
//     }
//   };
  
  module.exports = {
    getCheckout,
    getOrderConfirmation,
  };

  