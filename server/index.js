import express from 'express';
import dotenv from 'dotenv';
import { chats } from './data.js';
import { connectDB } from './config/database.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import cors from 'cors';

const app = express()
dotenv.config()
connectDB()
app.use(express.json());
app.get("/api/chat", (req, res) => {
    res.send(chats)
})

app.get("/api/chat/:id", (req, res) => {
    const singleChat = chats.find(chat => chat._id === req.params.id)
    res.send(singleChat)
})
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log(`server running on port ${PORT}`)

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
