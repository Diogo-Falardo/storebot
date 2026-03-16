import { Router } from "express";
import { userController } from "../controller/user.controller.js";

const router = Router();

// validates a user is allowed to create a shop
router.get("/validate-me", userController.validateIfUserHasStore);

// retrieves an entire user
router.get("/me", userController.getUserInfoFromTelegramId);

export default router;
