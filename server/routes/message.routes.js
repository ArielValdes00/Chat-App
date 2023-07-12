import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allMessages, sendMessage, deleteAllMessages } from '../controllers/messageControllers.js';

const router = express.Router();

router.get("/:chatId", protect, allMessages);
router.post("/", protect, sendMessage);
router.put("/:chatId", protect, deleteAllMessages);

export default router;
