import { PrismaClient } from '@prisma/client';
import { getGroqChatCompletion } from '../services/groqService.js';
const prisma = new PrismaClient();

class MessageController {
    async sendMessage(req, res) {
        try {
            const { chatId, content } = req.body;

            const chat = await prisma.chat.findUnique({
                where: { id: Number(chatId) },
                include: {
                    mesagens: {
                        orderBy: {
                            id: 'asc'
                        }
                    }
                }
            });

            if (!chat) {
                return res.status(404).json({ message: "Chat not found" })
            }

            const context = chat.mesagens.map(message => {
                let parsed;
                try {
                    parsed = JSON.parse(message.content);
                } catch (e) {
                    return { role: "user", content: message.content };
                }
                return [
                    { role: "user", content: parsed.user },
                    { role: "assistant", content: parsed.assistant }
                ];
            }).flat();

            context.push({ role: "user", content: content });

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            let assistantResponse = '';

            for await (const chunk of getGroqChatCompletion(context)) {
                const data = chunk;
                const content = data.choices[0].delta.content || '';
                assistantResponse += content;
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }

            await prisma.message.create({
                data: {
                    chatId: Number(chatId),
                    content: JSON.stringify({
                        user: content,
                        assistant: assistantResponse
                    })
                }
            });

            res.write(`data: ${JSON.stringify({ end: true })}\n\n`);
            res.end();
        } catch (error) {
            res.status(400).json({ message: "Error sending message", error: error.message });
        }
    }
}

export const messageController = new MessageController();