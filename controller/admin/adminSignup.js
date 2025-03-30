
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

        if (!userData) {
            return res.render('login', { message: 'Invalid User' });
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.render('login', { message: 'Invalid Password' });
        }

        if (userData.is_admin !== 1) {
            return res.render('login', { message: 'Invalid admin' });
        }

        req.session.user_id = userData._id;
        console.log('Admin authenticated, redirecting to dashboard...');
        return res.render('dashboard');
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