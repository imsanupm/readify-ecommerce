const Order = require('../../models/user/order-schema');
const User = require('../../models/user/userSchema');
const Category = require('../../models/admin/category')
const Product = require('../../models/admin/productSchema')









const adminController = {
   
    getDashboard: async (req, res) => {
        try {
            console.log('Rendering admin dashboard page');
            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                page: 'dashboard'
            });
        } catch (error) {
            console.error('Error rendering dashboard:', error);
            res.status(500).render('error', { 
                message: 'Error loading dashboard',
                error: error 
            });
        }
    },

   
    getDashboardData: async (req, res) => {
        try {
            console.log('Dashboard API called with filter:', req.query.filter);
            const { filter = 'monthly' } = req.query;
            
           
            const dateRange = getDateRange(filter);
            console.log('Date range:', dateRange);
            
            
            const [salesData, topProducts, topCategories, stats] = await Promise.all([
                getSalesData(filter, dateRange),
                getTopProducts(),
                getTopCategories(),
                getDashboardStats(dateRange)
            ]);
            
            console.log('Data fetched successfully');
            console.log('Sales data points:', salesData.length);
            console.log('Top products:', topProducts.length);
            console.log('Top categories:', topCategories.length);
            
            const responseData = {
                success: true,
                salesData,
                topProducts,
                topCategories,
                stats,
                filter
            };
            
            res.json(responseData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal Server Error',
                message: error.message 
            });
        }
    }
};


function getDateRange(filter) {
    const now = new Date();
    let startDate, endDate = new Date(now);
    
    switch (filter) {
        case 'daily':
            // Last 30 days
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
            break;
        case 'weekly':
            // Last 12 weeks
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 84);
            break;
        case 'monthly':
            // Last 12 months
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
            break;
        case 'yearly':
            // Last 5 years
            startDate = new Date(now.getFullYear() - 5, 0, 1);
            break;
        default:
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    }
    
    return { startDate, endDate };
}

// Get sales data for chart based on filter
async function getSalesData(filter, dateRange) {
    try {
        console.log('Fetching sales data for filter:', filter);
        
        let groupBy, dateFormat;
        
        switch (filter) {
            case 'daily':
                groupBy = {
                    year: { $year: '$createdOn' },
                    month: { $month: '$createdOn' },
                    day: { $dayOfMonth: '$createdOn' }
                };
                dateFormat = 'daily';
                break;
            case 'weekly':
                groupBy = {
                    year: { $year: '$createdOn' },
                    week: { $week: '$createdOn' }
                };
                dateFormat = 'weekly';
                break;
            case 'monthly':
                groupBy = {
                    year: { $year: '$createdOn' },
                    month: { $month: '$createdOn' }
                };
                dateFormat = 'monthly';
                break;
            case 'yearly':
                groupBy = {
                    year: { $year: '$createdOn' }
                };
                dateFormat = 'yearly';
                break;
            default:
                groupBy = {
                    year: { $year: '$createdOn' },
                    month: { $month: '$createdOn' }
                };
                dateFormat = 'monthly';
        }
        
        const salesData = await Order.aggregate([
            {
                $match: {
                    createdOn: {
                        $gte: dateRange.startDate,
                        $lte: dateRange.endDate
                    },
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: '$finalAmount' },
                    totalOrders: { $sum: 1 },
                    totalQuantity: { $sum: '$totalQuantity' },
                    averageOrderValue: { $avg: '$finalAmount' }
                }
            },
            {
                $sort: { 
                    '_id.year': 1, 
                    '_id.month': 1, 
                    '_id.day': 1, 
                    '_id.week': 1 
                }
            }
        ]);
        
        console.log('Raw sales data points:', salesData.length);
        return formatSalesData(salesData, dateFormat);
    } catch (error) {
        console.error('Error getting sales data:', error);
        return [];
    }
}


function formatSalesData(data, format) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return data.map(item => {
        let label;
        switch (format) {
            case 'daily':
                label = `${item._id.day}/${item._id.month}/${item._id.year}`;
                break;
            case 'weekly':
                label = `W${item._id.week} ${item._id.year}`;
                break;
            case 'monthly':
                label = `${months[item._id.month - 1]} ${item._id.year}`;
                break;
            case 'yearly':
                label = item._id.year.toString();
                break;
            default:
                label = `${months[item._id.month - 1]} ${item._id.year}`;
        }
        
        return {
            label,
            sales: Math.round(item.totalSales || 0),
            orders: item.totalOrders || 0,
            quantity: item.totalQuantity || 0,
            averageOrderValue: Math.round(item.averageOrderValue || 0)
        };
    });
}


async function getTopProducts() {
    try {
        console.log('Fetching top 5 products');
        
        const topProducts = await Order.aggregate([
            { $unwind: '$orderedItems' },
            {
                $match: {
                    'orderedItems.status': { $ne: 'Cancelled' } 
                }
            },
            {
                $group: {
                    _id: '$orderedItems.product',
                    productName: { $first: '$orderedItems.productDetails.name' },
                    productImage: { $first: { $arrayElemAt: ['$orderedItems.productDetails.images', 0] } },
                    brand: { $first: '$orderedItems.productDetails.brand' },
                    category: { $first: '$orderedItems.productDetails.category' },
                    totalQuantity: { $sum: '$orderedItems.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$orderedItems.quantity', '$orderedItems.price'] } },
                    totalOrders: { $sum: 1 },
                    averagePrice: { $avg: '$orderedItems.price' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

     
        const enrichedProducts = await Promise.all(
            topProducts.map(async (product) => {
                try {
                    const productDetails = await Product.findById(product._id)
                        .populate('category', 'name')
                        .lean();
                    
                    return {
                        ...product,
                        productName: product.productName || productDetails?.productTitle || 'Unknown Product',
                        productImage: product.productImage || (productDetails?.productImage?.[0]) || '/images/no-image.jpg',
                        brand: product.brand || productDetails?.authorName || 'Unknown Brand',
                        category: productDetails?.category?.name || 'Unknown Category', // Fixed: Get actual category name
                        regularPrice: productDetails?.regularPrice || 0,
                        status: productDetails?.status || 'Unknown'
                    };
                } catch (err) {
                    console.error('Error enriching product:', err);
                    return {
                        ...product,
                        productName: product.productName || 'Unknown Product',
                        productImage: '/images/no-image.jpg',
                        brand: 'Unknown Brand',
                        category: 'Unknown Category'
                    };
                }
            })
        );
        

        return enrichedProducts;
    } catch (error) {
        console.error('Error getting top products:', error);
        return [];
    }
}


async function getTopCategories() {
    try {
        console.log('Fetching top 5 categories');
        
        // First, get category data from orders
        const categoryData = await Order.aggregate([
            { $unwind: '$orderedItems' },
            {
                $match: {
                    'orderedItems.status': { $ne: 'Cancelled' } // Fixed: Use $ne instead of $nin
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderedItems.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productInfo.category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $group: {
                    _id: '$categoryInfo._id',
                    categoryName: { $first: '$categoryInfo.name' },
                    description: { $first: '$categoryInfo.description' },
                    isListed: { $first: '$categoryInfo.isListed' },
                    categoryOffer: { $first: '$categoryInfo.categoryOffer' },
                    totalQuantity: { $sum: '$orderedItems.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$orderedItems.quantity', '$orderedItems.price'] } },
                    totalOrders: { $sum: 1 },
                    uniqueProducts: { $addToSet: '$orderedItems.product' },
                    averageOrderValue: { $avg: { $multiply: ['$orderedItems.quantity', '$orderedItems.price'] } }
                }
            },
            {
                $addFields: {
                    productCount: { $size: '$uniqueProducts' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);
        
        console.log('Top categories fetched:', categoryData.length);
        return categoryData;
    } catch (error) {
        console.error('Error getting top categories:', error);
        return [];
    }
}

// Get dashboard summary statistics - FIXED VERSION
async function getDashboardStats(dateRange) {
    try {
        console.log('Fetching dashboard statistics');
        
        const stats = await Order.aggregate([
            {
                $match: {
                    createdOn: {
                        $gte: dateRange.startDate,
                        $lte: dateRange.endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $ne: ['$status', 'Cancelled'] }, // Fixed: Use $ne instead of $nin
                                '$finalAmount',
                                0
                            ]
                        }
                    },
                    totalOrders: { $sum: 1 },
                    completedOrders: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0]
                        }
                    },
                    cancelledOrders: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0]
                        }
                    },
                    pendingOrders: {
                        $sum: {
                            $cond: [
                                { 
                                    $or: [
                                        { $eq: ['$status', 'Pending'] },
                                        { $eq: ['$status', 'Processing'] }
                                    ]
                                }, 
                                1, 
                                0
                            ]
                        }
                    },
                    averageOrderValue: {
                        $avg: {
                            $cond: [
                                { $ne: ['$status', 'Cancelled'] }, // Fixed: Use $ne instead of $nin
                                '$finalAmount',
                                null
                            ]
                        }
                    },
                    totalDiscount: { $sum: '$discount' },
                    totalCouponAmount: { $sum: '$couponAmount' }
                }
            }
        ]);
        
        const result = stats[0] || {
            totalRevenue: 0,
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
            pendingOrders: 0,
            averageOrderValue: 0,
            totalDiscount: 0,
            totalCouponAmount: 0
        };
        
        // Calculate additional metrics
        result.completionRate = result.totalOrders > 0 ? 
            Math.round((result.completedOrders / result.totalOrders) * 100) : 0;
        result.cancellationRate = result.totalOrders > 0 ? 
            Math.round((result.cancelledOrders / result.totalOrders) * 100) : 0;
        
        console.log('Dashboard stats calculated:', result);
        return result;
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return {
            totalRevenue: 0,
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
            pendingOrders: 0,
            averageOrderValue: 0,
            completionRate: 0,
            cancellationRate: 0,
            totalDiscount: 0,
            totalCouponAmount: 0
        };
    }
}

module.exports ={adminController} ;
