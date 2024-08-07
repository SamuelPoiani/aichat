import { scrollToBottom } from './utils.js';

export function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('mb-4');
    const content = JSON.parse(message.content);
    messageDiv.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
            <p class="font-bold text-blue-400">User</p>
            <p>${content.user}</p>
        </div>
        <div class="bg-gray-700 rounded-lg p-4">
            <p class="font-bold text-green-400">Assistant</p>
            <p>${content.assistant}</p>
        </div>
    `;
    return messageDiv;
}

export function updateChatList(chats, onChatClick) {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    chats.forEach(chat => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                ${chat.name}
            </button>
        `;
        listItem.querySelector('button').addEventListener('click', () => onChatClick(chat.id));
        chatList.appendChild(listItem);
    });
}

export function updateChatHistory(messages) {
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML = '';
    messages.forEach(message => {
        const messageDiv = createMessageElement(message);
        chatHistory.appendChild(messageDiv);
    });
    scrollToBottom(chatHistory);
}

export function displayUserMessage(content) {
    const chatHistory = document.getElementById('chat-history');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('mb-4');
    userMessageDiv.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
            <p class="font-bold text-blue-400">User</p>
            <p>${content}</p>
        </div>
    `;
    chatHistory.appendChild(userMessageDiv);
    scrollToBottom(chatHistory);
}

export function displayAssistantMessage() {
    const chatHistory = document.getElementById('chat-history');
    const assistantMessageDiv = document.createElement('div');
    assistantMessageDiv.classList.add('bg-gray-700', 'rounded-lg', 'p-4', 'mb-4');
    assistantMessageDiv.innerHTML = `
        <p class="font-bold text-green-400">Assistant</p>
        <p id="assistant-response"></p>
    `;
    chatHistory.appendChild(assistantMessageDiv);
    scrollToBottom(chatHistory);
    return document.getElementById('assistant-response');
}
