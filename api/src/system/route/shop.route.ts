import { Router } from "express";
import { ShopController } from "../controller/shop.controller";

// controllers

const router = Router();

// router to create a shop via telegram user id
router.post("/tg/create", ShopController.createShop_tg);

export default router;
