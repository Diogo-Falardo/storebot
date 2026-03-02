import { useQuery } from '@tanstack/react-query'
import { sf_GetCategorysFromShop } from '@/server/shop/products/category/productCategory.functions'

/**
 * Hook to fetch all the categorys from a shop
 *
 * @param param0 shopId
 * @returns server function: sf_GetCategorysFromShop
 */
export function useGetShopCategorys({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ['categorys', shopId],
    queryFn: () => sf_GetCategorysFromShop({ data: { shopId } }),
  })
}
