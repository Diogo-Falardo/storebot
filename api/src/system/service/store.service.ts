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

  // updates a store expireDate
  async updateStoreExpireDate(
    userId: string,
    storeId: string,
    expireDate: string,
  ) {
    const ownership = await this.validateStoreOwner(userId, storeId);
    if (!ownership) return "Upsss.... restriceted area!";

    try {
      await db
        .update(stores)
        .set({ storeExpireDate: new Date(expireDate) })
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)));

      return `Store is expiring at: ${new Date(expireDate)}`;
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
