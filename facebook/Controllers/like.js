const Like = require("../Models/like");
const Post = require("../Models/post");
const Notification = require('../Models/notification')
const Mongoose = require('mongoose')

//LIKE POST
async function likePost(req, res){
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

          //unlike post check
            const allReadyLike = await Like.findOneAndDelete({ userId, postId });
            if(allReadyLike){
           return  res.status(200).json({ message: "Post unliked successfully!" });
        }

        const like = new Like({ userId, postId });
        await like.save();
        const newNotification = await Notification.create({
            userId: postId,
            type: "like",
            message:`like on post ${newComment.postId}`
        });

        res.status(201).json({ message: " Post liked successfully!" });
    } catch (error) {
        console.log('error in like post function ',error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//UN-LIKE POST
async function unlikePost(req, res){
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        const deletedLike = await Like.findOneAndDelete({ userId, postId });
        console.log("deleted like",deletedLike)
        if (!deletedLike) {
            console.log("!deleted like",deletedLike)
            return res.status(400).json({ message: "You have not liked this post yet!" });
        }

        res.status(200).json({ message: "Post unliked successfully!" });
    } catch (error) {
        console.log('error in unlike post function ',error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Get All Users Who Liked a Post
async function getPostLikes(req, res){
    try {
        const postId  = new Mongoose.Types.ObjectId(req.params.id);
// console.log("loda lsn--------------",postId)
        const likes = await Like.find({postId: postId }).populate("userId", "username email");
// console.log(likes)
        res.status(200).json({ count: likes.length, likes });
    } catch (error) {
        console.log('error ha bhai get post likes function ma ',error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Get All Posts Liked by a User 
async function getUserLikedPosts(req, res){
    try {
        const userId = req.user._id;

        const likedPosts = await Like.find({ userId }).populate("postId", "caption image");

        res.status(200).json({ count: likedPosts.length, likedPosts });
    } catch (error) {
        console.log('error ha bhai',error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {
    likePost,
    unlikePost,
    getPostLikes,
    getUserLikedPosts,
}
