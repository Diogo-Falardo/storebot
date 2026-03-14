import { useQuery } from '@tanstack/react-query'
import { sf_GetCategorysFromstore } from '@/server/store/products/category/productCategory.functions'

/**
 * Hook to fetch all the categorys from a store
 *
 * @param param0 storeId
 * @returns server function: sf_GetCategorysFromstore
 */
export function useGetstoreCategorys({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['categorys', storeId],
    queryFn: () => sf_GetCategorysFromstore({ data: { storeId } }),
  })
}
