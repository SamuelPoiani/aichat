const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class chatController {

    async createConversation(req, res) {
        try {
            const { name } = req.body;
            const newConversation = await prisma.chat.create({
                data: { name }
            });
            res.status(201).json(newConversation)
        } catch (error) {
            res.status(400).json({ message: "Error to create conversation", error: error.message })
        }

    }
}

module.exports = new chatController();