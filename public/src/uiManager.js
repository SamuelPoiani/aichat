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

export function updateChatList(chats, onChatClick, onDeleteClick, onRenameClick, onResetClick) {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';

    // Close all open menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.options-button') && !e.target.closest('.options-menu')) {
            document.querySelectorAll('.options-menu').forEach(menu => menu.style.display = 'none');
        }
    });

    chats.forEach(chat => {
        const listItem = document.createElement('li');
        listItem.classList.add('flex', 'justify-between', 'items-center', 'px-4', 'py-2', 'hover:bg-gray-700', 'transition-colors', 'relative');
        listItem.innerHTML = `
            <button class="text-left flex-grow truncate chat-button">
                ${chat.name}
            </button>
            <div class="relative">
                <button class="text-gray-400 hover:text-white focus:outline-none options-button">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="options-menu">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rename-option">Rename</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 reset-option">Reset</a>
                    <a href="#" class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-700 delete-option">Delete</a>
                </div>
            </div>
        `;

        const chatButton = listItem.querySelector('.chat-button');
        const optionsButton = listItem.querySelector('.options-button');
        const optionsMenu = listItem.querySelector('.options-menu');
        const renameOption = listItem.querySelector('.rename-option');
        const resetOption = listItem.querySelector('.reset-option');
        const deleteOption = listItem.querySelector('.delete-option');

        chatButton.addEventListener('click', () => onChatClick(chat.id));
        optionsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close all other menus
            document.querySelectorAll('.options-menu').forEach(menu => {
                if (menu !== optionsMenu) menu.style.display = 'none';
            });
            // Calculate the position of the options menu
            const rect = optionsButton.getBoundingClientRect();
            optionsMenu.style.top = `${rect.top}px`;
            optionsMenu.style.left = `${rect.right + 8}px`; // Adjust the offset as needed
            // Toggle the current menu
            optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
        });
        renameOption.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onRenameClick(chat.id);
            optionsMenu.style.display = 'none';
        });
        resetOption.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onResetClick(chat.id);
            optionsMenu.style.display = 'none';
        });
        deleteOption.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteClick(chat.id);
            optionsMenu.style.display = 'none';
        });

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
        <p class="assistant-response"></p>
    `;
    chatHistory.appendChild(assistantMessageDiv);
    scrollToBottom(chatHistory);
    return assistantMessageDiv.querySelector('.assistant-response');
}