
const Category = require('../../models/admin/category');
const Product = require('../../models/admin/productSchema')



const getProductDetailPage = async (req, res) => {
    try {
        const id = req.params.id;
        const products = await Product.findOne({_id:id}).populate('category').lean();
        console.log("product new console",products);
        
        
        if (!products) {
            return res.status(404).render('pagenotFound', { message: "Product not found" });
        }

        const allProducts = await Product.find({ _id: { $ne: id } }).populate('category').lean();
        
        // Filter related products by category
        let relProducts = allProducts.filter(item => item.category._id.toString() === products.category._id.toString());

        // Limit the related products to a maximum of 4 items
        relProducts = relProducts.slice(0, 4);

        res.render('productDetailPage', {
            product: products,
            relatedProducts: relProducts
        });

    } catch (error) {
        console.error(`Error during getProductDetailPage: ${error}`);
        res.render('pagenotFound');
    }
};



module.exports = {
    getProductDetailPage
}