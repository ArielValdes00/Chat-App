import express  from "express";
import { authUser, getUsers, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

export default router;