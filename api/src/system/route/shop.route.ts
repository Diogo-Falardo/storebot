import { Router } from "express";
import { ShopController } from "../controller/shop.controller";

const router = Router();

// create a shop associted to telegram_user_id
router.post("/create", ShopController.createShop_For_Telegram);

export default router;
