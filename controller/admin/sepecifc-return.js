

const returnOrder = async (req,res) => {
    try {
        console.log('you are getting call from return order====================')
        console.log(req.params);
        console.log(req.body)
    } catch (error) {
        console.log('error during return order',error);
    }
}

module.exports = {
    returnOrder
}