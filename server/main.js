import express from 'express'
const PORT = 4321;
const app = express();
import chatRoutes from './routes/chatRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

app.use(express.json())


app.use('/api/chat', chatRoutes)


app.get('/', (res, req) => {
    req.json("hello world")
})


app.listen(PORT ,() => {
console.log(`Server running on http://localhost:${PORT}`)
})