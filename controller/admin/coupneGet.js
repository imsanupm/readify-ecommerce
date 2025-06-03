const { save } = require('pdfkit');
const code  = require('../../helpers/user/statusCode');
const Coupen = require('../../models/admin/coupen');


const getCoupenPage = async (req,res) => {
    try {
        res.render('coupen');
    } catch (error) {
        console.log('error during getCoupenPage',error);
        res.status(code.HttpStatus.BAD_REQUEST).json({message:"Internal server errror",success:false})
    }
}



    const addCoupen = async (req, res) => {
        try {

   
              
          const {
            code,
            discount,
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
            maxUsagePerUser,
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



      
module.exports = {
    getCoupenPage,
    addCoupen
}