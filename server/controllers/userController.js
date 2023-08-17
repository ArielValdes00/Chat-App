import { generateToken } from '../config/generateToken.js';
import { User } from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { uploadImageToCloudinary } from '../config/uploadImagenToCloudinary.js';
import nodemailer from "nodemailer";
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
    try {
        const users = await User.find({ _id: { $ne: req.user._id } });
        res.send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
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

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = generateToken(user._id);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: user.email, 
            subject: 'Password Reset',
            html: `
              <p>Hello,</p>
              <p>You have requested to reset your password.</p>
              <p>Click <a href="http://your-app-url/reset-password/${resetToken}">here</a> to reset your password.</p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,</p>
              <p>Your App Team</p>
            `,
          };
      
          await transporter.sendMail(mailOptions);
      
          res.status(200).json({ message: "Password reset email sent successfully" });

        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
};



