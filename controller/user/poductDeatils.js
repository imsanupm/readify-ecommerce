
const Category = require('../../models/admin/category');
const product = require('../../models/admin/productSchema');
const Product = require('../../models/admin/productSchema')



const getProductDetailPage = async (req, res) => {
    try {
        const id = req.params.id;
      
        const products = await Product.findOne({_id:id}).populate('category').lean();
        
        const isOffer = ''
        if(products.productOffer){
          isOffer = "Product Offer"
        }

        
        if (!products) {
            return res.status(404).render('pagenotFound', { message: "Product not found" });
        }

        const allProducts = await Product.find({ _id: { $ne: id } }).populate('category').lean();
        
        
        let relProducts = allProducts.filter(item => item.category._id.toString() === products.category._id.toString());

       
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


const getProductListPage = async (req, res) => {
    try {

      const { search, category, sort, page = 1, limit = 9 } = req.query;
  
      const query = {
        isBlocked:{$ne:true}
      };
  
      await Product.updateMany({quantity:{$lt:5}},
        {isBlocked:true}
      ) 


      if (search && search.trim()) {
        query.$or = [
          { productTitle: { $regex: search.trim(), $options: 'i' } },
          { bname: { $regex: search.trim(), $options: 'i' } },
          
        ];
      }
  
   
      if (category) {
        const categories = category.split(',').filter(id => id.trim()); 
        if (categories.length > 0) {
          query.category = { $in: categories };
        }
      }
  
      const sortOption = {};
      if (sort) {
        const sortFields = sort.split(',').filter(s => s.trim());
        sortFields.forEach(field => {
          switch (field) {
            case 'price-desc':
              sortOption.regularPrice = -1;
              break;
            case 'price-asc':
              sortOption.regularPrice = 1;
              break;
            case 'a-z':
              sortOption.productTitle = 1;
              break;
            case 'z-a':
              sortOption.productTitle = -1;
              break;
          }
        });
      } else {
    
        sortOption.createdAt = -1; 
      }
  
    
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 12;
      const skip = (pageNum - 1) * limitNum;
  
      // 5. Execute Query
      const [products, totalProducts, categories] = await Promise.all([
        Product.find(query)
          .populate('category')
          .sort(sortOption)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Product.countDocuments(query), 
        Category.find({}).lean(), 
      ]);
        

      const totalPages = Math.ceil(totalProducts / limitNum);
  
    
      res.render('productList', {
        books: products,
        categories,
        totalProducts,
        currentPage: pageNum,
        totalPages,
        queryParams: {
          search: search || '',
          category: category || '',
          sort: sort || '',
        },
      });
  
    } catch (error) {
      console.error('Error in getProductListPage:', error);
      res.status(500).render('error', { message: 'An error occurred while fetching products' });
    }
  };
module.exports = {
    getProductDetailPage,
    getProductListPage,
}




