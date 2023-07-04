import express  from "express";
import { authUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/api/login", authUser);
router.post("/api/register", registerUser);

export default router;