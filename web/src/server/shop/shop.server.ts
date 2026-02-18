import { and, eq } from 'drizzle-orm'
import { validateUserShopOwnership } from '../user/user.server'
import type {
  shopExtendedSchemaType,
  shopSchemaType,
} from '@/db/schemas/shop.schemas'
import { db } from '@/db'
import { shops } from '@/db/schema'

import { shopExtendedSchema } from '@/db/schemas/shop.schemas'

// get all the user shops from its id
export async function getUserShopsByUserId(
  userId: string,
): Promise<Array<shopExtendedSchemaType> | null> {
  try {
    const userShops = await db
      .select()
      .from(shops)
      .where(eq(shops.userId, userId))

    if (userShops.length === 0) return null
    return shopExtendedSchema.array().parse(userShops)
  } catch (err: any) {
    console.error(err)
    throw new Error('Error getting user shops')
  }
}

// get shop by id
export async function getShopById(
  userId: string,
  shopId: string,
): Promise<shopExtendedSchemaType> {
  try {
    const shop = await db
      .select()
      .from(shops)
      .where(and(eq(shops.id, shopId), eq(shops.userId, userId)))
      .limit(1)

    if (shop.length === 0) throw new Error('Shop not found')
    return shopExtendedSchema.parse(shop[0])
  } catch (err: any) {
    console.error(err)
    throw new Error('Error getting shop')
  }
}

// create a new shop
export async function createUserShop(userId: string, dto: shopSchemaType) {
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

// update a shop
export async function updateUserShop(dto: shopExtendedSchemaType) {
  const { userId, id: shopId } = dto

  const ownership = await validateUserShopOwnership({ userId, shopId })

  if (!ownership) {
    throw new Error('Ups... This is restricted area!')
  }

  const shop = await getShopById(userId, shopId)

  if (shop === dto) {
    return true
  }

  if (shop.shopName === dto.shopName) {
    return true
  }

  try {
    await db
      .update(shops)
      .set({
        shopName: dto.shopName,
      })
      .where(and(eq(shops.id, shopId), eq(shops.userId, userId)))

    return true
  } catch (err: any) {
    console.error(err.message)
    throw new Error(err.message ?? 'Error while updating shop')
  }
}
