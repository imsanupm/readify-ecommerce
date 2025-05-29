

const code = require('../../helpers/user/statusCode')
const User = require('../../models/user/userSchema');
const Order = require('../../models/user/order-schema');
const Cart = require('../../models/admin/cart');
const Product = require('../../models/admin/productSchema');
const Razorpay = require('razorpay');
require('dotenv').config();
const crypto = require('crypto');


// const placeNewOrder = async (req,res) => {
//     try {
   
//      const userId = req.session.user_id;
//      const {addressId,paymentMethod} = req.body;
//      const address  = await User.findById(userId).populate('addresses');
//     const cartData =  await Cart.findOne({userId}).populate('items.productId');
//       const user = await User.findById(userId);
  
//      const addressData = address.addresses.filter((val)=>val._id.toString()==addressId);
    
//         if(paymentMethod =="cod"){
//             return await cod(req,res,cartData,addressData,user,userId);
//         }
     
//         } catch (error) {
//         console.log("error from placeNewOrder",error);
//         return res.status(500).json({ success: false, message: 'Something went wrong' });
//     }
// }

// const cod = async (req,res,cartData,addressData,user,userId) => {
//   try {
//     let subTotal = 0;
//     let totalAmount = 0;
//     let gstAmount = null;
//     const deliveryCharge = 49;
//     const gstpercentage = 14;
//     const cutOfMoneyForDeleveryCharge = 1000;
//     const orderedItems = [];
  

//     for (const item of cartData.items) {
//         const product = item.productId;
//         const price = product.regularPrice;
//         const quantity = item.quantity;
      
//         subTotal += price * quantity;
      
//         orderedItems.push({
//           product: product._id,
//           productDetails: {
//             name: product.productTitle,
//             images: product.productImage,
  
//             category: product.category
//           },
//           quantity: quantity,
//           price: price,
//           status: 'Processing'
//         });
      
//         await Product.findByIdAndUpdate(
//           product._id,
//           { $inc: { quantity: -quantity } }
//         );
//       }
//      totalAmount+=subTotal;
//       gstAmount = (subTotal * gstpercentage )/ 100;
//       totalAmount += gstAmount;

     
//       if(subTotal<cutOfMoneyForDeleveryCharge){
//         totalAmount += deliveryCharge;
//       }
      
//       const orderData = new Order({
//         userId: userId,
//         userData:{
//             name:user.name,
//             email:user.email,
//             phone:user.phonenumber
//         },
//         orderedItems,
//         totalPrice:subTotal,
//         discount: 0,
//         finalAmount: totalAmount,
//         shippingCharge:totalAmount>1000?deliveryCharge:0,
//         totalQuantity: orderedItems.reduce((sum, item) => sum + item.quantity, 0),
//         address: {
//             fullname: addressData[0].fullname,
//             state: addressData[0].state,
//             district: addressData[0].district,
//             house_flat: addressData[0].house_flat,
//             pincode: addressData[0].pincode,
//             landmark: addressData[0].landmark,
//             mobile: addressData[0].mobile,
//             alt_phone: addressData[0].alt_phone,
//             village_city: addressData[0].village_city,
//             street: addressData[0].street,
//             addressType: addressData[0].addressType
//           },
//           invoiceDate: new Date(),
//           status: 'Pending',
//           paymentMethod: paymentMethod,
//           createdOn: new Date()
//       })



//       await orderData.save();

//       cartData.items = [];
//       await cartData.save();
  
//       return res.status(200).json({ success: true });

//   } catch (error) {
//     console.log("error during cod payment",error);
    
//   }
  
// }



const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


const placeNewOrder = async (req,res) => {
  try {
      const userId = req.session.user_id;
      const {addressId, paymentMethod} = req.body;

      const address = await User.findById(userId).populate('addresses');
      const cartData = await Cart.findOne({ userId }).populate('items.productId');
      const user = await User.findById(userId);

      const addressData = address.addresses.filter((val) => val._id.toString() == addressId);

      if(paymentMethod == "cod"){
          return await cod(req, res, cartData, addressData, user, userId, paymentMethod); // pass paymentMethod here
      }else if(paymentMethod=="razorpay"){
        return await createRazorpayOrder(req,res,cartData,addressData,user,userId,paymentMethod)
      }


  } catch (error) {
      console.log("error from placeNewOrder", error);
      return res.status(500).json({ success: false, message: 'Something went wrong' });
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

    return res.status(200).json({
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






const cod = async (req, res, cartData, addressData, user, userId, paymentMethod) => { // accept it here
  try {
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

          await Product.findByIdAndUpdate(
              product._id,
              { $inc: { quantity: -quantity } }
          );
      }

      totalAmount += subTotal;
      gstAmount = (subTotal * gstpercentage) / 100;
      totalAmount += gstAmount;

      if (subTotal < cutOfMoneyForDeleveryCharge) {
          totalAmount += deliveryCharge;
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
          finalAmount: totalAmount,
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
          invoiceDate: new Date(),
          status: 'Pending',
          paymentMethod: paymentMethod, // now it's defined
          createdOn: new Date()
      });

      await orderData.save();

      cartData.items = [];
      await cartData.save();

      return res.status(200).json({ success: true });

  } catch (error) {
      console.log("error during cod payment", error);
      return res.status(500).json({ success: false, message: 'COD payment failed' });
  }
}




module.exports = {
    placeNewOrder,
    verifyRazorpayPayment
}