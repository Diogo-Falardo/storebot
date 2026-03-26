import { createServerFn } from '@tanstack/react-start'
import { serverProduct } from './products.server'
import {
  type_create_PRODUCT,
  type_patch_PRODUCT,
  type_schema_PRODUCT,
} from '@/db/schemas/product.schema'

const productServer = new serverProduct()

export const sf_get_ProductsFromStoreId = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.get_ProductsFromStoreId(data.storeId)
  })

export const sf_create_Product = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; dto: type_create_PRODUCT }) =>
      data,
  )
  .handler(async ({ data }) => {
    return await productServer.create_Product(
      data.userId,
      data.storeId,
      data.dto,
    )
  })

export const sf_update_Product = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { storeId: string; productId: string; dto: type_patch_PRODUCT }) =>
      data,
  )
  .handler(async ({ data }) => {
    return await productServer.update_Product(
      data.storeId,
      data.productId,
      data.dto,
    )
  })

export const sf_delete_Product = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.delete_Product(data.storeId, data.productId)
  })

export const sf_toogle_ProductVisibilty = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    const product = await productServer.get_ProductByProductId(
      data.storeId,
      data.productId,
    )

    const newVisibility = product.productVisible === 1 ? 0 : 1

    return await productServer.toogle_ProductVisibility(
      data.productId,
      newVisibility,
    )
  })

export const sf_add_ProductImage = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { productId: string; imageUrl: string }) => data)
  .handler(async ({ data }) => {
    return await productServer.add_ProductImage(data.productId, data.imageUrl)
  })

export const sf_validate_IfProductExists = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }): Promise<'invalid' | 'valid'> => {
    const res = await productServer.validate_IfProductExists(
      data.storeId,
      data.productId,
    )

    if (!res) return 'invalid'

    return 'valid'
  })

export const sf_get_ProductFromProductId = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; productId: string }) => data)
  .handler(async ({ data }): Promise<type_schema_PRODUCT> => {
    return await productServer.get_ProductByProductId(
      data.storeId,
      data.productId,
    )
  })
