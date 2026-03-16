import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorHandling.js";
import { userService } from "../service/user.service.js";
import { REQUIRED_TELEGRAM_HEADERS } from "../../lib/field.valid.js";
import { storeService } from "../service/store.service.js";
import { SELECT_ENTIRE_USER } from "../../db/schemas/user.schema.js";

export const userController = {
  /**
   * Validate if a user is valid to create a store
   * @param req
   * @param res
   * @param next
   * @returns "true" user is allowed || "false"
   */
  async validateIfUserHasStore(
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

    const user = await userService.getUserIdFromTelegramId(tgUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      const isValid = await storeService.getStoreByInternalUserId(user);
      if (!isValid) {
        return res.status(200).json({ valid: true });
      }
      return res.status(200).json({ valid: false });
    } catch (err) {
      next(err);
    }
  },

  /**
   * returns the entire user info + store info
   * @param req
   * @param res
   * @param next
   * @returns SELECT_ENTIRE_USER schema
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
      return res.status(200).json(SELECT_ENTIRE_USER.parse(user));
    } catch (err) {
      next(err);
    }
  },
};
