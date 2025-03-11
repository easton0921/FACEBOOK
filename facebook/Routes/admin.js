const express = require('express');
const {  adminJwtMiddleware}= require('../Middlewares/jwt');
const Multerfile = require('../Middlewares/multer');
const {signinAdmin, verifySignin,loginProfile,update,getProfile,logout,adminCreateUser,userUpdate,userRead,userDeleteById,findByIdP,userBlocked,} = require('../Controllers/admin')
const router = express.Router();

//admin onboarding
router.post('/signin',signinAdmin)
router.post('/verify', adminJwtMiddleware,verifySignin)
router.post('/login-profile',loginProfile)
router.get('/get-profile', adminJwtMiddleware,getProfile);
router.put('/update', adminJwtMiddleware,update)
router.get('/logout', adminJwtMiddleware,logout)

//user crud by admin 
router.post('/user-create', adminJwtMiddleware,adminCreateUser)
router.patch('/user-update/:id', adminJwtMiddleware,userUpdate)
router.get('/user-get',adminJwtMiddleware,userRead)
router.delete('/user-delete/:id',adminJwtMiddleware,userDeleteById)
router.get('/user/:id',adminJwtMiddleware,findByIdP)
router.put('/user-blocked/:id',adminJwtMiddleware,userBlocked)

module.exports = router;

