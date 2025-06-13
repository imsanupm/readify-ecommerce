const code = require('../../helpers/user/statusCode');
const Product = require('../../models/admin/productSchema');
const Order = require('../../models/user/order-schema');



const specificCancel = async (req, res) => {
    try {
        console.log('from specifReturn =====');

        const { orderId, productId } = req.body
        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Internal Server Error" })
        }
        
       
        if (order.paymentMethod == 'cod') {
            return await specifCancelCOD(req, res, order, productId)
        }

        return
    } catch (error) {
        console.log('error during specifCancelCOD', error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server ", success: false });
    }
}
// const specifCancelCOD = async (req, res, order, productId) => {
//     try {
//          const product = await Product.findById(productId)
          
//          const cancelItem = order.orderedItems.find((item) => item.product.toString() === productId);
        
//           const productQuantity  = cancelItem.quantity;
//           const couponAmount = order.couponAmount
//           const cancelItemFinalAmont = order.finalAmount;
//           const couponPerProduct = couponAmount/order.totalQuantity
//           const productTotalamount = product.finalAmount +(productQuantity*couponPerProduct);
//           orderedItems.finalAmount - productTotalamount
//           product.quantity +=productQuantity
//           await product.save();
//           await order.save()
//         return
//     } catch (error) {
//         console.log('error during specifCancelCOD', error);
//         res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error please Try again", success: false })
//     }
// }


// const specifCancelCOD = async (req, res, order, productId) => {
//     try {
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Product not found", success: false });
//         }

//         const cancelItem = order.orderedItems.find((item) => item.product.toString() === productId);
//         if (!cancelItem) {
//             return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Item not found in order", success: false });
//         }

//         if (cancelItem.status === 'Cancelled') {
//             return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Item already cancelled", success: false });
//         }

//         if (cancelItem.status === 'Delivered') {
//             return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Cannot cancel delivered item", success: false });
//         }

//         if (order.status === 'Cancelled') {
//             return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Order already cancelled", success: false });
//         }

//         const productQuantity = cancelItem.quantity;
//         const couponAmount = order.couponAmount || 0;
//         const totalQuantity = order.totalQuantity || 1;
//         const couponPerProduct = couponAmount > 0 ? couponAmount / totalQuantity : 0;
//       // const refundAmount = (product.finalAmount * productQuantity) + (couponPerProduct * productQuantity);
//        const refundAmount = (cancelItem.price * productQuantity) + (couponPerProduct * productQuantity);
         
          
//         console.log('productQantity:',productQuantity,
//                     "couponAmount:",couponAmount,
//                     'totalQuantity:',totalQuantity,
//                     "couponPerProudct:",couponPerProduct,
//                     "refundAmont:",refundAmount
//         );
        
//         // 1. Update item status
//         cancelItem.status = 'Cancelled';
//         cancelItem.cancelledAt = new Date();

//         // 2. Update order fields
//         order.finalAmount = Math.max(0, order.finalAmount - refundAmount);
//         order.totalQuantity = Math.max(0, order.totalQuantity - productQuantity);
//          console.log('refundAmount========',refundAmount);
//          console.log('order.finalAmount====',order.finalAmount)
//         // 3. Restore product stock
//         product.quantity += productQuantity;
//         await product.save();

//         // 4. Auto-cancel order if all items are cancelled
//         const allItemsCancelled = order.orderedItems.every(item => item.status === 'Cancelled');
//         if (allItemsCancelled) {
//             order.status = 'Cancelled';
//             order.cancellationDate = new Date();
//             order.cancellationReason = 'All items cancelled by user';
//         }

//        const saveOrder =  await order.save();
//          // console.log('saveorder ',saveOrder);
          
//         return res.status(code.HttpStatus.OK).json({ message: "Item cancelled successfully", success: true });

//     } catch (error) {
//         console.log('error during specifCancelCOD', error);
//         res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error. Please try again.", success: false });
//     }
// };
// const specifCancelCOD = async (req, res, order, productId) => {
//     try {
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Product not found", success: false });
//         }

//         const cancelItem = order.orderedItems.find((item) => item.product.toString() === productId);
//         if (!cancelItem) {
//             return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Item not found in order", success: false });
//         }

//         if (cancelItem.status === 'Cancelled') {
//             return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Item already cancelled", success: false });
//         }

//         if (cancelItem.status === 'Delivered') {
//             return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Cannot cancel delivered item", success: false });
//         }

//         if (order.status === 'Cancelled') {
//             return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Order already cancelled", success: false });
//         }

//         const productQuantity = cancelItem.quantity;
//         const itemPrice = cancelItem.price; // Use stored item price
//         const totalQuantity = order.totalQuantity || 1;

//         // Coupon amount per product if applied
//         let couponPerProduct = 0;
//         if (order.couponApplied && order.couponAmount > 0) {
//             couponPerProduct = order.couponAmount / totalQuantity;
//         }

//         const refundAmount = (itemPrice * productQuantity) + (couponPerProduct * productQuantity);

//         console.log('productQuantity:', productQuantity,
//             "itemPrice:", itemPrice,
//             "couponPerProduct:", couponPerProduct,
//             "refundAmount:", refundAmount
//         );

//         // 1. Update item status
//         cancelItem.status = 'Cancelled';
//         cancelItem.cancelledAt = new Date();

//         // 2. Update order fields
//         order.finalAmount = Math.max(0, order.finalAmount - refundAmount);
//         order.totalQuantity = Math.max(0, order.totalQuantity - productQuantity);

//         // 3. Restore product stock
//         product.quantity += productQuantity;
//         await product.save();

//         // 4. Auto-cancel order if all items are cancelled
//         const allItemsCancelled = order.orderedItems.every(item => item.status === 'Cancelled');
//         if (allItemsCancelled) {
//             order.status = 'Cancelled';
//             order.cancellationDate = new Date();
//             order.cancellationReason = 'All items cancelled by user';
//         }

//         await order.save();
//          console.log('orderData===========',order);
         
//         return res.status(code.HttpStatus.OK).json({ message: "Item cancelled successfully", success: true });

//     } catch (error) {
//         console.log('error during specifCancelCOD', error);
//         res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error. Please try again.", success: false });
//     }
// };



const specifCancelCOD = async (req, res, order, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Product not found", success: false });
    }

    const cancelItem = order.orderedItems.find((item) => item.product.toString() === productId);
    if (!cancelItem) {
      return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Item not found in order", success: false });
    }

    if (cancelItem.status === 'Cancelled') {
      return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Item already cancelled", success: false });
    }

    if (cancelItem.status === 'Delivered') {
      return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Cannot cancel delivered item", success: false });
    }

    if (order.status === 'Cancelled') {
      return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Order already cancelled", success: false });
    }

    const productQuantity = cancelItem.quantity;
    const itemPrice = cancelItem.price;

    const itemTotal = itemPrice * productQuantity; // only base amount, no tax/coupon
    const totalQuantity = order.totalQuantity || 1;

    // Per-product coupon share (if any)
    let couponPerProduct = 0;
    if (order.couponApplied && order.couponAmount > 0) {
      couponPerProduct = order.couponAmount / totalQuantity;
    }

    const refundAmount = itemTotal + (couponPerProduct * productQuantity); // full deduction for finalAmount

    // 1. Update item status
    cancelItem.status = 'Cancelled';
    cancelItem.cancelledAt = new Date();

    // 2. Update order fields
    order.finalAmount = Math.max(0, order.finalAmount - refundAmount); // with coupon
    order.totalPrice = Math.max(0, order.totalPrice - itemTotal); // only base value
    order.totalQuantity = Math.max(0, order.totalQuantity - productQuantity);

    // 3. Restore stock
    product.quantity += productQuantity;
    await product.save();

    // 4. Cancel order if all items are cancelled
    const allItemsCancelled = order.orderedItems.every(item => item.status === 'Cancelled');
    if (allItemsCancelled) {
      order.status = 'Cancelled';
      order.cancellationDate = new Date();
      order.cancellationReason = 'All items cancelled by user';
    }

    await order.save();

    return res.status(code.HttpStatus.OK).json({ message: "Item cancelled successfully", success: true });

  } catch (error) {
    console.log('error during specifCancelCOD', error);
    res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error. Please try again.", success: false });
  }
};




// const specifCancelCOD = async (req, res, order, productId) => {
//   try {
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Product not found", success: false });
//     }

//     const cancelItem = order.orderedItems.find(item => item.product.toString() === productId);
//     if (!cancelItem) {
//       return res.status(code.HttpStatus.NOT_FOUND).json({ message: "Item not found in order", success: false });
//     }

//     if (cancelItem.status === 'Cancelled') {
//       return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Item already cancelled", success: false });
//     }

//     if (cancelItem.status === 'Delivered') {
//       return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Cannot cancel delivered item", success: false });
//     }

//     if (order.status === 'Cancelled') {
//       return res.status(code.HttpStatus.BAD_REQUEST).json({ message: "Order already cancelled", success: false });
//     }

//     const productQuantity = cancelItem.quantity;
//     const itemPrice = cancelItem.price;

//     // Coupon per product if applied
//     let couponPerProduct = 0;
//     if (order.couponApplied && order.couponAmount > 0 && order.totalQuantity > 0) {
//       couponPerProduct = order.couponAmount / order.totalQuantity;
//     }

//     const itemSubTotal = itemPrice * productQuantity;
//     const itemDiscount = couponPerProduct * productQuantity;
//     const gstRate = 0.14;
//     const itemGst = itemSubTotal * gstRate;
//     const itemFinalAmount = itemSubTotal + itemGst - itemDiscount;

//     // Update item status
//     cancelItem.status = 'Cancelled';
//     cancelItem.cancelledAt = new Date();

//     // Update order-level fields
//     order.finalAmount = Math.max(0, order.finalAmount - itemFinalAmount);
//     order.totalPrice = Math.max(0, order.totalPrice - itemSubTotal);
//     order.totalQuantity = Math.max(0, order.totalQuantity - productQuantity);
//     order.couponAmount = Math.max(0, order.couponAmount - itemDiscount);

//     // Restore product stock
//     product.quantity += productQuantity;
//     await product.save();

//     // Auto-cancel if all items are cancelled
//     const allItemsCancelled = order.orderedItems.every(item => item.status === 'Cancelled');
//     if (allItemsCancelled) {
//       order.status = 'Cancelled';
//       order.cancellationDate = new Date();
//       order.cancellationReason = 'All items cancelled by user';
//       order.finalAmount = 0;
//       order.totalPrice = 0;
//       order.couponAmount = 0;
//       order.shippingCharge = 0;
//     }

//     await order.save();

//     return res.status(code.HttpStatus.OK).json({ message: "Item cancelled successfully", success: true });

//   } catch (error) {
//     console.log('error during specifCancelCOD', error);
//     return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error. Please try again.", success: false });
//   }
// };

module.exports = {
    specificCancel
}