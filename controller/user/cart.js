const Cart = require('../../models/admin/cart');
const User = require('../../models/user/userSchema');
const code = require('../../helpers/user/statusCode');
const message = require('../../helpers/user/jsonRespose');
const getUser = require('../../helpers/user/getUser');
const Product = require('../../models/admin/productSchema');
const Wishlist = require('../../models/admin/wishList')
const findUser = require('../../helpers/user/getUser');





const calculateCartAmounts = async (cartData) => {
  let subTotal = 0;
  let totalAmount = 0;
  let gstAmount = 0;
  const deliveryCharge = 49;
  const gstPercentage = 14;
  const cutOffMoneyForDeliveryCharge = 1000;
  const offerTypes = new Set();

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return {
      subTotal: 0,
      totalAmount: 0,
      deliveryCharge: 0,
      gstAmount: 0,
      offerTypes: []
    };
  }

  cartData.items.forEach(item => {
    const price = item.productId.offerType && item.productId.offerType !== 'null' && item.productId.finalAmount > 0 
      ? item.productId.finalAmount 
      : item.productId.regularPrice;

    const quantity = item.quantity;
    subTotal += price * quantity;

    if (item.productId.offerType && item.productId.offerType !== 'null' && item.productId.finalAmount > 0) {
      offerTypes.add(item.productId.offerType);
    }
  });

  gstAmount = (subTotal * gstPercentage) / 100;
  totalAmount = subTotal + gstAmount;

  const delivery = subTotal < cutOffMoneyForDeliveryCharge ? deliveryCharge : 0;
  totalAmount += delivery;

  return {
    subTotal,
    totalAmount,
    deliveryCharge: delivery,
    gstAmount,
    offerTypes: Array.from(offerTypes)
  };
};


const getCart = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const cartData = await Cart.findOne({ userId }).populate('items.productId');
    const userData = await findUser.getUserById(req.session.user_id);
    
    const {
      subTotal,
      totalAmount,
      deliveryCharge,
      gstAmount,
      offerTypes
    } = await calculateCartAmounts(cartData); // async call

    res.render('cart', {
      cartData,
      subTotal,
      totalAmount,
      deliveryCharge,
      gstAmount,
      offerTypes,
      user_name:userData.name
    });
  } catch (error) {
    console.log('error during getting the cart page', error);
    res.render('cart', {
      cartData: null,
      subTotal: 0,
      totalAmount: 0,
      deliveryCharge: 0,
      gstAmount: 0,
      offerTypes: [],
      user:userData,
      user_name:userData.name
    });
  }
};


const addToCart = async (req, res) => {
   
    try {
      const productId = req.body.productId;
      const userId = req.session.user_id;
  
    
      const user = await User.findById(userId).populate('cart');
      
      const product = await Product.findById(productId);

        if(product.quantity<1){
          return res.status(404).json({message:"Product Not Available Product Arrive Soom thank you",success:false})
        }
        

      if (!product) {
        return res.status(code.HttpStatus.NOT_FOUND).json({
          message: "Product Not Found",
          success: false
        });
      }
    
      if (product.quantity === 0) {
        return res.status(code.HttpStatus.NOT_FOUND).json({
          message: "Empty Stock. Stock Will Arrive Soon",
          success: false
        });
      }

      await Wishlist.updateOne(
        { userId: userId },
        { $pull: { products: { productId: productId } } }
      );
  
    
      if (!user.cart) {
 
        const newCart = await Cart.create({
          userId: userId,
          items: [{
            productId: productId,
            quantity: 1
          }]
        });
  
        user.cart = newCart._id;
        await user.save();
  
        return res.status(code.HttpStatus.CREATED).json({
          message: "Product added to cart",
          success: true
        });
      }
  
      const existingItem = user.cart.items.find(item =>
        item.productId.toString() === productId
      );

     if (existingItem) {
  if (existingItem.quantity + 1 > product.quantity) {
    return res.status(code.HttpStatus.BAD_REQUEST).json({
      message: `Only ${product.quantity} unit(s) available in stock. You cannot add more.`,
      success: false
    });
  }
}

  
      if (existingItem) {
        if (existingItem.quantity >= 5) {
          return res.status(code.HttpStatus.CONFLICT).json({
            message: "You can only add up to 5 units of this product to your cart.",
            success: false
          });
        }
  
        existingItem.quantity += 1;
      } else {
        user.cart.items.push({
          productId: productId,
          quantity: 1
        });
      }
  
      await user.cart.save();
  
      return res.status(code.HttpStatus.OK).json({
        message: "Cart updated successfully",
        success: true
      });
  
    } catch (error) {
      console.log('Error during adding to the cart:', error);
      return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        success: false
      });
    }
  };
  


module.exports = {
  getCart,
  addToCart,
  calculateCartAmounts
}