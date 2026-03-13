import { v4 as uuidv4 } from "uuid";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling";
import { stores } from "../../db/schema";
import { CREATE_SHOP_TYPE } from "../../db/schemas/shop.schema";
import {
  schema_public_STORE_INFO,
  schema_public_type_STORE_INFO,
} from "../../schemas/store.schema";

export const storeService = {
  // validates if a user is the real owner of that store
  async validateStoreOwner(userId: string, storeId: string): Promise<boolean> {
    try {
      const owner = await db
        .select()
        .from(stores)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)));

      if (!owner[0]) return false;

      return true;
    } catch (err) {
      console.error(`
        -------------------------------------
        ERROR WITH VALIDATION STORE OWNER:

        ${err}
        
        -------------------------------------`);
      throw new HttpError(500, "Error loading store...");
    }
  },

  // updates a store expire date
  async updateStoreExpireDate(
    userId: string,
    storeId: string,
    period: string, // pass period instead of expireDate
  ) {
    const ownership = await this.validateStoreOwner(userId, storeId);
    if (!ownership) return "Upsss.... restriceted area!";

    // Fetch current expire date
    const store = await db
      .select()
      .from(stores)
      .where(and(eq(stores.userId, userId), eq(stores.id, storeId)))
      .limit(1);

    let currentExpire = store[0]?.storeExpireDate
      ? new Date(store[0].storeExpireDate)
      : new Date();

    const now = new Date();
    // if currentExpire is in the past, use now
    if (currentExpire < now) currentExpire = now;

    // calculate new expire date
    switch (period) {
      case "1d":
        currentExpire.setDate(currentExpire.getDate() + 1);
        break;
      case "1w":
        currentExpire.setDate(currentExpire.getDate() + 7);
        break;
      case "1m":
        currentExpire.setMonth(currentExpire.getMonth() + 1);
        break;
      case "3m":
        currentExpire.setMonth(currentExpire.getMonth() + 3);
        break;
      case "1y":
        currentExpire.setFullYear(currentExpire.getFullYear() + 1);
        break;
      default:
        throw new HttpError(400, "Invalid period");
    }

    try {
      await db
        .update(stores)
        .set({ storeExpireDate: currentExpire })
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)));

      return `Store is expiring at: ${currentExpire}`;
    } catch (err) {
      console.error(`
      -------------------------------------
      ERROR UPDATING STORE EXPIRE DATE:

      ${err}

      -------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },

  // get store expire date
  async getStoreExpireDate(userId: string, storeId: string) {
    try {
      const active = await db
        .select({ storeExpireDate: stores.storeExpireDate })
        .from(stores)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)))
        .limit(1);

      if (!active[0]) throw new HttpError(404, "Store was not found");

      return active[0].storeExpireDate;
    } catch (err) {
      console.error(`
      -------------------------------------
      ERROR GETTING STORE EXPIRE DATE

      ${err}

      -------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },

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

  // querys for a store id and returns a public store info
  async getStoreByStoreId(
    storeId: string,
  ): Promise<schema_public_type_STORE_INFO | null> {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(eq(stores.id, storeId))
        .limit(1);

      if (!store[0]) return null;

      return schema_public_STORE_INFO.parse(store[0]);
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
        storeName: dto.storeName,
        storeType: dto.storeType,
      });

      return "store created";
    } catch (err) {
      console.error(err);
      throw new HttpError(500, "Error creating store...");
    }
  },
};
