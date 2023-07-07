import express  from "express";
import { authUser, getUsers, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.post("/", registerUser);
router.post("/login", authUser);

export default router;