const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
         type: String,
          required: true 
        },
    user: {
         type: String, 
         required: true
         }, 
    postId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "post",
        required: true
     },
     isDeleted:{
        type:Boolean,
        default:false,
     }
    },{timestamps: true});
    
    const Comment = mongoose.model("comment",commentSchema);
    
    module.exports = Comment;
    














