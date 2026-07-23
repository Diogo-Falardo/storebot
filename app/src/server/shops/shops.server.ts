import { db } from "#/db";
import { table_shops } from "#/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid"
import { selectShopSchema } from "#/db/schemas/shops/shop.schema";
import type { selectShop, updateShop } from "#/db/schemas/shops/shop.types";
import { fetchUser } from "../users/user.server";
import { validateUserShopInteraction } from "../validators";

export async function fetchUserShop(userId: string): Promise<selectShop | null> {
  try {
    const [shop] = await db.select().from(table_shops).where(eq(table_shops.userId, userId)).limit(1)

    if (!shop) return null

    return selectShopSchema.parse(shop)
  } catch (error) {
    console.error("fetchUserShop", error)
    throw new Error("Error loading shop!")
  }
}

export async function fecthShop(shopId: string): Promise<selectShop> {
  try {
    const [shop] = await db.select().from(table_shops).where(eq(table_shops.id, shopId))

    if (!shop) throw new Error("Shop not found!")

    return selectShopSchema.parse(shop)
  } catch (error) {
    console.error("fetchShop", error)
    throw new Error("Error loading shop!")
  }
}

/** Ensure the user has a shop; create one if missing. Always returns the shop row. */
export async function createShop(userId: string): Promise<selectShop> {
  const existing = await fetchUserShop(userId)
  if (existing) return existing

  const user = await fetchUser(userId)
  try {
    const random_uuid = uuidv4()
    const [created] = await db
      .insert(table_shops)
      .values({ userId: user.id, name: user.username ?? `shop_${random_uuid}` })
      .returning()

    if (!created) throw new Error("Error creating shop!")
    return selectShopSchema.parse(created)
  } catch (error) {
    console.error("createShop", error)
    throw new Error("Error creating shop!")
  }
}

export async function updateShop(userId: string, shopId: string, shopInfo: updateShop): Promise<string> {
  await validateUserShopInteraction({
    userId,
    shopId,
    userExists: true,
    shopExists: true,
    isUserOwner: true,
  })

  // get current shop data
  const shop = await fecthShop(shopId)

  const updateObj: Record<string, any> = {}

  // shop name
  if (shopInfo.name && shopInfo.name !== shop.name) {
    updateObj.name = shopInfo.name
  }

  // shop description
  if (shopInfo.description && shopInfo.description !== shop.description) {
    updateObj.description = shopInfo.description
  }

  // shop currency
  if (shopInfo.currency && shopInfo.currency !== shop.currency) {
    updateObj.currency = shopInfo.currency
  }

  if (Object.keys(updateObj).length === 0) {
    return 'No changes were applied!'
  }

  try {
    await db.update(table_shops).set(updateObj).where(and(eq(table_shops.id, shopId), eq(table_shops.userId, userId)))
    return "Shop has been updated!"
  } catch (error) {
    console.error("updateShop", error)
    throw new Error("Error updating shop!")
  }
}
