import { Router } from "express";
import { userController } from "../controller/user.controller";

const router = Router();

// retrieves an user
router.get("/me", userController.getUser_From_telegram);

export default router;
