const { default: mongoose } = require('mongoose');
const User = require('../../models/user/userSchema');
const bcrypt = require('bcrypt');
const reUsedFucntionForchangeEamil = require('../../controller/user/userController');

const loadUserProfile = async (req,res) => {
    try {
        const userId = req.session.user_id
        const userData = await User.findOne({_id:new mongoose.Types.ObjectId(userId)});
        res.render('userProfile',{user:userData});
    } catch (error) {
        console.log('error during loadUserProfile',error)
    }
    
}

const changePassword = async (req,res)=>{
    try{
     userId = req.session.user_id;
     const userData = await User.findOne({_id:userId});
     const {oldPassword,newPassword,confirmPassword} = req.body
    
    if(userData){
        const passwordMatch = await bcrypt.compare(oldPassword,userData.password)
        console.log('password match variable', passwordMatch)
      if(!passwordMatch){
        return res.json({message:"The old password is not matching ",success:false})
      }
      const hashedPassword = await bcrypt.hash(newPassword,10)
      userData.password = hashedPassword
      await userData.save();
      console.log('password changed sucessfully');
       return res.json({message:"password changed successfully",success:true})
    }
    }catch(erro){
        console.log(`error during changePassowrd function ${erro}`);
    }
}



const changeEmail = async (req,res) => {
    try {
        const email = req.body.email
       
        //you have have to write conditon for if the email is already exists or not
         otp = await reUsedFucntionForchangeEamil.generateOTP()
         console.log('generated otp',otp);
         const emailSent = await reUsedFucntionForchangeEamil.sendVarificationEmail(email,otp)
         const expiresAt = Date.now() + 60 * 1000;
         if (emailSent) {
            req.session.userOtp = otp;
        req.session.otpExpiry = expiresAt
        req.session.newEmail = email
           res.json({
            message:"We sended a Otp to your email",
            success:true,
            expiresAt: expiresAt
        });
        }
        
    } catch (error) {
        console.log('error during changing the email',error)
    }
}
 const verifyOtp = async (req,res) => {
    try {
        const userId = req.session.user_id;
        const email = req.session.newEmail;
        const sessionOtp = req.session.userOtp;
        const otpExpiry = req.session.otpExpiry
        const otp = req.body.otp;
        const user = await User.findById(userId)
        
        if(otp!==sessionOtp){
            return res.json({message:"Otp not match please enter correct Otp",success:false})
        }

        user.email = email;
        await user.save()
        // req.session.user_id = null;
        req.session.newEmail = null;
        req.session.userId = null;
        req.session.otpExpiry = null;

        return res.json({message:'Email changed successfully',success:true});

    } catch (error) {
        console.log('error during verifyOpt for changing the email',error)
    }
 }
module.exports = {
    loadUserProfile,
    changePassword,
    changeEmail,
    verifyOtp,
}