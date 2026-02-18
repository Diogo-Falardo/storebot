import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorHandling";
import { zId } from "../utils/validators";
import { shopCreateSchema } from "../../db/schemas/shop.schema";
import { UserService } from "../service/user.service";
import { shopService } from "../service/shop.service";
import { tgHeadersSchema } from "../../db";

// schemas

export const ShopController = {
  // create a new shop for a telegram user
  async createShop_tg(req: Request, res: Response, next: NextFunction) {
    try {
      const header = tgHeadersSchema.parse(req.headers);
      const shopCreateDto = shopCreateSchema.parse(req.body);

      if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const tg_userID = header["x-tg-user-id"];

      const userId = await UserService.tg_checkId(tg_userID);
      // existing user shops
      const userShops = await shopService.getShopsByUserId(userId);
      if (userShops.length > 0)
        throw new HttpError(
          400,
          "We are sorry for now its only available one shop per user",
        );

      const newShop = await shopService.createShop(userId, shopCreateDto);
      return res.status(201).json(newShop);
    } catch (err) {
      next(err);
    }
  },
};
