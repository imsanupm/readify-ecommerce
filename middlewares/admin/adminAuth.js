const adminAuth = async (req,res,next) => {
    try {
       
       if(!req.session.admin_id){
         return res.redirect('/admin/adminLogin')
       }
       next()
    } catch (error) {
       console.log('error during adminAuth Middleware',error)
    }
   }

   const isUserLoggedOut = async (req,res,next) => {
    try {
        if(req.session.admin_id){
            return res.redirect('/admin/dashboard');
        }
        next()
    } catch (error) {
        console.log('error during isAdmin Middleware',error);
        return res.redirect('/admin/dahsbaord')
   }
}

module.exports = {
    adminAuth,
    isUserLoggedOut
}