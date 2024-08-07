import { createNewChat, loadChatHistory, getCurrentChatId, setCurrentChatId } from './chatService.js';
import { sendMessage } from './messageHandler.js';

export function initializeEventListeners() {
    const newChatButton = document.getElementById('new-chat');
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');

    newChatButton.addEventListener('click', handleNewChatClick);
    sendButton.addEventListener('click', handleSendButtonClick);
    messageInput.addEventListener('keypress', handleMessageInputKeypress);
}

export function handleNewChatClick() {
    setCurrentChatId(null);
    document.getElementById('chat-history').innerHTML = '';
    window.history.pushState({}, '', '/');
    document.getElementById('message-input').focus();
}

export function handleSendButtonClick() {
    sendMessage();
}

export function handleMessageInputKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

export function handleChatItemClick(chatId) {
    setCurrentChatId(chatId);
    loadChatHistory(chatId);
    window.history.pushState({}, '', `/?chat=${chatId}`);
}
