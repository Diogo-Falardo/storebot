import { v4 as uuidv4 } from "uuid";
import { db } from "../../db/index.js";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling.js";
import {
  category,
  paymentMethods,
  shippingMethods,
  stores,
} from "../../db/schema.js";
import {
  INSERT_STORE_type,
  SELECT_PUBLIC_STORE,
  SELECT_PUBLIC_STORE_type,
  SELECT_STORE,
  SELECT_STORE_CATEGORY,
  SELECT_STORE_CATEGORY_type,
  SELECT_STORE_METHODS,
  SELECT_STORE_METHODS_type,
  SELECT_STORE_type,
} from "../../db/schemas/store.schema.js";

export const storeService = {
  /**
   * validates if a user is the real owner of that store
   *
   *
   * @param userId
   * @param storeId
   * @returns true if user is the owner of the shop
   */
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

  /**
   * updates a store expire date based on the select period time
   *
   * period = `nday`, `nweek` , `nmonth`, ...
   * @param userId
   * @param storeId
   * @param period "1d", "1w", "1m", "3m", "1y"
   * @returns
   */
  async updateStoreExpireDate(
    userId: string,
    storeId: string,
    period: string, // pass period instead of expireDate
  ) {
    const ownership = await this.validateStoreOwner(userId, storeId);
    if (!ownership) return "Upsss.... restriceted area!";

    const storeExpireDate = await this.getStoreExpireDate(storeId);

    let currentExpire = storeExpireDate
      ? new Date(storeExpireDate)
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

  /**
   * selects the store exipire date
   *
   * @param storeId
   * @returns
   */
  async getStoreExpireDate(storeId: string) {
    try {
      const active = await db
        .select({ storeExpireDate: stores.storeExpireDate })
        .from(stores)
        .where(eq(stores.id, storeId))
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
   * select store info from internal user id
   *
   * @param userId
   * @returns
   */
  async getStoreByInternalUserId(
    userId: string,
  ): Promise<SELECT_STORE_type | null> {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(eq(stores.userId, userId))
        .limit(1);

      if (!store[0]) return null;

      const _store = {
        storeId: store[0].id,
        storeCreatedAt: new Date(store[0].createdAt),
        ...store[0],
      };
      return SELECT_STORE.parse(_store);
    } catch (err) {
      console.error(`
-------------------------------------
ERROR GETTING STORE BY INTERNAL USER ID

${err}

-------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },

  /**
   * select "public store info"
   *
   * "selects cool to share store info"
   *
   * - info that is not sensitive
   *
   * @param storeId
   * @returns
   */
  async publicStoreInfo(
    storeId: string,
  ): Promise<SELECT_PUBLIC_STORE_type | null> {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(eq(stores.id, storeId))
        .limit(1);

      if (!store[0]) return null;

      return SELECT_PUBLIC_STORE.parse(store[0]);
    } catch (err) {
      console.error(`
-------------------------------------
ERROR GETTING PUBLIC STORE INFO

${err}

 -------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },

  /**
   * create a store
   *
   * @param userId
   * @param dto
   */
  async createStore(userId: string, dto: INSERT_STORE_type) {
    try {
      await db.insert(stores).values({
        id: uuidv4(),
        userId: userId,
        storeName: dto.storeName,
        storeType: dto.storeType,
      });

      return "store created";
    } catch (err) {
      console.error(`
-------------------------------------
ERROR CREATING STORE

${err}

-------------------------------------
`);
      throw new HttpError(500, "Error creating store...");
    }
  },

  /**
   * finds a store by its id
   * @param storeId
   * @returns store model
   */
  async getStoreByStoreId(storeId: string): Promise<SELECT_STORE_type | null> {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(eq(stores.id, storeId))
        .limit(1);

      if (!store[0]) return null;

      return SELECT_STORE.parse(store[0]);
    } catch (err: any) {
      console.error(`
-------------------------------------
ERROR GETTING STORE BY STORE ID

${err}

-------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },

  /**
   * finds the categorys of a store
   * @param storeId
   * @returns array of categorys
   */
  async getStoreCategorysByStoreId(
    storeId: string,
  ): Promise<Array<SELECT_STORE_CATEGORY_type> | null> {
    try {
      const categorys = await db
        .select()
        .from(category)
        .where(eq(category.storeId, storeId));

      if (categorys.length === 0) return null;

      return SELECT_STORE_CATEGORY.array().parse(categorys);
    } catch (err) {
      console.error(`
-------------------------------------
ERROR GETTING STORE CATEGORYS BY STORE ID

${err}

-------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },

  /**
   * finds the shipping methods of a store
   * @param storeId
   * @returns array of shipping methods
   */
  async getStoreShippingMethodsByStoreId(
    storeId: string,
  ): Promise<Array<SELECT_STORE_METHODS_type> | null> {
    try {
      const methods = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.storeId, storeId));

      if (methods.length === 0) return null;

      return SELECT_STORE_METHODS.array().parse(methods);
    } catch (err: any) {
      console.error(`
-------------------------------------
ERROR GETTING STORE SHIPPING METHODS

${err}

-------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },

  /**
   * finds the payment methods of a store
   * @param storeId
   * @returns array of payment methods
   */
  async getStorePaymentMethodsByStoreId(
    storeId: string,
  ): Promise<Array<SELECT_STORE_METHODS_type> | null> {
    try {
      const methods = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.storeId, storeId));

      if (methods.length === 0) return null;

      return SELECT_STORE_METHODS.array().parse(methods);
    } catch (err: any) {
      console.error(`
-------------------------------------
ERROR GETTING STORE PAYMENT METHODS

${err}

-------------------------------------
      `);
      throw new HttpError(500, "Error loading store...");
    }
  },
};
