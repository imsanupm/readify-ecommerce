const code = require('../../helpers/user/statusCode');
const Wallet = require('../../models/user/wallet');




// const getWallet = async (req, res) => {
//     try {
//         const userId = req.session.user_id;
//         const page = parseInt(req.query.page) || 1;
//         const limit = 4;
//         const skip = (page - 1) * limit;

//         const wallet = await Wallet.findOne({ user: userId }).lean()

//         if (!wallet) {
//             return res.render('wallet', {
//                 walletData: null,
//                 transactions: [],
//                 currentPage: page,
//                 totalPages: 0
//             });
//         }

      
//         const sortedTransactions = wallet.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         const totalTransactions = sortedTransactions.length;
//         const totalPages = Math.ceil(totalTransactions / limit);

//         const paginatedTransactions = sortedTransactions.slice(skip, skip + limit);
//         console.log("rendering wallet==========",wallet);
//         res.render('wallet', {
//             walletData: wallet,
//             transactions: paginatedTransactions,
//             currentPage: page,
//             totalPages: totalPages
//         });

//     } catch (error) {
//         console.log('Error during getWallet:', error);
//         res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
//     }
// };




// const getWallet = async (req, res) => {
//     try {
//         const userId = req.session.user_id;
//         const page = parseInt(req.query.page) || 1;
//         const limit = 10;
//         const skip = (page - 1) * limit;

//         const wallet = await Wallet.findOne({ user: userId }).lean();

//         if (!wallet) {
//             console.log('No wallet found for user:', userId);
//             return res.render('wallet', {
//                 walletData: null,
//                 transactions: [],
//                 currentPage: page,
//                 totalPages: 0
//             });
//         }

//         // Sort transactions by createdAt in descending order
//         const sortedTransactions = wallet.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         // Log transactions to verify createdAt field
//         console.log('Sorted Transactions:', sortedTransactions.map(tx => ({
//             transactionId: tx.transactionId,
//             createdAt: tx.createdAt
//         })));

//         const totalTransactions = sortedTransactions.length;
//         const totalPages = Math.ceil(totalTransactions / limit);

//         const paginatedTransactions = sortedTransactions.slice(skip, skip + limit);

//         console.log('Paginated Transactions:', paginatedTransactions);
//         console.log('Rendering wallet with balance:', wallet.balance);

//         res.render('wallet', {
//             walletData: wallet,
//             transactions: paginatedTransactions,
//             currentPage: page,
//             totalPages: totalPages
//         });

//     } catch (error) {
//         console.error('Error during getWallet:', error);
//         res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
//     }
// };



const getWallet = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const wallet = await Wallet.findOne({ user: userId }).lean();

        if (!wallet) {
            console.log('No wallet found for user:', userId);
            return res.render('wallet', {
                walletData: null,
                transactions: [],
                currentPage: page,
                totalPages: 0,
                totalTransactions: 0 // Add for empty wallet case
            });
        }

        // Sort transactions by createdAt in descending order
        const sortedTransactions = wallet.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Log transactions to verify createdAt field
        console.log('Sorted Transactions:', sortedTransactions.map(tx => ({
            transactionId: tx.transactionId,
            createdAt: tx.createdAt
        })));

        const totalTransactions = sortedTransactions.length;
        const totalPages = Math.ceil(totalTransactions / limit);

        const paginatedTransactions = sortedTransactions.slice(skip, skip + limit);

        console.log('Paginated Transactions:', paginatedTransactions);
        console.log('Total Transactions:', totalTransactions);
        console.log('Rendering wallet with balance:', wallet.balance);

        res.render('wallet', {
            walletData: wallet,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages: totalPages,
            totalTransactions: totalTransactions // Add totalTransactions here
        });

    } catch (error) {
        console.error('Error during getWallet:', error);
        res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
};
module.exports = {
    getWallet
}