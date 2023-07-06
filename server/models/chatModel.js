import mongoose from "mongoose";

const chatModel = mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        images: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
    },
    {
        timestamps: true
    }
);

export const Chat = mongoose.model("Chat", chatModel);
