import { Message } from '../src/models/messageModel.js';
import { User } from '../src/models/userModel.js';
import { Chat } from '../src/models/chatModel.js';

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
        console.log("Complete all Fields");
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

        await Chat.updateOne(
            { _id: chatId },
            { $set: { hasUnreadMessages: true, latestMessage: message } }
        );
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export const readMessages = async (req, res) => {
    const { chatId } = req.body;
    
    try {
        await Chat.updateOne(
            { _id: chatId },
            { $set: { hasUnreadMessages: false } }
        );

        await Message.updateMany(
            { chat: chatId, readBy: { $ne: req.user._id } },
            { $addToSet: { readBy: req.user._id } }
        );

        res.sendStatus(204);
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
