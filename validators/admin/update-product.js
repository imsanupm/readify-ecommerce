const fs = require('fs');
const path = require('path');
const productModel = require('../../models/admin/productSchema');

const validateProductEdit = async (req, res, next) => {
  try {
    
    const productId = req.params.id;
    console.log('reqest body',req.body);
    
    const {
      name,
      writer,
      category_id,
      language,
      regularPrice,
      availableQuantity,
      description,
      imagesToDelete,
      imagesToKeep,
      offer
    } = req.body;
   
    const product = await productModel.findById(productId);
    // console.log(typeof product.category)
    if(!product){
      return res.status(404).json({ success: false, message: 'No Changes Decteted' });
    }
      //  console.log('image data from the body',imagesToKeep);
      //  console.log('image data from the DB',product.productImage);
    if(name==product.productTitle&&
      writer==product.authorName&&
      language==product.language&&
      category_id==product.category&&
      description==product.description&&
      regularPrice==product.regularPrice&&
      availableQuantity==product.quantity&&
      offer==product.productOffer
    ){
        return res.status(400).json({message:"No Changes Decteted",
          success:false
        })
      }else if (offer<0||availableQuantity<0){
        return res.status(400).json({message:"Value should not negative please try again",success:false})
      }else if (regularPrice<199){
        return res.status(400).json({message:"Regular price should be greaterthan or equal to 199 ",success:false});
      }
    

    next()
  } catch (error) {
    console.log('error during validating updateProduct',error)
  }
};

module.exports ={validateProductEdit} ;
