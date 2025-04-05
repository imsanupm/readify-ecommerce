
const User = require('../models/user/userSchema');

const main = async (req,res,next) => {
    res.locals.user = req.session.user_id||null
    next();
}

const userAuth = async (req,res,next) => {
    
        if(req.session.user_id){
            User.findById(req.session.user_id)
            .then(data=>{
                if(data&&data.isActive){
                    next()
                }else{
                    res.redirect('/signin')
                }
            }).catch(error=>{
                console.log('error during userAuthMiddleware',error)
                res.status(500).send('internal Server error')
            })
        }else{
            res.redirect('/signin')
        }
}

const adminAuth = async (req,res,next) => {
 try {
    admin = await User.findById(req.session.admin_id)
    if(!admin||!admin.is_admin){
      return res.redirect('/admin/adminLogin')
    }
    next()
 } catch (error) {
    console.log('error during adminAuth Middleware',error)
 }
}


module.exports = {
    main,
    userAuth,
  adminAuth,
}