import { createServerFn } from '@tanstack/react-start'
import { serverProduct } from './products.server'
import { DTO_CREATE_PRODUCT, PRODUCT_SCHEMA } from '@/schemas/product.schema'

const productServer = new serverProduct()

/**
 * "GET"
 * products from a store
 *
 * required: userId & storeId
 */
export const sf_ProductsFromstore = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; storeId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.getProductsFromstoreId(data.userId, data.storeId)
  })

/**
 * "POST"
 * create a product
 *
 * required: userId, storeId, product objects
 */
export const sf_AddProductTostore = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; dto: DTO_CREATE_PRODUCT }) =>
      data,
  )
  .handler(async ({ data }) => {
    return await productServer.createProduct(
      data.userId,
      data.storeId,
      data.dto,
    )
  })

/**
 * "POST"
 * update a product from a store
 *
 * required: storeId, productId, product object
 */
export const sf_UpdateProductFromstore = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { storeId: string; productId: string; dto: DTO_CREATE_PRODUCT }) =>
      data,
  )
  .handler(async ({ data }) => {
    return await productServer.updateProduct(
      data.storeId,
      data.productId,
      data.dto,
    )
  })

/**
 * "POST"
 * delete a product
 *
 * required: storeId & productId
 */
export const sf_DeleteProductFromstore = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.deleteProduct(data.storeId, data.productId)
  })

/**
 * "POST"
 * switch product visibility
 *
 * required: storeId & productId
 */
export const sf_ToogleProductVisibilty = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    const product = await productServer.getProductById(
      data.storeId,
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

/**
 * "GET"
 * validate if a product still exists in store
 *
 * required: storeId & productId
 */
export const sf_ValidateIfProductExists = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }): Promise<'invalid' | 'valid'> => {
    const res = await productServer.validateIfProductExists(
      data.storeId,
      data.productId,
    )

    if (!res) return 'invalid'

    return 'valid'
  })

/**
 * "GET"
 * return a product from its id
 *
 * required storeId & productId
 */
export const sf_GetProductFromId = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }): Promise<PRODUCT_SCHEMA> => {
    return await productServer.getProductById(data.storeId, data.productId)
  })
