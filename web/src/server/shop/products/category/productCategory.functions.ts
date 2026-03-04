import { createServerFn } from '@tanstack/react-start'
import { serverCategory } from './productCategory.server'

const categoryServer = new serverCategory()

/**
 * "GET"
 * categorys from a shop
 *
 * required: shopId
 */
export const sf_GetCategorysFromShop = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { shopId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.getCategorysFromShopId(data.shopId)
  })

/**
 * "POST"
 * create a category
 *
 * required: shopId & category "name"
 */
export const sf_CreateCategory = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { shopId: string; category: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.createCategory(data.shopId, data.category)
  })

/**
 * "POST"
 * delete a category
 *
 * required: shopId & categoryId
 */
export const sf_DeleteCategory = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { shopId: string; categoryId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.deleteCategory(data.shopId, data.categoryId)
  })

/**
 * "GET"
 * retrieve category name
 *
 * required: shopId & categoryId
 */
export const sf_ConvertCategoryIdIntoName = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { shopId: string; categoryId: string }) => data)
  .handler(async ({ data }) => {
    return await categoryServer.getCategoryName(data.shopId, data.categoryId)
  })
