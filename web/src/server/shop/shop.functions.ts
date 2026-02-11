import { createServerFn } from '@tanstack/react-start'
import { createUserShop, getUserShopsByUserId } from './shop.server'
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
