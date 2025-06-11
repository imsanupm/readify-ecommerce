const Order = require('../../models/user/order-schema');
const User = require('../../models/user/userSchema');

const moment = require('moment');




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



const loadDashBoard = async (req, res) => {
  try {
    const { filterType, startDate, endDate } = req.query;

    const matchStage = {
      status: 'Delivered'
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);

    if (filterType === 'yearly') {
      matchStage.createdOn = {
        $gte: new Date(now.getFullYear(), 0, 1),
        $lte: now
      };
    } else if (filterType === 'monthly') {
      matchStage.createdOn = {
        $gte: startOfMonth,
        $lte: now
      };
    } else if (filterType === 'weekly') {
      matchStage.createdOn = {
        $gte: startOfWeek,
        $lte: now
      };
    } else if (filterType === 'custom' && startDate && endDate) {
      matchStage.createdOn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(matchStage).populate('userId');

    const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
    const totalSales = orders.length;

    const recentOrders = await Order.find(matchStage)
      .sort({ createdOn: -1 })
      .limit(10)
      .populate('userId');

    let chartData = [];

    if (filterType === 'yearly') {
      chartData = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdOn' },
              month: { $month: '$createdOn' }
            },
            totalAmount: { $sum: '$finalAmount' },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
    } else if (filterType === 'monthly') {
      chartData = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdOn' },
              month: { $month: '$createdOn' },
              week: { $week: '$createdOn' }
            },
            totalAmount: { $sum: '$finalAmount' },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
      ]);
    } else if (filterType === 'weekly' || (filterType === 'custom' && orders.length <= 31)) {
      chartData = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdOn' },
              month: { $month: '$createdOn' },
              day: { $dayOfMonth: '$createdOn' }
            },
            totalAmount: { $sum: '$finalAmount' },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
    }

    res.render('dashboard', {
      totalRevenue,
      totalSales,
      recentOrders,
      chartData,
      filterType: filterType || 'yearly'
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
    loadDashBoard
}









