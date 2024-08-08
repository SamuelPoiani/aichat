import { loadChatHistory, setCurrentChatId, deleteChat, renameChat, resetChat, loadChats } from './chatService.js';
import { sendMessage } from './messageHandler.js';
import { updateChatList } from './uiManager.js';

export function initializeEventListeners() {
    const newChatButton = document.getElementById('new-chat');
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');

    newChatButton.addEventListener('click', handleNewChatClick);
    sendButton.addEventListener('click', handleSendButtonClick);
    messageInput.addEventListener('keypress', handleMessageInputKeypress);

    loadChats().then(chats => {
        if (chats && Array.isArray(chats)) {
            updateChatList(chats, handleChatItemClick, handleDeleteChat, handleRenameChat, handleResetChat);
        } else {
            console.error('Invalid chats data:', chats);
            // Optionally, display an error message to the user
        }
    }).catch(error => {
        console.error('Error loading chats:', error);
        // Optionally, display an error message to the user
    });
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

export function handleDeleteChat(chatId) {
    if (confirm('Are you sure you want to delete this chat?')) {
        deleteChat(chatId).then(() => {
            loadChats(); // Reload the chat list after deletion
            // Clear the chat history
            document.getElementById('chat-history').innerHTML = '';
            // Reset the current chat ID
            setCurrentChatId(null);
            // Update the URL to the root
            window.history.pushState({}, '', '/');
        });
    }
}

export function handleRenameChat(chatId) {
    const newName = prompt('Enter new name for the chat:');
    if (newName) {
        renameChat(chatId, newName);
    }
}

export function handleResetChat(chatId) {
    if (confirm('Are you sure you want to reset this chat? All messages will be deleted.')) {
        resetChat(chatId);
    }
}