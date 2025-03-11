const express = require('express');
const {  jwtMiddleware}= require('../Middlewares/jwt');
const { upload } = require('../Middlewares/multer');
const {postOne,getPost,deletePost,getAllPost,} = require('../Controllers/post')

const router = express.Router();

//user post 
router.post('/post',jwtMiddleware,upload,postOne)
router.get('/my-post',jwtMiddleware,getPost)
router.delete('/post/:id',jwtMiddleware,deletePost)
router.get('/all-post',jwtMiddleware,getAllPost)

module.exports = router;

