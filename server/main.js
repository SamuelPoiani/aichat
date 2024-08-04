const express = require('express');
const PORT = 4321;
const app = express();

app.get('/', (res, req) => {
    req.json("hello world")
})


app.listen(PORT ,() => {
console.log(`Server running on http://localhost:${PORT}`)
})