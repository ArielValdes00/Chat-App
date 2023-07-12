import { Message } from '../models/messageModel.js';
import { User } from '../models/userModel.js';
import { Chat } from '../models/chatModel.js';

export const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name picture email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};


export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Datos inválidos pasados en la solicitud");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);
        message = await Message.findById(message._id)
            .populate("sender", "name picture")
            .populate("chat")
            .exec();

        message = await User.populate(message, {
            path: "chat.users",
            select: "name picture email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export const deleteAllMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            res.status(404);
            throw new Error("Chat not found");
        }

        await Message.updateMany(
            { chat: chatId },
            { $addToSet: { deletedBy: req.user._id } }
        );

        res.json({ message: 'All messages are deleted' });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
