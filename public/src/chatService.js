import { updateChatList, updateChatHistory } from './uiManager.js';
import { handleChatItemClick, handleDeleteChat, handleRenameChat, handleResetChat } from './eventHandlers.js';

let currentChatId = null;

export async function loadChats() {
    try {
        const response = await fetch('/api/chat/getChats');
        const chats = await response.json();
        updateChatList(chats, handleChatItemClick, handleDeleteChat, handleRenameChat, handleResetChat);
        
        // If there are no chats left, create a new one
        if (chats.length === 0) {
            await createNewChat();
        }
        
        return chats;
    } catch (error) {
        console.error('Error loading chats:', error);
        return [];
    }
}

export async function loadChatHistory(chatId) {
    try {
        const response = await fetch(`/api/chat/loadChatHistory/${chatId}`);
        const messages = await response.json();
        updateChatHistory(messages);
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

export async function createNewChat() {
    try {
        const response = await fetch('/api/chat/createChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: 'New Chat',
                instruction: 'You are a helpful AI assistant.'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const newChat = await response.json();
        currentChatId = newChat.id;
        document.getElementById('chat-history').innerHTML = '';
        window.history.pushState({}, '', `/?chat=${currentChatId}`);
        await loadChats();
        console.log('New chat created:', newChat);
        return newChat;
    } catch (error) {
        console.error('Error creating new chat:', error);
        throw error;
    }
}

export async function generateChatTitle(chatId, firstMessage) {
    try {
        const response = await fetch('/api/chat/generateTitle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatId, firstMessage })
        });
        const { title } = await response.json();
        return title;
    } catch (error) {
        console.error('Error generating chat title:', error);
        return 'New Chat';
    }
}

export async function updateChatTitle(chatId, newTitle) {
    try {
        await fetch(`/api/chat/updateTitle/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        });
    } catch (error) {
        console.error('Error updating chat title:', error);
    }
}

export async function deleteChat(chatId) {
    try {
        const response = await fetch(`/api/chat/deleteChat/${chatId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await loadChats();
    } catch (error) {
        console.error('Error deleting chat:', error);
    }
}

export async function renameChat(chatId, newName) {
    try {
        const response = await fetch(`/api/chat/updateTitle/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newName })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await loadChats();
    } catch (error) {
        console.error('Error renaming chat:', error);
    }
}

export async function resetChat(chatId) {
    try {
        const response = await fetch(`/api/chat/resetChat/${chatId}`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await loadChatHistory(chatId);
    } catch (error) {
        console.error('Error resetting chat:', error);
    }
}

export async function initializeChat() {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat');

    if (chatId) {
        currentChatId = Number(chatId);
        await loadChatHistory(currentChatId);
    } else {
        await createNewChat();
    }
    loadChats();
}

export function getCurrentChatId() {
    return currentChatId;
}

export function setCurrentChatId(chatId) {
    currentChatId = chatId;
}