import { Router } from "express";
import { storeController } from "../controller/store.controller";

const router = Router();

// create a store associted to telegram_user_id
router.post("/create", storeController.createStore_For_Telegram);

// returns the store info, doesnt need verification.
router.get("/store-info/:id", storeController.storeInfo);

export default router;
