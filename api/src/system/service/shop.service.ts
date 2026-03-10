import { v4 as uuidv4 } from "uuid";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling";
import { shops } from "../../db/schema";
import { CREATE_SHOP_TYPE } from "../../db/schemas/shop.schema";

export const shopService = {
  /**
   * Gets the corresponding shop from an user
   * @param userId [database]
   * @returns The corresponding shop or null
   */
  async getShopByUserId(userId: string) {
    try {
      const shop = await db
        .select()
        .from(shops)
        .where(eq(shops.userId, userId))
        .limit(1);

      if (!shop[0]) return null; // this means there is no shop from that user

      return shop[0];
    } catch (err) {
      throw new HttpError(500, "error getting shop");
    }
  },

  /**
   * Creates a shop
   * @param userId
   * @param dto
   */
  async createShop(userId: string, dto: CREATE_SHOP_TYPE) {
    try {
      await db.insert(shops).values({
        id: uuidv4(),
        userId: userId,
        shopName: dto.shopName,
        shopType: dto.shopType,
      });

      return "shop created";
    } catch (err) {
      console.error(err);
      throw new HttpError(500, "error creating shop");
    }
  },
};
