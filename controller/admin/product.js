// Update your controller (productController.js)
const Category = require('../../models/admin/category');
const Product = require('../../models/admin/productSchema');
const fs = require('fs');
const path = require('path');
const User = require('../../models/user/userSchema');
const sharp = require('sharp');
const product = require('../../models/admin/productSchema');
const category = require('../../models/admin/category');
const multer = require('multer');
const uploads = require('../../helpers/multer'); // Update with actual path

const getProductaddPage = async(req, res) => {
    try {
        const category = await Category.find({isListed: true});
        console.log(category);
        res.render('addProduct', {
          categories: category
        });
    } catch (error) {
        console.log(`Problem on your getProductPage function ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Modified to handle cropped images from the front-end
const addProduct = async (req,res) => {
    
  try {
      
      const categories = await categoryModel.find({});

      if(!categories){
          console.log('Error when finding category')
          return res.status(500).json({massege:'Error'})
      }
      const {
          name,
          writer,
          category_id,
          language,
          regularPrice,
          salePrice,
          availableQuantity,
          description,
          publishedDate
      } = req.body;

      if(!name ||!writer ||!category_id ||!language ||!regularPrice ||!salePrice ||!availableQuantity ||!description ||!publishedDate){
          
          console.log('Problem with finding credentials in req.body in addProduct in productController')

          return res.render('Admin/addProduct',{categories,massege:'Need Credentials'})
      }

      const imagePaths = req.files.map(file => `/uploadedImages/${file.filename}`);

      if(!imagePaths){

          console.log('Problem with imagePaths newProduct in addProduct in productController')

          return res.render('Admin/addProduct',{categories,massege:'Problem with imagePaths newProduct '})

      }


      const newProduct = new productModel({
          name,
          writer,
          category_id,
          language,
          regularPrice,
          salePrice,
          availableQuantity,
          description,
          productImages: imagePaths,
          publishedDate
      })

      if(!newProduct){
          console.log('Problem with Creating newProduct in addProduct in productController');
          return res.render('Admin/addProduct',{categories,massege:'Problem with Creating newProduct'})

      }

      await newProduct.save();
      console.log(`New Book Added
          name : ${name},
          `)

      res.redirect('/admin/addProducts');


  } catch (error) {
      res.render('500');
      console.log(`Error show in addProducts and the 
          Error is ${error}`)
  }
}

// Make sure to update your route to use the multer middleware correctly
// In your routes file:
// router.post('/addProduct', uploads.array('croppedImages', 4), productController.addProduct);

module.exports = {
    getProductaddPage,
    addProduct,
};