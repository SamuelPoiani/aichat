const express = require('express');
const PORT = 4321;
const app = express();
const chatRoutes = require('./routes/chatRoutes')

app.use(express.json())

app.use('/chat', chatRoutes)


app.get('/', (res, req) => {
    req.json("hello world")
})


app.listen(PORT ,() => {
console.log(`Server running on http://localhost:${PORT}`)
})