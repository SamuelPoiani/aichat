import { PrismaClient } from '@prisma/client';
import { getGroqChatCompletion } from '../services/groqService.js';
const prisma = new PrismaClient();

class chatController {
    async createChat(req, res) {
        try {
            const { name, instruction } = req.body;
            console.log('Creating chat with:', { name, instruction }); // Add this line for debugging
            const newChat = await prisma.chat.create({
                data: {
                    name: name || 'New Chat',
                    instruction: instruction || 'You are a helpful AI assistant.'
                }
            });
            console.log('New chat created:', newChat); // Add this line for debugging
            res.json(newChat);
        } catch (error) {
            console.error('Error creating chat:', error); // Add this line for debugging
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
            const { id } = req.params;
            await prisma.message.deleteMany({ where: { chatId: Number(id) } });
            await prisma.chat.delete({ where: { id: Number(id) } });
            res.json({ message: "Chat deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: "Error deleting chat", error: error.message });
        }
    }

    async resetChat(req, res) {
        try {
            const { id } = req.params;
            await prisma.message.deleteMany({ where: { chatId: Number(id) } });
            res.json({ message: "Chat reset successfully" });
        } catch (error) {
            res.status(400).json({ message: "Error resetting chat", error: error.message });
        }
    }

    async loadChatHistory(req, res) {
        const { chatId } = req.params;
        const chat = await prisma.chat.findUnique({
            where: { id: Number(chatId) },
            include: { mesagens: true }
        });
    
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
    
        res.json(chat.mesagens);
    }

    async getChats(_, res) {
        const chats = await prisma.chat.findMany()
        res.json(chats)
    }
}

const ChatController = new chatController();

// Export the instance
export { ChatController };