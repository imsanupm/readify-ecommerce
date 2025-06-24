
const User = require('../models/user/userSchema');
const getUser = require('../helpers/user/getUser');


// const main = async (req,res,next) => {
//     res.locals.user = req.session.user_id||null
//     next();
// }


const main = async (req, res, next) => {
    res.locals.user_name = req.session.user_name || null;
  console.log('session',req.session)
    if (req.session.user_id) {
        try {
            const userData = await User.findById(req.session.user_id);
            res.locals.user_image = userData?.photo || "/uploads/profile-pictures/default.png";
        } catch (err) {
            console.error("Error fetching user data:", err);
            res.locals.user_image = "/uploads/profile-pictures/default.png";
        }
    } else {
        res.locals.user_image = "/uploads/profile-pictures/default.png";
    }

    next();
};


const isUserSignedIn = async (req, res, next) => {
  try {
   
    if (!req.session.user_id) {
     
      return res.redirect("/signin");
    }

    const user = await User.findById(req.session.user_id);
  

  
    if (!user) {
     
      req.session.user_id = null;
      return res.redirect("/signin");
    }


    if (!user.isActive) {
    
      req.session.destroy();
      return res.redirect("/signin");
    }

    next(); 
  } catch (error) {
    console.log("Error in userAuth middleware:", error);
    res.status(500).send("Internal server error");
  }
};



const isUserLoggedOut = async (req,res,next)=>{
    if(req.session.user_id){
        res.redirect('/')
    }
    else{
        next()
    }
}




module.exports = {
    main,
    isUserSignedIn,
    isUserLoggedOut,
  
}