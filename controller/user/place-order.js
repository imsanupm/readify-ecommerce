
const Coupon = require('../../models/admin/coupen');
const code = require('../../helpers/user/statusCode')
const User = require('../../models/user/userSchema');
const Order = require('../../models/user/order-schema');
const Cart = require('../../models/admin/cart');
const Product = require('../../models/admin/productSchema');
const Razorpay = require('razorpay');
require('dotenv').config();
const crypto = require('crypto');
const calculation = require('../user/cart')
const Wallet = require('../../models/user/wallet');
const { nanoid } = require('nanoid');



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});



const placeNewOrder = async (req, res) => {
  try {
    console.log("ree", req.body);
    const userId = req.session.user_id;
    const { addressId, paymentMethod, couponCode } = req.body;
   
     
    const address = await User.findById(userId).populate('addresses');
    const cartData = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      populate: { path: 'category', select: 'offer' }
    });
    const user = await User.findById(userId);
    const addressData = address.addresses.filter((val) => val._id.toString() == addressId);

    const orderedItems = [];

    
    const {
      subTotal,
      totalAmount: calculatedTotalAmount,
      deliveryCharge,
      gstAmount
    } = await calculation.calculateCartAmounts(cartData);

    let totalAmount = calculatedTotalAmount;

    for (const item of cartData.items) {
      const product = item.productId;
      const quantity = item.quantity;

      orderedItems.push({
        product: product._id,
        productDetails: {
          name: product.productTitle,
          images: product.productImage,
          category: product.category
        },
        quantity: quantity,
        price: product.regularPrice,
        status: 'Processing'
      });

      await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -quantity } });
    }

    


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
        discountToApply,
        isCouponApplied,
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
        paymentMethod,
        orderedItems,
        subTotal,
        totalAmount,
        deliveryCharge,
        discountToApply,
        isCouponApplied,
        coupon
      );
    }else if(paymentMethod=="wallet"){
          return await walletPayment(
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
        discountToApply,
        isCouponApplied,
        coupon
      );
    }

  } catch (error) {
    console.log("error from placeNewOrder", error);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};



const cod = async (req, res, cartData, addressData, user, userId, paymentMethod, orderedItems, subTotal, totalAmount, deliveryCharge, discountToApply, isCouponApplied, coupon) => {
  try {
      
      if(totalAmount>1000){
        return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "You cannot make a Cash on Delivery purchase over ₹1000. insted of cod you can use online payment or wallet payment", success: false })

      }
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
      couponAmount: coupon && isCouponApplied ? coupon.discount : 0,
      couponApplied: isCouponApplied ? true : false,
      invoiceDate: new Date(),
      status: 'Pending',
      paymentMethod: paymentMethod,
      createdOn: new Date()
    });

    await orderData.save();

   

    if (coupon && isCouponApplied) {

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
        { new: true }
      );



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



const walletPayment = async (
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
  discountToApply,
  isCouponApplied,
  coupon
) => {
  try {
   
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet || wallet.balance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

   
    const orderData = new Order({
      userId,
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
      couponAmount: coupon && isCouponApplied ? coupon.discount : 0,
      couponApplied: isCouponApplied ? true : false,
      invoiceDate: new Date(),
      status: 'Pending',
      paymentMethod,
      createdOn: new Date()
    });

    await orderData.save();

   
    const transactionId = nanoid(10);
    wallet.balance -= totalAmount;
    wallet.transactions.push({
      transactionId,
      type: "debit",
      amount: totalAmount,
      description: `Wallet purchase for order ${orderData.orderId}`,
      orderId: orderData.orderId,
      status: "completed"
    });
    await wallet.save();

  
    if (coupon && isCouponApplied) {
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
        { new: true }
      );

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
    console.log("Error during wallet payment", error);
    return res.status(500).json({ success: false, message: 'Wallet payment failed' });
  }
};






const createRazorpayOrder = async (
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
  discountToApply,
  isCouponApplied,
  coupon
) => {
 
  try {
   
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), 
      currency: 'INR',
      receipt: "user",
      payment_capture: 1 
    });
    

  
    console.log('address data in create order',addressData)
    req.session.razorpayOrder = {
      userId,
      userData: {
        name: user.name || 'Customer',
        email: user.email || 'customer@example.com',
        phone: user.phonenumber || '0000000000'
      },
      orderedItems,
      totalPrice: subTotal,
      discount: discountToApply || 0,
      finalAmount: Number(totalAmount.toFixed(2)),
      shippingCharge: totalAmount < 1000 ? deliveryCharge : 0, // Align with placeNewOrder
      totalQuantity: orderedItems.reduce((sum, item) => sum + item.quantity, 0),
      
      address: {
        _id:addressData[0]._id,
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
      couponAmount: isCouponApplied ? coupon.discount : 0,
      couponApplied: isCouponApplied,
      couponDetail: coupon ? coupon._id : null,
      paymentMethod,
      razorpayOrderId: order.id
    };

    console.log('order creation success')
    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      orderId: order.id,
      user: {
        name: user.name || 'Customer',
        email: user.email || 'customer@example.com',
        phone: user.phonenumber || '0000000000'
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to create Razorpay order: ${error.message}`
    });
  }
};


const verifyRazorpayPayment = async (req, res) => {
  console.log('Verify payment fn')
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      paymentMethod,
      couponCode
    } = req.body;

    const userId = req.session.user_id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

   
    const orderDetails = req.session.razorpayOrder;
    if (!orderDetails) {
      return res.status(400).json({ success: false, message: 'Order details not found' });
    }

    const {
      userId: storedUserId,
      userData,
      orderedItems,
      totalPrice,
      discount,
      finalAmount,
      shippingCharge,
      totalQuantity,
      address,
      couponAmount,
      couponApplied,
      couponDetail,
      paymentMethod: storedPaymentMethod,
      razorpayOrderId
    } = orderDetails;
    console.log('req-body-address',addressId)
    console.log('orderDetails address',address)
   
    if (userId !== storedUserId) {
      return res.status(400).json({ success: false, message: 'User ID mismatch', debug: { userId, storedUserId } });
    }
    
    if (paymentMethod !== storedPaymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method mismatch', debug: { paymentMethod, storedPaymentMethod } });
    }
    
    if (addressId !== address._id?.toString()) {
      return res.status(400).json({ success: false, message: 'Address ID mismatch', debug: { addressId, storedAddressId: address._id?.toString() } });
    }
    


    
    const orderData = new Order({
      userId,
      userData,
      orderedItems,
      totalPrice,
      discount,
      finalAmount,
      shippingCharge,
      totalQuantity,
      address,
      couponAmount,
      couponApplied,
      couponDetail,
      invoiceDate: new Date(),
      status: 'Pending',
      paymentMethod,
      paymentDetails: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      },
      createdOn: new Date()
    });
    console.log('order data in verify payment',orderData)
    await orderData.save();

    // make it reusable function after the review
    if (couponDetail && couponApplied) {
      const updatedCoupon = await Coupon.findOneAndUpdate(
        { _id: couponDetail },
        {
          $push: { usage: { userId } },
          $inc: { currentUsage: 1 }
        },
        { new: true }
      );

      if (updatedCoupon.currentUsage >= updatedCoupon.maxUsage) {
        await Coupon.updateOne(
          { _id: couponDetail },
          { $set: { isActive: false } }
        );
      }
    }

    // Clear cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    // Clear session
    delete req.session.razorpayOrder;

    return res.status(200).json({ success: true, message: 'Payment verified and order placed' });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      success: false,
      message: `Payment verification failed: ${error.message}`
    });
  }
};





const getPaymentFailedPage = async (req,res) => {
  try {
    res.render('payment-failed')
  } catch (error) {
    console.log('errror during getPaymentFailed function',error)
  }
}






module.exports = {
  placeNewOrder,
  verifyRazorpayPayment,
  getPaymentFailedPage
}