const mongoose = require('mongoose');
const { Schema } = mongoose;
const { nanoid } = require('nanoid');


const orderSchema = new Schema({
    orderId: {
      type: String,
      default: () => nanoid(8), // 8-character unique ID
      unique: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    userData:{
        name:String,
        email:String,
        phone:String
    },
     
    orderedItems: [{
          
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        productDetails:{
            name:String,
            images:[String],
            brand:String,
            category:String,
        },
        
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned','Return Cancelled'],
            default: 'Processing'
        },
        isReturnRequested: {
            type: Boolean,
            default: false
        },
        
        cancellationReason: String,
        cancelledAt: Date,
        returnReason: String,
        returnRequestedOn: Date,
        returnedOn: Date
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    couponAmount:{
       type:Number,
       default:0
    },
    shippingCharge:{
        type:Number,
        required:true,
        default:0
    },
    totalQuantity:Number,
    address: {
        fullname: { type: String },
        state: { type: String },
        district: { type: String },
        house_flat: { type: String },
        pincode: { type: Number },
        landmark: { type: String },
        mobile: { type: String },
        alt_phone: { type: String },
        village_city: { type: String },
        street: { type: String },
        addressType: { type: String }
      },
      
    invoiceDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
      //  enum: [''],
        default: 'Online Payment'
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    },
    paymentDetails: {
        paymentId: String,
        orderId: String
    },
    couponApplied: {
        type: Boolean,
        default: false
    },
    couponDetail:{
        type:Schema.Types.ObjectId,
        ref:'Coupon'
    },
    cancellationReason: String,
    cancellationDate: Date,
    orderNotes:String,
});


const Order = mongoose.model("order", orderSchema);
module.exports = Order;