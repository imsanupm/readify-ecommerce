

const validateChangePassword = async (req,res,next) => {
    

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    const  {confirmPassword,oldPassword,newPassword} = req.body
    if(!confirmPassword||!oldPassword||!newPassword){
        return res.json({message:"All fields are required Please try again"})
    }
    if(!passwordRegex.test(newPassword)){
        return res.json({message: "Password must be at least 6 characters and include uppercase, lowercase, digit, and special character",success:false});
    }
    if(oldPassword==newPassword){
        return res.json({message:"Your old password and new password are same please try again",success:false});
    }
    next()
    
}



module.exports={
    validateChangePassword
}