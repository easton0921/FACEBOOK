const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    video: {
        type: String
    },
    caption: {
        type: String
    },
    audio: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }
)

const Post = mongoose.model('post', postSchema)
module.exports = Post
