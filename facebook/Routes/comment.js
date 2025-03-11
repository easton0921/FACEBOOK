const express = require('express');
const {  jwtMiddleware}= require('../Middlewares/jwt');
const {createComment, getCommentsByPost, updateComment,deleteComment,} = require('../Controllers/comment')

const router = express.Router();

//user post 
router.post('/',jwtMiddleware,createComment)// create a comment 
router.get("/count/:id", getCommentsByPost);//comment count on a post
router.put('/:id',jwtMiddleware,updateComment)//for practice
router.delete("/:id", jwtMiddleware, deleteComment);


module.exports = router;

