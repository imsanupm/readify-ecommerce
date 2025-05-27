const code = require('../../helpers/user/statusCode');
const Wallet = require('../../models/user/wallet');


const getWallet = async (req,res) => {
    try {
        const userId = req.session.user_id;
        const wallet = await Wallet.findOne({user:userId})
        res.render('wallet',
            {walletData:wallet}
        );
        console.log('you are getting the call from the walllet==========data',wallet)
    } catch (error) {
        console.log('error during getWallet',error)
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    getWallet
}