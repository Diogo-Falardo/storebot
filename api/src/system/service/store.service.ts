import { v4 as uuidv4 } from "uuid";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling";
import { stores } from "../../db/schema";
import { CREATE_SHOP_TYPE } from "../../db/schemas/shop.schema";

export const storeService = {
  /**
   * Gets the corresponding shop from an user
   * @param userId [database]
   * @returns The corresponding shop or null
   */
  async getStoreByUserId(userId: string) {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(eq(stores.userId, userId))
        .limit(1);

      if (!store[0]) return null; // this means there is no shop from that user

      return store[0];
    } catch (err) {
      console.error(err);
      throw new HttpError(500, "Error loading store...");
    }
  },

  // querys for a store id
  async getStoreByStoreId(storeId: string) {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(eq(stores.id, storeId))
        .limit(1);

      if (!store[0]) return null;

      return store[0];
    } catch (err) {
      console.error(err);
      throw new HttpError(500, "Error loading store...");
    }
  },

  /**
   * Creates a shop
   * @param userId
   * @param dto
   */
  async createStore(userId: string, dto: CREATE_SHOP_TYPE) {
    try {
      await db.insert(stores).values({
        id: uuidv4(),
        userId: userId,
        storeName: dto.shopName,
        storeType: dto.shopType,
      });

      return "store created";
    } catch (err) {
      console.error(err);
      throw new HttpError(500, "Error creating store...");
    }
  },
};
