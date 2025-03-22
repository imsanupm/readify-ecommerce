const User = require('../../models/user/userSchema');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const  env = require('dotenv').config();
const Product=require('../../models/admin/productSchema')

const loadHomepage = async (req,res)=>{
    try {
       const product  = await Product.find({isBlocked:false}).sort({createdAt:-1}).limit(6)
       console.log("produt from home page",product)
        res.render('home',{products:product})
    } catch (error) {
        console.log(`error during ${error}`);
    }
}

const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(`error during loading login page ${error}`)
    }
}

const signin = async(req,res)=>{
     try {
        const {email,password} = req.body;
        const userData = await User.findOne({email:email})
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                  req.session.user_id = userData._id;
                  res.redirect('/home');
            }else {
                res.render('login',{message:'Incorrect password'})
            }
        }else{
          
            res.render('login',{message:'user with this email id is not exist'})
        }
     } catch (error) {
        console.error('Error verifying user:', error.message);
        res.render('login', { message: 'An error occurred during login.' });
     }
}


const pageNotfound = async(req,res)=>{
    try {
        res.render('pagenotFound')
    } catch (error) {
        console.log(`error during pagenot found page rendering ${error}`);
    }
}

const generateOTP = ()=>{
    return Math.floor(100000+Math.random()*900000).toString();
}
const sendVarificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });
        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Verify Your Account',
            text: `Your OTP is ${otp}`,
            html: `<b>Your OTP is ${otp}</b>`,
        });
        return info?.accepted?.length > 0;
    } catch (error) {
        console.log(`error during sendVarificationEmail function in controller ${error}`);
        return false;
    }
};


const loadSignup = async (req,res)=>{
    try {
        res.render('signin')
    } catch (error) {
        console.log(`eror during loadLogin ${error}`);
    }
}

const loadVerifyOtp = async (req, res) => {
    try {
        if (!req.session.userOtp || !req.session.userData) {
            return res.redirect('/signup');
        }
        res.render('verify-Otp');
    } catch (error) {
        console.log(`error during loadVerifyOtp ${error}`);
        res.redirect('/pagenotfound');
    }
};

const signup = async (req, res) => {
    try {
        const { email, password, Phone, cPassword, name } = req.body;
        
        // Fix password comparison
        if (password !== cPassword) {
            return res.render('signin', { message: 'Passwords do not match' });
        }  //optional

         const hashedPassword = await securePassword(password)


        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.render('signin', { message: 'This email already exists' });
        }

        const otp = generateOTP();
        console.log(otp)
        const emailSent = await sendVarificationEmail(email, otp);
        if (!emailSent) {
            return res.render('signin', { message: 'Failed to send OTP. Please try again.' });
        }

        // Store OTP and user data in session with expiry
        req.session.userOtp = otp;
        req.session.userData = { email, hashedPassword, Phone, name };
        req.session.otpExpiry = Date.now() + 120000; // 2 minutes in milliseconds

        res.redirect('/verify-otp');
    } catch (error) {
        console.log(`error during user signup ${error}`);
        res.status(500).redirect('/pagenotfound');
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const { userOtp, userData, otpExpiry } = req.session;

        if (!userOtp || !userData) {
            return res.redirect('/signup');
        }

        if (Date.now() > otpExpiry) {
            return res.render('verifyOtp', { message: 'OTP has expired' });
        }

        if (otp !== userOtp) {
            return res.render('verifyOtp', { message: 'Invalid OTP' });
        }

        // Create new user
        const newUser = new User({
            name: userData.name,
            email: userData.email,
            password: userData.hashedPassword,
            phonenumber: userData.Phone,
            isVerified: true
        });   
                  //you also have to add the signup user into session 

        await newUser.save();

        // Clear session data
        req.session.userOtp = null;
        req.session.userData = null;
        req.session.otpExpiry = null;

        res.redirect('/'); // Redirect to homepage after successful verification
    } catch (error) {
        console.log(`error during verifyOtp ${error}`);
        res.redirect('/pagenotfound');
    }
};

const resendOtp = async (req, res) => {
    try {
        const { userData } = req.session;
        
        // Check if user data exists in session
        if (!userData) {
            return res.status(400).redirect('/signup');
        }

        // Generate new OTP
        const newOtp = generateOTP();
        console.log(newOtp);
        
        // Attempt to send verification email
        const emailSent = await sendVarificationEmail(userData.email, newOtp);
        
        if (!emailSent) {
            return res.status(500).render('verify-Otp', { 
                message: 'Failed to resend OTP. Please try again.' 
            });
        }

        // Update session with new OTP and expiry
        req.session.userOtp = newOtp;
        req.session.otpExpiry = Date.now() + 120000; // 2-minute expiry

        // Send success response
        return res.status(200).render('verify-Otp', { 
            message: 'New OTP sent successfully' 
        });

    } catch (error) {
        console.log(`error during resendOtp: ${error}`);
        return res.status(500).redirect('/pagenotfound');
    }
};

const securePassword = async (password)=>{
      try {
        const hashedPassword = await bcrypt.hash(password,10);
      return hashedPassword
      } catch (error) {
        console.log(`error during securing password ${error}`)
      }
}

module.exports = {
    loadHomepage,
    pageNotfound,
    loadSignup,
    signup,
    loadVerifyOtp,
    verifyOtp,
    resendOtp,
    loadLogin,
    signin,
}