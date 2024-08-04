const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.js')

router.post('/createConversation', chatController.createConversation)

module.exports = router;