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
        hasUnreadMessages: {
            type: Boolean,
            default: false
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        deletedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        picture: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
    },
    {
        timestamps: true
    }
);

export const Chat = mongoose.model("Chat", chatModel);
