import { generateToken } from '../config/generateToken.js';
import { User } from '../models/userModel.js';

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

        if(!user) {
            res.status(401).json({ message: "Invalid Email" });
        } else if(await user.matchPassword(password.toString())) {
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

