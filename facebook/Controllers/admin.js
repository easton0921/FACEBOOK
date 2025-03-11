const express = require('express');
const User = require('../Models/user');
const UserOtp = require('../Models/otp');
const otpService = require('../Utility/otp');
const bcrypt = require('../Utility/password')
const jwt = require('../Utility/jwt');
const jti = require('../Utility/common')
const constants = require('../Utility/constant')
const Mongoose = require('mongoose');
const constant = require('../Utility/constant');


const app = express()
app.use(express.json())

//sign in admin
async function signinAdmin(req, res) {
  try {
    const { username, email, password, } = req.body;
    let obj = { username: username};
    let x = await jti.regex(email);//email check @gmail.com
    if (!x) {
      console.log('x,x', x)
      return res.status(400).json({ status: "Eamil is not proper" })
    }
    if (email) {
      if (await User.findOne({ email, emailVerify: true })) {
        return res.status(400).json({ status: "email already exist" })
      }
      let JTI = await jti.generateRandomString()
      obj.jti = JTI
      let checkDataExist = await User.find({ email, emailVerify: false }).deleteMany()
      let otpEmail = await otpService.otpForEmail(email)
      let pass = await bcrypt.hashPassword(password)
      console.log('hash', pass)
      obj.email = email
      obj.password = pass
      obj.otp = otpEmail
    }  else {
      res.status(400).json({ status: "required email or phone, countryCode..!" })
    }
    console.log('data in db', obj)
    
    obj.role=constants.role.ADMIN
    const dbStore = await User.create(obj)//user store data
    console.log('JTI', dbStore.jti)
    const token = jwt.genToken({ id: dbStore._id, jti: dbStore.jti ,role:constants.role.ADMIN})
    const otpStoredb = await UserOtp.create(obj)//db store data 

    res.status(200).json({ status: "OTP sent successfully.", token: token, jti: dbStore.jti,role:dbStore.role })


  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ status: 'error' });
  }
};

//verify check
async function verifySignin(req, res) {
  try {
    const id = req.user._id;
   if( req.user.role==="admin"){

    const { username, email, otp } = req.body;
    console.log("req", req.body)

    let obj = { verifyToken: id, username: username };
    if (email && otp) {
      const emailAndOtp = await UserOtp.findOne({ email, otp });
      if (!emailAndOtp) {
        return res.status(404).json({ status: 'Email and otp not exist' });
      }
      const emailAndOtpDelete = await UserOtp.deleteMany({ email })
      obj.emailVerify = true;
    }
  }

    else {
      res.status(404).json({ status: "required valid data" })
    }
    //db find data
    const dbStore = await User.findByIdAndUpdate(obj.verifyToken, obj, { new: true })
    console.log("obj ", obj)
    console.log('dbStore:', dbStore)
    if (!dbStore) {
      return res.status(404).json({ status: 'Invalid data' });
    }
    res.status(200).json({ status: 'otp verify', dbStore })

  } 
  catch (error) {
    console.log('error:', error)
    res.status(500).json({ error: "error" })
  }
};

//get profile
async function getProfile(req, res) {
  try {
    if( req.user.role==="admin"){

    const id = req.user._id
    console.log('id is ', id)
    const jti = id.jti
    console.log('id is', jti)
    const role = req.body.role

    const allDbUser = await User.findOne(id, jti,role)
    console.log('db', allDbUser)
    if (!allDbUser) {
      return res.status(404).json({ status: 'invalid token' })
    } else {
      return res.status(200).json({ status: allDbUser })
    }
  }
  else return res.status(404).json({status:"invalid token"})
  } catch (error) {
    console.log(error)
    res.status(404).json({ status: 'error...' })
  }
};

//login admin
async function loginProfile(req, res) {
    try {
      const { email, password } = req.body
      let obj = {};
      if (email && password) {
        const db = await User.findOne({ email, emailVerify: true})
        if (!db) {
          return res.status(404).json({ status: 'email not exist' })
        }
  
        let hash = db.password;//get password for db
        const passwordMatch = await bcrypt.checkPassword(password, hash)//match password 
        console.log('password', passwordMatch)
        obj.password = passwordMatch;
        let newJti = await jti.generateRandomString();
        let dbSaveJti = await User.findByIdAndUpdate(db._id, { jti: newJti }, { new: true })
        let token = await jwt.genToken({ id: db._id, jti: newJti,role:db.role})
        console.log('jti', dbSaveJti)
        // console.error('')
        if (passwordMatch === true && db.isBlocked===false && db.isDeleted===false) {
          res.status(200).json({ status: 'Logged in successfully.', token: token, jti: newJti ,role:db.role})
        } else if (passwordMatch === false) {
          res.status(200).json({ status: 'Invalid password..' })
        } else {
          res.status(404).json({ status: 'password required..!' })
        }
      }
      else return res.status(404).json({ status: 'Please enter require data..!' });
    }
    catch (err) {
      console.error('error login function ', err)
      res.status(500).json({ status: 'error' })
    }
  };
   
//update admin 
async function update(req, res) {
  try {
    const id = req.user._id
    const { username } = req.body;
    let updateData = await User.findByIdAndUpdate(id, req.body, { new: true });
    const jti = req.user.jti
    console.log('jti', jti)
    res.status(200).json({ id, status: updateData, jti: jti })

  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: 'error' })
  }
};

//admin logout
async function logout(req, res) {
  try {
    const id = req.user._id;
    const jtiDel = req.user.jti;
    console.log('blank', jtiDel)
    let db = await User.findByIdAndUpdate(id, { jti: '' }, { new: true })
    res.status(200).json({ status: 'User logout success' })
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: 'error' })
  }
};

// -------------------------------------------------crud admin by yser----------------------------------------------
async function adminCreateUser(req,res){
  try {
    const { username, phone, countryCode, email, password,} = req.body;
    const obj = {username:username};
    if(email){
    const check = await User.findOne({email:email,emailVerify:true})
    if(check){
      console.log('check',check)
        return res.status(404).json({status:"email allready exist"})
    }
    let pass = await bcrypt.hashPassword(password)
    obj.email = email;
    obj.password = pass;
    obj.emailVerify = true;
    if(phone && countryCode){
        if (await User.findOne({ phone, countryCode, phoneVerify: true })) {
          return res.status(400).json({ status: "phone number already exist" })
        }
        
        let checkDataExist = await User.find({ phone, countryCode, phoneVerify: false }).deleteMany()
        
        let hash = await bcrypt.hashPassword(password)
        console.log('hash', hash)
        obj.phone = phone
        obj.countryCode = countryCode
        obj.password = hash
        obj.phoneVerify = true;
      }
  }
  else return res.status(404).json({status:"email or phone number required"})
  obj.role = constant.role.USER;
    const create = await User.create(obj)
    console.log('create admin by user', create);
    res.status(200).json({status:"Account created successfully.",user:create,})

  } catch (error) {
    console.log("error ha bhai admin user function ma ",error);
    res.status(500).json({status:"error"})
  }
};

//user update
async function userUpdate(req,res){
   try {
    const body = req.body;//request of body
    const user = await User.findByIdAndUpdate(req.params.id,
      { $set: {
        username:body.username,
        age:body.age,
        gender:body.gender
        }
    },{new:true}
    );
    return res.status(200).json({status:"Success",User:user})
   } catch (error) {
    console.log('error ha bhai user update',error)
    res.status(500).json({status:"error"})
   }
};

//get all db
async function userRead(req,res){
  try {

     const user = await User.find({isDeleted:false,role:"user"})
     const count = await User.countDocuments({isDeleted:false,role:"user"});
    return res.status(200).json({status:user,count:count})
  } catch (error) {
    console.log('error ha bhai userRead',error)
  }
};

//find by id
async function findByIdP(req,res){
  try {
    const user =await User.findById(req.params.id)
    if(!user) return res.status(404).json({error:"User not found"})
        return res.status(200).json({status:user})
} catch (error) {
    console.log('error',error)
    res.status(500).json({status:"error"})
  }
};


//user delete
async function userDeleteById(req,res){
  try {
    const del = await User.findByIdAndUpdate(req.params.id,{isDeleted:true},{new:true})
    if(!del)return res.status(404).json({status:"id not match"})
  return res.status(200).json({status:'Account deleted successfully.',delete : del.isDeleted})

  } catch (error) {
    console.log('error',error)
    res.status(500).json({status:"error"})
  }
  
};

//User blocked by admin 
async function userBlocked(req,res){
  try {
    
    const find = await User.findById(req.params.id)
    if(!find){
      return res.status(404).json({status:"invalid id"})
    }
    const userBlock = await User.findByIdAndUpdate(req.params.id,{jti:"",isBlocked:true},{new :true})
    res.status(200).json({status:userBlock._id,isBlocked:userBlock.isBlocked})
    
  } catch (error) {
    console.log('error ha bhai userBlocked function ma',error)
    res.status(500).json({status:"error"})
  }
}



  module.exports = {
    signinAdmin,
    verifySignin,
    loginProfile,
    getProfile,
    update,
    logout,
    adminCreateUser,
    userUpdate,
    userRead,
    findByIdP,
    userDeleteById,
    userBlocked,
  }