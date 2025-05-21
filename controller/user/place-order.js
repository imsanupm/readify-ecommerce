

const code = require('../../helpers/user/statusCode')
const User = require('../../models/user/userSchema');
const Order = require('../../models/user/order-schema');
const Cart = require('../../models/admin/cart');
const Product = require('../../models/admin/productSchema');



const placeNewOrder = async (req,res) => {
    try {
      console.log("=========================================================<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=")
     const userId = req.session.user_id;
     const {addressId,paymentMethod} = req.body;
     const address  = await User.findById(userId).populate('addresses');
    const cartData =  await Cart.findOne({userId}).populate('items.productId');
      const user = await User.findById(userId);
      console.log("====================================================add",address);
        if(paymentMethod !=="cod"){
            return res.status(code.HttpStatus.BAD_REQUEST)
        }
        let subTotal = 0;
        let totalAmount = null;
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
                name: product.name,
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
         
          gstAmount = subTotal * gstpercentage / 100;
          totalAmount += gstAmount;
  
          // totalAmount+=gstAmount;
          if(subTotal<cutOfMoneyForDeleveryCharge){
            totalAmount += deliveryCharge;
          }
          
          const orderData = new Order({
            userId: userId,
            userData:{
                name:user.name,
                email:user.email,
                phone:user.phonenumber
            },
            orderedItems,
            totalPrice:subTotal,
            discount: 0,
            finalAmount: totalAmount,
            shippingCharge:totalAmount>1000?deliveryCharge:0,
            totalQuantity: orderedItems.reduce((sum, item) => sum + item.quantity, 0),
            address: {
                fullname: address.fullname,
                state: address.state,
                district: address.district,
                house_flat: address.house_flat,
                pincode: address.pincode,
                landmark: address.landmark,
                mobile: address.mobile,
                alt_phone: address.alt_phone,
                village_city: address.village_city,
                street: address.street,
                addressType: address.addressType
              },
              invoiceDate: new Date(),
              status: 'Pending',
              paymentMethod: paymentMethod,
              createdOn: new Date()
          })



          await orderData.save();

          cartData.items = [];
          await cartData.save();
      
          return res.status(200).json({ success: true });
    } catch (error) {
        console.log("error from placeNewOrder",error);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}




module.exports = {
    placeNewOrder
}