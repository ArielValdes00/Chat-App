import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import messageRoutes from './routes/message.routes.js';
import cors from 'cors';
import { Server } from 'socket.io';
import { Message } from './models/messageModel.js';

const app = express()
dotenv.config()
connectDB()
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000' || process.env.VERCEL_URL,
    credentials: true
}));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
    res.json("The server is running");
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
console.log(`server running on port ${PORT}`);

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    })
    socket.on("message read", async (data) => {
        const { chatId, userId } = data;

        await Message.updateMany(
            { chat: chatId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );
    });
    socket.off("disconnect", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});


