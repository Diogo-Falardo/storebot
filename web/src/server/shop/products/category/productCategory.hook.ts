import { useQuery } from '@tanstack/react-query'
import { getCategorysFromShop } from './productCategory.functions'

export function useGetShopCategorys({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ['categorys'],
    queryFn: () => getCategorysFromShop({ data: { shopId } }),
  })
}
