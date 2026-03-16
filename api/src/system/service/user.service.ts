import { v4 as uuidv4 } from "uuid";
import { users } from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling.js";
import { storeService } from "./store.service.js";
import {
  SELECT_ENTIRE_USER_OBJECT,
  SELECT_ENTIRE_USER_OBJECT_type,
} from "../../db/schemas/user.schema.js";

export const userService = {
  async createUser(telegramId: number) {},

  /**
   * from telegramId, selects all the available user info
   *
   * @param telegramId
   * @returns
   */
  async getTelegramUserInfo(
    telegramId: number,
  ): Promise<SELECT_ENTIRE_USER_OBJECT_type | string | undefined> {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.telegramUserId, telegramId))
        .limit(1);

      if (!user[0]) {
        throw new HttpError(404, "User not found");
      }

      const userStore = await storeService.getStoreByInternalUserId(user[0].id);

      // remove this in the future
      // need to think on a better solution for this
      if (!userStore) {
        return "No store";
      }
      const categorys = await storeService.getStoreCategorysByStoreId(
        userStore.storeId,
      );
      const shippingMethods =
        await storeService.getStoreShippingMethodsByStoreId(userStore.storeId);
      const paymentMethods = await storeService.getStorePaymentMethodsByStoreId(
        userStore.storeId,
      );

      const info = {
        userId: userStore.userId,
        storeId: userStore.storeId,
        storeName: userStore.storeName,
        storeType: userStore.storeType,
        storeCurrency: userStore.storeCurrency ?? null,
        storeExpireDate: userStore.storeExpireDate
          ? userStore.storeExpireDate.toISOString()
          : null,
        categorys: categorys?.map((c) => c.category) ?? [], // map to string
        shippingMethods: shippingMethods?.map((m) => m.method) ?? [], // map to string
        paymentMethods: paymentMethods?.map((m) => m.method) ?? [], // map to string
        storeCreatedAt: userStore.storeCreatedAt.toISOString(),
      };

      return SELECT_ENTIRE_USER_OBJECT.parse(info);
    } catch (err: any) {
      console.log(`
        --------------------------------

        ERROR GETTING TELEGRAM USER INFO

        ${err}

        --------------------------------
        
     `);
      if (err instanceof HttpError) throw err;
      throw new HttpError(500, "Error loading user...");
    }
  },

  /**
   * Checks for the real id of a user.
   * Trys to associated telegram_user_id with existing user inside of database
   * @param telegramId telegram_user_id
   * @returns the userId associated in the database
   */
  async getUserIdFromTelegramId(telegramId: number): Promise<string | null> {
    try {
      const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.telegramUserId, telegramId))
        .limit(1);

      return user[0]?.id ?? null;
    } catch (err) {
      console.log(`
        -------------------------------------
        ERROR GETING USER ID FROM TELEGRAM ID

        ${err}

        -------------------------------------
       
     `);
      throw new HttpError(500, "Error loading user...");
    }
  },

  /**
   * Checks for an existing user or create a new user associted with telegram_user_id
   * @param telegramId
   * @returns the user Id
   */
  async checkTelegramUserId(telegramId: number): Promise<string | null> {
    // already an user?
    const user = await this.getUserIdFromTelegramId(telegramId);
    if (user) return user;

    try {
      await db.insert(users).values({
        id: uuidv4(),
        telegramUserId: telegramId,
      });

      const userId = await this.getUserIdFromTelegramId(telegramId);

      if (!userId) {
        return null;
      }

      return userId;
    } catch (err) {
      console.log(`
        -------------------------------
        ERROR CHECKING TELEGRAM USER ID

        ${err}

        -------------------------------
     `);
      throw new HttpError(500, "Erro loading user...");
    }
  },
};
