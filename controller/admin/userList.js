

const category = require('../../models/admin/category');
const User = require('../../models/user/userSchema');

const  loadUserList = async(req,res)=>{

    try {
        const page  = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page-1)*limit;
        const userData = await User.find().sort({name:1})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);
        
        const totalProducts = await User.countDocuments({});
        const totalPages = Math.ceil(totalProducts/limit)

        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push({
                number: i,
                isActive: i === page
            });
        }
        res.render('usersList',{
            userData,
            currentPage: page,
            totalPages,
            paginationLinks,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page - 1,
            nextPage: page + 1
        })
         console.log(userData)
    } catch (error) {
        console.log(`error during loading LoadUserList function ${error}`)
    }
}



const searchUser = async(req,res)=>{
    try {


        console.log('your getting a new call from the fornt end for searching ');
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Search term is required' });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }

        res.json(users);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const toggleUserStatus = async (req,res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ success: true, isActive: user.isActive });
    } catch (error) {
        console.error("Error toggling user status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    loadUserList,
    searchUser,
    toggleUserStatus
}

