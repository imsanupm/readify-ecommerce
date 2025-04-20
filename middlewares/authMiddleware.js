
const User = require('../models/user/userSchema');

const main = async (req,res,next) => {
    res.locals.user = req.session.user_id||null
    next();
}

const isUserSignedIn = async (req,res,next) => {

        if(req.session.user_id){
                    // console.log('middleware data',req.session.user_id)
                    next()
        }else{ 
           return res.redirect('/signin')
        }
}
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