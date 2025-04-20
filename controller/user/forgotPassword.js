const User = require('../../models/user/userSchema')
const sendUrlTomail = require('../user/userController');
const crypto = require('crypto')
const findByEmail  = require('../../helpers/user/getUser');
const securePassword  = require('../../controller/user/userController')
const getForgotPassword = async (req,res) => {
    try {
        res.render('forgotPassword');
    } catch (error) {
        console.log('error during getForgotPassword',error);
        res.status(500).json({message:"Internal server Error Please Try again",success:false});
    }
}

const forgotPassword = async (req,res) => {
    try {
        const email = req.body.email;
        console.log('emial for changin the password',req.body);
        if(!email){
            return res.json({message:"Please Try Again Email Should Not Empty",success:false});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            console.log('email validation error')
            return res.json({message:"Invalid Email Fromat Please Enter Proper Email"})
        }
        const user  =  await User.findOne({email:email});
        console.log('user for forgt password',user);
        if(!user){
            console.log('you didnt get eny User from the db')
            return res.status(404).json({message:"User with this email Is not exist",success:false});
        }
           
           
            
          const resetToken = crypto.randomBytes(32).toString('hex');

          const resetLink = `http://localhost:3856/confirmPassword?token=${resetToken}`;

             
        const emailSent = await sendUrlTomail.sendVarificationEmail(email,resetLink);
        if(emailSent){
            req.session.resetToken = resetToken;
          req.session.resetEmail = email;
          req.session.resetTokenExpiration = Date.now() + 60000; //1 min expiry
          console.log('url for forgot',resetLink);
            
        }
          console.log('i think the otp sended sucessfuuly');

          return res.json({message:"We sended A Url to Your Email Address",success:true,redirectTo:'/forgot-password'});

    } catch (error) {
        console.log('error during forgot the password ',error)
    }
}

const confirmPasswordGet = async (req,res) => {
    try {
        const token = req.session.resetToken;
        const email = req.session.resetEmail;
        const time  = req.session.resetTokenExpiration;
        console.log('rest token from session ')
        if(!token||!email||!time){
            return res.json({message:"Something Went Wrong"});
        }
        if (Date.now() > time) {
            return res.json({ success: false, message: "Reset token has expired. Please request a new one." });
        }
        res.render('confirmPassword',{token:token});
    } catch (error) {
        console.log('error during confirmPasswordGet',error);
        return res.status(500).json({message:"Internal server error",success:false})
    }
}

const updatePassword = async (req,res) => {
    try {
        
       
        const passwordRegex = /^.{6,}$/;
        const {token,password,confirmPassword} = req.body;
        const email = req.session.resetEmail;
        console.log(req.body)
     
          if(!password||!confirmPassword){
            return res.json({message:"all Fields are required",success:false})
          }
          if(!passwordRegex.test(password)||!passwordRegex.test(confirmPassword)){
            console.log('your stuck in validation');
            return res.json({message:"Needed A Strong Password Atleast Six Characters With Special Characters"});
          }
          if (password !== confirmPassword) {
            return res.json({ message: "Passwords do not match", success: false });
          }

            const hashedPassword = await securePassword.securePassword(password);
            const user = await User.findOneAndUpdate(
                { email: email },       
                { $set: { password: hashedPassword }},
                { new: true }     
              );
              console.log('user data i taken form the db',user);
          if(!user){
            return res.json({message:"Your Password didnt changedd Please Try again",success:false});
          }
          console.log('password Changed successfully!')
         return res.json({message:"Your Password Changeed successfully",success:true});
    } catch (error) {
        console.log('error during updatePassword',error)
    }
}


 module.exports = {
    getForgotPassword,
    forgotPassword,
    confirmPasswordGet,
    updatePassword,
 }

