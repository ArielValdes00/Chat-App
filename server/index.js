import express from 'express';
import dotenv from 'dotenv';
import { chats } from './data.js';

const app = express()
dotenv.config()

app.get("/api/chat", (req, res) => {
    res.send(chats)
})

app.get("/api/chat/:id", (req, res) => {
    const singleChat = chats.find(chat => chat._id === req.params.id)
    res.send(singleChat)
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log(`server running on port ${PORT}`)