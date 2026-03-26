import { useQuery } from '@tanstack/react-query'
import {
  sf_get_CategoryNameByCategoryId,
  sf_get_CategorysFromStoreId,
} from '@/server/category/category.functions'

export const use_get_CategoryNamesByCategoryId = ({
  storeId,
  categoryId,
}: {
  storeId: string
  categoryId: string | undefined
}) => {
  return useQuery({
    queryKey: ['category', categoryId, storeId],
    queryFn: async () => {
      if (categoryId) {
        return await sf_get_CategoryNameByCategoryId({
          data: { storeId, categoryId },
        })
      }
      return null
    },
    enabled: !!categoryId, // only fetch if categoryId is truthy
  })
}

export const use_get_CategorysFromStoreId = ({
  storeId,
}: {
  storeId: string
}) => {
  return useQuery({
    queryKey: ['categorys', storeId],
    queryFn: async () => {
      return await sf_get_CategorysFromStoreId({ data: { storeId } })
    },
  })
}
