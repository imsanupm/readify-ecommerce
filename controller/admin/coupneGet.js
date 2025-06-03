const { save } = require('pdfkit');
const code  = require('../../helpers/user/statusCode');
const Coupen = require('../../models/admin/coupen');


const getCoupenPage = async (req, res) => {
  try {
    const coupenDatas = await Coupen.find({}).sort({ createdAt: -1 });
    console.log("coupon datas====================", coupenDatas);
    
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