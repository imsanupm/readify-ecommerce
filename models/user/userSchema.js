const mongoose = require("mongoose")
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique:true,
        sparse: true
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    phonenumber: {
        type: Number,
        // required: false,
        unique:true,
        // sparse:true,
        // default:null,

    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    photo: {
        type: String,
        default: "/uploads/profile-pictures/default.png"
    },
    is_admin: {
        type: Number,
        default:0
      },
      addresses:[{
        type:Schema.Types.ObjectId,
        ref:'Address'
    }],


}, { timestamps: true });
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema)