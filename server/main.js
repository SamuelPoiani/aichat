import express from 'express'
import path from 'path'
import chatRoutes from './routes/chatRoutes.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);


const app = express();
const PORT = 4321;
dotenv.config()

app.use(express.static('public'))
app.use(express.json())


app.use('/api/chat', chatRoutes)


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})