const User = require('../../models/user/userSchema');

const getUserByEmail =  async (value) => {
    try {
        const email = value;

        const user = await User.findOne({email:email});
        console.log('user form the db',user);
        if(!user){
            return res.json({message:"User with this email Not exits Please Try again",success:false})
        }
       return user;
    } catch (error) {
        console.log('error duringgetting the getUserByEmail',error);
        res.status(500).json({message:"Internal server Error",success:false})
    }
}


module.exports = {
    getUserByEmail
}

