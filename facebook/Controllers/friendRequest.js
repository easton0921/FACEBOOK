const Request = require('../Models/friendRequest')
const User = require('../Models/user')
const Post = require('../Models/post')


//friend request send
async function friendRequestSend(req, res) {
    try {
        const body = req.body
        console.log('req of body', body)
        const senderId =  req.user._id
        const receiverId = req.body
        console.log('sender id', senderId)
        console.log(' receiverId', receiverId)
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }
        const existingRequest = await Request.findOne({ sender: senderId, receiver: receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent' });
        }


        const request = new Request({ sender: senderId, receiver: receiverId, status: 'pending' });
        await request.save();

        res.status(201).json({ message: 'Request sent successfully', request });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

//friend request received
async function friendRequestReceived(req, res) {
    try {
        const userId = req.user._id; 
        console.log('User ID:', userId);

        
        const receivedRequests = await Request.find({ receiver: userId,status:"pending" }).populate('sender', 'username email gender age');

        res.status(200).json({ status: "success", receivedRequests });
    } catch (error) {
        console.error('Error in received function:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

//friend request accepted / rejected
async function acceptRequest(req, res) {
    try {
        const { _id, status } = req.body; 
        console.log("Received request body:", req.body);
        const receiver = await Request.findById(_id);
        if (!receiver) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        const statusUpdate = await Request.findByIdAndUpdate(_id,{ status: status },{ new: true });
        res.status(200).json({ success: true, message: "Request accepted", data: statusUpdate });
    } catch (error) {
        console.error("Error in acceptRequest function:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




module.exports = {
    friendRequestSend,
    friendRequestReceived,
    acceptRequest,
}
