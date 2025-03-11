
const mongoose = require('mongoose')
const constants = require('../Utility/constant')
const userSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    countryCode:{
        type:String,
    },
    phone:{
        type:String,
        unique:true, 
    },
    password:{
        type:String
    },
    emailVerify:{
        type:String,
        default:false,
    },
    emailNotVerify:{
        type:String,
    },
    phoneVerify:{
        type:String,
        default:false,
    },
    phoneNotVerify:{
        type:String,
    },
    gender:{
        type: String,
        enum: Object.values(constants.gender),
        default: constants.gender.MALE,
    },
    jti:{
        type:String,
    },
    age: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(constants.role)
    },
    isBlocked: {
        type:Boolean,
        default:false
    },
    isDeleted: {
        type:Boolean,
        default:false
    },
},{ timestamps: true })

const User = mongoose.model('user',userSchema)
module.exports = User

