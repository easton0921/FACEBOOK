const express = require('express');
const {  jwtMiddleware}= require('../Middlewares/jwt');
const {likePost,unlikePost,getPostLikes,getUserLikedPosts,} = require('../Controllers/like')

const router = express.Router();

//user post 
router.post('/liked',jwtMiddleware,likePost)//===========this like and unlike both use 
router.post('/unliked',jwtMiddleware,unlikePost)//for practice
router.get("/post/:id", getPostLikes);
router.get("/user/liked-posts", jwtMiddleware, getUserLikedPosts);


module.exports = router;

