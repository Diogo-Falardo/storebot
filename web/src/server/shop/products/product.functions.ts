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
 * create a product
 *
 * required: userId, shopId, product objects
 */
export const sf_AddProductToShop = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; shopId: string; dto: DTO_CREATE_PRODUCT }) => data,
  )
  .handler(async ({ data }) => {
    return await productServer.createProduct(data.userId, data.shopId, data.dto)
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

/**
 * "POST"
 * add image
 *
 * required: productId & img url
 */
export const sf_AddProductImage = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { productId: string; imageUrl: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.insertImage(data.productId, data.imageUrl)
  })
