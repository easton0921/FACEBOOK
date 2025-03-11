const mongoose = require('mongoose')
const userOtpSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    countryCode:{
        type:String,
    },
    otp:{
        type:Number,
        required:true,
    },
},{timestams:true}
);
const Userotp = mongoose.model("Userotp",userOtpSchema)
module.exports = Userotp