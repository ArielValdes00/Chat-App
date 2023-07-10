import { generateToken } from '../config/generateToken.js';
import { User } from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { uploadImageToCloudinary } from '../config/uploadImagenToCloudinary.js';
dotenv.config()

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, picture } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please complete all the fields" });
        };
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        };

        const user = await User.create({ name, email, password, picture });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: "Invalid Email" });
        } else if (await user.matchPassword(password.toString())) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Invalid Password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { name: { $regex: req.query.search, $options: "i" } },
        ]
    }
        : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
}

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userInfo = {
            ...user.toObject(),
            token: req.token
        };
        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const updateProfilePicture = async (req, res) => {
    try {
        const imageFile = req.file;

        const imageUrl = await uploadImageToCloudinary(imageFile);

        await User.findByIdAndUpdate(req.user._id, { picture: imageUrl });

        res.send('Profile picture updated');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

