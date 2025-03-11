const express = require('express');
const { jwtMiddleware, } = require('../Middlewares/jwt');
const Multerfile = require('../Middlewares/multer');

const { handleUserSignup, handleGetAllUser, handleGetUserVerity, loginProfile, update, logout, changePassword,
     forgetPassword, resetPassword, singleFileUpload,insertMany,Delete, anotherUserListing,userFindById}
     = require('../Controllers/user')

const router = express.Router();

//user onboarding
router.post('/signup', handleUserSignup);
router.post('/verify', jwtMiddleware, handleGetUserVerity);
router.post('/login', loginProfile)
router.get('/profile', jwtMiddleware, handleGetAllUser);
router.put('/update', jwtMiddleware, update)
router.get('/logout', jwtMiddleware, logout)
router.put('/change-password', jwtMiddleware, changePassword)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)
router.post("/file-upload", Multerfile.upload, singleFileUpload,)
router.post('/insertMany', insertMany)
router.delete('/account-delete', jwtMiddleware,Delete)


// get another users listings
router.get('/all-user', jwtMiddleware,anotherUserListing);
router.get('/id/:id',jwtMiddleware,userFindById)


module.exports = router;


