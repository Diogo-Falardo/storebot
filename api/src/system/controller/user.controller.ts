import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/ErrorHandling";
import { tgHeadersSchema } from "../../db";
import { userService } from "../service/user.service";
import { ENTIRE_USER_MODEL } from "../../db/schemas/user.schema";

export const userController = {
  /**
   * Gets an entire user object from the telegram id
   * **"0"**: if returned means that user is in db but have not any shops
   * @param req HEADERS : tg-user-id , bot-secret ("used to validate request")
   * @returns ENTIRE_USER_OBJECT or 0
   */
  async getUser_From_telegram(req: Request, res: Response, next: NextFunction) {
    // validate headers
    const header = tgHeadersSchema.parse(req.headers);
    // validate bot secret
    if (header["x-bot-secret"] !== process.env.BOT_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgUserId = header["x-tg-user-id"];

    try {
      const user = await userService.getUserInfo(tgUserId);

      if (user === "no shops") {
        return res.status(200).json("0");
      }

      return res.status(200).json(ENTIRE_USER_MODEL.parse(user));
    } catch (err) {
      next(err);
    }
  },
};
