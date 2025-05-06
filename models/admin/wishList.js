const mongoose=require('mongoose')
const {Schema}=mongoose

const whishlistSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   products:[{

    productId:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },addedOn:{
        type:Date,
        default:Date.now
    }
   }]
})
const Whishlist=mongoose.model("Whishlist",whishlistSchema)
module.exports=Whishlist