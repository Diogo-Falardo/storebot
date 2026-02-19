import { createServerFn } from '@tanstack/react-start'
import { getProductsFromShopId } from './products.server'

// returns the products from the shop
export const getProductsFromShop = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; shopId: string }) => data)
  .handler(async ({ data }) => {
    return await getProductsFromShopId(data.userId, data.shopId)
  })
