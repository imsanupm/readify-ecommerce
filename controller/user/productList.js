const Product = require("../../models/admin/productSchema")
const Category = require('../../models/admin/category')
const product = require("../../models/admin/productSchema")
const findUser = require('../../helpers/user/getUser')
const getProductListPage = async (req,res) => {
    try {

        console.log('the page is rendering ................');
        
        const userData = await findUser.getUserById(req.session.user_id);
        console.log('userData fomr product list page=========',userData);
        console.log('product list page ===============');
        
        const product = await Product.find({isBlocked:false}).sort({createdAt:-1})
        const category = await Category.find({})
        res.render('productList',{
            products:product,
            categories:category
        })
    } catch (error) {
        console.log(`error during rendering the productListpage`)
    }
}

const productSorting = async (req,res)=>{
    try{
     const sortBy = req.query.sortBy || "default"
     sortOptions = {}
      switch(sortBy){
        case "name-asc":
        sortOptions = {productTitle : 1};
        break;

        case "name-desc":
        sortOptions = {productTitle:-1};
        break;

        case "price-low-high":
        sortOptions = {regularPrice:1};
        break;

        case "price-high-low":
        sortOptions = {regularPrice:-1}

        default:
        sortOptions = {}
      }
     let products = await Product.find().sort(sortOptions).limit(8).lean();
     res.json({products})
    }catch(error){
     console.log(`error during sorting function ${error}`);
    }
}

const filterProducts = async (req, res) => {
    try {
        let { categories, minPrice, maxPrice } = req.query;
        
        let filter = { isBlocked: false };

        if (categories) {
            filter.category = { $in: categories.split(",") }; // Convert comma-separated string to array
        }

        if (minPrice && maxPrice) {
            filter.regularPrice = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }

        const products = await Product.find(filter);

        res.json({ products });
    } catch (error) {
        console.error("Error filtering products:", error);
        res.status(500).json({ error: "Server error" });
    }
};


module.exports = {
    getProductListPage,
    productSorting,
    filterProducts
}


