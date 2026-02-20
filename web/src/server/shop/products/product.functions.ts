import { createServerFn } from '@tanstack/react-start'
import {
  deleteProductFromShop,
  getProductsFromShopId,
  updateProductFromShop,
} from './products.server'
import { productUpdateType } from '@/db/schemas/product.schema'

// returns the products from the shop
export const getProductsFromShop = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; shopId: string }) => data)
  .handler(async ({ data }) => {
    return await getProductsFromShopId(data.userId, data.shopId)
  })

// delete a product from a shop
export const serverDeleteProductFromShop = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { shopId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    return await deleteProductFromShop(data.shopId, data.productId)
  })

// update a product from a shop
export const serverUpdateProductFromShop = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { dto: productUpdateType }) => data)
  .handler(async ({ data }) => {
    return await updateProductFromShop(data.dto)
  })
