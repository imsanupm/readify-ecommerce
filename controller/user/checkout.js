const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');
const code = require('../../helpers/user/statusCode');
const message = require('../../helpers/user/jsonRespose');
const helpers = require('../../helpers/user/getUser');
const Product = require('../../models/admin/productSchema');
const Wishlist = require('../../models/admin/wishList')


const getCheckout = async (req, res) => {
    try {
       const userId = req.session.user_id
            
              const addresss  = await User.findById(userId).populate('addresses');
            
          
             
              const cartData =  await Cart.findOne({userId}).populate('items.productId');
              let subTotal = 0;
              let totalAmount = null;
              let gstAmount = null;
              const deliveryCharge = 49;
              const gstpercentage = 14;
              const cutOfMoneyForDeleveryCharge = 1000;
               
              if (!cartData || !cartData.items || cartData.items.length === 0) {
                return res.render('cart', {
                  cartData: null,
                  subTotal: 0,
                  totalAmount: 0,
                  deliveryCharge: 0
                });
              }
              
      
              cartData.items.forEach(item=>{
                const price = item.productId.regularPrice;
                const quantity = item.quantity;
                subTotal += price*quantity;
              })
             
              gstAmount = subTotal * gstpercentage / 100;
              totalAmount += gstAmount;
      
              // totalAmount+=gstAmount;
              if(subTotal<cutOfMoneyForDeleveryCharge){
                totalAmount += deliveryCharge;
              }
               
              totalAmount+=subTotal

              
              res.render('checkout', {
                address:addresss.addresses,
                subTotal,
                totalAmount,
                deliveryCharge,
                gstAmount,
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

  