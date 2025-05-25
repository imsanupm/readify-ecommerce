

const code = require('../../helpers/user/statusCode')
const User = require('../../models/user/userSchema');
const Order = require('../../models/user/order-schema');
const Cart = require('../../models/admin/cart');
const Product = require('../../models/admin/productSchema');



const placeNewOrder = async (req,res) => {
    try {
   
     const userId = req.session.user_id;
     const {addressId,paymentMethod} = req.body;
     const address  = await User.findById(userId).populate('addresses');
    const cartData =  await Cart.findOne({userId}).populate('items.productId');
      const user = await User.findById(userId);
  
     const addressData = address.addresses.filter((val)=>val._id.toString()==addressId);
    
        if(paymentMethod !=="cod"){
            return res.status(code.HttpStatus.BAD_REQUEST)
        }
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
         totalAmount+=subTotal;
          gstAmount = (subTotal * gstpercentage )/ 100;
          totalAmount += gstAmount;
  
         
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