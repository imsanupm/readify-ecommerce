
const User = require('../../models/user/userSchema');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const loadLogin = async(req,res)=>{
    
    try {
        res.render('adminlogin');
    } catch (error) {
        console.log(`error during load signin in admin side ${error}`)
    }
}

const verifyAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const userData = await User.findOne({ email });

        if(!email||!password){
            return res.json({message:"all fields are required"})
        }

        if (!userData) {
            return res.json( { message: 'Invalid User',success:false});
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.json('adminLogin', { message: 'Invalid Password' });
        }

        if (userData.is_admin !== 1) {
            return res.json('adminLogin', { message: 'Invalid admin' });
        }

        req.session.admin_id = userData._id;
        console.log('amdin id',userData._id);
        return res.json({success:true,message:'Login successfully',redirecturl:'/dahsboard'})
    } catch (error) {
        console.error('Error verifying admin:', error.message);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
};



module.exports={
    verifyAdmin,
    loadLogin,
}