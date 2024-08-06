import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class chatController {
    
    async createChat(req, res) {
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

    async deleteChat(req, res) {
        try {

            const results = {}

            const { id } = req.params;

            const deleteMessages = await prisma.message.deleteMany({
                where: {chatId: Number(id) }
            })
            results.deletedMessages = deleteMessages

            const deleteChat = await prisma.chat.delete({
                where: {id: Number(id)}
            })
            results.deletedChat = deleteChat

            res.status(200).json(results)
        } catch (error) {
            res.status(400).json({message: "Error to delete conversation", error: error.message})
        }
    }
}

const ChatController = new chatController();

// Export the instance
export { ChatController };