import { createServerFn } from '@tanstack/react-start'
import { serverCategory } from './productCategory.server'

const categoryServer = new serverCategory()

/**
 * "GET"
 * categorys from a store
 *
 * required: storeId
 */
export const sf_GetCategorysFromstore = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.getCategorysFromstoreId(data.storeId)
  })

/**
 * "POST"
 * create a category
 *
 * required: storeId & category "name"
 */
export const sf_CreateCategory = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; category: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.createCategory(data.storeId, data.category)
  })

/**
 * "POST"
 * delete a category
 *
 * required: storeId & categoryId
 */
export const sf_DeleteCategory = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { storeId: string; categoryId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.deleteCategory(data.storeId, data.categoryId)
  })

/**
 * "GET"
 * retrieve category name
 *
 * required: storeId & categoryId
 */
export const sf_getCategoryNameByCategoryId = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { storeId: string; categoryId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.getCategoryName(data.storeId, data.categoryId)
  })
