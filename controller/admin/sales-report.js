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

        console.log('Date Range:', fromDate.toDate(), 'to', toDate.toDate());

        const orders = await Order.find({
            createdOn: { $gte: fromDate.toDate(), $lte: toDate.toDate() },
            status: { $in: 'Delivered' }
        }).populate('userId');

        console.log('Fetched Orders:', orders.length);

        const reportData = orders.map(order => ({
            orderId: order.orderId,
            date: moment(order.createdOn).format('YYYY-MM-DD'),
            customer: order.userData?.name || 'Unknown',
            products: order.orderedItems.map(item => item.productDetails?.name || 'Unnamed Product').join(', '),
            amount: order.totalPrice,
            discount: order.discount || 0,
            coupon: order.couponDetail?.code || null,
            netAmount: order.totalPrice - (order.discount || 0),
            paymentMethod: order.paymentMethod
        }));

        console.log('Report Data:', reportData);

        res.json({ reportData });
    } catch (error) {
        console.error('Error during getSalesReport:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSalesRepor = async (req,res) => {
    try {
        res.render('sales-report');
    } catch (error) {
        console.log('erorr during getSalesRepor');
        
    }
}











module.exports = {
    getSalesReport,
    getSalesRepor
}