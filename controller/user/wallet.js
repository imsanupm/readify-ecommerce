const code = require('../../helpers/user/statusCode');
const Wallet = require('../../models/user/wallet');


const getWallet = async (req,res) => {
    try {
        const userId = req.session.user_id;
        const wallet = await Wallet.findOne({user:userId});


        if (wallet) {
            // Sort transactions: newest first
            wallet.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        res.render('wallet',
            {walletData:wallet}
        );
        console.log('you are getting the call from the walllet==========data',wallet)
    } catch (error) {
        console.log('error during getWallet',error)
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


// const getWallet = async (req, res) => {
//     try {
//         const userId = req.session.user_id;
//         const page = parseInt(req.query.page) || 1; // Current page
//         const limit = 10; // Transactions per page
//         const skip = (page - 1) * limit;

//         const wallet = await Wallet.findOne({ user: userId });

//         if (!wallet) {
//             return res.render('wallet', {
//                 walletData: null,
//                 transactions: [],
//                 currentPage: page,
//                 totalPages: 0
//             });
//         }

//         // Sort transactions by newest first
//         const sortedTransactions = wallet.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         const totalTransactions = sortedTransactions.length;
//         const totalPages = Math.ceil(totalTransactions / limit);

//         const paginatedTransactions = sortedTransactions.slice(skip, skip + limit);

//         res.render('wallet', {
//             walletData: wallet,
//             transactions: paginatedTransactions,
//             currentPage: page,
//             totalPages: totalPages
//         });

//     } catch (error) {
//         console.log('Error during getWallet:', error);
//         res.status(500).send('Internal server error');
//     }
// };


module.exports = {
    getWallet
}