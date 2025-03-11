const express = require('express');
const common = require('./common');
const User = require('../Models/user');
const UserOtp = require('../Models/otp');
express.json()
//email otp 
async function otpForEmail(email) {
    try {
      const deleteResult = await UserOtp.deleteMany({ email });
      console.log("Deleted OTPs:", deleteResult);
      let otpIs = common.otpCreate();
      console.log("Generated OTP for email:", otpIs);
      // await UserOtp.create({ email, otp: otpIs });
      return otpIs;
    } catch (error) {
      console.error("Error in otpForEmail function please check:", error);
      throw error;
    }
  }
  

//phone otp 
async function otpForPhone(phone, countryCode) {
    try {
      const deleteResult = await UserOtp.deleteMany({ phone, countryCode });
      console.log("Deleted OTPs:", deleteResult);
      let otpIs = common.otpCreate();
      console.log("Generated OTP for phone:", otpIs);
      // await UserOtp.create({ phone, countryCode, otp: otpIs });
      return otpIs;
    } catch (error) {
      console.error("Error in otpForPhone function please check:", error);
      throw error; 
    }
  }
module.exports = {
    otpForEmail,
    otpForPhone,
};
