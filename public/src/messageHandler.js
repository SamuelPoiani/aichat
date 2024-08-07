import { getCurrentChatId, createNewChat, generateChatTitle, updateChatTitle, loadChats } from './chatService.js';
import { displayUserMessage, displayAssistantMessage } from './uiManager.js';
import { scrollToBottom } from './utils.js';

export async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageContent = messageInput.value.trim();
    if (!messageContent) return;

    let currentChatId = getCurrentChatId();
    if (!currentChatId) {
        await createNewChat();
        currentChatId = getCurrentChatId();
    }

    displayUserMessage(messageContent);
    const assistantResponse = displayAssistantMessage();
    messageInput.value = '';

    try {
        console.log('Sending message:', { chatId: currentChatId, content: messageContent });
        const response = await fetch('/api/chat/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: currentChatId,
                content: messageContent
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.substring(6));

                    if (data.end) {
                        break;
                    }

                    assistantResponse.innerHTML += data.content;
                    scrollToBottom(document.getElementById('chat-history'));
                }
            }
        }

        const chatHistory = document.getElementById('chat-history');
        if (chatHistory.children.length === 2) {
            const newTitle = await generateChatTitle(currentChatId, messageContent);
            await updateChatTitle(currentChatId, newTitle);
            loadChats();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        assistantResponse.innerHTML = 'Error: Unable to send message. Please try again.';
    }
}
