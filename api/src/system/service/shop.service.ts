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
      const newShops = await db
        .select()
        .from(shops)
        .where(eq(shops.userId, userId));

      if (!newShops || newShops.length === 0)
        throw new HttpError(404, "shop not found");

      return shopViewSchema.array().parse(newShops);
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
      throw new HttpError(500, "error creating shop");
    }
  },
};
