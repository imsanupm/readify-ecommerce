const User = require('../../models/user/userSchema');
const code= require('../../helpers/user/statusCode');

const getUserById =  async (value) => {
    try {

        const user = await User.findById(value)
        if(!user){
            console.log('user not found');
            return res.status(code.HttpStatus.NOT_FOUND).json({message:"User Not Found",success:false})
        }
        
       return user;
    } catch (error) {
        console.log('error duringgetting the getUserByEmail',error);
        res.status(500).json({message:"Internal server Error",success:false})
    }
}


module.exports = {
    getUserById
}


