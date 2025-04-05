const { default: mongoose } = require('mongoose');
const User = require('../../models/user/userSchema');
const bcrypt = require('bcrypt');

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
module.exports = {
    loadUserProfile,
    changePassword,
}