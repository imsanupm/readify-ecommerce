const express = require('express');
const router = express.Router();
const userController = require('../controller/user/userController');
const passportConfig = require('../config/passport');
const passport = passportConfig.passport;
const listProduct = require('../controller/user/productList')
const productDetailPage = require('../controller/user/poductDeatils')
const userAuth = require('../middlewares/authMiddleware')
const userProfile = require('../controller/user/userProfile');
const validateChangePassword = require("../validators/user/changePassword");

router.get('/', userController.loadHomepage);
router.get('/signup', userController.loadSignup);
router.post('/signup', userController.signup);
router.get('/signin',userController.loadLogin);
router.post('/signin',userController.signin);
router.get('/logout',userController.logout)
router.get('/verify-otp', userController.loadVerifyOtp);
router.post('/verify-otp', userController.verifyOtp);
router.get('/resend-otp', userController.resendOtp);
router.get('/pagenotfound', userController.pageNotfound);
//product
router.get('/productListPage',userAuth.userAuth,listProduct.getProductListPage)
router.get('/productListPage/sort', listProduct.productSorting);
router.get('/productListPage/filter', listProduct.filterProducts);
router.get('/productDetilPage/:id',productDetailPage.getProductDetailPage)
//profile
router.get('/userProfile',userProfile.loadUserProfile)
router.patch('/changePassword',validateChangePassword.validateChangePassword,userProfile.changePassword)




































router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/signup' }), (req, res) => {
    res.redirect('/');
});

module.exports = router;