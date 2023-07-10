import express  from "express";
import { authUser, getUserInfo, getUsers, registerUser, updateProfilePicture } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from 'multer';

const upload = multer();

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/userInfo", protect, getUserInfo);
router.post("/", registerUser);
router.post("/login", authUser);
router.post("/updateimage", protect, upload.single('image'), updateProfilePicture);

export default router;