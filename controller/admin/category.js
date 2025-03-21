
const category = require('../../models/admin/category');


const categoryInfo = async(req,res)=>{
    try {
        const page  = parseInt(req.query.page) || 1;
        const limit = 0;
        const skip = (page-1)*limit;

        const categoryData = await category.find({})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);
         
        const totalCategories = await category.find({});
        const totalPages = Math.ceil(totalCategories/limit)
        res.render('category',{
            cat:categoryData,
            currentPage:page,
            totalPage:totalPages
        });
    } catch (error) {
        console.log(`error during categoryInfo functon in category${error}`);
        
    
    }
} 

const addCategory = async(req,res)=>{
    try {
        console.log('category add body ',req.body)
        const {categoryName,description} = req.body
        const existingCategory = await category.findOne({name:categoryName});
        if(existingCategory){
            return res.status(400).json({message:'Category Already Exisits',redirectUrl:"/admin/adminlogin"})
        }
       
       
        const newCategory = new category({
            name:categoryName,
            description:description
        })
           await newCategory.save();
           return res.status(200).json({message:'category added successfully',success:true,});

    } catch (error) {
        console.log(`error during adding the category`,error);
        return res.status(500).json({message:'internal Server error'})
    }
}

const updateCategory = async (req,res) => {
  try {
      
    console.log("req params",req.params)
    console.log("req body",req.body)
     
     const {categoryName,categoryDescription} = req.body
     const {categoryId} = req.params
     if(!categoryName?.trim() || !categoryDescription?.trim()){
        return res.status(401).json({
            message:"all fields are required",
            status: "error",
        })
     }
     const containsNumbers = (input) => /\d/.test(input);  // Regex to check if string contains any number (0-9)
     if (containsNumbers(req.body.categoryName) || containsNumbers(req.body.categoryDescription)) {
        return res.status(400).json({
            message: "Category name and description should not contain numbers!",
            status: "error"
        });
    }


     const existingCategory = await category.findOne({
        _id:categoryId,
    });
     console.log(`category from database ${existingCategory}`);

     if (!existingCategory) {
        return res.status(400).json({
            message: 'This category is not found',
            status: "error"
        });

    }
    const updatedCategory = await category.findByIdAndUpdate(
        categoryId, // Find by ID
        { name: categoryName, description:categoryDescription }, // Update fields
        { new: true, } // Return updated document
    );
    
    console.log("hai");
    
    if(updatedCategory){

       return  res.json({message:"updated",success:true})
    }else{
       return res.json({message:"not updated",success:false})
    }
  } catch (error) {
    
  }
}

const catagoryStatus = async (req, res) => {
    console.log('hello from block and unblock function');
    try {
        const categoryId = req.params.id;
        console.log("Category ID:", categoryId);

        // Rename the variable to avoid conflict
        const foundCategory = await category.findById(categoryId);

        if (!foundCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        foundCategory.isListed = !foundCategory.isListed;
        await foundCategory.save();

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
    
}



module.exports = {
    categoryInfo,
    addCategory,
    updateCategory,
    catagoryStatus,
}