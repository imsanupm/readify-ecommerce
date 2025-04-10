
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

// const getProductListPage = async (req,res) => {
//     try {
//         const {search,category,sort} = req.query;
//         console.log(req.query);
//         const query = {};
//         if(search){
//             query.bname = {$regex : search, $options : 'i'};
//         }
//         if(category){
//             const categories = category.split(',');
//             query.category = { $in: categories };
//         }
//         let sortOption = {};
//         if (sort === 'price-desc') sortOption.regularPrice = -1;
//         else if (sort === 'price-asc') sortOption.regularPrice = 1;
//         else if (sort === 'a-z') sortOption.productTitle = 1;
//         else if (sort === 'z-a') sortOption.productTitle = -1;

//         const books = await Product.find(query).sort(sortOption);
//         console.log(books)
//         res.render('productList',{books:books});
//     } catch (error) {
//         console.log('error during getProduct detailPage',error)
//     }
// }


// const getProductListPage = async (req, res) => {
//     try {
//         const { search, category, sort } = req.query;
//         console.log(req.query);
        
//         const query = {};
        
//         // Handle search
//         if (search) {
//             query.bname = { $regex: search, $options: 'i' };
//         }
        
//         // Handle category filtering
//         if (category) {
//             const categories = category.split(',');
//             query.category = { $in: categories };
//         }
        
//         // Handle multiple sort options
//         let sortOption = {};
        
//         if (sort) {
//             const sortFields = sort.split(',');
            
//             // Apply each sorting option
//             sortFields.forEach(sortField => {
//                 switch (sortField) {
//                     case 'price-desc':
//                         sortOption.regularPrice = -1;
//                         break;
//                     case 'price-asc':
//                         sortOption.regularPrice = 1;
//                         break;
//                     case 'a-z':
//                         sortOption.productTitle = 1;
//                         break;
//                     case 'z-a':
//                         sortOption.productTitle = -1;
//                         break;
//                 }
//             });
//         }

//         const books = await Product.find(query).sort(sortOption);
//         console.log(books);
//         res.render('productList', { books: books });
//     } catch (error) {
//         console.log('error during getProduct detailPage', error);
//     }
// };


// const getProductListPage = async (req, res) => {
//     try {
//         const { search, category, sort } = req.query;
//         const cat = await Category.find({});
//         console.log('Query parameters:', req.query);
        
//         // Build MongoDB query object
//         const query = {};
        
//         // Add search filter - IMPORTANT: Check if we need to search in productTitle instead of bname
//         if (search) {
//             // Search in both product title and name fields to ensure we catch all matches
//             query.$or = [
//                 { productTitle: { $regex: search, $options: 'i' } },
//                 { bname: { $regex: search, $options: 'i' } }
//             ];
//         }
        
//         // Add category filter
//         if (category) {
//             const categories = category.split(',');
//             query.category = { $in: categories };
//         }
        
//         // Initialize sort object
//         let sortOption = {};
        
//         // Handle multiple sort options
//         if (sort) {
//             const sortFields = sort.split(',');
            
//             // Process each sort option
//             sortFields.forEach(sortField => {
//                 switch (sortField) {
//                     case 'price-desc':
//                         sortOption.regularPrice = -1;
//                         break;
//                     case 'price-asc':
//                         sortOption.regularPrice = 1;
//                         break;
//                     case 'a-z':
//                         sortOption.productTitle = 1;
//                         break;
//                     case 'z-a':
//                         sortOption.productTitle = -1;
//                         break;
//                 }
//             });
//         }

//         console.log('MongoDB Query:', query);
//         console.log('Sort Options:', sortOption);
        
//         // Execute the query with sorting
//         const books = await Product.find(query).sort(sortOption);
        
//         console.log(`Found ${books.length} books`);
        
//         // Render the page with results
//         res.render('productList', { books: books ,category:cat});
        
//     } catch (error) {
//         console.error('Error during getProductListPage:', error);
//         res.status(500).render('error', { message: 'An error occurred while fetching books' });
//     }
// };





const getProductListPage = async (req, res) => {
    try {
      // Extract query parameters
      const { search, category, sort, page = 1, limit = 12 } = req.query;
  
      // Initialize query object for MongoDB
      const query = {};
  
      // 1. Handle Search
      if (search && search.trim()) {
        query.$or = [
          { productTitle: { $regex: search.trim(), $options: 'i' } },
          { bname: { $regex: search.trim(), $options: 'i' } },
          // Add more fields to search as needed, e.g., description
        ];
      }
  
      // 2. Handle Filters (Categories)
      if (category) {
        const categories = category.split(',').filter(id => id.trim()); // Split and sanitize
        if (categories.length > 0) {
          query.category = { $in: categories };
        }
      }
  
      // Add more filters as needed, e.g., price range, rating
      // Example for price range:
      // if (minPrice || maxPrice) {
      //   query.regularPrice = {};
      //   if (minPrice) query.regularPrice.$gte = Number(minPrice);
      //   if (maxPrice) query.regularPrice.$lte = Number(maxPrice);
      // }
  
      // 3. Handle Sorting
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
            // Add more sort options as needed
          }
        });
      } else {
        // Default sort (optional)
        sortOption.createdAt = -1; // e.g., newest first
      }
  
      // 4. Pagination
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
        Product.countDocuments(query), // For pagination
        Category.find({}).lean(), // For filter options in UI
      ]);
  
      //  tyring to implement pagination
      const totalPages = Math.ceil(totalProducts / limitNum);
  
      // 6. Render Response
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