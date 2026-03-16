import { Router } from "express";
import { storeController } from "../controller/store.controller.js";

const router = Router();

// create a store associted to telegram_user_id
router.post("/create", storeController.createTelegramStore);

// returns the public store info, doesnt need verification.
router.get("/public-info/:id", storeController.storeInfo);

// update the
// router.post("/update-expire-date/:id", storeController.updateExpireStoreDate);

// returns store expire date
router.get("/expire-date/:id", storeController.storeExpireDate);

export default router;
