import { createServerFn } from '@tanstack/react-start'
import { serverProduct } from './products.server'
import { DTO_CREATE_PRODUCT, PRODUCT_SCHEMA } from '@/schemas/product.schema'

const productServer = new serverProduct()

export const sf_ProductsFromstore = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; storeId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.getProductsFromstoreId(data.userId, data.storeId)
  })

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

export const sf_DeleteProductFromstore = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.deleteProduct(data.storeId, data.productId)
  })

export const sf_ToogleProductVisibilty = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    const product = await productServer.getProductByProductId(
      data.storeId,
      data.productId,
    )

    const newVisibility = product.visible === 1 ? 0 : 1

    return await productServer.toogleVisibility(data.productId, newVisibility)
  })

export const sf_AddProductImage = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { productId: string; imageUrl: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.insertImage(data.productId, data.imageUrl)
  })

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

export const sf_getProductFromProductId = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }): Promise<PRODUCT_SCHEMA> => {
    return await productServer.getProductByProductId(
      data.storeId,
      data.productId,
    )
  })
