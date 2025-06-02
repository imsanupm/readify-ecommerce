
const category = require('../../models/admin/category');
const categoryModel = require('../../models/admin/category');
const Products = require('../../models/admin/productSchema')

const categoryInfo = async(req,res)=>{
    try {
        const page  = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page-1)*limit;

        const categoryData = await categoryModel.find({})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);
         
        const totalCategories = await categoryModel.countDocuments({});
        const totalPages = Math.ceil(totalCategories/limit)

        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push({
                number: i,
                isActive: i === page
            });
        }

        res.render('category',{
            cat:categoryData,
            currentPage: page,
            totalPages,
            paginationLinks,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page - 1,
            nextPage: page + 1
        });
    } catch (error) {
        console.log(`error during categoryInfo functon in category${error}`);
        
    
    }
} 

const addCategory = async(req,res)=>{
    try {
        console.log('category add body ',req.body)
        const {categoryName,description} = req.body

        const containsNumbers = (input) => /\d/.test(input);  
        if (containsNumbers(categoryName) || containsNumbers(description)) {
           return res.status(400).json({
               message: "Category name and description should not contain numbers!",
               status: "error"
           });
       }

        const existingCategory = await categoryModel.findOne({
            name: { $regex: new RegExp(`^${categoryName}$`, "i") }
        });
        if(existingCategory){
            return res.json({message:'Category Already Exisits',redirectUrl:"/admin/adminlogin"})
        }
       
       
        const newCategory = new categoryModel({
            name:categoryName,
            description:description
        })
           await newCategory.save();
           return res.status(200).json({message:'category added successfully',success:true,});

    } catch (error) {
        console.log(`error during adding the category`,error);
        return res.status(500).json({message:'All fields are required'})  //sanu you have to deal this handle the validation
    }
}

const updateCategory = async (req,res) => {
  try {
      

     
     const {categoryName,categoryDescription,offer} = req.body
     const {categoryId} = req.params
     if(!categoryName?.trim() || !categoryDescription?.trim()){
        return res.status(401).json({
            message:"all fields are required",
            status: "error",
        })
     }
     const containsNumbers = (input) => /\d/.test(input);  
     if (containsNumbers(req.body.categoryName) || containsNumbers(req.body.categoryDescription)) {
        return res.status(400).json({
            message: "Category name and description should not contain numbers!",
            status: "error"
        });
    }

    if (isNaN(offer) || offer < 0 || offer > 99) {
        return res.status(400).json({
          success: false,
          message: "Offer must be a number between 1 and 99."
        });
      }

    

     const existingCategory = await categoryModel.findOne({
        _id:categoryId,
    });
    

     if (!existingCategory) {
        return res.status(400).json({
            message: 'This category is not found',
            status: "error"
        });

    }

    console.log('initial      =========================================');
    
    
 
    const mongoose = require("mongoose");
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    const numericOffer = Number(offer);
    
    const relProducts = await Products.find({
      category: categoryObjectId,
      $or: [
        { productOffer: { $lt: numericOffer } },
        { productOffer: { $in: [null, 0] } }
      ]
    });
    
    console.log("Filtered products found:", relProducts.length);
    
    for (let product of relProducts) {
      const discount = (product.regularPrice * numericOffer) / 100;
      const discountedPrice = Math.round(product.regularPrice - discount);
    
      await Products.findByIdAndUpdate(product._id, {
        // productOffer: numericOffer,
        finalAmount: discountedPrice,
        offerType: "Category Offer"
      });
    }
    
      
         

    const updatedCategory = await categoryModel.findByIdAndUpdate(
        categoryId, 
        { name: categoryName, description:categoryDescription ,categoryOffer:offer}, 
        { new: true, } 
    );
    

    
    if(updatedCategory){

       return  res.json({message:"updated",success:true})
    }else{
       return res.json({message:"not updated",success:false})
    }
  } catch (error) {
    
  }
}

const catagoryStatus = async (req, res) => {
   
    try {
        const categoryId = req.params.id;

        const foundCategory = await categoryModel.findById(categoryId);

        if (!foundCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        foundCategory.isListed = !foundCategory.isListed;
        await foundCategory.save();
        console.log('block&ublock function are working properly')

        res.json({
            success: true,
            isListed: foundCategory.isListed,
            message: `Category ${foundCategory.isListed ? 'Unblocked' : 'Blocked'} successfully`
        });

    } catch (error) {
        console.error("Error in catagoryStatus:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const searchCategory = async (req,res)=>{
    try {
      
        const query = req.query.query
        console.log(`data you got from the front end for searching is ${query}`)
        const categories  = await categoryModel.find({name:{$regex:query,$options:"i"}})
        console.log(`category name for searching is ${categories}`);
        if(categories.length==0){
            return res.status(404).json([])
        }
        
        res.json(categories)

    } catch (error) {
        console.log(`error during searchCategory ${error}`)
        res.status(500).json({message:"internal server error"})
    }
}






module.exports = {
    categoryInfo,
    addCategory,
    updateCategory,
    catagoryStatus,
    searchCategory,
}