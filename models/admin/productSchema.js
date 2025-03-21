const mongoose = require('mongoose')
const {Schema} = mongoose


const productSchema = new Schema({
    productTitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        // required:true 
    },
    regularPrice:{
        type:Number,
        required:true
    },
    // salePrice:{
    //     type:Number,
    //     required:true
    // },
    productOffer:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        // default:true
    },
    productImage:{
        type:[String],
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["Available","out of stock"]
    },
    authorName:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    }
},{timestamps:true});


const product = mongoose.model('Product',productSchema)

module.exports = product