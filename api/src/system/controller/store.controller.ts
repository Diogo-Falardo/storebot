import { Request, Response, NextFunction } from "express";
import { userService } from "../service/user.service.js";
import { storeService } from "../service/store.service.js";
import { REQUIRED_TELEGRAM_HEADERS } from "../../lib/field.valid.js";
import {
  INSERT_STORE,
  SELECT_PUBLIC_STORE,
} from "../../db/schemas/store.schema.js";

export const storeController = {
  /**
   * Create a shop and associate it with a telegram user
   * @param req HEADERS : tg-user-id , bot-secret ("used to validate request")
   * @returns
   */
  async createTelegramStore(req: Request, res: Response, next: NextFunction) {
    // validate headers
    const header = REQUIRED_TELEGRAM_HEADERS.parse(req.headers);
    const tg_userID = header["x-tg-user-id"];
    // validate bot secret
    if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const storeCreateDto = INSERT_STORE.parse(req.body);
    console.log(storeCreateDto);
    // db user id
    const userId = await userService.checkTelegramUserId(tg_userID);
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    const store = await storeService.getStoreByInternalUserId(userId);

    if (store) {
      return res
        .status(401)
        .json("You already have a shop: " + store.storeName);
    }

    try {
      const newStore = await storeService.createStore(userId, storeCreateDto);
      return res.status(201).json(newStore);
    } catch (err) {
      next(err);
    }
  },

  // returns the public store info
  async storeInfo(req: Request, res: Response, next: NextFunction) {
    // validate headers
    const header = REQUIRED_TELEGRAM_HEADERS.parse(req.headers);
    // validate bot secret
    if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const storeId = req.params.id;

    if (!storeId || Array.isArray(storeId))
      return res.status(400).json({ error: "Store id is required" });

    try {
      const store = await storeService.getStoreByStoreId(storeId);

      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      return res.status(200).json(SELECT_PUBLIC_STORE.parse(store));
    } catch (err) {
      next(err);
    }
  },

  // returns the expire date of a store
  async storeExpireDate(req: Request, res: Response, next: NextFunction) {
    // validate headers
    const header = REQUIRED_TELEGRAM_HEADERS.parse(req.headers);
    // validate bot secret
    if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const tg_userID = header["x-tg-user-id"];
    const storeId = req.params.id;

    if (!storeId || Array.isArray(storeId))
      return res.status(400).json({ error: "Store id is required" });

    // validate if user is the owner of this shop
    const userId = await userService.getUserIdFromTelegramId(tg_userID);
    if (!userId) {
      return res.status(404).json("User not found");
    }
    const ownership = await storeService.validateStoreOwner(userId, storeId);
    if (!ownership) return "Upsss.... restriceted area!";

    try {
      const expireDate = await storeService.getStoreExpireDate(storeId);

      return res.status(200).json(expireDate);
    } catch (err) {
      next(err);
    }
  },
};
