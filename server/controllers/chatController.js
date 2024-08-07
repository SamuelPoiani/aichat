import { PrismaClient } from '@prisma/client';
import { getGroqChatCompletion } from '../services/groqService.js';
const prisma = new PrismaClient();

class chatController {
    async createChat(req, res) {
        try {
            const newChat = await prisma.chat.create({
                data: {
                    name: 'New Chat'
                }
            });
            res.json(newChat);
        } catch (error) {
            res.status(400).json({ message: "Error creating chat", error: error.message });
        }
    }

    async generateTitle(req, res) {
        try {
            const { chatId, firstMessage } = req.body;

            const prompt = `Generate a short, concise title (max 5 words) for a chat that starts with this message: "${firstMessage}". Respond with only the title, no quotes or explanations.`;
            const context = [{ role: "user", content: prompt }];

            let title = '';
            for await (const chunk of getGroqChatCompletion(context)) {
                const data = chunk;
                title += data.choices[0].delta.content || '';
            }

            title = title.trim().split('\n')[0].slice(0, 50); // Take first line and limit to 50 characters

            await prisma.chat.update({
                where: { id: Number(chatId) },
                data: { name: title }
            });

            res.json({ title });
        } catch (error) {
            res.status(400).json({ message: "Error generating title", error: error.message });
        }
    }

    async updateTitle(req, res) {
        try {
            const { chatId } = req.params;
            const { title } = req.body;

            await prisma.chat.update({
                where: { id: Number(chatId) },
                data: { name: title }
            });

            res.json({ message: "Title updated successfully" });
        } catch (error) {
            res.status(400).json({ message: "Error updating title", error: error.message });
        }
    }

    async deleteChat(req, res) {
        try {

            const results = {}

            const { id } = req.params;

            const deleteMessages = await prisma.message.deleteMany({
                where: { chatId: Number(id) }
            })
            results.deletedMessages = deleteMessages

            const deleteChat = await prisma.chat.delete({
                where: { id: Number(id) }
            })
            results.deletedChat = deleteChat

            res.status(200).json(results)
        } catch (error) {
            res.status(400).json({ message: "Error to delete conversation", error: error.message })
        }
    }


    async loadChatHistory(req, res) {
        const { chatId } = req.params;
        const messages = await prisma.message.findMany({
            where: {
                chatId: Number(chatId)
            }
        })
        res.json(messages);
    }

    async getChats(req, res) {
        const chats = await prisma.chat.findMany()
        res.json(chats)
    }
}

const ChatController = new chatController();

// Export the instance
export { ChatController };