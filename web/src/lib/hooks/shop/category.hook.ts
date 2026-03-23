import { useQuery } from '@tanstack/react-query'
import { sf_GetCategorysFromstore } from '@/server/store/products/category/productCategory.functions'

export function useGetstoreCategorys({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['categorys', storeId],
    queryFn: () => sf_GetCategorysFromstore({ data: { storeId } }),
  })
}
