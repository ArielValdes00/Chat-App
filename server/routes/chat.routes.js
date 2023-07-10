import express  from "express";
import { protect } from "../middleware/authMiddleware.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup, updateGroupPicture } from "../controllers/chatController.js";
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/group", upload.single('image'), createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/update-picture", protect, upload.single('image'), updateGroupPicture);
router.put("/groupremove", protect, removeFromGroup);
router.put("/groupadd", protect, addToGroup);

export default router;