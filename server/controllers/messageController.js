const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class messageController {
    async sendMessage(req, res){
        try {
            const {chatId, content} = req.body;
            const chat = await prisma.chat.findUnique({
                where: {id: Number(chatId)}
            })

            if(!chat){
                return res.status(404).json({message: "Chat not found"})
            }

            const newMessage = await prisma.message.create({
                data: {
                    chatId: Number(chatId),
                    content
                }
            })
            res.status(201).json(newMessage)
        } catch (error) {
            res.status(400).json({message: "Error to send message", error: error.message})
        }
    }
}

module.exports = new messageController();