import { useQuery } from '@tanstack/react-query'
import { sf_getCategoryNameByCategoryId } from '@/server/store/products/category/productCategory.functions'

export const use_getCategoryNameByCategoryId = ({
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
        return await sf_getCategoryNameByCategoryId({ data: { storeId, categoryId } })
      }
      return null
    },
    enabled: !!categoryId, // only fetch if categoryId is truthy
  })
}
