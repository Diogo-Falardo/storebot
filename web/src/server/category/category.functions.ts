import { createServerFn } from '@tanstack/react-start'
import { serverCategory } from './category.server'

const categoryServer = new serverCategory()

export const sf_get_CategorysFromStoreId = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.get_CategorysFromStoreId(data.storeId)
  })

export const sf_create_Category = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; category: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.create_Category(data.storeId, data.category)
  })

export const sf_delete_Category = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; categoryId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.delete_Category(data.storeId, data.categoryId)
  })

export const sf_get_CategoryNameByCategoryId = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { storeId: string; categoryId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.get_CategoryNameByCategoryId(
      data.storeId,
      data.categoryId,
    )
  })
