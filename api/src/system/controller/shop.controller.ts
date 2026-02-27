import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorHandling";
import { userService } from "../service/user.service";
import { shopService } from "../service/shop.service";
import { tgHeadersSchema } from "../../db";
import { CREATE_SHOP_MODEL } from "../../db/schemas/shop.schema";

// schemas

export const ShopController = {
  /**
   * Create a shop and associate it with a telegram user
   * @param req HEADERS : tg-user-id , bot-secret ("used to validate request")
   * @returns
   */
  async createShop_For_Telegram(
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

    const shop = await shopService.getShopByUserId(userId);

    if (shop) {
      return res.status(401).json("You already have a shop: " + shop.shopName);
    }

    try {
      const newShop = await shopService.createShop(userId, shopCreateDto);
      return res.status(201).json(newShop);
    } catch (err) {
      next(err);
    }
  },
};
