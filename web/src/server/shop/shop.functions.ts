import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { shops } from '@/db/schema'
import {
  createUserShop,
  getShopById,
  getUserShopsByUserId,
} from './shop.server'
import type { shopSchemaType } from '@/db/schemas/shop.schemas'
import {
  userShopOwnershipSchema,
  validateUserShopOwnership,
} from '../user/user.server'

/**
 * function to return the user shops
 */
export const getUserShops = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return await getUserShopsByUserId(data.id)
  })

/**
 * function to create a new user shop
 */

export const postcreateUserShop = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; createShopDto: shopSchemaType }) => data,
  )
  .handler(async ({ data }) => {
    return await createUserShop(data.userId, data.createShopDto)
  })

/**
 * function to get a user shop info
 */
export const getUserShopInfo = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; shopId: string }) => data)
  .handler(async ({ data }) => {
    return await getShopById(data.userId, data.shopId)
  })

export const deleteShop = createServerFn({ method: 'POST' })
  .inputValidator((data: { shopId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const ids = {
      userId: data.userId,
      shopId: data.shopId,
    }

    userShopOwnershipSchema.parse(ids)

    const isOwner = await validateUserShopOwnership(ids)

    if (!isOwner) {
      throw new Error('not authorized')
    }

    try {
      await db
        .delete(shops)
        .where(and(eq(shops.userId, ids.userId), eq(shops.id, ids.shopId)))

      return true
    } catch (err: any) {
      console.error(err)
    }
  })
