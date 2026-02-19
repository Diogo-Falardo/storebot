import { useQuery } from '@tanstack/react-query'
import { getProductsFromShop } from './product.functions'

export function useGetShopProducts({
  userId,
  shopId,
}: {
  userId: string
  shopId: string
}) {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProductsFromShop({ data: { userId, shopId } }),
  })
}
