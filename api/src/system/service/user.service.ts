import { users } from "../../../drizzle/schema";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling";
import { v4 } from "uuid";

export const UserService = {
  /**
   * If user return user, else return null
   * @param id telegram_id
   * @returns user_id
   */
  async tg_getUserId(id: number): Promise<string | null> {
    try {
      const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.telegramUserId, id))
        .limit(1);

      return user[0]?.id ?? null;
    } catch (err) {
      throw new HttpError(500, "error getting user");
    }
  },

  /**
   * If user exists return user, If user doesnt exists creates one!
   * @param id telegram_id
   * @returns user_id
   */
  async tg_checkId(id: number): Promise<string> {
    const user = await this.tg_getUserId(id);
    if (user) return user;

    const newUserId = v4();
    try {
      await db.insert(users).values({
        id: newUserId,
        telegramUserId: id,
      });
      return newUserId;
    } catch (err) {
      throw new HttpError(500, "generating user!");
    }
  },
};
