const express = require('express');
const {  jwtMiddleware}= require('../Middlewares/jwt');
const {friendRequestSend,friendRequestReceived,acceptRequest,} = require('../Controllers/friendRequest')

const router = express.Router();

//user post 
router.post('/send',jwtMiddleware,friendRequestSend)
router.get('/friend-requests/received',jwtMiddleware,friendRequestReceived)
router.put('/accept',jwtMiddleware,acceptRequest)


module.exports = router;

