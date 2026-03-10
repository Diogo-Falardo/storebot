import { v4 as uuidv4 } from "uuid";
import { users } from "../../db/schema";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling";
import { shopService } from "./shop.service";
import { ENTIRE_USER_MODEL } from "../../db/schemas/user.schema";

export const userService = {
  async createUser(telegramId: number) {},

  /**
   * From the telegram_user_id trys to obtain all the info
   *
   * **info**: user (table) + shop (table)
   * @param telegramId
   * @returns the entire user object or null
   */
  async getUserInfo(telegramId: number) {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.telegramUserId, telegramId))
        .limit(1);

      if (!user[0]) {
        throw new HttpError(404, "user not found");
      }

      const userShop = await shopService.getShopByUserId(user[0].id);

      // remove this in the future
      // need to think on a better solution for this
      if (!userShop) {
        return "no shops";
      }

      return {
        userCreatedAt: user[0].createdAt,
        ...user[0],
        ...userShop,
        shopId: userShop.id, // this or will missmatch in "schemas"
      };
    } catch (err: any) {
      console.error(err);
      if (err instanceof HttpError) throw err;
      throw new HttpError(500, "error getting user");
    }
  },

  /**
   * Checks for the real id of a user.
   * Trys to associated telegram_user_id with existing user inside of database
   * @param telegramId telegram_user_id
   * @returns the userId associated in the database
   */
  async getUserId(telegramId: number): Promise<string | null> {
    try {
      const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.telegramUserId, telegramId))
        .limit(1);

      return user[0]?.id ?? null;
    } catch (err) {
      throw new HttpError(500, "error getting user");
    }
  },

  /**
   * Checks for an existing user or create a new user associted with telegram_user_id
   * @param telegramId telegram_user_id
   * @returns the user
   */
  async tg_checkId(telegramId: number): Promise<string> {
    // already an user?
    const user = await this.getUserId(telegramId);
    if (user) return user;

    try {
      await db.insert(users).values({
        id: uuidv4(),
        telegramUserId: telegramId,
      });

      const userId = await this.getUserId(telegramId);

      if (!userId) {
        throw new Error();
      }

      return userId;
    } catch (err) {
      throw new HttpError(500, "error generating user!");
    }
  },
};
