import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling";

import {
  shopCreateSchemaType,
  shopViewSchema,
  shopViewSchemaType,
} from "../../db/schemas/shop.schema";
import { shops } from "../../db/schema";

export const shopService = {
  /**
   * return a shop or null
   * @param shopId
   * @returns
   */
  async getShopById(shopId: string): Promise<shopViewSchemaType | null> {
    try {
      const _shop = await db
        .select()
        .from(shops)
        .where(eq(shops.id, shopId))
        .limit(1);

      const shop = _shop[0];

      if (!shop) return null;
      return shopViewSchema.parse(shop);
    } catch (err) {
      throw new HttpError(500, "error getting shop");
    }
  },

  async getShopsByUserId(userId: string): Promise<Array<shopViewSchemaType>> {
    try {
      const userShops = await db
        .select()
        .from(shops)
        .where(eq(shops.userId, userId));

      return shopViewSchema.array().parse(userShops);
    } catch (err) {
      throw new HttpError(500, "error getting shops");
    }
  },

  // creates a new shop
  async createShop(userId: string, dto: shopCreateSchemaType) {
    try {
      await db.insert(shops).values({
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
