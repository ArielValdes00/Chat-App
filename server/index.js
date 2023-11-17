import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import messageRoutes from './routes/message.routes.js';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { Message } from './src/models/messageModel.js';
import http from "http";

const app = express()
dotenv.config()
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: "*"
}));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
    res.json("The server is running");
})

const port = process.env.PORT || 5000

const server = http.createServer(app);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Mongodb connected");
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}).catch((err) => {
    console.log({ err });
    process.exit(1);
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: "*"
    }
});

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

