const Category = require('../../models/admin/category')
const Product = require('../../models/admin/productSchema');
const fs = require('fs');
const path =  require('path');
const User = require('../../models/user/userSchema');
const sharp = require('sharp');

const getProductaddPage = async(req,res)=>{
    try {
        const category = await Category.find({isListed:true})
        console.log(category);
        res.render('addProduct',{
            cat:category
        })
    } catch (error) {
        console.log(`problem on your getProductPage fucntion ${error}`)
        res.status(500).json({message:'internal server error'});
    }
}




module.exports = {
    getProductaddPage,
}
