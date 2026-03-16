import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorHandling.js";
import { userService } from "../service/user.service.js";
import { REQUIRED_TELEGRAM_HEADERS } from "../../lib/field.valid.js";
import { SELECT_ENTIRE_USER_OBJECT } from "../../db/schemas/user.schema.js";
import { storeService } from "../service/store.service.js";

export const userController = {
  /**
   * Gets an entire user object from the telegram id
   * **"no_shops"**: if returned means that user is in db but have not any shops
   * @param req HEADERS : tg-user-id , bot-secret ("used to validate request")
   * @returns ENTIRE_USER_OBJECT or 0 || 1
   */
  async getUserInfoFromTelegramId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // validate headers
    const header = REQUIRED_TELEGRAM_HEADERS.parse(req.headers);
    const tgUserId = header["x-tg-user-id"];
    // validate bot secret
    if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await userService.getTelegramUserInfo(tgUserId);

      if (user === "No store" || !user) {
        return res.status(200).json(user);
      }

      return res.status(200).json(SELECT_ENTIRE_USER_OBJECT.parse(user));
    } catch (err) {
      next(err);
    }
  },
};
