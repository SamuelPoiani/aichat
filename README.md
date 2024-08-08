# AIChat

AIChat is a simple AI-powered chat application built with Node.js, Express, and Groq AI.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- SQLite

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/SamuelPoiani/aichat.git
   cd aichat
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Open your web browser and navigate to `http://localhost:4321`

3. You can now use the chat interface to:
   - Create new chats
   - Send messages to the AI
   - View chat history
   - Rename, reset, or delete chats

## Features

- Real-time AI responses using Groq AI
- Chat history persistence
- Multiple chat sessions
- Automatic chat title generation

## License

This project is licensed under the MIT License. See the LICENSE file for details.
