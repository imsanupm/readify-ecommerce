const Order = require("../../models/user/order-schema");
const User = require('../../models/user/userSchema')

// const getOrderListPage = async (req,res) => {
//     try {
      
//         const orderData = await Order.find({}).sort({createdOn:-1})
//         if(!orderData){
//             return res.json({message:"cannot find the orderData"});

//         }
       
//          res.render('list-order',{
//             orderData:orderData
//          });
//          return
//     } catch (error) {
//         console.log('error during getOrderListPage',error);
//     }
// }



const getOrderListPage = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10; // orders per page
      const skip = (page - 1) * limit;
  
      const totalOrders = await Order.countDocuments({});
      const totalPages = Math.ceil(totalOrders / limit);
  
      const orderData = await Order.find({})
        .sort({ createdOn: -1 })
        .skip(skip)
        .limit(limit);
  
      if (!orderData) {
        return res.json({ message: "Cannot find the orderData" });
      }
  
      // Prepare pagination links
      const paginationLinks = [];
      for (let i = 1; i <= totalPages; i++) {
        paginationLinks.push({
          number: i,
          isActive: i === page,
        });
      }
  
      res.render('list-order', {
        orderData,
        currentPage: page,
        totalPages,
        paginationLinks,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
      });
    } catch (error) {
      console.log('error during getOrderListPage', error);
      res.sendStatus(500);
    }
  };
  

const orderDetailPage = async (req,res) => {
    try {
        const userId = req.session.user_id;
        const orderId = req.params.IdOrder;
        const gstPercentage = 14;
        const cutOfDeliveryAmount = 1000;
        const deliveryChargeAmount = 49;
        const orderData = await Order.findOne({_id:orderId}); 
      


        let subTotal = 0;
        orderData.orderedItems.forEach((items)=>{
            subTotal += items.price * items.quantity;
        })
         let totalAmount = subTotal;
         if(subTotal<cutOfDeliveryAmount){
            totalAmount+=deliveryChargeAmount;
         }
         const gst = (subTotal*gstPercentage)/100;
         totalAmount+=gst;

        
        res.render('order-detail-admin',{
            order:orderData,
            subTotal: subTotal.toFixed(2),
            gstAmount: gst.toFixed(2),
            deliveryCharge: deliveryChargeAmount.toFixed(2),
            totalPrice: totalAmount.toFixed(2)
        });

        return
    } catch (error) {
        console.log('error during getOrderListPage',error)
    }
    
}

module.exports = {
    getOrderListPage,
    orderDetailPage
}