const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", 
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post", 
            required: true
        }
    },
    { timestamps: true }
);

const Like = mongoose.model("like", likeSchema);
module.exports = Like;
