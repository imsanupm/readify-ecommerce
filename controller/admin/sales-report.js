const moment = require('moment');
const Order = require('../../models/user/order-schema');

const getSalesReport = async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;
        let fromDate, toDate;

        const now = moment().endOf('day');

        switch (period) {
            case 'today':
                fromDate = moment().startOf('day');
                toDate = moment().endOf('day');
                break;
            case 'week':
                fromDate = moment().startOf('week');
                toDate = now;
                break;
            case 'month':
                fromDate = moment().startOf('month');
                toDate = now;
                break;
            case 'year':
                fromDate = moment().startOf('year');
                toDate = now;
                break;
            case 'custom':
                if (!startDate || !endDate) {
                    return res.status(400).json({ message: 'Start and End date required for custom period' });
                }
                fromDate = moment(startDate).startOf('day');
                toDate = moment(endDate).endOf('day');
                break;
            default:
                return res.status(400).json({ message: 'Invalid period value' });
        }

      

        const orders = await Order.find({
            createdOn: { $gte: fromDate.toDate(), $lte: toDate.toDate() },
            status: { $in: 'Delivered' }
        }).populate('userId');

    

        const reportData = orders.map(order => ({
            orderId: order.orderId,
            date: moment(order.createdOn).format('YYYY-MM-DD'),
            customer: order.userData?.name || 'Unknown',
            products: order.orderedItems.map(item => item.productDetails?.name || 'Unnamed Product').join(', '),
            amount: order.totalPrice,
            discount:  Number((order.totalPrice - order.finalAmount).toFixed(2)),
            coupon: order.couponDetail?.code || null,
            netAmount: order.finalAmount|| 0,
            paymentMethod: order.paymentMethod,
            
        }));

  

        res.json({ reportData });
    } catch (error) {
        console.error('Error during getSalesReport:', error);
        
    }
};

const getSalesRepor = async (req,res) => {
    try {
        const result = await Order.aggregate([
            {
              $match: { status: 'Delivered' } // Only delivered orders
            },
            {
              $group: {
                _id: null,
                totalSalesCount: { $sum: 1 },
                totalOrderAmount: { $sum: '$finalAmount' },
                totalDiscount: { $sum: { $subtract: ['$totalPrice', '$finalAmount'] } }
              }
            }
          ]);
      
          if (result.length === 0) {
            return res.status(200).json({
              totalSalesCount: 0,
              totalOrderAmount: 0,
              totalDiscount: 0
            });
          }
      
          const { totalSalesCount, totalOrderAmount, totalDiscount } = result[0];
      
          console.log('==============');
          
        res.render(
            'sales-report',
            {
                totalSalesCount,
                totalOrderAmount,
                totalDiscount
              }
        );
    } catch (error) {
        console.log('erorr during getSalesRepor');
        
    }
}











module.exports = {
    getSalesReport,
    getSalesRepor
}