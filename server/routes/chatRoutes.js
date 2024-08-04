const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.js')
const messageController = require('../controllers/messageController.js')

router.post('/create', chatController.createChat)
router.post('/sendMessage', messageController.sendMessage)
router.delete('/delete/:id', chatController.deleteChat)

module.exports = router;