const User = require('../../models/user/userSchema');
const code  = require('../../helpers/user/statusCode')



const findByreferralCode = async (refCode) => {
    try {
        const user = await User.findOne({ referelcode: refCode }); // ✅ Await the query
        return !!user; // ✅ returns true if found, false if not
    } catch (error) {
        console.error('Error during findUserByReferralCode:', error);
        return false; // Don't throw or use res.status here
    }
};

module.exports = {
    findByreferralCode
}