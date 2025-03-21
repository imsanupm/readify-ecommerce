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
adminRouter.get('/userList',adminUserList.loadUserList);
adminRouter.post('userList',adminUserList.searchUser);
adminRouter.get('/category',adminCategory.categoryInfo);
adminRouter.post('/addCategory',adminCategory.addCategory);
adminRouter.post('/updateCategory/:categoryId',adminCategory.updateCategory)
adminRouter.put('/category/toggle/:id',adminCategory.catagoryStatus)
//Product management
adminRouter.get('/addProducts',productController.getProductaddPage);
// adminRouter.post('/addProduct',uploads.array("images",4),productController.addProduct)
adminRouter.post('/addProduct',uploads.array('productImages',10),productController.addProduct);


module.exports= adminRouter;

