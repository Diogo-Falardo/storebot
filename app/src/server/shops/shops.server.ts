import { db } from "#/db";
import { table_shops } from "#/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid"
import { selectShopSchema } from "#/db/schemas/shops/shop.schema";
import type { selectShop } from "#/db/schemas/shops/shop.types";
import { fetchUser } from "../users/user.server";

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

export async function createShop(userId: string) {
  // validate if user has already shop created
  const userShop = await fetchUserShop(userId)
  console.log(userShop)
  if (!userShop) {
    // fetch user info
    const user = await fetchUser(userId)
    try {
      const random_uuid = uuidv4()
      await db.insert(table_shops).values({ userId: user.id, name: user.username ?? `shop_${random_uuid}` })
    } catch (error) {
      console.error("createShop", error)
      throw new Error("Error creating shop!")
    }
  }
}
