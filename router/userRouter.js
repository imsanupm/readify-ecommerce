const express = require('express');
const router = express.Router();
const userController = require('../controller/user/userController');
const passportConfig = require('../config/passport');
const passport = passportConfig.passport;
const productDetailPage = require('../controller/user/poductDeatils')
const userAuth = require('../middlewares/authMiddleware')
const userProfile = require('../controller/user/userProfile');
const validateChangePassword = require("../validators/user/changePassword");
const addresManageMent = require('../controller/user/address')
const validateAddressForm = require('../validators/user/addressValidator')
const forgotPassword = require('../controller/user/forgotPassword');
const cartController = require('../controller/user/cart');
const updateCart = require('../controller/user/update-cart');
const wishListController = require('../controller/user/wishList')
const updatWishlist = require('../controller/user/update-whishlist');
const checkout = require('../controller/user/checkout'); 
const placeOrder = require('../controller/user/place-order');
const orderDetails = require('../controller/user/orderList');
const invoicePdf = require('../helpers/user/invoice-download');
const returnCancel = require('../controller/user/return-request');
const wallet = require('../controller/user/wallet');
const profile = require('../controller/user/referral');
const cancelOrder = require('../controller/user/cancel-order')


router.get('/', userController.loadHomepage);
router.get('/signup', userController.loadSignup);
router.post('/signup',userAuth.isUserLoggedOut, userController.signup);
router.get('/signin',userAuth.isUserLoggedOut,userController.loadLogin);
router.post('/signin',userController.signin);
router.get('/logout',userController.logout)
router.get('/verify-otp',userAuth.isUserLoggedOut, userController.loadVerifyOtp);
router.post('/verify-otp', userController.verifyOtp);
router.get('/resend-otp',userAuth.isUserLoggedOut, userController.resendOtp);
router.get('/pagenotfound', userController.pageNotfound);



router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/signup' }), (req,res)=>{
    console.log(req.session.passport,'sessio data')
    res.redirect('/')} );

//forgotPassword
router.get('/forgot-password',userAuth.isUserLoggedOut,forgotPassword.getForgotPassword)
router.post('/forgot-password',forgotPassword.forgotPassword)
router.get('/confirmPassword',userAuth.isUserLoggedOut,forgotPassword.confirmPasswordGet)
router.patch('/confirmPassword',forgotPassword.updatePassword)
//product
router.get('/productDetailPage/:id',userAuth.isUserSignedIn ,productDetailPage.getProductDetailPage)
router.get('/books',userAuth.isUserSignedIn,productDetailPage.getProductListPage)
//profile
router.patch('/update-userName-phoneNumber',userProfile.changeNamePhone)
router.get('/userProfile',userAuth.isUserSignedIn,userProfile.loadUserProfile)
router.patch('/changePassword',validateChangePassword.validateChangePassword,userProfile.changePassword)
router.post('/changeEmail',userProfile.changeEmail);
router.patch('/changeEmail',userProfile.verifyOtp)
router.get('/myAdress',userAuth.isUserSignedIn,addresManageMent.getAdressPage);
router.get('/addNewAddress',userAuth.isUserSignedIn,addresManageMent.getAddAdressForm)
router.post('/addNewAddress', addresManageMent.saveAddress)
router.get('/addresses/edit/:AddressId',userAuth.isUserSignedIn,addresManageMent.getUpdateAddress);
router.put('/addresses/edit/:addressId',validateAddressForm.updateAddress,addresManageMent.updateAddress)
router.delete('/addresses/delete/:addressId',addresManageMent.deleteAddress)
router.get('/profile',userAuth.isUserSignedIn,profile.getProfile)
router.post('/apply-referral',profile.applyReferral)
//cart
router.get('/cart',userAuth.main,userAuth.isUserSignedIn,cartController.getCart);
router.post('/addToCart',cartController.addToCart)
router.patch('/cart/update-quantity', updateCart.updateQuantity);
router.delete('/cart/remove/:productId',updateCart.removeFromCart);

//whishlist
router.get('/wishlist',userAuth.isUserSignedIn,wishListController.getWishList)
router.post('/wishlist',wishListController.addToWishlist);
router.delete('/wishlist/delete/:productId',updatWishlist.deleteProduct)


//order related
router.get('/checkout', userAuth.isUserSignedIn,checkout.getCheckout);
router.post('/placeOrder',placeOrder.placeNewOrder);
router.post('/verifyRazorpayPayment', placeOrder.verifyRazorpayPayment);
router.get('/orderConfirmation',userAuth.isUserSignedIn,checkout.getOrderConfirmation)
router.get('/paymentFailed',userAuth.isUserSignedIn,placeOrder.getPaymentFailedPage)

//order Details
router.get('/orderListPage',userAuth.isUserSignedIn,orderDetails.getOrderListPage)
router.get('/orderDetailPage/:id',userAuth.isUserSignedIn,orderDetails.getOrderDetailPage)
router.get('/downloadInvoice/:orderId',invoicePdf.downloadInvoice)

//return cancel
router.post('/cancelOrder/:orderId', cancelOrder.cancelRequest);
router.patch('/returnOrder/:orderId', returnCancel.returnRequest);

//wallet management
router.get('/wallet',userAuth.isUserSignedIn,wallet.getWallet);

















router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/signup' }), (req, res) => {
    res.redirect('/');
});


router.use(((req,res,next)=>{
    res.render('pagenotFound')
}))
module.exports = router;
