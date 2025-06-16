
const User = require('../models/user/userSchema');
const getUser = require('../helpers/user/getUser');
const main = async (req,res,next) => {
    res.locals.user = req.session.user_id||null
    next();
}

// const isUserSignedIn = async (req,res,next) => {


//         if(req.session.user_id  ){
                 
//                     next()
//         }else{ 
//            return res.redirect('/signin')
//         }
// }

const isUserSignedIn = async (req, res, next) => {
  try {
   
    if (!req.session.user_id) {
      console.log("User not logged in. Redirecting...");
      return res.redirect("/signin");
    }

    // Fetch user from DB
    const user = await User.findById(req.session.user_id);
    console.log(user)

  
    if (!user) {
      console.log("User not found in DB. Clearing session.");
      req.session.user_id = null;
      return res.redirect("/signin");
    }


    if (!user.isActive) {
      console.log(`User ${user.email} is blocked. Destroying session.`);
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