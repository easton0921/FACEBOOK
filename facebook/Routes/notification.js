const express = require('express');
const {  jwtMiddleware}= require('../Middlewares/jwt');
const {createNotification,getUserNotifications,markAsRead,deleteNotification} = require('../Controllers/notification')

const router = express.Router();

//user post 
router.post("/", jwtMiddleware,createNotification);
router.get("/:userId", jwtMiddleware,getUserNotifications);
router.put("/read/:id", jwtMiddleware,markAsRead);
router.delete("/:id", jwtMiddleware,deleteNotification);


module.exports = router;

