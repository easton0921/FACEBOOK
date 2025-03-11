const Comment = require('../Models/comment')
const Mongoose = require('mongoose')
const Notification = require('../Models/notification');

// comment
async function createComment(req, res) {
    try {
        const user = req.user.username
        const { text, postId } = req.body;
        const newComment = new Comment({ text, user, postId });
        await newComment.save();
        const newNotification = await Notification.create({
            userId: postId,
            type: "comment",
            message:`comment on post ${req.user._id}`
        });
        res.status(201).json({ message: "Comment created", comment: newComment });
    } catch (err) {
        console.log(('error ha bhai create comment function ma ', err))
        res.status(500).json({ error: "error" });
    }
};

// Get all comments for a  post
async function getCommentsByPost(req, res) {
    try {
        const postId = new Mongoose.Types.ObjectId(req.params.id);
        console.log('postId', postId)
        const comments = await Comment.find({ postId: postId, isDeleted: false });
        console.log('comments', comments)
        res.status(200).json({ count: comments.length, comments });
    } catch (err) {
        console.log('error ha bhai getCommnetByPost function ma ', err)
        res.status(500).json({ error: 'error' });
    }
};

// Update a comment
async function updateComment(req, res) {
    try {
        const id = new Mongoose.Types.ObjectId(req.params.id);//comment id
        console.log('comment id', id)
        const { text } = req.body;
        console.log('body', text)
        const updatedComment = await Comment.findByIdAndUpdate(id, { text: text }, { new: true });
        console.log('updateComment', updatedComment)
        if (!updatedComment) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json({ message: "Comment updated", comment: updatedComment });
    } catch (err) {
        console.log('error ha bhai update comment function ma ', err)
        res.status(500).json({ error: "error" });
    }
};

// Delete a comment
async function deleteComment(req, res) {
    try {
        const id = new Mongoose.Types.ObjectId(req.params.id)
        const deletedComment = await Comment.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedComment) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        console.log('error ha bhai deleteComment fucntion ma ', err)
        res.status(500).json({ error: "error" });
    }
};


module.exports = {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
}
