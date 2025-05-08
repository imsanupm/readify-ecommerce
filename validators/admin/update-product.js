const fs = require('fs');
const path = require('path');
const productModel = require('../../models/admin/productSchema');

const validateProductEdit = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const {
      name,
      writer,
      category_id,
      language,
      regularPrice,
      availableQuantity,
      description,
      imagesToDelete,
      imagesToKeep
    } = req.body;

    const product = await productModel.findById(productId);
    if(!product){
      return res.status(404).json({ success: false, message: 'No Changes Decteted' });
    }
      //  console.log('image data from the body',imagesToKeep);
      //  console.log('image data from the DB',product.productImage);
    if(name==product.productTitle&&
      writer==product.authorName&&
      language==product.language&&
      regularPrice==product.regularPrice&&
      availableQuantity==product.quantity&&
      arraysEqual(imagesToKeep, product.productImage)){
        return res.status(400).json({message:"All fields are required",
          success:false
        })
      }
    

    next()
  } catch (error) {
    console.log('error during validating updateProduct',error)
  }
};

module.exports ={validateProductEdit} ;
