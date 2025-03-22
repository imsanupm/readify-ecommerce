const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/admin/adminSignup')
const adminDashBoard = require('../controller/admin/dashboard')
const adminUserList = require('../controller/admin/userList');
const adminCategory = require('../controller/admin/category');
const product = require('../models/admin/productSchema');
const productController = require('../controller/admin/product');
const multer= require('multer')
const uploads = require('../helpers/multer')



adminRouter.get('/adminlogin', adminController.loadLogin);
adminRouter.post('/adminlogin',adminController.verifyAdmin);
adminRouter.get('/dashboard',adminDashBoard.loadDashBoard);
//user management
adminRouter.get('/userList',adminUserList.loadUserList);
adminRouter.post('userList',adminUserList.searchUser);
//category management
adminRouter.get('/category',adminCategory.categoryInfo);
adminRouter.post('/addCategory',adminCategory.addCategory);
adminRouter.post('/updateCategory/:categoryId',adminCategory.updateCategory)
adminRouter.put('/category/toggle/:id',adminCategory.catagoryStatus)
//Product management
adminRouter.get('/addProducts',productController.getProductaddPage);
adminRouter.post('/addProducts',uploads.array('productImages',10),productController.addProduct);
adminRouter.get('/listProducts',productController.listProduct)
adminRouter.patch('/blockUnblockProduct/toggle-block/:id',productController.blockUnblockProduct)
adminRouter.get('/editProduct/:id',productController.getProductEdit);
adminRouter.delete('/remove-image/:id',productController.removeProductImage)

module.exports= adminRouter;

