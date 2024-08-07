import express from 'express'

import { ChatController } from '../controllers/chatController.js';
import { messageController } from '../controllers/messageController.js';

const router = express.Router();

router.post('/createChat', ChatController.createChat)
router.post('/generateTitle', ChatController.generateTitle)
router.put('/updateTitle/:chatId', ChatController.updateTitle)
router.get('/getChats', ChatController.getChats)
router.get('/loadChatHistory/:chatId', ChatController.loadChatHistory)
router.post('/sendMessage', messageController.sendMessage)
export default router;