const Notification = require('../Models/notification');

// Create a new notification
async function createNotification(req,res){
    try {
        const { userId, type, message } = req.body;
        const newNotification = new Notification({ userId, type, message });
        await newNotification.save();
        res.status(201).json({ message: "Notification created", data: newNotification });
    } catch (err) {
        console.log('error ha bhai createNotification function ma',err)
        res.status(500).json({ error:'error'});
    }
};

// Get all notifications for a user
async function getUserNotifications(req,res){
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.log('error ha bhai getUserNotifications function ma',err)
        res.status(500).json({ error:'error'});
    }
};

// Mark a notification as read
async function markAsRead(req,res){
    try {
        const { id } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!updatedNotification) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json({ message: "Notification marked as read", data: updatedNotification });
    } catch (err) {
        console.log('error ha bhai markRead function ma',err)
        res.status(500).json({ error:'error' });
    }
};

// Delete a notification
async function deleteNotification(req,res){
    try {
        const { id } = req.params;
        const deletedNotification = await Notification.findByIdAndDelete(id);
        if (!deletedNotification) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json({ message: "Notification deleted" });
    } catch (err) {
        console.log('error ha bhai deleteNotification functon ma ',err)
        res.status(500).json({ error:'error' });
    }
};


module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification
}