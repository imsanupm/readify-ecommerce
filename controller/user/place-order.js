
const Coupon = require('../../models/admin/coupen');
const code = require('../../helpers/user/statusCode')
const User = require('../../models/user/userSchema');
const Order = require('../../models/user/order-schema');
const Cart = require('../../models/admin/cart');
const Product = require('../../models/admin/productSchema');
const Razorpay = require('razorpay');
require('dotenv').config();
const crypto = require('crypto');






const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});




// const placeNewOrder = async (req, res) => {
//   try {
//     const userId = req.session.user_id;
//     const { addressId, paymentMethod } = req.body;

//     const address = await User.findById(userId).populate('addresses');
//     const cartData = await Cart.findOne({ userId }).populate({
//       path: 'items.productId',
//       populate: { path: 'category', select: 'offer' }
//     });
//     const user = await User.findById(userId);

//     const addressData = address.addresses.filter((val) => val._id.toString() == addressId);

//     let subTotal = 0;
//     let totalAmount = 0;
//     let gstAmount = null;

//     const deliveryCharge = 49;
//     const gstpercentage = 14;
//     const cutOfMoneyForDeleveryCharge = 1000;
//     const orderedItems = [];

//     let orgTotal = 0; // ✅ Original price without discount

//     for (const item of cartData.items) {
//       const product = item.productId;
//       const price = product.regularPrice;
//       const quantity = item.quantity;

//       orgTotal += price * quantity; // ✅ Original MRP total

//       // ✅ Use finalAmount if valid offer exists
//       const offerPrice =
//         product.offerType && product.offerType !== 'null' && product.finalAmount > 0
//           ? product.finalAmount
//           : product.regularPrice;

//       const itemTotal = offerPrice * quantity;
//       subTotal += itemTotal;

//       orderedItems.push({
//         product: product._id,
//         productDetails: {
//           name: product.productTitle,
//           images: product.productImage,
//           category: product.category
//         },
//         quantity: quantity,
//         price: price, // ✅ Still store regular price as original price
//         status: 'Processing'
//       });

//       await Product.findByIdAndUpdate(
//         product._id,
//         { $inc: { quantity: -quantity } }
//       );
//     }

//     gstAmount = (subTotal * gstpercentage) / 100;
//     totalAmount = subTotal + gstAmount;

//     if (subTotal < cutOfMoneyForDeleveryCharge) {
//       totalAmount += deliveryCharge;
//     }
     
//     console.log("orgTotal (MRP):", orgTotal);
//     console.log("subTotal (after offer):", subTotal);
//     console.log("totalAmount (final):", totalAmount);

//     if (paymentMethod == "cod") {
//       return await cod(
//         req,
//         res,
//         cartData,
//         addressData,
//         user,
//         userId,
//         paymentMethod,
//         orderedItems,
//         subTotal,
//         totalAmount,
//         deliveryCharge
//       );
//     } else if (paymentMethod == "razorpay") {
//       return await createRazorpayOrder(
//         req,
//         res,
//         cartData,
//         addressData,
//         user,
//         userId,
//         paymentMethod
//       );
//     }

//   } catch (error) {
//     console.log("error from placeNewOrder", error);
//     return res.status(500).json({ success: false, message: 'Something went wrong' });
//   }
// };



// const placeNewOrder = async (req, res) => {
//   try {
//     const userId = req.session.user_id;
//     const { addressId, paymentMethod,couponCode } = req.body;
    

//     let coupon = null;
// let discountToApply = 0;

// if (couponCode) {
//   coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });

//   if (!coupon) {
//     return res.status(404).json({ message: "Coupon not found", success: false });
//   }

//   const now = new Date();

//   if (!coupon.isActive || now < coupon.startDate || now > coupon.expiryDate) {
//     return res.status(400).json({ message: "Coupon is not valid at this time", success: false });
//   }

//   if (subTotal < coupon.minPurchase) {
//     return res.status(400).json({ message: `Minimum purchase of ₹${coupon.minPurchase} required`, success: false });
//   }

//   const userUsage = coupon.usage.find(entry => entry.userId.toString() === userId.toString());
//   const usageCount = userUsage ? userUsage.usageCount : 0;

//   if (usageCount >= coupon.maxUsagePerUser) {
//     return res.status(400).json({ message: "Coupon usage limit reached", success: false });
//   }

//   // Calculate applicable discount
//   discountToApply = coupon.discount;
//   if (coupon.maxDiscount && coupon.maxDiscount > 0) {
//     discountToApply = Math.min(coupon.discount, coupon.maxDiscount);
//   }
// }

    
//     const address = await User.findById(userId).populate('addresses');
//     const cartData = await Cart.findOne({ userId }).populate({
//       path: 'items.productId',
//       populate: { path: 'category', select: 'offer' }
//     });
//     const user = await User.findById(userId);

//     const addressData = address.addresses.filter((val) => val._id.toString() == addressId);

//     let subTotal = 0; // ✅ This will now be the MRP total
//     let totalAmount = 0;
//     let gstAmount = null;

//     const deliveryCharge = 49;
//     const gstpercentage = 14;
//     const cutOfMoneyForDeleveryCharge = 1000;
//     const orderedItems = [];

//     for (const item of cartData.items) {
//       const product = item.productId;
//       const price = product.regularPrice;
//       const quantity = item.quantity;

//       subTotal += price * quantity; // ✅ MRP total

//       // ✅ Offer-based price used only for totalAmount
//       const offerPrice =
//         product.offerType && product.offerType !== 'null' && product.finalAmount > 0
//           ? product.finalAmount
//           : product.regularPrice;

//       totalAmount += offerPrice * quantity;

//       orderedItems.push({
//         product: product._id,
//         productDetails: {
//           name: product.productTitle,
//           images: product.productImage,
//           category: product.category
//         },
//         quantity: quantity,
//         price: price,
//         status: 'Processing'
//       });

//       await Product.findByIdAndUpdate(
//         product._id,
//         { $inc: { quantity: -quantity } }
//       );
//     }

//     gstAmount = (totalAmount * gstpercentage) / 100;
//     totalAmount += gstAmount;
//     let isCoupneapplyied = false
//     if (totalAmount < cutOfMoneyForDeleveryCharge) {
//       totalAmount += deliveryCharge;
//     }
//     if (coupon !== null) {
//       totalAmount -= discountToApply;
//       if (totalAmount < 0) totalAmount = 0; // safety check
//       isCoupneapplyied = true
//     }
//     console.log('coupen applyied aanou',isCoupneapplyied);
//     console.log('iscoupen amount=======',discountToApply);
    
    
    
//     if (paymentMethod == "cod") {
//       return await cod(
//         req,
//         res,
//         cartData,
//         addressData,
//         user,
//         userId,
//         paymentMethod,
//         orderedItems,
//         subTotal,
//         totalAmount,
//         deliveryCharge,
//         isCoupneapplyied,
//         discountToApply


//       );
//     } else if (paymentMethod == "razorpay") {
//       return await createRazorpayOrder(
//         req,
//         res,
//         cartData,
//         addressData,
//         user,
//         userId,
//         paymentMethod
//       );
//     }

//   } catch (error) {
//     console.log("error from placeNewOrder", error);
//     return res.status(500).json({ success: false, message: 'Something went wrong' });
//   }
// };



const placeNewOrder = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const { addressId, paymentMethod, couponCode } = req.body;

    const address = await User.findById(userId).populate('addresses');
    const cartData = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      populate: { path: 'category', select: 'offer' }
    });
    const user = await User.findById(userId);
    const addressData = address.addresses.filter((val) => val._id.toString() == addressId);

    let subTotal = 0;
    let totalAmount = 0;
    let gstAmount = null;
    const deliveryCharge = 49;
    const gstpercentage = 14;
    const cutOfMoneyForDeleveryCharge = 1000;
    const orderedItems = [];

    for (const item of cartData.items) {
      const product = item.productId;
      const price = product.regularPrice;
      const quantity = item.quantity;

      subTotal += price * quantity;

      const offerPrice =
        product.offerType && product.offerType !== 'null' && product.finalAmount > 0
          ? product.finalAmount
          : product.regularPrice;

      totalAmount += offerPrice * quantity;

      orderedItems.push({
        product: product._id,
        productDetails: {
          name: product.productTitle,
          images: product.productImage,
          category: product.category
        },
        quantity: quantity,
        price: price,
        status: 'Processing'
      });

      await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -quantity } });
    }

    // GST and delivery charges
    gstAmount = (totalAmount * gstpercentage) / 100;
    totalAmount += gstAmount;

    if (totalAmount < cutOfMoneyForDeleveryCharge) {
      totalAmount += deliveryCharge;
    }

    // ✅ Coupon validation AFTER subtotal is available
    let coupon = null;
    let discountToApply = 0;
    let isCouponApplied = false;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });

      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found", success: false });
      }

      const now = new Date();

      if (!coupon.isActive || now < coupon.startDate || now > coupon.expiryDate) {
        return res.status(400).json({ message: "Coupon is not valid at this time", success: false });
      }

      if (subTotal < coupon.minPurchase) {
        return res.status(400).json({ message: `Minimum purchase of ₹${coupon.minPurchase} required`, success: false });
      }

      const userUsage = coupon.usage.find(entry => entry.userId.toString() === userId.toString());
      const usageCount = userUsage ? userUsage.usageCount : 0;

      if (usageCount >= coupon.maxUsagePerUser) {
        return res.status(400).json({ message: "Coupon usage limit reached", success: false });
      }

      discountToApply = Number(coupon.discount);

      if (coupon.maxDiscount && Number(coupon.maxDiscount) > 0) {
        discountToApply = Math.min(Number(coupon.discount), Number(coupon.maxDiscount));
      }
      

      totalAmount -= discountToApply;
      if (totalAmount < 0) totalAmount = 0;

      isCouponApplied = true;
    }

   


    if (paymentMethod == "cod") {
      return await cod(
        req,
        res,
        cartData,
        addressData,
        user,
        userId,
        paymentMethod,
        orderedItems,
        subTotal,
        totalAmount,
        deliveryCharge,
        isCouponApplied,
        discountToApply,
        coupon
      );
    } else if (paymentMethod == "razorpay") {
      return await createRazorpayOrder(
        req,
        res,
        cartData,
        addressData,
        user,
        userId,
        paymentMethod
      );
    }

  } catch (error) {
    console.log("error from placeNewOrder", error);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};


const cod = async (req, res, cartData, addressData, user, userId, paymentMethod, orderedItems, subTotal, totalAmount, deliveryCharge,discountToApply,isCouponApplied,coupon) => {
  try {

   
      const orderData = new Order({
          userId: userId,
          userData: {
              name: user.name,
              email: user.email,
              phone: user.phonenumber
          },
          orderedItems,
          totalPrice: subTotal,
          discount: 0,
          finalAmount: Number(totalAmount.toFixed(2)),
          shippingCharge: totalAmount > 1000 ? deliveryCharge : 0,
          totalQuantity: orderedItems.reduce((sum, item) => sum + item.quantity, 0),
          address: {
              fullname: addressData[0].fullname,
              state: addressData[0].state,
              district: addressData[0].district,
              house_flat: addressData[0].house_flat,
              pincode: addressData[0].pincode,
              landmark: addressData[0].landmark,
              mobile: addressData[0].mobile,
              alt_phone: addressData[0].alt_phone,
              village_city: addressData[0].village_city,
              street: addressData[0].street,
              addressType: addressData[0].addressType
          },
          couponAmount:coupon.discount,
          couponApplied:isCouponApplied?true:false,
          invoiceDate: new Date(),
          status: 'Pending',
          paymentMethod: paymentMethod,
          createdOn: new Date()
      });

      await orderData.save();
       
      
      //  coupon count logics new one        
      if (coupon && isCouponApplied) {
        // Use update operators to perform multiple updates in one go
        const updatedCoupon = await Coupon.findOneAndUpdate(
          { code: coupon.code },
          {
            $push: {
              usage: { userId: userId }
            },
            $inc: {
              currentUsage: 1
            }
          },
          { new: true } // Return the updated document
        );
        if (updatedCoupon){
          console.log('Coupon updated==========',updatedCoupon);
          
        }
      
        // If coupon usage limit is reached, deactivate it
        if (updatedCoupon.currentUsage >= updatedCoupon.maxUsage) {
          await Coupon.updateOne(
            { code: coupon.code },
            { $set: { isActive: false } }
          );
        }
      }
      



      cartData.items = [];
      await cartData.save();

      return res.status(200).json({ success: true });

  } catch (error) {
      console.log("error during cod payment", error);
      return res.status(500).json({ success: false, message: 'COD payment failed' });
  }
}









const createRazorpayOrder = async (req, res, cartData, addressData, user, userId) => {
  try {
    let subTotal = 0;
    const gstpercentage = 14;
    const deliveryCharge = 49;
    const cutOff = 1000;

    for (const item of cartData.items) {
      subTotal += item.productId.regularPrice * item.quantity;
    }

    let totalAmount = subTotal + (subTotal * gstpercentage) / 100;
    if (subTotal < cutOff) totalAmount += deliveryCharge;

    const amountInPaise = Math.round(totalAmount * 100);

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
      notes: {
        userId: userId,
        addressId: req.body.addressId
      }
    });

    return res.status(code.HttpStatus.OK).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phonenumber
      }
    });

  } catch (error) {
    console.log("Error in createRazorpayOrder:", error);
    return res.status(500).json({ success: false, message: "Razorpay order creation failed" });
  }
};


const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      paymentMethod
    } = req.body;

    const userId = req.session.user_id;

    // Step 1: Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    // Step 2: Fetch user, cart, and address info
    const user = await User.findById(userId);
    const address = await User.findById(userId).populate('addresses');
    const cartData = await Cart.findOne({ userId }).populate('items.productId');

    const addressData = address.addresses.filter(val => val._id.toString() === addressId);

    // Step 3: Reuse your cod() function for order creation
    await cod(req, res, cartData, addressData, user, userId, paymentMethod);

  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};











module.exports = {
    placeNewOrder,
    verifyRazorpayPayment
}