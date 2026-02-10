import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../utils/ErrorHandling";

import {
  shopCreateSchemaType,
  shopViewSchema,
  shopViewSchemaType,
} from "../../db/schemas/shop.schema";
import { shops } from "../../db/schema";
import { v4 } from "uuid";

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

  // creates a new shop
  async createShop(userId: string, dto: shopCreateSchemaType) {
    const shopId = v4();
    try {
      await db.insert(shops).values({
        id: shopId,
        userId: userId,
        shopName: dto.shopName,
        shopType: dto.shopType,
      });

      const shop = await this.getShopById(shopId);
      return shop;
    } catch (err) {
      throw new HttpError(500, "error creating shop");
    }
  },
};
