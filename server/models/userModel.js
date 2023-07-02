import mongoose from "mongoose";

const userModel = mongoose.Schema(
    {
        name: {
            type:String,
            require: true
        },
        email: {
            type:String,
            require: true
        },
        password: {
            type:String,
            require: true
        },
        picture: {
            type:String,
            require: true,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userModel);