const { save } = require('pdfkit');
const code  = require('../../helpers/user/statusCode');
const Coupen = require('../../models/admin/coupen');


const getCoupenPage = async (req, res) => {
  try {
    const coupenDatas = await Coupen.find({}).sort({ createdAt: -1 });
    res.render('coupen', { 
     datas: coupenDatas 
    }); // pass data to the view
  } catch (error) {
    console.log('Error during getCoupenPage:', error);
    res.status(400).json({ message: "Internal server error", success: false });
  }
};

    const addCoupen = async (req, res) => {
        try {

        
              
          const {
            code,
            discount,
            maxDiscount,
           minPurchase,
            startDate,
            expiryDate,
            isActive,
            maxUsagePerUser,
          } = req.body;
      
          const savedData = new Coupen({
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
          return res.status(500).json({
            message: "Internal server error",
            success: false,
          });
        }
      };


    

      const updateCoupen = async (req, res) => {
        try {
          const coupenId = req.params.coupenId.toUpperCase(); // Ensure uppercase match
          const {
            discount,
            minPurchase,
            maxDiscount,
            startDate,
            expiryDate,
            maxUsagePerUser,
            isActive
          } = req.body;
      
          // Find the coupon by code
          const coupenData = await Coupen.findOne({ code: coupenId });
          if (!coupenData) {
            return res.status(code.HttpStatus.BAD_REQUEST).json({ success: false, message: 'Coupon not found' });
          }
      
          // Update the fields
          coupenData.discount = discount;
          coupenData.minPurchase = minPurchase;
          coupenData.maxDiscount = maxDiscount;
          coupenData.startDate = startDate;
          coupenData.expiryDate = expiryDate;
          coupenData.maxUsage = maxUsagePerUser;
          coupenData.isActive = isActive;
      
          // Save the updated document
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
      
          const coupon = await Coupen.findOne({ code: couponCode });
      
          if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
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
          const deleted = await Coupen.findOneAndDelete({ code: couponCode });
      
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