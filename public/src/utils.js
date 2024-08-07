export function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

export function parseMessageContent(message) {
    return JSON.parse(message.content);
}
