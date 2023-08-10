import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import { uploadImageToCloudinary } from "../config/uploadImagenToCloudinary.js";
import mongoose from "mongoose";

export const accessChat = async (req, res) => {
    const { userId } = req.body;
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const reqUserIdObjectId = new mongoose.Types.ObjectId(req.user._id);

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        users: { $all: [reqUserIdObjectId, userIdObjectId] },
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        await Chat.updateOne(
            { _id: isChat[0]._id },
            { $set: { deletedBy: [] } } 
        );
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [reqUserIdObjectId, userIdObjectId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
};


export const fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $in: [req.user._id] } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .populate("picture")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name picture email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export const createGroupChat = async (req, res) => {
    const name = req.body.name;
    const users = JSON.parse(req.body.users);

    if (!users || !name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.body.userId);

    try {
        const imageFile = req.file;
        const imageUrl = await uploadImageToCloudinary(imageFile);

        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.body.userId,
            picture: imageUrl
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
};


export const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
};


export const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
};

export const updateGroupPicture = async (req, res) => {
    const { chatId } = req.body;

    try {
        const imageFile = req.file;
        const imageUrl = await uploadImageToCloudinary(imageFile);

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                picture: imageUrl,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(updatedChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export const deleteChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            res.status(404);
            throw new Error("Chat not found");
        }

        chat.deletedBy.addToSet(req.user._id);
        await chat.save();

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};


