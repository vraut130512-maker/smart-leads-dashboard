import { Router } from "express";
import { register, login, getMe, registerValidation, loginValidation } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", protect, getMe);

export default router;
