const code = require('../../helpers/user/statusCode');
const Order = require('../../models/user/order-schema');
const Product = require('../../models/admin/productSchema');
const Wallet = require('../../models/user/wallet');
const {nanoid} = require('nanoid')
// const specificReturnHandler = async (req, res) => {
//     try {
//         console.log('you are getting call from the right place');
//         const { action, orderId, productId } = req.body;

//         if (!orderId || !productId) {
//             return res.status(400).json({ success: false, message: "Missing orderId or productId" });
//         }

//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//         }

//         const cancelItem = order.orderedItems.find(item => item.product.toString() === productId);
//         if (!cancelItem) {
//             return res.status(404).json({ success: false, message: "Product not found in order" });
//         }

//         const itemTotal = cancelItem.price * cancelItem.quantity;
//         const subtotal = order.totalPrice;           // Before discount
//         const finalAmount = order.finalAmount;       // After discount
//         const couponAmount = order.couponAmount || 0; // Use 0 if not present

//         const adjustedFinalAmount = finalAmount + couponAmount;

//         const productShare = (itemTotal / subtotal) * 100;
//         const discountAmount = subtotal - adjustedFinalAmount;
//         const refundAmount = parseFloat(((discountAmount * productShare) / 100).toFixed(2));

//         const totalReturnAmount = parseFloat((itemTotal - refundAmount).toFixed(2));

//         console.log('subTotal=======', subtotal);
//         console.log('final amount==', finalAmount);
//         console.log('coupon amount==', couponAmount);
//         console.log('adjusted final amount==', adjustedFinalAmount);
//         console.log('refund amount==', totalReturnAmount);

//         // return res.status(200).json({
//         //     success: true,
//         //     message: "Refund amount calculated using discount share",
//         //     itemTotal,
//         //     refundAmount,
//         //     totalReturnAmount
//         // });
//         if (action == "approve") {
//             await specifReturnExicution(totalReturnAmount, order, orderId, productId);
//         }

//         return res.status(200).json({
//     success: true,
//     message: "Specific return approved, amount refunded to wallet",
//     refundAmount: totalReturnAmount
// });



//     } catch (error) {
//         console.log('error during specificReturnHandler====', error);
//         return res.status(500).json({
//             message: "Internal server error, we are working on it",
//             success: false
//         });
//     }
// };

// // Function definition
// const specifReturnExicution = async (totalReturnAmount, order, orderId, productId) => {
//     try {
//         const userId = order.userId;

//         let wallet = await Wallet.findOne({ user: userId });
//         if (!wallet) {
//             wallet = new Wallet({
//                 user: userId,
//                 balance: 0,
//                 transactions: []
//             });
//         }

//         const transaction = {
//             transactionId: nanoid(),
//             type: "credit",
//             amount: totalReturnAmount,
//             description: `Specific return approved via ${order.paymentMethod} for product #${productId} in order #${orderId}`,
//             orderId: orderId,
//             status: "completed",
//         };

//         wallet.balance += totalReturnAmount;
//         wallet.transactions.push(transaction);
//         await wallet.save();

//         const returnedItem = order.orderedItems.find(item => item.product.toString() === productId);
//         if (returnedItem) {
//             const product = await Product.findById(returnedItem.product);
//             if (product) {
//                 product.quantity += returnedItem.quantity;
//                 await product.save();
//             }
//         }
//     } catch (error) {
//         console.log('error during specifReturnExicution====', error);
//         // You can't use res here (it's not available), so just log
//     }
// };




const specificReturnHandler = async (req, res) => {
    try {
        console.log('You are getting call from the right place');
        const { action, orderId, productId } = req.body;

        if (!orderId || !productId) {
            return res.status(400).json({ success: false, message: "Missing orderId or productId" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const cancelItem = order.orderedItems.find(item => item.product.toString() === productId);
        if (!cancelItem) {
            return res.status(404).json({ success: false, message: "Product not found in order" });
        }

        const itemTotal = cancelItem.price * cancelItem.quantity;
        const subtotal = order.totalPrice;
        const finalAmount = order.finalAmount;
        const couponAmount = order.couponAmount || 0;

        const adjustedFinalAmount = finalAmount + couponAmount;
        const productShare = (itemTotal / subtotal) * 100;
        const discountAmount = subtotal - adjustedFinalAmount;
        const refundAmount = parseFloat(((discountAmount * productShare) / 100).toFixed(2));
        const totalReturnAmount = parseFloat((itemTotal - refundAmount).toFixed(2));

        

        if (action === "approve") {
            await specifReturnExicution(totalReturnAmount, order, orderId, productId, cancelItem, itemTotal);
        }

        return res.status(200).json({
            success: true,
            message: "Specific return approved, amount refunded to wallet",
            refundAmount: totalReturnAmount
        });

    } catch (error) {
        console.log('error during specificReturnHandler====', error);
        return res.status(500).json({
            message: "Internal server error, we are working on it",
            success: false
        });
    }
};

const specifReturnExicution = async (totalReturnAmount, order, orderId, productId, cancelItem, itemTotal) => {
    try {
        const userId = order.userId;

        // 1. Refund to wallet
        let wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            wallet = new Wallet({
                user: userId,
                balance: 0,
                transactions: []
            });
        }

        const transaction = {
            transactionId: nanoid(),
            type: "credit",
            amount: totalReturnAmount,
            description: `Specific return approved via ${order.paymentMethod} for product #${productId} in order #${orderId}`,
            orderId,
            status: "completed",
        };

        wallet.balance += totalReturnAmount;
        wallet.transactions.push(transaction);
        await wallet.save();

        // 2. Update product quantity
        const product = await Product.findById(productId);
        if (product) {
            product.quantity += cancelItem.quantity;
            await product.save();
        }

        // 3. Update order item status and totals
        const itemIndex = order.orderedItems.findIndex(item => item.product.toString() === productId);
        if (itemIndex !== -1) {
            order.orderedItems[itemIndex].status = "Returned";
        }

        order.totalPrice = parseFloat((order.totalPrice - itemTotal).toFixed(2));
        order.finalAmount = parseFloat((order.finalAmount - totalReturnAmount).toFixed(2));
        order.totalQuantity -= cancelItem.quantity;

         const allReturned = order.orderedItems.every(item => item.status === "Returned");
        if (allReturned) {
            order.status = "Returned";
        }


        await order.save();

        
    } catch (error) {
        console.log('error during specifReturnExicution====', error);
    }
};

module.exports = {
    specificReturnHandler
};


