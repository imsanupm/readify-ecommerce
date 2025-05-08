const fs = require('fs');
const path = require('path');
const productModel = require('../../models/admin/productSchema');

const validateProductEdit = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    const product = await productModel.findById(productId);
    

    next()
  } catch (error) {
    console.log('error during validating updateProduct',error)
  }
};

module.exports ={validateProductEdit} ;
