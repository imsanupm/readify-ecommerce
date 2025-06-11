const Order = require('../../models/user/order-schema');
const User = require('../../models/user/userSchema');
const Category = require('../../models/admin/category')
const Product = require('../../models/admin/productSchema')




// const loadDashBoard = async (req, res) => {
//     try {
//         let { filterType, startDate, endDate } = req.query;
    
//         const filter = {
//           status: 'Delivered',
//         };
    
//         const now = new Date();
    
//         if (filterType === 'yearly') {
//           const yearStart = new Date(now.getFullYear(), 0, 1);
//           filter.createdOn = { $gte: yearStart, $lte: now };
//         } else if (filterType === 'monthly') {
//           const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//           filter.createdOn = { $gte: monthStart, $lte: now };
//         } else if (filterType === 'weekly') {
//           const weekStart = new Date();
//           weekStart.setDate(now.getDate() - 7);
//           filter.createdOn = { $gte: weekStart, $lte: now };
//         } else if (filterType === 'custom' && startDate && endDate) {
//           filter.createdOn = {
//             $gte: new Date(startDate),
//             $lte: new Date(endDate)
//           };
//         }
    
//         const orders = await Order.find(filter).populate('userId');
    
//         const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
//         const totalSales = orders.length;
    
//         // Chart data for last 7 months
//         const chartData = await Order.aggregate([
//           {
//             $match: {
//               status: 'Delivered',
//               createdOn: {
//                 $gte: new Date(new Date().setMonth(now.getMonth() - 6))
//               }
//             }
//           },
//           {
//             $group: {
//               _id: {
//                 month: { $month: "$createdOn" },
//                 year: { $year: "$createdOn" }
//               },
//               totalAmount: { $sum: "$finalAmount" },
//               totalOrders: { $sum: 1 }
//             }
//           },
//           {
//             $sort: { "_id.year": 1, "_id.month": 1 }
//           }
//         ]);
    
//         // Recent 6 orders
//         const recentOrders = await Order.find({})
//           .sort({ createdOn: -1 })
//           .limit(6)
//           .populate('userId');
//             console.log('total revenue===',totalRevenue,
//                 'totalSales',totalSales,
//                 'chartData',chartData,
//                 'recentOrders',recentOrders
//             );
//             console.log('chartData============',chartData);
            
//         res.render('dashboard', {
//           totalRevenue,
//           totalSales,
//           chartData,
//           recentOrders
//         });
    
//       } catch (error) {
//         console.error("Error in adminDashboard controller:", error);
//         res.status(500).json({ message: "Internal server error" });
//       }
//   };
  



// const loadDashBoard = async (req, res) => {
//   try {
//     let { filterType, startDate, endDate } = req.query;

//     const filter = {
//       status: 'Delivered'
//     };

//     const now = new Date();

//     // Determine date range filter
//     if (filterType === 'yearly') {
//       const yearStart = new Date(now.getFullYear(), 0, 1);
//       filter.createdOn = { $gte: yearStart, $lte: now };
//     } else if (filterType === 'monthly') {
//       const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//       filter.createdOn = { $gte: monthStart, $lte: now };
//     } else if (filterType === 'weekly') {
//       const weekStart = new Date();
//       weekStart.setDate(now.getDate() - 7);
//       filter.createdOn = { $gte: weekStart, $lte: now };
//     } else if (filterType === 'custom' && startDate && endDate) {
//       filter.createdOn = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     // Fetch orders based on filter
//     const orders = await Order.find(filter).populate('userId');

//     const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
//     const totalSales = orders.length;

//     // Build chart data based on filterType
//     let chartData = [];

//     if (filterType === 'weekly') {
//       // Group by day
//       chartData = await Order.aggregate([
//         {
//           $match: {
//             status: 'Delivered',
//             createdOn: filter.createdOn
//           }
//         },
//         {
//           $group: {
//             _id: {
//               day: { $dayOfMonth: "$createdOn" },
//               month: { $month: "$createdOn" },
//               year: { $year: "$createdOn" }
//             },
//             totalAmount: { $sum: "$finalAmount" },
//             totalOrders: { $sum: 1 }
//           }
//         },
//         {
//           $sort: {
//             "_id.year": 1,
//             "_id.month": 1,
//             "_id.day": 1
//           }
//         }
//       ]);
//     } else {
//       // Group by month
//       chartData = await Order.aggregate([
//         {
//           $match: {
//             status: 'Delivered',
//             createdOn: {
//               $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
//             }
//           }
//         },
//         {
//           $group: {
//             _id: {
//               month: { $month: "$createdOn" },
//               year: { $year: "$createdOn" }
//             },
//             totalAmount: { $sum: "$finalAmount" },
//             totalOrders: { $sum: 1 }
//           }
//         },
//         {
//           $sort: {
//             "_id.year": 1,
//             "_id.month": 1
//           }
//         }
//       ]);
//     }

//     // Recent 6 orders
//     const recentOrders = await Order.find({})
//       .sort({ createdOn: -1 })
//       .limit(6)
//       .populate('userId');

//       console.log('custom date==========',startDate,endDate);
      

//     res.render('dashboard', {
//       totalRevenue,
//       totalSales,
//       chartData,
//       recentOrders
//     });

//   } catch (error) {
//     console.error("Error in adminDashboard controller:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



// const loadDashBoard = async (req, res) => {
//   try {
//     let { filterType, startDate, endDate } = req.query;

//     const filter = {
//       status: 'Delivered'
//     };

//     const now = new Date();

//     // Determine date range filter
//     if (filterType === 'yearly') {
//       const yearStart = new Date(now.getFullYear(), 0, 1);
//       filter.createdOn = { $gte: yearStart, $lte: now };
//     } else if (filterType === 'monthly') {
//       const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//       filter.createdOn = { $gte: monthStart, $lte: now };
//     } else if (filterType === 'weekly') {
//       const weekStart = new Date();
//       weekStart.setDate(now.getDate() - 7);
//       filter.createdOn = { $gte: weekStart, $lte: now };
//     } else if (filterType === 'custom' && startDate && endDate) {
//       // Fix: Set end date to end of day to include the entire end date
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999); // Set to end of day
      
//       filter.createdOn = {
//         $gte: start,
//         $lte: end
//       };
//     }

//     // Fetch orders based on filter
//     const orders = await Order.find(filter).populate('userId');

//     const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
//     const totalSales = orders.length;

//     // Build chart data based on filterType
//     let chartData = [];

//     if (filterType === 'weekly') {
//       // Group by day - use the same filter as above
//       chartData = await Order.aggregate([
//         {
//           $match: {
//             status: 'Delivered',
//             createdOn: filter.createdOn // Use the same filter
//           }
//         },
//         {
//           $group: {
//             _id: {
//               day: { $dayOfMonth: "$createdOn" },
//               month: { $month: "$createdOn" },
//               year: { $year: "$createdOn" }
//             },
//             totalAmount: { $sum: "$finalAmount" },
//             totalOrders: { $sum: 1 }
//           }
//         },
//         {
//           $sort: {
//             "_id.year": 1,
//             "_id.month": 1,
//             "_id.day": 1
//           }
//         }
//       ]);
//     } else if (filterType === 'custom' && startDate && endDate) {
//       // Custom date range chart data
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
      
//       // Calculate date difference to decide grouping
//       const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
//       if (daysDiff <= 31) {
//         // Group by day for ranges up to 31 days
//         chartData = await Order.aggregate([
//           {
//             $match: {
//               status: 'Delivered',
//               createdOn: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: {
//                 day: { $dayOfMonth: "$createdOn" },
//                 month: { $month: "$createdOn" },
//                 year: { $year: "$createdOn" }
//               },
//               totalAmount: { $sum: "$finalAmount" },
//               totalOrders: { $sum: 1 }
//             }
//           },
//           {
//             $sort: {
//               "_id.year": 1,
//               "_id.month": 1,
//               "_id.day": 1
//             }
//           }
//         ]);
//       } else {
//         // Group by month for longer ranges
//         chartData = await Order.aggregate([
//           {
//             $match: {
//               status: 'Delivered',
//               createdOn: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: {
//                 month: { $month: "$createdOn" },
//                 year: { $year: "$createdOn" }
//               },
//               totalAmount: { $sum: "$finalAmount" },
//               totalOrders: { $sum: 1 }
//             }
//           },
//           {
//             $sort: {
//               "_id.year": 1,
//               "_id.month": 1
//             }
//           }
//         ]);
//       }
//     } else {
//       // Default: Group by month (last 7 months)
//       chartData = await Order.aggregate([
//         {
//           $match: {
//             status: 'Delivered',
//             createdOn: {
//               $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
//             }
//           }
//         },
//         {
//           $group: {
//             _id: {
//               month: { $month: "$createdOn" },
//               year: { $year: "$createdOn" }
//             },
//             totalAmount: { $sum: "$finalAmount" },
//             totalOrders: { $sum: 1 }
//           }
//         },
//         {
//           $sort: {
//             "_id.year": 1,
//             "_id.month": 1
//           }
//         }
//       ]);
//     }

//     // Recent 6 orders
//     const recentOrders = await Order.find({})
//       .sort({ createdOn: -1 })
//       .limit(6)
//       .populate('userId');

//     console.log('Filter Type:', filterType);
//     console.log('Custom date range:', startDate, 'to', endDate);
//     console.log('Total orders found:', orders.length);
//     console.log('Total revenue:', totalRevenue);
//     console.log('chartDatas=================',chartData);
    

//     res.render('dashboard', {
//       totalRevenue,
//       totalSales,
//       chartData,
//       recentOrders,
//       filterType, // Pass current filter to frontend
//       startDate,  // Pass dates to frontend for form population
//       endDate
//     });

//   } catch (error) {
//     console.error("Error in adminDashboard controller:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



// const loadDashBoard = async (req, res) => {
//   try {
//     const { filterType, startDate, endDate } = req.query;

//     const matchStage = {
//       status: 'Delivered'
//     };

//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfWeek = new Date(now);
//     startOfWeek.setDate(now.getDate() - 6);

//     if (filterType === 'yearly') {
//       matchStage.createdOn = {
//         $gte: new Date(now.getFullYear(), 0, 1),
//         $lte: now
//       };
//     } else if (filterType === 'monthly') {
//       matchStage.createdOn = {
//         $gte: startOfMonth,
//         $lte: now
//       };
//     } else if (filterType === 'weekly') {
//       matchStage.createdOn = {
//         $gte: startOfWeek,
//         $lte: now
//       };
//     } else if (filterType === 'custom' && startDate && endDate) {
//       matchStage.createdOn = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     const orders = await Order.find(matchStage).populate('userId');

//     const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
//     const totalSales = orders.length;

//     const recentOrders = await Order.find(matchStage)
//       .sort({ createdOn: -1 })
//       .limit(10)
//       .populate('userId');

//     let chartData = [];

//     if (filterType === 'yearly') {
//       chartData = await Order.aggregate([
//         { $match: matchStage },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdOn' },
//               month: { $month: '$createdOn' }
//             },
//             totalAmount: { $sum: '$finalAmount' },
//             totalOrders: { $sum: 1 }
//           }
//         },
//         { $sort: { '_id.year': 1, '_id.month': 1 } }
//       ]);
//     } else if (filterType === 'monthly') {
//       chartData = await Order.aggregate([
//         { $match: matchStage },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdOn' },
//               month: { $month: '$createdOn' },
//               week: { $week: '$createdOn' }
//             },
//             totalAmount: { $sum: '$finalAmount' },
//             totalOrders: { $sum: 1 }
//           }
//         },
//         { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
//       ]);
//     } else if (filterType === 'weekly' || (filterType === 'custom' && orders.length <= 31)) {
//       chartData = await Order.aggregate([
//         { $match: matchStage },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdOn' },
//               month: { $month: '$createdOn' },
//               day: { $dayOfMonth: '$createdOn' }
//             },
//             totalAmount: { $sum: '$finalAmount' },
//             totalOrders: { $sum: 1 }
//           }
//         },
//         { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
//       ]);
//     }

//     res.render('dashboard', {
//       totalRevenue,
//       totalSales,
//       recentOrders,
//       chartData,
//       filterType: filterType || 'yearly'
//     });
//   } catch (err) {
//     console.error('Error loading dashboard:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };






  

// module.exports = {
//     loadDashBoard
// }




const adminController = {
    // Render dashboard page
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

    // Get dashboard analytics data
    getDashboardData: async (req, res) => {
        try {
            console.log('Dashboard API called with filter:', req.query.filter);
            const { filter = 'monthly' } = req.query;
            
            // Get date range based on filter
            const dateRange = getDateRange(filter);
            console.log('Date range:', dateRange);
            
            // Get all data in parallel for better performance
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

// Helper function to get date range based on filter
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
                    status: { $ne: 'Cancelled' } // Fixed: Use $ne instead of $nin for single value
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

// Format sales data for chart display
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

// Get top 5 best selling products with product details
async function getTopProducts() {
    try {
        console.log('Fetching top 5 products');
        
        const topProducts = await Order.aggregate([
            { $unwind: '$orderedItems' },
            {
                $match: {
                    'orderedItems.status': { $ne: 'Cancelled' } // Fixed: Use $ne instead of $nin
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

        // Get additional product details from Product collection
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
        
        console.log('Top products fetched:', enrichedProducts.length);
        return enrichedProducts;
    } catch (error) {
        console.error('Error getting top products:', error);
        return [];
    }
}

// Get top 5 best selling categories with category details
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
