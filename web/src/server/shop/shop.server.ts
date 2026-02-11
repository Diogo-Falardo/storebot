import { and, eq } from 'drizzle-orm'
import type {
  shopCreateSchemaType,
  shopViewSchemaType,
} from '@/db/schemas/shop.schemas'
import { db } from '@/db'
import { shops } from '@/db/schema'
import { shopViewSchema } from '@/db/schemas/shop.schemas'

// get all the user shops from its id
export async function getUserShopsByUserId(
  userId: string,
): Promise<Array<shopViewSchemaType> | null> {
  try {
    const userShops = await db
      .select()
      .from(shops)
      .where(eq(shops.userId, userId))

    if (userShops.length === 0) return null
    return shopViewSchema.array().parse(userShops)
  } catch (err: any) {
    console.error(err)
    throw new Error('Error getting user shops')
  }
}

// get shop by id
export async function getShopById(
  id: string,
  userId: string,
): Promise<shopViewSchemaType> {
  try {
    const shop = await db
      .select()
      .from(shops)
      .where(and(eq(shops.id, id), eq(shops.userId, userId)))
      .limit(1)

    if (shop.length === 0) throw new Error('Shop not found')
    return shopViewSchema.parse(shop[0])
  } catch (err: any) {
    console.error(err)
    throw new Error('Error getting shop')
  }
}

// create a new shop
export async function createUserShop(
  userId: string,
  dto: shopCreateSchemaType,
) {
  try {
    // insert the new shop
    await db.insert(shops).values({
      userId: userId,
      shopName: dto.shopName,
      shopType: dto.shopType,
    })
  } catch (err: any) {
    console.error(err)
    throw new Error('Error creating user shop')
  }
}
