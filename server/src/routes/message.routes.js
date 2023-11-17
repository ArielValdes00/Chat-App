import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allMessages, sendMessage, deleteAllMessages, readMessages } from '../controllers/messageControllers.js';

const router = express.Router();

router.get("/:chatId", protect, allMessages);
router.post("/", protect, sendMessage);
router.put("/:chatId", protect, deleteAllMessages);
router.post("/read", protect, readMessages)

export default router;
