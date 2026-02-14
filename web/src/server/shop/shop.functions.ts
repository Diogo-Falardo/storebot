import { createServerFn } from '@tanstack/react-start'
import {
  createUserShop,
  getShopById,
  getUserShopsByUserId,
} from './shop.server'
import type { shopCreateSchemaType } from '@/db/schemas/shop.schemas'

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
    (data: { userId: string; createShopDto: shopCreateSchemaType }) => data,
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
