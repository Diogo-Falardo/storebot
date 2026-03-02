import { createServerFn } from '@tanstack/react-start'
import { serverProduct } from './products.server'
import { DTO_CREATE_PRODUCT } from '@/schemas/product.schema'

const productServer = new serverProduct()

/**
 * "GET"
 * products from a shop
 *
 * required: userId & shopId
 */
export const sf_ProductsFromShop = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; shopId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.getProductsFromShopId(data.userId, data.shopId)
  })

/**
 * "POST"
 * update a product from a shop
 *
 * required: shopId, productId, product object
 */
export const sf_UpdateProductFromShop = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { shopId: string; productId: string; dto: DTO_CREATE_PRODUCT }) =>
      data,
  )
  .handler(async ({ data }) => {
    return await productServer.updateProduct(
      data.shopId,
      data.productId,
      data.dto,
    )
  })

/**
 * "POST"
 * delete a product
 *
 * required: shopId & productId
 */
export const sf_DeleteProductFromShop = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { shopId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.deleteProduct(data.shopId, data.productId)
  })

/**
 * "POST"
 * switch product visibility
 *
 * required: shopId & productId
 */
export const sf_ToogleProductVisibilty = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { shopId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    const product = await productServer.getProductById(
      data.shopId,
      data.productId,
    )

    const newVisibility = product.visible === 1 ? 0 : 1

    return await productServer.toogleVisibility(data.productId, newVisibility)
  })

// // function to get products from a shop
// export const serverGetProductsFromShop = createServerFn({
//   method: 'GET',
// })
//   .inputValidator((data: { shopId: string }) => data)
//   .handler(async ({ data }) => {
//     return await getProductsFromShopPublic(data.shopId)
//   })
