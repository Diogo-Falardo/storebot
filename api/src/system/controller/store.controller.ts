import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorHandling.js";
import { userService } from "../service/user.service.js";
import { storeService } from "../service/store.service.js";
import { tgHeadersSchema } from "../../db/index.js";
import { CREATE_SHOP_MODEL } from "../../db/schemas/shop.schema.js";
import { schema_add_STORE_EXPIRE_DATE } from "../../schemas/store.schema.js";
import { valid_uuid } from "../../lib/field.valid.js";

export const storeController = {
  /**
   * Create a shop and associate it with a telegram user
   * @param req HEADERS : tg-user-id , bot-secret ("used to validate request")
   * @returns
   */
  async createStore_For_Telegram(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // validate headers
    const header = tgHeadersSchema.parse(req.headers);
    // validate bot secret
    if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tg_userID = header["x-tg-user-id"];
    const shopCreateDto = CREATE_SHOP_MODEL.parse(req.body);

    // db user id
    const userId = await userService.tg_checkId(tg_userID);

    const shop = await storeService.getStoreByUserId(userId);

    if (shop) {
      return res.status(401).json("You already have a shop: " + shop.storeName);
    }

    try {
      const newShop = await storeService.createStore(userId, shopCreateDto);
      return res.status(201).json(newShop);
    } catch (err) {
      next(err);
    }
  },

  // returns the public store info
  async storeInfo(req: Request, res: Response, next: NextFunction) {
    // validate headers
    const header = tgHeadersSchema.parse(req.headers);
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
      return res.json(store);
    } catch (err) {
      next(err);
    }
  },

  async storeExpireDate(req: Request, res: Response, next: NextFunction) {
    // validate headers
    const header = tgHeadersSchema.parse(req.headers);
    // validate bot secret
    if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const tg_userID = header["x-tg-user-id"];
    const storeId = req.params.id;

    if (!storeId || Array.isArray(storeId))
      return res.status(400).json({ error: "Store id is required" });

    const userId = await userService.tg_checkId(tg_userID);

    try {
      const expireDate = await storeService.getStoreExpireDate(userId, storeId);

      return res.status(200).json(expireDate);
    } catch (err) {
      next(err);
    }
  },

  // async updateExpireStoreDate(req: Request, res: Response, next: NextFunction) {
  //   // validate headers
  //   const header = tgHeadersSchema.parse(req.headers);
  //   // validate bot secret
  //   if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
  //     return res.status(401).json({ error: "Unauthorized" });
  //   }
  //   const userId = header["x-tg-user-id"];
  //   const { id: storeId } = valid_uuid.parse({ id: req.params.id });
  //   const { storeExpireDate } = schema_add_STORE_EXPIRE_DATE.parse(req.body);

  //   const user = await userService.getUserId(userId);
  //   if (typeof user === "string") {
  //     valid_uuid.parse({ id: user });
  //   } else return res.status(404).json({ error: "User not found" });

  //   try {
  //     const result = await storeService.updateStoreExpireDate(
  //       user,
  //       storeId,
  //       storeExpireDate,
  //     );

  //     return res.status(200).json(result);
  //   } catch (err) {
  //     next(err);
  //   }
  // },
};
