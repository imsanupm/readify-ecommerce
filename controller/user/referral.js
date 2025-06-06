
const code = require('../../helpers/user/statusCode')
const User  = require('../../models/user/userSchema')
const Wallet = require('../../models/user/wallet');
const {nanoid} = require('nanoid');



const getProfile = async (req , res) => {
    try {
        const userId = req.session.user_id;
        const userData = await User.findById(userId);
        const walletData = await Wallet.findOne({user:userId});
        return res.render(
            'profile',
            {
                user:userData,
                wallet:walletData
            }
           
        )
    } catch (error) {
        console.log('error during getProfilepage=========',error);
        
    }
}






const applyReferral = async (req, res) => {
    try {
        const referralCode = req.body.referralCode;
        const userId = req.session.user_id;
        const userData = await User.findById(userId);
         if(referralCode==userData.referelcode){
            return res.status(code.HttpStatus.BAD_REQUEST).json({message:"You cannot apply Your own Referral Code",success:false})
         }
        const referredUser = await User.findOne({ referelcode: referralCode });

        if (!referredUser) {
            return res.status(code.HttpStatus.BAD_REQUEST).json({
                message: "Invalid Referral",
                success: false
            });
        }

        const newUserBonus = 50;
        const referredUserBonus = 100;
        const reason = "Referral Bonus";

      
        await refundToUser(userId, newUserBonus, reason);
        await refundToUser(referredUser._id, referredUserBonus, reason);
       
        userData.referedBy = referredUser._id
        await userData.save()
        return res.status(code.HttpStatus.OK).json({
            message: "Referral bonus applied successfully",
            success: true
        });

    } catch (error) {
        console.error("Error in applyReferral:", error);
        return res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error, please try again.",
            success: false
        });
    }
};



const refundToUser = async (userId, amount, description, orderId = null) => {
    try {
        let wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            // If wallet doesn't exist, create one
            wallet = new Wallet({
                user: userId,
                balance: 0,
                transactions: [],
            });
        }

        wallet.balance += amount;

        wallet.transactions.push({
            transactionId: nanoid(),
            type: "credit",
            amount,
            description,
            orderId,
            status: "completed"
        });

        await wallet.save();
    } catch (error) {
        console.error("Error during refundToUser:", error);
      //  throw error; // Optional: rethrow if you want upstream handling
    }
};

module.exports = {
    getProfile,
    applyReferral
}