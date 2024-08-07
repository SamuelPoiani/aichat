import { initializeEventListeners } from './eventHandlers.js';
import { initializeChat } from './chatService.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeChat();
});
