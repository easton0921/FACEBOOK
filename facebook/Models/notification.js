const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }, 
    type: {
        type: String,
        required: true,
        enum: ["comment", "like", "friendRequest"]
    }, 
    message: {
        type: String,
        required: true
    }, 
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }
);

const Notification = mongoose.model("notification",notificationSchema)
module.exports = Notification


