const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/admin/adminSignup')
const adminDashBoard = require('../controller/admin/dashboard')
const adminUserList = require('../controller/admin/userList');
const adminCategory = require('../controller/admin/category');
const productController = require('../controller/admin/product');
const authMiddleware = require('../middlewares/admin/adminAuth')
const uploads = require('../helpers/multer')
const updateValidation = require('../validators/admin/update-product');
const listPage = require('../controller/admin/listOrder-orderDetail');
const updateStatus = require('../controller/admin/order-status');
const specificReturn = require('../controller/admin/sepecifc-return');
const orderReturn = require('../controller/admin/return-order');
const coupen = require('../controller/admin/coupneGet')
const updateCoupenValidate = require('../validators/admin/updateCoupen')
const saleReport = require('../controller/admin/sales-report');


adminRouter.get('/adminlogin',authMiddleware.isUserLoggedOut, adminController.loadLogin);
adminRouter.post('/adminlogin',adminController.verifyAdmin);
adminRouter.get('/logout',adminController.logout)


adminRouter.get('/dashboard',authMiddleware.adminAuth,adminDashBoard.adminController.getDashboard);
adminRouter.get('/api/dashboard-data',adminDashBoard.adminController.getDashboardData)
//user management
adminRouter.get('/userList',authMiddleware.adminAuth,adminUserList.loadUserList);
adminRouter.post("/toggle-status", adminUserList.toggleUserStatus);
//category management
adminRouter.get('/category',authMiddleware.adminAuth,adminCategory.categoryInfo);
adminRouter.post('/addCategory',adminCategory.addCategory);
adminRouter.post('/updateCategory/:categoryId',adminCategory.updateCategory)
adminRouter.put('/category/toggle/:id',adminCategory.catagoryStatus)
adminRouter.get('/search-category',authMiddleware.adminAuth,adminCategory.searchCategory);
//Product management
adminRouter.get('/addProducts',authMiddleware.adminAuth,productController.getProductaddPage);
adminRouter.post('/addProducts',uploads.array('productImages',10),productController.addProduct);
adminRouter.get('/listProducts',authMiddleware.adminAuth,productController.listProduct)
adminRouter.patch('/blockUnblockProduct/toggle-block/:id',productController.blockUnblockProduct)
adminRouter.get('/searchProduct',authMiddleware.adminAuth,productController.searchUser)
adminRouter.get('/editProduct/:id',authMiddleware.adminAuth,productController.getProductEdit);
adminRouter.post('/edit-product/:id', uploads.array('productImages', 10) ,updateValidation.validateProductEdit, productController.editProduct);
adminRouter.delete('/remove-image/:id',productController.removeProductImage)


//order management
adminRouter.get('/listOrder',authMiddleware.adminAuth,listPage.getOrderListPage)
adminRouter.get('/orderDetail/:IdOrder',authMiddleware.adminAuth,listPage.orderDetailPage);
//update order
adminRouter.patch('/update-status/:orderId', updateStatus.updateStatus);
//adminRouter.patch('/return-order/:orderId',specificReturn.returnOrder);

//return approvel
adminRouter.patch('/returns/approve/:id', orderReturn.approveReturn);
adminRouter.patch('/deny-return', orderReturn.denyReturn);
//specific return

//coupen management
adminRouter.get('/admin/coupenManagement',authMiddleware.adminAuth,coupen.getCoupenPage)
adminRouter.post('/add-coupons',coupen.addCoupen);
adminRouter.put('/updateCoupen/:coupenId',updateCoupenValidate.validateCouponUpdate,coupen.updateCoupen)
adminRouter.put('/coupons/:couponCode/toggle',coupen.coupenStatus);
adminRouter.delete('/coupons/:couponCode', coupen.deleteCoupon);


//sales report
adminRouter.get('/sales-summary',authMiddleware.adminAuth,saleReport.salesSummary)
adminRouter.get('/report',authMiddleware.adminAuth,saleReport.getSalesRepor)





adminRouter.post('/individual-return-action' , specificReturn.specificReturnHandler  )





module.exports= adminRouter;

                                                          





