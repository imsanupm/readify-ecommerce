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



adminRouter.get('/adminlogin',authMiddleware.isUserLoggedOut, adminController.loadLogin);
adminRouter.post('/adminlogin',adminController.verifyAdmin);
adminRouter.get('/logout',adminController.logout)
adminRouter.get('/dashboard',authMiddleware.adminAuth,adminDashBoard.loadDashBoard);
//user management
adminRouter.get('/userList',authMiddleware.adminAuth,adminUserList.loadUserList);
adminRouter.post("/toggle-status", adminUserList.toggleUserStatus);
//category management
adminRouter.get('/category',adminCategory.categoryInfo);
adminRouter.post('/addCategory',adminCategory.addCategory);
adminRouter.post('/updateCategory/:categoryId',adminCategory.updateCategory)
adminRouter.put('/category/toggle/:id',adminCategory.catagoryStatus)
adminRouter.get('/search-category',adminCategory.searchCategory);
//Product management
adminRouter.get('/addProducts',productController.getProductaddPage);
adminRouter.post('/addProducts',uploads.array('productImages',10),productController.addProduct);
adminRouter.get('/listProducts',productController.listProduct)
adminRouter.patch('/blockUnblockProduct/toggle-block/:id',productController.blockUnblockProduct)
adminRouter.get('/searchProduct',productController.searchUser)
adminRouter.get('/editProduct/:id',productController.getProductEdit);
adminRouter.post('/edit-product/:id', uploads.array('productImages', 10) ,updateValidation.validateProductEdit, productController.editProduct);
adminRouter.delete('/remove-image/:id',productController.removeProductImage)
// adminRouter.put('/updateImg',uploads.array("productImages",10),productController.updateImg)

//order management
adminRouter.get('/listOrder',listPage.getOrderListPage)
adminRouter.get('/orderDetail/:IdOrder',listPage.orderDetailPage);
//update order
adminRouter.patch('/update-status/:orderId', updateStatus.updateStatus);
adminRouter.patch('/return-order/:orderId',specificReturn.returnOrder);

//return approvel
adminRouter.patch('/returns/approve/:id', orderReturn.approveReturn);

//coupen management
adminRouter.get('/coupenManagement',coupen.getCoupenPage)
adminRouter.post('/addCoupens',coupen.addCoupen);
adminRouter.put('/updateCoupen/:coupenId',updateCoupenValidate.validateCouponUpdate,coupen.updateCoupen)
adminRouter.put('/coupons/:couponCode/toggle',coupen.coupenStatus);
adminRouter.delete('/coupons/:couponCode', coupen.deleteCoupon);

module.exports= adminRouter;







