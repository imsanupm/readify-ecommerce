const { save } = require('pdfkit');
const code  = require('../../helpers/user/statusCode');
const Coupon = require('../../models/admin/coupen');




const getCoupenPage = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 3; 
    const page = parseInt(req.query.page) || 1;

    const totalCoupons = await Coupon.countDocuments({});
    const totalPages = Math.ceil(totalCoupons / ITEMS_PER_PAGE);

    const coupenDatas = await Coupon.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

   
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push({
        number: i,
        isActive: i === page
      });
    }

    res.render('coupen', {
      datas: coupenDatas,
      currentPage: page,
      totalPages: totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page - 1,
      nextPage: page + 1,
      paginationLinks: paginationLinks
    });

  } catch (error) {
    console.log('Error during getCoupenPage:', error);
    res.status(400).json({ message: "Internal server error", success: false });
  }
};




    const addCoupen = async (req, res) => {
        try {

          console.log("You are getting call ================");
          
    
          const {
            code,
            discount,
           minPurchase,
            startDate,
            expiryDate,
            isActive,
            maxUsagePerUser,
          } = req.body;


          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const start = new Date(startDate);
          const end = new Date(expiryDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
      
          
          if (!code || typeof code !== 'string') {
            return res.status(400).json({ success: false, message: 'Coupon code is required.' });
          }
          const hasLetters = /[a-zA-Z]/.test(code);
          const numbers = code.match(/\d/g);
          if (!hasLetters || !numbers || numbers.length < 2) {
            return res.status(400).json({
              success: false,
              message: 'Coupon code must contain letters and at least 2 numbers.',
            });
          }
      
          
          if (discount === undefined || isNaN(discount) || parseFloat(discount) <= 0) {
            return res.status(400).json({ success: false, message: 'Discount must be a positive number.' });
          }
      
          
          if (minPurchase !== undefined && (isNaN(minPurchase) || parseFloat(minPurchase) < 0)) {
            return res.status(400).json({ success: false, message: 'Minimum purchase must be a non-negative number.' });
          }
           console.log('you are getting call from here ================');
           
              if (
      minPurchase !== undefined &&
      !isNaN(minPurchase) &&
      parseFloat(minPurchase) > 0 &&
      parseFloat(discount) >= 0.6 * parseFloat(minPurchase)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Discount must be less than 60% of the minimum purchase amount.',
      });
    }

         
          if (!startDate || isNaN(start)) {
            return res.status(400).json({ success: false, message: 'Start date is required and must be valid.' });
          }
          if (start < today) {
            return res.status(400).json({ success: false, message: 'Start date cannot be in the past.' });
          }
      
         
          if (!expiryDate || isNaN(end)) {
            return res.status(400).json({ success: false, message: 'Expiry date is required and must be valid.' });
          }
          if (end < today) {
            return res.status(400).json({ success: false, message: 'Expiry date cannot be in the past.' });
          }
          if (end < start) {
            return res.status(400).json({ success: false, message: 'Expiry date must be after start date.' });
          }
      
          
          if (maxUsagePerUser !== undefined && (!Number.isInteger(Number(maxUsagePerUser)) || maxUsagePerUser <= 0)) {
            return res.status(400).json({ success: false, message: 'Max usage per user must be a positive integer.' });
          }
      
          const savedData = new Coupon({
            code,
            discount,
            minPurchase,
            startDate,
            expiryDate,
            isActive,
            maxUsage:maxUsagePerUser,
          });
      
          await savedData.save();
      
          return res.status(200).json({
            message: "Coupon added successfully",
            success: true,
          });
        } catch (error) {
          console.log("Error during addCoupen:", error);
          if(error.code==11000){
            return res.status(code.HttpStatus.BAD_REQUEST).json({message:"Coupon code Already exists.",success:false})
          }
          return res.status(500).json({
            message: "Internal server error",
            success: false,
          });
        }
      };


    

      const updateCoupen = async (req, res) => {
        try {
          const coupenId = req.params.coupenId.toUpperCase(); 
          const {
            discount,
            minPurchase,
            maxDiscount,
            startDate,
            expiryDate,
            maxUsagePerUser,
            isActive
          } = req.body;

          
      
       
          const coupenData = await Coupon.findOne({ code: coupenId });
          if (!coupenData) {
            return res.status(code.HttpStatus.BAD_REQUEST).json({ success: false, message: 'Coupon not found' });
          }
      
         
          coupenData.discount = discount;
          coupenData.minPurchase = minPurchase;
          coupenData.maxDiscount = maxDiscount;
          coupenData.startDate = startDate;
          coupenData.expiryDate = expiryDate;
          coupenData.maxUsage = maxUsagePerUser;
          coupenData.isActive = isActive;
      
        
          await coupenData.save();
      
          res.status(code.HttpStatus.OK).json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupenData
          });
      
        } catch (error) {
          console.log('Error during updateCoupen:', error);
          res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
      };
      



     

      const coupenStatus = async (req, res) => {
        try {
          const couponCode = req.params.couponCode.toUpperCase();
          const { isActive } = req.body;
      
          const coupon = await Coupon.findOne({ code: couponCode });
      
          if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
          }
      
     
          if (isActive && coupon.currentUsage >= coupon.maxUsage) {
            return res.status(400).json({
              success: false,
              message: "Cannot activate. Usage limit reached. Please update maxUsage."
            });
          }
      
          coupon.isActive = isActive;
          await coupon.save();
      
          const status = isActive ? 'activated' : 'blocked';
          return res.status(200).json({ success: true, message: `Coupon ${status} successfully` });
      
        } catch (error) {
          console.error('Error toggling coupon status:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
      };
      

      const deleteCoupon = async (req, res) => {
        try {
         
          
          const couponCode = req.params.couponCode.toUpperCase();
          const deleted = await Coupon.findOneAndDelete({ code: couponCode });
      
          if (!deleted) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
          }
      
          return res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
        } catch (error) {
          console.error('Error deleting coupon:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
      };
      
        
module.exports = {
    getCoupenPage,
    addCoupen,
    updateCoupen,
    coupenStatus,
    deleteCoupon
}