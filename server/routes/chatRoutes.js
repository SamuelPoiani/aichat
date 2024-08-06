import express from 'express'

import { ChatController } from '../controllers/chatController.js';
import { MessageController } from '../controllers/messageController.js';

const router = express.Router();

router.post('/create', ChatController.createChat)
router.post('/sendMessage', MessageController.sendMessage)
router.delete('/delete/:id', ChatController.deleteChat)

export default router;