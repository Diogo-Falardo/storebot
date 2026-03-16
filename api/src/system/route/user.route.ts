import { Router } from "express";
import { userController } from "../controller/user.controller.js";

const router = Router();

// retrieves an user
router.get("/me", userController.getUserInfoFromTelegramId);

export default router;
