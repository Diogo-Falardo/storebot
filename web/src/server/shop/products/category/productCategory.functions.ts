import { createServerFn } from '@tanstack/react-start'
import {
  addCategory,
  deleteCategory,
  getCategoryFromShopId,
} from './productCategory.server'

// returns the category
export const getCategorysFromShop = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { shopId: string }) => data)
  .handler(async ({ data }) => {
    return await getCategoryFromShopId(data.shopId)
  })

// adds a category
export const createCategory = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { shopId: string; category: string }) => data)
  .handler(async ({ data }) => {
    return await addCategory(data.shopId, data.category)
  })

export const serverDeleteCategory = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { shopId: string; categoryId: string }) => data)
  .handler(async ({ data }) => {
    return await deleteCategory(data.shopId, data.categoryId)
  })
